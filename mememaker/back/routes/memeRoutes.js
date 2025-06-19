const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const db = require('../db');
const uuid = require('uuid').v4;
const nodemailer = require('nodemailer');


router.get('/random', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT temId, categori, imgURL FROM template ORDER BY RAND() LIMIT 3'
    );
    res.json(rows);
  } catch (err) {
    console.error('DB fetch error:', err.message);
    res.status(500).json({ error: '랜덤 이미지 로딩 실패' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT temId, categori, imgURL FROM template');
    res.json(rows);
  } catch (err) {
    console.error('DB fetch error:', err.message);
    res.status(500).json({ error: '전체 데이터 로딩 실패' });
  }
});


router.get('/see', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT temId, categori, imgURL FROM meme');
    res.json(rows);
  } catch (err) {
    console.error('DB fetch error:', err.message);
    res.status(500).json({ error: '보기 페이지 데이터 로딩 실패' });
  }
});

router.post('/feed', multer({ storage: multer.memoryStorage() }).single('image'), async (req, res) => {
  try {
    const { temId, template, categori } = req.body;
    if (!req.file || !temId || !template || !categori) {
      return res.status(400).json({ error: '필수 항목 누락' });
    }

    const id = Math.floor(10000 + Math.random() * 90000).toString(); // 5자리 랜덤 숫자
    const fileName = `memes/${uuid()}.png`;

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: 'ap-northeast-2',
    });

    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME, // 예: 'your-bucket-name'
      Key: fileName,
      Body: req.file.buffer,
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    const uploadResult = await s3.upload(s3Params).promise();
    const imgURL = uploadResult.Location;

    // DB에 저장
    await db.query(
      'INSERT INTO meme (id, temId, template, categori, imgURL) VALUES (?, ?, ?, ?, ?)',
      [id, temId, template, categori, imgURL]
    );

    res.status(200).json({
      message: '업로드 및 저장 완료',
      id,
      temId,
      template,
      categori,
      imgURL,
    });
  } catch (err) {
    console.error('업로드 실패:', err.message);
    res.status(500).json({ error: '서버 오류', detail: err.message });
  }
});

router.post('/email', async (req, res) => {
  const { to, subject, image } = req.body;

  if (!to || !subject || !image) {
    return res.status(400).json({ error: '이메일 전송 정보 누락' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // base64 앞의 헤더 제거 (예: "data:image/jpeg;base64,")
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const mailOptions = {
      from: `"짤메이커" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <h3>It show - Creative 짤메이커를 이용해주셔서 감사합니다.</h3>
        <img src="cid:memeimage" style="max-width: 100%; border-radius: 10px;" />
      `,
      attachments: [
        {
          filename: 'meme.jpg',
          content: base64Data,
          encoding: 'base64',
          cid: 'memeimage', // 👈 cid와 HTML 내 참조 일치해야 함
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '이메일 전송 성공' });
  } catch (err) {
    console.error('이메일 전송 실패:', err);
    res.status(500).json({ error: '이메일 전송 실패', detail: err.message });
  }
});

module.exports = router;




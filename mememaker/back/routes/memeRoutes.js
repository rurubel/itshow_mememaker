const express = require('express');
const router = express.Router();
const db = require('../db');
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




const express = require('express');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const router = express.Router();

const s3 = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME;

router.get('/', async (req, res) => {
  try {
    console.log('요청 도착: S3 이미지 목록 요청');

    if (!BUCKET) {
      console.error('환경변수 S3_BUCKET_NAME이 설정되지 않았습니다.');
      return res.status(500).json({ error: 'Bucket name is not configured' });
    }

    const data = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
    const filtered = (data.Contents || []).filter(obj => obj.Key && !obj.Key.endsWith('/'));

    if (filtered.length === 0) {
      return res.json([]);
    }

    const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);

    const signedUrls = await Promise.all(
      selected.map(async (obj) => {
        const command = new GetObjectCommand({
          Bucket: BUCKET,
          Key: obj.Key,
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 300 });
        return { key: obj.Key, url };
      })
    );

    res.json(signedUrls);
  } catch (err) {
    console.error('S3 fetch error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to load images' });
  }
});

module.exports = router;



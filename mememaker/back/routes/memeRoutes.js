const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/random', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT temId, categori, imgURL FROM template ORDER BY RAND() LIMIT 3'
    );
    res.json(rows);
  } catch (err) {
    console.error('DB fetch error:', err.message);
    res.status(500).json({ error: '3개 로딩 실패' });
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

module.exports = router;




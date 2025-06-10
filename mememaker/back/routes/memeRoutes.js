const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT temId, categori, imgURL FROM template ORDER BY RAND() LIMIT 3'
    );
    res.json(rows);
  } catch (err) {
    console.error('DB fetch error:', err.message);
    res.status(500).json({ error: 'Failed to load images from DB' });
  }
});

module.exports = router;




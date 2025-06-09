require('dotenv').config();

const express = require('express');
const cors = require('cors');
const imageRoutes = require('./routes/memeRoutes');


const app = express();
const PORT = 5000;

app.use(cors());
app.use('/images', imageRoutes);

app.listen(PORT, () => {
  console.log(process.env.S3_BUCKET_NAME);
  console.log(`서버가 열립니다. http://localhost:${PORT}`);
});

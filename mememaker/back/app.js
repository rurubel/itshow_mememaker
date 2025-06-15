const express = require('express');
const cors = require('cors');
const memeRoutes = require('./routes/memeRoutes');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({limit: '50mb' }));


app.use('/meme', memeRoutes);

app.listen(PORT, () => {
  console.log(`서버가 열립니다. http://localhost:${PORT}`);
});

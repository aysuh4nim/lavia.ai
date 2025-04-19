const express = require('express');
const { getResponseFromOpenAI } = require('./api/openai.js'); // OpenAI API işlevini içe aktar

const app = express();
const port = 3000;

app.use(express.json()); // JSON verisini işlemek için

// API Endpoint
app.post('/api/query', async (req, res) => {
  const userInput = req.body.prompt;
  try {
    const aiResponse = await getResponseFromOpenAI(userInput);
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("OpenAI API hatası:", error);
    res.status(500).send("Bir hata oluştu.");
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor.`);
});

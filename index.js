import express from 'express';
import { getResponseFromOpenAI } from './api/openai.js';  // openai.js'yi doğru şekilde import et
import path from 'path';  // path modülünü import et
import { fileURLToPath } from 'url';  // fileURLToPath fonksiyonunu import et

// ES modül yapısında __dirname yerine import.meta.url kullanmamız gerekiyor.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Statik dosyaları servis etmek (index.html)
app.use(express.static(path.join(__dirname, '')));  // Kök dizindeki tüm dosyaları statik olarak sunar

app.post('/ask', async (req, res) => {
    const prompt = req.body.prompt;
    const answer = await getResponseFromOpenAI(prompt);
    res.json({ answer });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

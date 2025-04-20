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
app.use(express.static(path.join(__dirname, 'public')));  // public klasörünü kullanmak

// API Endpoint
app.post('/api/openai', async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const answer = await getResponseFromOpenAI(prompt);
        res.json({ reply: answer });
    } catch (error) {
        res.status(500).json({ error: 'OpenAI API hatası: ' + error.message });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

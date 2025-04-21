import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const apiKey = process.env.OPENAI_API_KEY; // API_KEY yerine OPENAI_API_KEY kullanılıyor

router.post("/", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt boş olamaz." });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].text.trim();
        res.json({ reply });
    } catch (error) {
        console.error("OpenAI API hatası:", error.response?.data || error.message);
        res.status(500).json({ error: "OpenAI'den yanıt alınamadı." });
    }
});

export default router;


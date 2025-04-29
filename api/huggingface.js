import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY; // Hugging Face API Anahtarı

// Hugging Face API'ye POST isteği atan endpoint
router.post("/", async (req, res) => {
    const { prompt } = req.body;

    // Eğer prompt boşsa hata döndür
    if (!prompt || prompt.trim() === "") {
        return res.status(400).json({ error: "Prompt boş olamaz." });
    }

    try {
        const response = await axios({
            method: "post",
            url: "https://api-inference.huggingface.co/models/gpt2", // Model URL'si
            headers: {
                Authorization: `Bearer ${huggingFaceApiKey}`, // API Anahtarı
                "Content-Type": "application/json",
            },
            data: { inputs: prompt }
        });

        // Yanıt formatı kontrolü
        if (Array.isArray(response.data)) {
            const reply = response.data[0]?.generated_text || "Üzgünüm, yanıt oluşturulamadı.";
            res.json({ reply });
        } else if (response.data?.generated_text) {
            res.json({ reply: response.data.generated_text });
        } else {
            throw new Error("Hugging Face API beklenen formatta yanıt vermedi.");
        }

    } catch (error) {
        console.error("❗ Hugging Face API Hatası:", error.response?.data || error.message);
        res.status(500).json({ error: "Hugging Face API'den yanıt alınamadı." });
    }
});

export default router;


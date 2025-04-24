import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY; // Hugging Face API Key

router.post("/", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt boş olamaz." });
    }

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/vblagoje/gpt2-lora-finetuned-sentiment", 
            {
                inputs: prompt
            },
            {
                headers: {
                    Authorization: `Bearer ${huggingFaceApiKey}`, 
                    "Content-Type": "application/json",
                }
            }
        );

        const reply = response.data[0]?.generated_text || "Yanıt alınamadı.";
        res.json({ reply });
    } catch (error) {
        console.error("Hugging Face API hatası:", error.response?.data || error.message);
        res.status(500).json({ error: "Hugging Face API'den yanıt alınamadı." });
    }
});

export default router;

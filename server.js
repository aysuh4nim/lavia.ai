import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import huggingfaceRouter from "./api/huggingface.js"; // Hugging Face router'ı import et

dotenv.config(); // .env dosyasını yükle

const app = express();
const PORT = process.env.PORT || 3000;

// Path ayarları
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS kullan
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// JSON verileri okumak için
app.use(express.json());

// Statik dosyaları (html, css, js) sunmak için
app.use(express.static(__dirname));

// Ana sayfa isteği
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Hugging Face API isteği
app.use("/api/huggingface", huggingfaceRouter);

// Genel hata yakalama middleware'i
app.use((err, req, res, next) => {
  console.error("❗ Sunucu Hatası:", err.stack);
  res.status(500).send("Sunucuda bir hata oluştu.");
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});

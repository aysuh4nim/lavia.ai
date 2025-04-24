import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import huggingfaceRouter from "./api/huggingface.js"; // Yeni Hugging Face router'ı import et

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS middleware'ini kullan
app.use(cors()); 

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Ana sayfa (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Hugging Face API rotasını bağla
app.use("/api/huggingface", huggingfaceRouter); // Artık buradan Hugging Face API'ye erişebileceğiz

// Sunucu tarafında hata loglama
app.use((err, req, res, next) => {
    console.error('Sunucu Hatası:', err.stack);  
    res.status(500).send('Bir şeyler ters gitti!');
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});

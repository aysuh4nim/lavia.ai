import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";  // CORS paketini içeri aktarın
import openaiRouter from "./api/openai.js"; // Artık route şeklinde import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS middleware'ini kullan
app.use(cors()); // Tüm kaynaklardan gelen istekleri kabul eder

// Eğer sadece belirli bir kaynağa izin vermek isterseniz:
// app.use(cors({ origin: 'http://localhost:3000' })); 

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Ana sayfa (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// OpenAI rotasını bağla
app.use("/api/openai", openaiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});


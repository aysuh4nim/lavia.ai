import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getResponseFromOpenAI } from "./api/openai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Ana sayfa (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// OpenAI API endpoint
app.post("/api/openai", async (req, res) => {
  const { prompt } = req.body;
  try {
    const reply = await getResponseFromOpenAI(prompt);
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API hatası:", error);
    res.status(500).json({ error: "Bir şeyler ters gitti." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});

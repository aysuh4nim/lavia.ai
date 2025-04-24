// checkEnv.js dosyası
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.HUGGINGFACE_API_KEY); // .env dosyasındaki anahtarı yazdır

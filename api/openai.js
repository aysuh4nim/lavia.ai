import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

export async function getResponseFromOpenAI(prompt) {
    try {
        // API'ye istek atıyoruz
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003",  // OpenAI modeli
            prompt: prompt,  // Kullanıcıdan gelen prompt
            max_tokens: 150,  // Yanıtın uzunluğu
            temperature: 0.7,  // Yanıtın çeşitliliği
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,  // API anahtarı
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].text.trim();  // API'den gelen yanıtı döndür
    } catch (error) {
        console.error("OpenAI API hatası:", error);
        return "Bir hata oluştu.";  // Hata durumunda bir mesaj döndür
    }
}


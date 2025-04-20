import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

export async function getResponseFromOpenAI(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003", // Kullandığınız model
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7, // Yanıt çeşitliliği için sıcaklık değeri
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("OpenAI API hatası:", error);
        return "Bir hata oluştu.";
    }
}

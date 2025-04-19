
require('dotenv').config(); 

const axios = require('axios');


const apiKey = process.env.API_KEY;

export async function getResponseFromOpenAI(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003", // Veya kullandığınız model
            prompt: prompt,
            max_tokens: 150
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


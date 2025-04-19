const apiKey = 'API_KEY';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

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


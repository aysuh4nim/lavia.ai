"use strict";

const micBtn = document.getElementById("micButton");
const chatBubble = document.getElementById("chatBubble");

micBtn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        chatBubble.textContent = "Maalesef, bu özellik tarayıcınızda desteklenmiyor.";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.start();

    recognition.onstart = () => {
        chatBubble.textContent = "Mikrofon açıldı, konuşabilirsiniz...";
    };

    recognition.onresult = async (event) => {
        const userSpeech = event.results[0][0].transcript;
        chatBubble.textContent = "Düşünüyorum...";

        try {
            const response = await getAIPrompt(userSpeech);
            chatBubble.textContent = response;
            speak(response);
        } catch (err) {
            console.error("Cevap alınamadı:", err);
            chatBubble.textContent = "Bir hata oluştu, lütfen tekrar dene.";
        }
    };

    recognition.onerror = (event) => {
        console.error("Mikrofon hatası:", event.error);
        chatBubble.textContent = "Mikrofonla ilgili bir hata oluştu.";
    };
});

function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "tr-TR";
    synth.speak(utter);
}

async function getAIPrompt(text) {
    try {
        console.log("API'ye gönderilen metin:", text); // Hata ayıklama: Konsola yazdır
        const response = await fetch("/ask", {  // "/ask" endpointine istekte bulunuyoruz
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: text })
        });

        if (!response.ok) {
            throw new Error("API yanıt vermedi.");
        }

        const data = await response.json();
        console.log("API'den alınan yanıt:", data); // Hata ayıklama: Konsola yazdır
        return data.answer || "Üzgünüm, anlamadım.";  // Yanıtı al ve döndür
    } catch (error) {
        console.error("API Hatası:", error);
        chatBubble.textContent = "Bir hata oluştu, lütfen tekrar deneyin.";
    }
}

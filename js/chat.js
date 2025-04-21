"use strict";

const micBtn = document.getElementById("micButton");
const chatBubble = document.getElementById("chatBubble");
let isChatting = false;  // Sohbetin aktif olup olmadığını takip et

// Mikrofon butonuna tıklama
micBtn.addEventListener("click", async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        chatBubble.textContent = "Maalesef, bu özellik tarayıcınızda desteklenmiyor.";
        return;
    }

    if (isChatting) {
        stopChat();
    } else {
        startChat(SpeechRecognition);
    }
});

function startChat(SpeechRecognition) {
    isChatting = true;
    micBtn.textContent = "🛑 Sohbeti Kapat";  // Buton metnini değiştir
    chatBubble.textContent = "Mikrofon açıldı, konuşabilirsiniz...";

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
}

function stopChat() {
    isChatting = false;
    micBtn.textContent = "🎙️ Sohbete Başla";  // Buton metnini eski haline döndür
    chatBubble.textContent = "Lavia: Görüşmek üzere!";
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "tr-TR";
    synth.speak(utter);
}

async function getAIPrompt(text) {
    try {
        console.log("API'ye gönderilen metin:", text); 
        const response = await fetch("/api/openai", {  
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
        console.log("API'den alınan yanıt:", data); 
        return data.reply || "Üzgünüm, anlamadım.";  
    } catch (error) {
        console.error("API Hatası:", error);
        chatBubble.textContent = "Bir hata oluştu, lütfen tekrar deneyin.";
    }
}

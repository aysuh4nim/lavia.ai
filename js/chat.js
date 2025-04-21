"use strict";

const micBtn = document.getElementById("micButton");
const chatBubble = document.getElementById("chatBubble");
let isChatting = false;
let recognition;

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
    micBtn.textContent = "🛑 Sohbeti Kapat";
    chatBubble.textContent = "Mikrofon açıldı, konuşabilirsiniz...";

    recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();

    recognition.onstart = () => {
        chatBubble.textContent = "Mikrofon açıldı, konuşabilirsiniz...";
    };

    recognition.onresult = async (event) => {
        const resultIndex = event.resultIndex;
        const result = event.results[resultIndex];
        const userSpeech = result[0].transcript;

        if (result.isFinal) {
            chatBubble.textContent = "Düşünüyorum...";

            try {
                const response = await getAIPrompt(userSpeech);
                chatBubble.textContent = response;
                speak(response);
            } catch (err) {
                console.error("Cevap alınamadı:", err);
                chatBubble.textContent = "Bir hata oluştu, lütfen tekrar dene.";
            }
        } else {
            // Geçici konuşma sonucu (kullanıcı konuşmaya devam ederken gösterilir)
            chatBubble.textContent = `Sen: ${userSpeech}`;
        }
    };

    recognition.onerror = (event) => {
        console.error("Mikrofon hatası:", event.error);
        chatBubble.textContent = "Mikrofonla ilgili bir hata oluştu.";
    };
}

function stopChat() {
    isChatting = false;
    micBtn.textContent = "🎙️ Sohbete Başla";
    chatBubble.textContent = "Lavia: Görüşmek üzere!";
    if (recognition) {
        recognition.stop();
    }
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

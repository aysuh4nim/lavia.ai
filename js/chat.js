// chat.js

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
                const response = await getAIPrompt(userSpeech); // Sunucuya yönlendirme
                chatBubble.textContent = response;
                speak(response);
            } catch (err) {
                console.error("Cevap alınamadı:", err);
                chatBubble.textContent = "Bir hata oluştu, lütfen tekrar dene.";
            }
        } else {
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
    console.log("API'ye gönderilen metin:", text);

    // Sunucuya istek gönderiyoruz
    const response = await fetch('/api/huggingface', { // Sunucudaki endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: text,
        }),
    });

    const data = await response.json();

    // Yanıt yoksa hata mesajı
    if (!data || !data.generated_text) {
        throw new Error("Yanıt alınamadı");
    }

    return data.generated_text; // Gerçek yanıtı döndür
}

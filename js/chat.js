const micBtn = document.getElementById("micButton");
const chatBubble = document.getElementById("chatBubble");
let isChatting = false;
let recognition;
let audioBlob;
let mediaRecorder;

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
        startRecording();  // Ses kaydını başlatıyoruz
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
    stopRecording();  // Kaydı durduruyoruz
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
    console.log("Hugging Face yanıtı:", data);

    // Yanıt yoksa hata mesajı
    if (!data || !data.reply) {
        throw new Error("Yanıt alınamadı");
    }

    return data.reply; // Gerçek yanıtı döndür
}

// Kaydedilen ses dosyasını base64 formatına çevirme ve backend'e gönderme
async function sendAudioToBackend() {
    if (!audioBlob) {
        alert("Lütfen önce ses kaydını başlatın.");
        return;
    }

    // Ses dosyasını base64'e çevirme
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1]; // Base64 formatına çeviriyoruz
        await sendToServer(base64Audio);
    };
    reader.readAsDataURL(audioBlob);  // Base64 formatında okuma işlemi
}

// Kaydın başlatılması
function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                audioBlob = event.data;
            };
            mediaRecorder.start();
        })
        .catch((error) => {
            console.error("Ses kaydı başlatılamadı:", error);
        });
}

// Kaydın durdurulması
function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}

// Base64 formatındaki ses verisini backend'e gönderme
async function sendToServer(base64Audio) {
    try {
        const response = await fetch('http://localhost:3000/process-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                audioData: base64Audio,  // Base64 formatındaki ses verisini gönderiyoruz
            }),
        });

        const data = await response.json();
        console.log("Model Yanıtı:", data.generatedText); // Model yanıtını console'a yazdırıyoruz
        chatBubble.textContent = data.generatedText; // Model yanıtını kullanıcıya gösteriyoruz
        speak(data.generatedText); // Modelin cevabını sesli okuma
    } catch (error) {
        console.error('API Hatası:', error.message);
    }
}


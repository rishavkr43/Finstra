 const baseUrl = 'http://127.0.0.1:5000';
//const baseUrl = 'https://finstra-production.up.railway.app/';

const startBtn = document.getElementById('start-btn');
const resultDiv = document.getElementById('result');
const languageSelect = document.getElementById("language");

let hasSpokenIntro = false;
let lastResponseText = "";
let voices = [];

// Language mapping for speech recognition and synthesis with specific voice names
const languageMap = {
    'en-US': { 
        name: 'English', 
        code: 'en-US',
        voicePreferences: ['Google US English', 'Microsoft David', 'en-US', 'en_US']
    },
    'hi-IN': { 
        name: 'Hindi', 
        code: 'hi-IN',
        voicePreferences: ['Google हिन्दी', 'Microsoft Hemant', 'hi-IN', 'hi_IN']
    },
    'bn-IN': { 
        name: 'Bengali', 
        code: 'bn-IN',
        voicePreferences: ['Google বাংলা', 'Microsoft Bangla', 'bn-IN', 'bn_IN']
    },
    'ta-IN': { 
        name: 'Tamil', 
        code: 'ta-IN',
        voicePreferences: ['Google தமிழ்', 'Microsoft Tamil', 'ta-IN', 'ta_IN']
    },
    'mr-IN': { 
        name: 'Marathi', 
        code: 'mr-IN',
        voicePreferences: ['Google मराठी', 'Microsoft Marathi', 'mr-IN', 'mr_IN']
    },
    'te-IN': { 
        name: 'Telugu', 
        code: 'te-IN',
        voicePreferences: ['Google తెలుగు', 'Microsoft Telugu', 'te-IN', 'te_IN']
    },
    'kn-IN': { 
        name: 'Kannada', 
        code: 'kn-IN',
        voicePreferences: ['Google ಕನ್ನಡ', 'Microsoft Kannada', 'kn-IN', 'kn_IN']
    },
    'gu-IN': { 
        name: 'Gujarati', 
        code: 'gu-IN',
        voicePreferences: ['Google ગુજરાતી', 'Microsoft Gujarati', 'gu-IN', 'gu_IN']
    },
    'ml-IN': { 
        name: 'Malayalam', 
        code: 'ml-IN',
        voicePreferences: ['Google മലയാളം', 'Microsoft Malayalam', 'ml-IN', 'ml_IN']
    }
};

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Initialize recognition language
function updateRecognitionLanguage() {
    const selectedLang = languageSelect.value;
    recognition.lang = selectedLang;
    console.log(`Recognition language updated to: ${selectedLang}`);
    
    // Log available voices for this language
    const availableVoices = voices.filter(voice => 
        voice.lang.startsWith(selectedLang.split('-')[0])
    );
    console.log(`Available voices for ${selectedLang}:`, availableVoices.map(v => `${v.name} (${v.lang})`));
}

// Load and initialize voices
function loadVoices() {
    return new Promise((resolve) => {
        const loadVoicesHandler = () => {
            voices = window.speechSynthesis.getVoices();
            console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
            resolve(voices);
        };

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.getVoices().length) {
            loadVoicesHandler();
        } else {
            window.speechSynthesis.onvoiceschanged = loadVoicesHandler;
        }
    });
}

// Find the best matching voice for a given language
function findVoice(targetLang) {
    const langPrefs = languageMap[targetLang]?.voicePreferences || [];
    let selectedVoice = null;

    // Log available voices for debugging
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    console.log('Looking for voice for language:', targetLang);

    // Try to find a voice matching our preferences
    for (const pref of langPrefs) {
        selectedVoice = voices.find(voice => 
            voice.name.includes(pref) || 
            voice.lang.includes(pref) ||
            voice.lang.startsWith(targetLang.split('-')[0])
        );
        if (selectedVoice) {
            console.log(`Found matching voice: ${selectedVoice.name} (${selectedVoice.lang})`);
            break;
        }
    }

    // If no preferred voice found, try to find any voice for the language
    if (!selectedVoice) {
        const langCode = targetLang.split('-')[0];
        selectedVoice = voices.find(voice => 
            voice.lang.startsWith(langCode) || 
            voice.lang.includes(langCode)
        );
    }

    // Fallback to default voice if no match found
    if (!selectedVoice && voices.length > 0) {
        console.warn(`No matching voice found for ${targetLang}, falling back to default`);
        selectedVoice = voices[0];
    }

    return selectedVoice;
}

// Text-to-speech function with improved voice selection and interruption handling
async function speakResponse(text, language) {
    if (!('speechSynthesis' in window)) {
        console.error('Text-to-speech not supported');
        return;
    }

    return new Promise((resolve, reject) => {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find appropriate voice
        const voice = findVoice(language);
        if (voice) {
            utterance.voice = voice;
            utterance.lang = language; // Use the exact language code
            console.log(`Using voice: ${voice.name} (${voice.lang}) for language: ${language}`);
        } else {
            console.warn(`No suitable voice found for ${language}`);
            utterance.lang = language; // Still set the language even without a specific voice
        }

        // Configure speech parameters
        utterance.rate = 0.9; // Slightly slower
        utterance.pitch = 1;
        utterance.volume = 1;

        // Handle successful completion
        utterance.onend = () => {
            console.log('Speech synthesis completed successfully');
            resolve();
        };

        // Add error handling
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            
            if (event.error === 'interrupted') {
                console.log('Speech was interrupted, attempting to resume...');
                // Small delay before retrying
                setTimeout(() => {
                    window.speechSynthesis.speak(utterance);
                }, 100);
            } else {
                resultDiv.innerHTML += `<br><br>Error speaking response: ${event.error}`;
                reject(event);
            }
        };

        // Chrome bug fix: speech synthesis sometimes stops
        const resumeSpeaking = () => {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }
        };

        // Keep checking and resuming if necessary
        const intervalId = setInterval(resumeSpeaking, 1000);
        
        // Clear interval when speech is done
        utterance.onend = () => {
            clearInterval(intervalId);
            resolve();
        };

        // Speak the text
        try {
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            clearInterval(intervalId);
            console.error('Error starting speech:', error);
            reject(error);
        }
    });
}

function startListening() {
    updateRecognitionLanguage();
    recognition.start();
    startBtn.textContent = 'Listening...';
    startBtn.disabled = true;
}

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    const selectedLanguage = languageSelect.value;
    
    resultDiv.textContent = `You said: "${transcript}"`;

    try {
        const res = await fetch(`${baseUrl}/api/py/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                text: transcript,
                language: languageMap[selectedLanguage].name.toLowerCase()
            })
        });

        const data = await res.json();
        
        // Display the response
        resultDiv.innerHTML += `<br><br><strong>Response:</strong><br>${data.response}`;
        
        // Speak the response with retry logic
        try {
            await speakResponse(data.response, selectedLanguage);
        } catch (speechError) {
            console.error('Speech synthesis failed:', speechError);
            // Try one more time after a short delay
            setTimeout(async () => {
                try {
                    await speakResponse(data.response, selectedLanguage);
                } catch (retryError) {
                    console.error('Retry failed:', retryError);
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML += `<br><br>Error: ${error.message}`;
    }
};

recognition.onend = () => {
    startBtn.textContent = 'Start Voice Input';
    startBtn.disabled = false;
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    startBtn.textContent = 'Start Voice Input';
    startBtn.disabled = false;
    resultDiv.innerHTML += `<br><br>Speech recognition error: ${event.error}`;
};

// Set initial language
updateRecognitionLanguage();

// Update recognition language when user changes selection
languageSelect.addEventListener('change', updateRecognitionLanguage);

// Add click event listener to start button
startBtn.addEventListener('click', startListening);

// Initialize voices when page loads
window.addEventListener('load', async () => {
    try {
        await loadVoices();
        console.log('Voice synthesis initialized successfully');
    } catch (error) {
        console.error('Error initializing voices:', error);
    }
});

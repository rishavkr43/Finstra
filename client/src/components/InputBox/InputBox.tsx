// Add type declarations for Web Speech API
// interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
// }

import React from 'react'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import axios, { AxiosResponse } from 'axios';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

interface MessageType {
    sender: string
    message: string
    timestamp: Date
    suggestions?: string[]
    scam_detected?: boolean
}

interface InputBoxProps {
    chatMessages: MessageType[],
    // setChatMessages: (messages: MessageType[]) => void,
    setChatMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
    chatInput: string,
    // setChatInput: (input: string) => void
    setChatInput: React.Dispatch<React.SetStateAction<string>>
    selectedLanguage: string,
    handleLanguageChange: (language: string) => void
}

// type SpeechRecognitionType = any;

const baseUrl = 'https://finstra-production.up.railway.app/';

const InputBox: React.FC<InputBoxProps> = ({ 
    chatMessages, setChatMessages, chatInput, setChatInput, selectedLanguage, handleLanguageChange }) => {
    // const [isListening, setIsListening] = useState(false);

    // Voice recognition setup
    // const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition as SpeechRecognitionType;
    // const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    // if (recognition) {
    //     recognition.continuous = true;
    //     recognition.interimResults = true;
    //     recognition.lang = 'en-US'; // You can change this based on user preference
    // }

    // const startListening = () => {
    //     if (!recognition) {
    //         alert("Speech recognition is not supported in your browser.");
    //         return;
    //     }

    //     recognition.start();
    //     setIsListening(true);

    //     recognition.onresult = (event: any) => {
    //         const transcript = Array.from(event.results)
    //             .map((result: any) => result[0])
    //             .map(result => result.transcript)
    //             .join('');

    //         setChatInput(transcript);
    //     };

    //     recognition.onerror = (event: any) => {
    //         console.error('Speech recognition error:', event.error);
    //         setIsListening(false);
    //     };

    //     recognition.onend = () => {
    //         setIsListening(false);
    //     };
    // };

    // const stopListening = () => {
    //     if (recognition) {
    //         recognition.stop();
    //         setIsListening(false);
    //     }
    // };

    // const handleVoiceSearch = async (text: string) => {
    //     try {
    //         const response = await axios.post('http://127.0.0.1:5000/search', { text });

    //         // Create bot message with response
    //         const botMessage: MessageType = {
    //             sender: "bot",
    //             message: response.data.response,
    //             timestamp: new Date()
    //         };

    //         setChatMessages((prev: MessageType[]) => [...prev, botMessage]);
    //     } catch (error) {
    //         console.error("Error in voice search:", error);
    //         setChatMessages((prev: MessageType[]) => [
    //             ...prev,
    //             {
    //                 sender: "bot",
    //                 message: "Sorry, I encountered an error processing your voice input. Please try again.",
    //                 timestamp: new Date()
    //             }
    //         ]);
    //     }
    // };

    const sendMessage = async () => {
        if (!chatInput.trim()) {
            setChatInput(chatInput.trim());
            return;
        }

        setChatInput("");

        // Create user message
        const userMessage = {
            sender: "user",
            message: chatInput,
            timestamp: new Date()
        };

        // Add user message
        setChatMessages((prev) => [...prev, userMessage]);

        // If the message came from voice input, use voice search endpoint
        // if (isListening) {
        //     // await handleVoiceSearch(chatInput);
        //     console.log('Unable to set up the voice');
        // } else {
        //     // Regular chat flow
        // }
        try {
            const previousMessages = chatMessages.slice(-5);
            const res: AxiosResponse = await axios.post(`${baseUrl}/api/py/chat`, {
                message: chatInput,
                language: selectedLanguage,
                chat_history: [...previousMessages, userMessage]
            });

            const botMessage: MessageType = {
                sender: "bot",
                message: res.data.response,
                timestamp: new Date(),
                suggestions: res.data.suggestions || [],
                scam_detected: res.data.scam_detected || false
            };

            setChatMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setChatMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    message: "Sorry, I encountered an error. Please try again.",
                    timestamp: new Date()
                }
            ]);
        }

    };

    const getPlaceholderText = () => {
        switch (selectedLanguage) {
            case 'hindi':
                return "अपना संदेश यहाँ लिखें...";
            case 'bengali':
                return "আপনার বার্তা এখানে টাইপ করুন...";
            default:
                return "Type your message here...";
        }
    };

    return (
        <>
            <div className="flex gap-2 border p-4 rounded-full shadow-md max-w-[82vw] mx-auto mt-4 bg-white">
                <input
                    className="flex-1 border rounded-lg px-3 py-2 text-black border-none outline-none"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={getPlaceholderText()}
                />
                {/* <Button
                    onClick={isListening ? stopListening : startListening}
                    className={`py-6 rounded-full ${isListening ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'} text-white mr-2`}
                    title={isListening ? 'Stop voice input' : 'Start voice input'}
                >
                    {isListening ? <MicOff /> : <Mic />}
                </Button> */}
                <div className='flex justify-center gap-x-4 items-end'>
                    <div className="mb-2">
                        <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            onLanguageChange={handleLanguageChange}
                        />
                    </div>
                    <Button
                        onClick={sendMessage}
                        className="bg-green-700 hover:bg-green-600 text-white py-6 px-4 rounded-full"
                    >
                        <Send />
                    </Button>
                </div>
            </div>
        </>
    )
}

export default InputBox
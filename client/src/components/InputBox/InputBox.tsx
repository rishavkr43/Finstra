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
    timestamp: string
    suggestions?: string[]
    scam_detected?: boolean
}

interface InputBoxProps {
    chatMessages: MessageType[],
    setChatMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
    chatInput: string,
    setChatInput: React.Dispatch<React.SetStateAction<string>>
    selectedLanguage: string,
    handleLanguageChange: (language: string) => void
    setIsLoading?: (v: boolean) => void
}

// Use localhost during local development. Change to deployed URL for production.
const baseUrl = 'http://localhost:5000';

const InputBox: React.FC<InputBoxProps> = ({
    chatMessages, setChatMessages, chatInput, setChatInput, selectedLanguage, handleLanguageChange, setIsLoading }) => {

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
            timestamp: new Date().toISOString()
        };

        // Add user message
        setChatMessages((prev) => [...prev, userMessage]);

        try {
            if (setIsLoading) {
                console.debug('[InputBox] setIsLoading(true)');
                setIsLoading(true);
            }
            const previousMessages = chatMessages.slice(-5);
            const res: AxiosResponse = await axios.post(`${baseUrl}/api/py/chat`, {
                message: chatInput,
                language: selectedLanguage,
                chat_history: [...previousMessages, userMessage]
            });

            const botMessage: MessageType = {
                sender: "bot",
                message: res.data.response,
                timestamp: new Date().toISOString(),
                suggestions: res.data.suggestions || [],
                scam_detected: res.data.scam_detected || false
            };

            setChatMessages((prev) => [...prev, botMessage]);
            if (setIsLoading) {
                console.debug('[InputBox] setIsLoading(false)');
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setChatMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    message: "Sorry, I encountered an error. Please try again.",
                    timestamp: new Date().toISOString()
                }
            ]);
            if (setIsLoading) {
                console.debug('[InputBox] setIsLoading(false) [error path]');
                setIsLoading(false);
            }
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
                    suppressHydrationWarning
                />
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
                        suppressHydrationWarning
                    >
                        <Send />
                    </Button>
                </div>
            </div>
        </>
    )
}

export default InputBox
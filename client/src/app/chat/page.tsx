'use client'
import InputBox from '@/components/InputBox/InputBox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import axios, { AxiosResponse } from 'axios'
import { HandCoins, Plus } from 'lucide-react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector'

const baseUrl = 'https://finstra-production.up.railway.app/';

interface MessageType {
  sender: string
  message: string
  timestamp: Date
  suggestions?: string[]
  scam_detected?: boolean
}

const Page: React.FC = () => {
  // const [suggestions, setSuggestions] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).replace('am', 'AM').replace('pm', 'PM');
  }

  const chat: MessageType[] = [
    // { sender: "user", message: "Hi, how are you?", timestamp: new Date("2022-01-01T12:00:00.000Z") },
    // { sender: "bot", message: "I'm doing great, thanks for asking! How about you?", timestamp: new Date("2022-01-01T12:00:01.000Z") },
    // { sender: "user", message: "I'm doing well, thanks!", timestamp: new Date("2022-01-01T12:00:02.000Z") },
    // { sender: "bot", message: "That's great to hear! Is there anything you need help with or would you like to chat?", timestamp: new Date("2022-01-01T12:00:03.000Z") },
  ];
  const [chatMessages, setChatMessages] = useState<MessageType[]>(() => [...chat]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [chatInput, setChatInput] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");

  useEffect(() => {
    (async () => {
      const res: AxiosResponse = await axios.get(`${baseUrl}/api/py/common-questions`)
      setSuggestedQuestions(res.data[selectedLanguage])
    })()
  }, [selectedLanguage])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // const handleQuestionClick = async (question: string) => {
  //   // Add user message
  //   const userMessage = {
  //     sender: "user",
  //     message: question,
  //     timestamp: new Date()
  //   };

  //   setChatMessages(prev => [...prev, userMessage]);

  //   // setIsLoading(true);
  //   try {
  //     // Get previous messages for context
  //     const previousMessages = chatMessages.slice(-5); // Get last 5 messages

  //     const res: AxiosResponse = await axios.post(`${baseUrl}/api/py/chat`, {
  //       message: question,
  //       language: "english",
  //       chat_history: [...previousMessages, userMessage]
  //     });

  //     const botMessage: MessageType = {
  //       sender: "bot",
  //       message: res.data.response,
  //       timestamp: new Date(),
  //       suggestions: res.data.suggestions || [],
  //       scam_detected: res.data.scam_detected || false
  //     };
  //     setChatMessages(prev => [...prev, botMessage]);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     setChatMessages(prev => [...prev, {
  //       sender: "bot",
  //       message: "Sorry, I encountered an error. Please try again.",
  //       timestamp: new Date()
  //     }]);
  //   }
  //   // finally {
  //   //   setIsLoading(false);
  //   // }
  // };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  // Function to format message text with proper line breaks
  const formatMessage = (message: string) => {
    return message.split('\n').map((line, i) => (
      <Fragment key={i}>
        {line}
        {i < message.split('\n').length - 1 && <br />}
      </Fragment>
    ));
  };

  return (
    <>
      <ScrollArea>
        <div className='bg-gray-50 md:h-[65vh] h-[68vh] max-w-[90vw] mt-6 mx-auto overflow-y-auto p-3 space-y-10 py-6 rounded shadow-xl'>
          {chatMessages.length === 0 && (
            <div className='flex flex-col items-center justify-center gap-6'>
              <div><HandCoins size={52} className='font-bold text-gray-700' /></div>
              <h1 className='text-4xl font-bold text-gray-700'>How can I help you?</h1>

              {/* Common Questions Section */}
              <div className='w-full max-w-2xl mt-8'>
                <h2 className='text-xl text-center font-semibold mb-4 text-gray-700'>Common Questions</h2>
                <div className='flex flex-col items-center gap-3'>
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <Button
                        onClick={() => setChatInput(question)}
                        className='text-sm text-black bg-gray-200 hover:bg-gray-300 cursor-pointer p-4'
                      >{question}</Button>
                      {index === suggestedQuestions.slice(0, 3).length - 1 && (
                        <Button className='bg-gray-200 hover:bg-gray-300 cursor-pointer text-black'>
                          <span>Show More</span><Plus />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {chatMessages?.map((msg, index) => (
            <div key={index}>
              <div className={`flex items-start gap-4 my-2 ${msg.sender === "user" ? "text-right justify-end" : "text-left justify-start"}`}>
                {msg.sender === "bot" &&
                  <Avatar className='hidden md:block'>
                    <AvatarImage src="https://i.pravatar.cc/100?img=70" alt="@shadcn" />
                    <AvatarFallback>Kissan AI</AvatarFallback>
                  </Avatar>
                }

                <div className='flex flex-col gap-2'>
                  <div className={`md:text-md text-sm shadow-md flex flex-col gap-y-2 max-w-[60vw] min-w-[20vw] px-6 py-4 rounded-xl ${msg.sender === "user" ? "bg-green-700 rounded-tr-none text-background" : "bg-slate-200 rounded-tl-none text-foreground"}`}>
                    <h2 className='font-bold'>{msg.sender === "user" ? 'You' : "Finstra AI"}</h2>
                    <div className="whitespace-pre-wrap">{formatMessage(msg.message)}</div>

                    {/* Scam Alert */}
                    {msg.scam_detected && (
                      <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <h3 className="font-bold">⚠️ Scam Alert!</h3>
                        <p>This message contains potential scam indicators. Please be cautious!</p>
                      </div>
                    )}

                    {/* Proactive Suggestions */}
                    {/* {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold text-gray-700">You might also want to know:</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="text-sm"
                              onClick={() => handleQuestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                  <span className={`text-xs p-4 text-black ${msg.sender === "user" ? "text-background self-end" : "text-foreground self-start"}`}>
                    {formatTime(new Date(msg.timestamp))}
                  </span>
                  {(msg.sender === "bot" && index === chatMessages.length - 1) && (
                    <>
                      <h1 className='text-xs'>Suggested Questions</h1>
                      <div className='flex flex-col justify-start items-start gap-2'>
                        {suggestedQuestions.slice(0, 3).map((question, index) => (
                          <div key={index} className='flex items-center gap-2'>
                            <Button
                              onClick={() => setChatInput(question)}
                              className='text-sm text-black bg-gray-200 hover:bg-gray-300 cursor-pointer p-4'
                            >{question}</Button>
                            {index === suggestedQuestions.slice(0, 3).length - 1 && (
                              <Button className='rounded-2xl bg-gray-200 hover:bg-gray-300 cursor-pointer text-black'>
                                <span>Show More</span><Plus />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {msg.sender === "user" &&
                  <Avatar className='hidden md:block'>
                    <AvatarImage src={`https://i.pravatar.cc/100?img=69`} alt="@shadcn" />
                    <AvatarFallback>{`user`}</AvatarFallback>
                  </Avatar>
                }
              </div>
              <hr className='w-[80vw] my-8 mx-auto'></hr>
            </div>
          ))}
          <div ref={messagesEndRef} ></div>
        </div>
      </ScrollArea>
      <InputBox
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
      />
        {/* <div className="mb-2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div> */}
      <div className="flex flex-col items-end px-4 mt-2">
        <div className="md:text-[10px] text-[6px] text-muted-foreground text-center select-none w-full">
          <span className="text-red-500">Note: </span>
          AI responses are generated based on the input provided and may not always be accurate.
        </div>
      </div>
    </>
  )

}

export default Page
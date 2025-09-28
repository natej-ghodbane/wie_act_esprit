// components/Chatbot.tsx
"use client";
import React, { useState, useCallback, memo } from "react";
import { marked } from 'marked';

// Utility component for the chat icon SVG
const ChatIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-white"
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.92 4.19L19 22l-6-2.5-2.22 1.66c-2.6.26-5.1-1-6.16-3.7A8.38 8.38 0 0 1 3 11.5a8.5 8.5 0 0 1 8.5-8.5 8.5 8.5 0 0 1 9.5 8.5z"/>
    </svg>
);

// Message type definition
interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Optimized function to send a message
    const sendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            // Calls your serverless API Route
            const res = await fetch('/api/chat', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage }),
            });

            const data = await res.json();
            const botReply = data.reply || data.error || "Sorry, I ran into an internal error.";
            
            setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'bot', text: "Network error. Could not connect to the AI service." }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    return (
        <>
            {/* FLOATING CHAT ICON BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg z-50 flex justify-center items-center cursor-pointer border-none hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
            >
                <ChatIcon />
            </button>
            
            {/* CHAT WINDOW INTERFACE */}
            {isOpen && (
                <div 
                    className="fixed bottom-24 right-6 w-80 h-96 bg-white/95 backdrop-blur-xl border border-pink-200/30 rounded-xl shadow-2xl z-40 flex flex-col"
                    style={{ 
                        boxShadow: '0 10px 25px rgba(236, 72, 153, 0.2)',
                    }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-t-xl font-semibold">
                        AgriBot - Agricultural Assistant
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-pink-50/50 to-rose-50/50">
                        {messages.length === 0 && (
                            <div className="text-center text-pink-700/70 mt-8 text-sm">
                                Hello! Ask me questions about agriculture, farming, or market information.
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' 
                                            : 'bg-white/80 text-gray-800 border border-pink-100'
                                    }`}
                                >
                                    {msg.role === 'user' ? (
                                        msg.text
                                    ) : (
                                        <div 
                                            dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }} 
                                            className="prose prose-sm max-w-none"
                                            style={{ 
                                                color: msg.role === 'bot' ? '#374151' : 'inherit',
                                                fontSize: '0.875rem',
                                                lineHeight: '1.4'
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/80 text-gray-800 p-3 rounded-2xl text-sm border border-pink-100">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-pink-100/50 bg-white/80 rounded-b-xl">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type your question..."
                                disabled={isLoading}
                                className="flex-1 p-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-gray-800 placeholder-pink-400/60"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-2 rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[60px]"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : (
                                    'Send'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(Chatbot);
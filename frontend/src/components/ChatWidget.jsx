import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! I am your AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Include only previous context (up to last 10 messages to save tokens)
            const chatHistory = [...messages, userMessage].slice(-10);

            // Get the base API URL and ensure we don't have duplicate /api
            let apiUrl = import.meta.env.VITE_API_URL || 'https://final-year-project-f2p0.onrender.com/api';
            // If the URL already ends with /api, we append /chat, else /api/chat
            const endpoint = apiUrl.endsWith('/api') ? `${apiUrl}/chat` : `${apiUrl}/api/chat`;

            const response = await axios.post(
                endpoint,
                { messages: chatHistory },
                { withCredentials: true }
            );

            if (response.data.success) {
                setMessages((prev) => [...prev, response.data.reply]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
            >
                <MessageCircle size={28} />
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-2xl flex flex-col w-[calc(100vw-3rem)] sm:w-[400px] h-[500px] max-h-[80vh] overflow-hidden border border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4 flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-2">
                                <Bot size={24} />
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">AI Assistant</h3>
                                    <p className="text-xs text-red-100">Powered by OpenAI</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-red-200 transition-colors bg-white/10 p-1 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex gap-3 max-w-[85%] self-start"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Bot size={16} />
                                    </div>
                                    <div className="p-4 bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-red-600" />
                                        <span className="text-sm text-gray-500">Typing...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <form
                                onSubmit={handleSendMessage}
                                className="flex items-center gap-2 bg-gray-50 p-1 pl-4 rounded-full border border-gray-200 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm py-2"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors flex items-center justify-center"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWidget;

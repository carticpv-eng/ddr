
import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";

interface Message {
    id: number;
    role: 'user' | 'model';
    text: string;
    isTyping?: boolean;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, role: 'model', text: "Salam aleykoum mon frère/ma sœur. Je suis le Compagnon DDR. Comment puis-je t'aider dans ta quête de savoir aujourd'hui ?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialiser la session
    useEffect(() => {
        try {
            const session = createChatSession();
            setChatSession(session);
        } catch (e) {
            console.error("Erreur init chat:", e);
        }
    }, []);

    // Scroll automatique vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chatSession) return;

        const userMsg: Message = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Ajouter bulle temporaire de réflexion
            const tempId = Date.now() + 1;
            setMessages(prev => [...prev, { id: tempId, role: 'model', text: '', isTyping: true }]);

            const resultStream = await chatSession.sendMessageStream({ message: userMsg.text });
            
            let fullText = '';
            
            // Mise à jour progressive du texte (streaming)
            for await (const chunk of resultStream) {
                const c = chunk as GenerateContentResponse;
                const text = c.text || '';
                fullText += text;
                
                setMessages(prev => prev.map(msg => 
                    msg.id === tempId ? { ...msg, text: fullText, isTyping: false } : msg
                ));
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now(), role: 'model', text: "Une erreur est survenue. Veuillez vérifier votre connexion." }]);
        } finally {
            setLoading(false);
        }
    };

    const formatMessage = (text: string) => {
        return text.split('\n').map((line, i) => {
            if (line.trim().startsWith('###')) return <h3 key={i} className="text-brand-400 font-bold mt-2">{line.replace(/^###\s/, '')}</h3>;
            if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) return <li key={i} className="ml-4">{line.replace(/^[*-]\s/, '')}</li>;
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={i} className="mb-1">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-brand-200">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-black">
            {/* Header Chat */}
            <div className="bg-dark-900 p-4 border-b border-gray-800 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-900 border border-brand-500 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(234,88,12,0.4)]">
                        ☪️
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-none">Compagnon DDR</h1>
                        <p className="text-brand-500 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            En ligne • IA Islamique
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-lg ${
                            msg.role === 'user' 
                                ? 'bg-brand-600 text-white rounded-br-none' 
                                : 'bg-dark-800 text-gray-200 border border-gray-700 rounded-bl-none'
                        }`}>
                            {msg.isTyping && !msg.text ? (
                                <div className="flex gap-1 h-5 items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            ) : (
                                <div className="text-sm md:text-base leading-relaxed">
                                    {formatMessage(msg.text)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black border-t border-gray-800">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Posez votre question (ex: Qui est Allah ?)..."
                        className="flex-1 bg-dark-900 border border-gray-700 rounded-full px-6 py-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
                        disabled={loading}
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !input.trim()}
                        className="bg-brand-600 hover:bg-brand-500 text-white rounded-full p-4 transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;

import React, { useState, useRef, useEffect } from 'react';
import { LiveClient, createChatSession } from '../services/geminiService';
import { MessageSquare, Mic, Send, X, Minimize2, Maximize2, Trash2, Headphones, Keyboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LiveAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Salam alaykoum ! Je suis votre compagnon DDR. Comment puis-je vous aider dans votre cheminement aujourd\'hui ?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const clientRef = useRef<LiveClient | null>(null);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen && active) {
      clientRef.current?.disconnect();
      setActive(false);
    }
  }, [isOpen, active]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, transcript]);

  const toggleVoiceSession = async () => {
    if (active) {
        clientRef.current?.disconnect();
        setActive(false);
        setTranscript('');
    } else {
        setConnecting(true);
        setError(null);
        setMode('voice');
        try {
            const client = new LiveClient(
                (text) => {
                    // AI Message
                    setMessages(prev => [...prev, { role: 'model', text }]);
                },
                (text) => {
                    // User Transcript
                    setTranscript(text);
                    setMessages(prev => [...prev, { role: 'user', text }]);
                }
            );
            await client.connect();
            clientRef.current = client;
            setActive(true);
        } catch (e: any) {
            console.error(e);
            setError(e.message === 'GEMINI_API_KEY_MISSING' 
                ? "Clé API manquante." 
                : "Erreur micro. Vérifiez les permissions.");
            setTimeout(() => setError(null), 5000);
        } finally {
            setConnecting(false);
        }
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: 'Salam alaykoum ! Je suis votre compagnon DDR. Comment puis-je vous aider dans votre cheminement aujourd\'hui ?' }]);
    chatRef.current = null;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
        if (!chatRef.current) {
            chatRef.current = createChatSession();
        }
        const result = await chatRef.current.sendMessage({ message: userText });
        setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (err: any) {
        console.error(err);
        setError("Désolé, j'ai rencontré une difficulté technique.");
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:scale-110 transition-all group border-2 border-white/20"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
        <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-24 left-6 z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14 w-64' : 'h-[500px] w-[350px] md:w-[400px]'}`}>
        {/* Header */}
        <div className="bg-dark-900 border border-brand-500/30 rounded-t-2xl p-4 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xs">DDR</div>
                {!isMinimized && (
                    <div>
                        <h3 className="text-white font-bold text-sm leading-none">Compagnon DDR</h3>
                        <span className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">En ligne</span>
                    </div>
                )}
                {isMinimized && <span className="text-white font-bold text-xs">Compagnon DDR</span>}
            </div>
            <div className="flex items-center gap-2">
                {!isMinimized && (
                    <button onClick={clearChat} className="text-gray-400 hover:text-red-500 p-1.5 transition-colors bg-white/5 rounded-lg" title="Effacer la conversation">
                        <Trash2 size={16} />
                    </button>
                )}
                <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-400 hover:text-white p-1.5 bg-white/5 rounded-lg">
                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white hover:bg-red-600 p-1.5 bg-red-500/20 rounded-lg transition-all flex items-center gap-1" title="Fermer l'assistant">
                    <X size={20} />
                    {!isMinimized && <span className="text-[10px] font-bold uppercase pr-1">Fermer</span>}
                </button>
            </div>
        </div>

        {!isMinimized && (
            <div className="flex-grow bg-[#0c0c0e] border-x border-brand-500/10 flex flex-col overflow-hidden relative">
                {/* Mode Selector */}
                <div className="flex border-b border-white/5 bg-black/40">
                    <button 
                        onClick={() => setMode('text')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === 'text' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Keyboard size={14} />
                        Clavier
                    </button>
                    <button 
                        onClick={() => setMode('voice')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === 'voice' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Headphones size={14} />
                        Vocal
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-brand-500/20">
                    {mode === 'text' ? (
                        <>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-brand-600 text-white rounded-tr-none shadow-lg shadow-brand-900/20' 
                                        : 'bg-dark-800 text-gray-200 border border-white/5 rounded-tl-none'
                                    }`}>
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-dark-800 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${active ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-brand-500/10 border-2 border-brand-500/30'}`}>
                                <Mic className={`w-10 h-10 ${active ? 'text-red-500 animate-pulse' : 'text-brand-500'}`} />
                            </div>
                            <h4 className="text-white font-bold mb-2">{active ? 'Je vous écoute...' : 'Assistant Vocal'}</h4>
                            <p className="text-gray-400 text-xs mb-8 leading-relaxed italic">
                                {transcript || "Cliquez sur le bouton ci-dessous pour démarrer une conversation vocale avec votre compagnon."}
                            </p>
                            <div className="flex flex-col gap-3 w-full max-w-[200px]">
                                <button
                                    onClick={toggleVoiceSession}
                                    disabled={connecting}
                                    className={`w-full py-3 rounded-full font-bold text-sm transition-all shadow-lg ${
                                        active 
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20' 
                                        : 'bg-brand-600 text-white hover:bg-brand-500 shadow-brand-900/20'
                                    }`}
                                >
                                    {connecting ? 'Connexion...' : active ? 'Arrêter' : 'Démarrer'}
                                </button>
                                
                                <button
                                    onClick={() => {
                                        if (active) clientRef.current?.disconnect();
                                        setIsOpen(false);
                                    }}
                                    className="w-full py-2 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Quitter l'assistant
                                </button>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area (Text Mode) */}
                {mode === 'text' && (
                    <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/5 flex gap-2 items-center">
                        <button 
                            type="button"
                            onClick={() => setMode('voice')}
                            className="w-10 h-10 bg-dark-800 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all"
                            title="Passer en mode vocal"
                        >
                            <Mic size={18} />
                        </button>
                        <input 
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Votre question..."
                            className="flex-grow bg-dark-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!inputText.trim() || loading}
                            className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white hover:bg-brand-500 transition-all disabled:opacity-50 disabled:hover:scale-100 active:scale-90 shadow-lg shadow-brand-900/20"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                )}

                {error && (
                    <div className="absolute bottom-20 left-4 right-4 bg-red-900/90 text-white text-[10px] p-2 rounded border border-red-500 animate-fade-in text-center">
                        {error}
                    </div>
                )}
            </div>
        )}

        {/* Footer (Minimized) */}
        {isMinimized && (
            <div className="bg-dark-900 border-x border-b border-brand-500/30 rounded-b-2xl h-1 flex items-center justify-center">
                <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
            </div>
        )}
        {!isMinimized && (
            <div className="bg-dark-900 border-x border-b border-brand-500/30 rounded-b-2xl p-2 text-center">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">La Daawah Dans la Rue • IA Compagnon</p>
            </div>
        )}
    </div>
  );
};

export default LiveAssistant;

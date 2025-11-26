import React, { useState, useEffect, useRef } from 'react';
import { LiveClient } from '../services/geminiService';

const LiveAssistant = () => {
  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const clientRef = useRef<LiveClient | null>(null);

  const toggleSession = async () => {
    if (active) {
        clientRef.current?.disconnect();
        setActive(false);
        setTranscript('');
    } else {
        setConnecting(true);
        try {
            const client = new LiveClient((text) => {
                setTranscript(text);
            });
            await client.connect();
            clientRef.current = client;
            setActive(true);
        } catch (e) {
            console.error(e);
            alert("Impossible de connecter l'assistant vocal. Vérifiez les permissions micro.");
        } finally {
            setConnecting(false);
        }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
        {active && (
            <div className="mb-4 bg-dark-900 border border-brand-500/50 p-4 rounded-xl shadow-2xl max-w-xs animate-fade-in-up">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-brand-500 text-sm">Compagnon DDR (En écoute...)</span>
                    <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>
                <div className="h-12 bg-black rounded p-2 overflow-hidden text-xs text-gray-400 italic border border-gray-800">
                    {transcript || "Parlez maintenant, mon frère..."}
                </div>
            </div>
        )}

        <button
            onClick={toggleSession}
            disabled={connecting}
            className={`flex items-center gap-2 px-6 py-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all transform hover:scale-105 border border-white/10 ${
                active 
                ? 'bg-red-900 text-white hover:bg-red-800 border-red-700' 
                : 'bg-brand-600 text-white hover:bg-brand-500 border-brand-500'
            }`}
        >
            {connecting ? (
                 <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
            ) : (
                <>
                     <span className="font-bold tracking-wide">{active ? 'Raccrocher' : 'Compagnon DDR'}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                     </svg>
                </>
            )}
        </button>
    </div>
  );
};

export default LiveAssistant;
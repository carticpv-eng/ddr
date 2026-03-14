
import React, { useState, useEffect } from 'react';
import { InboxMessage } from '../../types';
import { logAction } from '../../services/logService';

const AdminMailbox = () => {
  const [messages, setMessages] = useState<InboxMessage[]>(() => {
      const stored = localStorage.getItem('ddr_inbox');
      if (stored) {
          const msgs: InboxMessage[] = JSON.parse(stored);
          msgs.sort((a, b) => b.receivedAt - a.receivedAt);
          return msgs;
      }
      return [];
  });
  const [playingId, setPlayingId] = useState<string | null>(null);

  const [now, setNow] = useState(() => Date.now());

  const loadMessages = () => {
      const stored = localStorage.getItem('ddr_inbox');
      if (stored) {
          const msgs: InboxMessage[] = JSON.parse(stored);
          // Tri par date décroissante (plus récent en haut)
          msgs.sort((a, b) => b.receivedAt - a.receivedAt);
          setMessages(msgs);
      }
  };

  useEffect(() => {
      const interval = setInterval(() => {
          loadMessages();
          setNow(Date.now());
      }, 3000);
      return () => clearInterval(interval);
  }, []);

  const deleteMessage = (id: string, senderName: string) => {
      // Suppression directe SANS confirmation complexe (UX Rapide)
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated); // Mise à jour visuelle immédiate
      localStorage.setItem('ddr_inbox', JSON.stringify(updated)); // Mise à jour stockage
      
      // --- LOG ACTION ---
      logAction('DELETE_MSG', `Message de ${senderName} supprimé par admin`, 'warning');
      // ------------------
  };

  const getTimeRemaining = (expiresAt: number) => {
      const diff = expiresAt - now;
      if (diff <= 0) return "Expiré";
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
  };

  const togglePlay = (id: string) => {
      const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
      if (audio) {
          if (playingId === id) {
              audio.pause();
              setPlayingId(null);
          } else {
              document.querySelectorAll('audio').forEach(a => a.pause());
              audio.play();
              setPlayingId(id);
          }
      }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Boîte à Lettres</h1>
            <p className="text-gray-500 mt-2 text-sm">
                Messages et Témoignages reçus des fidèles. <span className="text-red-400 font-bold">Éphémère (24h)</span>.
            </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-300 font-mono uppercase tracking-widest">{messages.length} Messages actifs</span>
        </div>
      </div>

      {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#121214] rounded-2xl border border-gray-800">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              </div>
              <p className="text-gray-500">La boîte est vide pour le moment.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-4">
              {messages.map((msg) => {
                  const timeLeft = getTimeRemaining(msg.expiresAt);
                  const isUrgent = timeLeft.startsWith('0h') || timeLeft === "Expiré";
                  
                  // Nettoyage du numéro pour le lien tel: (enlève les espaces)
                  const cleanPhone = msg.senderPhone ? msg.senderPhone.replace(/\s+/g, '') : '';

                  return (
                      <div key={msg.id} className="bg-[#121214] border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-brand-500/30 transition group relative overflow-hidden">
                          
                          {/* Timer Badge */}
                          <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl border-l border-b ${isUrgent ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-green-900/30 border-green-500/30 text-green-500'}`}>
                              Exp: {timeLeft}
                          </div>

                          {/* Sender Info */}
                          <div className="flex items-center gap-4 min-w-[200px]">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border ${msg.type === 'audio' ? 'bg-red-900/20 border-red-500/30 text-red-500' : 'bg-blue-900/20 border-blue-500/30 text-blue-500'}`}>
                                  {msg.type === 'audio' ? '🎙️' : '📝'}
                              </div>
                              <div>
                                  <h3 className="text-white font-bold">{msg.senderName}</h3>
                                  <p className="text-xs text-gray-500">{new Date(msg.receivedAt).toLocaleTimeString()}</p>
                                  {msg.senderPhone && (
                                      <p className="text-xs text-brand-500 font-mono mt-1">{msg.senderPhone}</p>
                                  )}
                              </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 bg-black/40 rounded-xl p-4 border border-gray-800/50 flex items-center">
                              {msg.type === 'text' ? (
                                  <p className="text-gray-300 text-sm leading-relaxed italic">"{msg.content}"</p>
                              ) : (
                                  <div className="w-full flex items-center gap-4">
                                      {/* Audio Element with Base64 src */}
                                      <audio id={`audio-${msg.id}`} src={msg.content} onEnded={() => setPlayingId(null)} className="hidden"></audio>
                                      
                                      <button 
                                        onClick={() => togglePlay(msg.id)}
                                        className="w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition shadow-lg shrink-0"
                                      >
                                          {playingId === msg.id ? (
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                          ) : (
                                              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                          )}
                                      </button>
                                      
                                      <div className="flex-1 h-10 flex flex-col justify-center">
                                          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                                              <div className={`h-full bg-brand-500 transition-all duration-300 ${playingId === msg.id ? 'w-full animate-[loading_15s_linear]' : 'w-0'}`}></div>
                                          </div>
                                          <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
                                              <span>{playingId === msg.id ? 'Lecture...' : 'Audio Message'}</span>
                                              <span>{msg.audioDuration}</span>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col justify-center gap-2">
                              <button 
                                onClick={() => deleteMessage(msg.id, msg.senderName)} 
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-900/10 rounded-lg transition" 
                                title="Supprimer définitivement"
                              >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                              
                              {/* BOUTON D'APPEL AVEC LIEN NETTOYÉ */}
                              {msg.senderPhone ? (
                                  <a 
                                    href={`tel:${cleanPhone}`} 
                                    className="p-2 text-green-500 hover:text-green-400 hover:bg-green-900/10 rounded-lg transition border border-transparent hover:border-green-500/30" 
                                    title={`Appeler ${msg.senderPhone}`}
                                  >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                  </a>
                              ) : (
                                  <button className="p-2 text-gray-700 cursor-not-allowed" disabled>
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                  </button>
                              )}
                          </div>
                      </div>
                  );
              })}
          </div>
      )}
    </div>
  );
};

export default AdminMailbox;

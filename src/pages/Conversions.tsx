
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_CONVERSIONS, COUNTRY_CODES } from '../constants';
import { InboxMessage } from '../types';
import { logAction } from '../services/logService';

const Conversions = () => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'text' | 'audio'>('text');
  
  // États Audio
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  
  // Formulaire
  const [senderName, setSenderName] = useState('');
  const [textContent, setTextContent] = useState('');
  
  // Téléphone International
  const [phoneCountry, setPhoneCountry] = useState('+225');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Body Scroll Lock - Renforcé
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh'; // Force le blocage sur iOS
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    };
  }, [showModal]);

  // Timer logic for recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      drawWaveform();
    } else {
      clearInterval(interval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const drawWaveform = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const animate = () => {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.fillStyle = '#ea580c'; // Brand color
          
          const bars = 40;
          const width = canvasRef.current!.width / bars;
          
          for (let i = 0; i < bars; i++) {
              const height = Math.random() * canvasRef.current!.height * 0.6;
              const x = i * width;
              const y = (canvasRef.current!.height - height) / 2;
              
              // Rounded bars
              ctx.beginPath();
              ctx.roundRect(x + 2, y, width - 4, height, 5);
              ctx.fill();
          }
          animationRef.current = requestAnimationFrame(animate);
      };
      animate();
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- RECORDING LOGIC ---

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                  audioChunksRef.current.push(event.data);
              }
          };

          mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const audioUrl = URL.createObjectURL(audioBlob);
              setAudioBlob(audioBlob);
              setAudioUrl(audioUrl);
              
              // Stop all tracks to release mic
              stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          setIsRecording(true);
      } catch (err) {
          console.error("Erreur accès micro:", err);
          setErrorMsg("Impossible d'accéder au micro. Veuillez autoriser l'accès.");
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  };

  const deleteRecording = () => {
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      setIsPlayingPreview(false);
  };

  const togglePreview = () => {
      if (!previewAudioRef.current) return;
      
      if (isPlayingPreview) {
          previewAudioRef.current.pause();
          setIsPlayingPreview(false);
      } else {
          previewAudioRef.current.play();
          setIsPlayingPreview(true);
      }
  };

  // Utility: Convert Blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // --- SENDING LOGIC (LOCALSTORAGE) ---

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg('');
      
      // Validation Stricte
      if (!senderName.trim()) {
          setErrorMsg("Veuillez entrer votre nom pour que nous puissions vous identifier.");
          return;
      }
      if (!phoneNumber.trim()) {
          setErrorMsg("Votre numéro de téléphone est obligatoire pour vous recontacter.");
          return;
      }
      
      if (mode === 'audio' && !audioBlob) {
          setErrorMsg("Veuillez enregistrer un message audio.");
          return;
      }
      if (mode === 'text' && !textContent.trim()) {
          setErrorMsg("Veuillez écrire votre message.");
          return;
      }

      setLoading(true);

      try {
          // Check submission limit (2 per day)
          const today = new Date().toDateString();
          const submissionKey = `ddr_submissions_${today}`;
          const count = parseInt(localStorage.getItem(submissionKey) || '0');
          
          if (count >= 2) {
              throw new Error("Limite journalière atteinte (2 témoignages max). Revenez demain !");
          }

          let contentUrl = textContent;
          const fullPhone = `${phoneCountry} ${phoneNumber}`;

          // Conversion Audio vers Base64 pour LocalStorage (limité en taille)
          if (mode === 'audio' && audioBlob) {
              if (audioBlob.size > 2 * 1024 * 1024) { // 2MB Check
                  throw new Error("L'audio est trop long pour le stockage local. Essayez de faire plus court.");
              }
              contentUrl = await blobToBase64(audioBlob);
          }

          // Save to LocalStorage "Inbox"
          const newMessage: InboxMessage = {
              id: Date.now().toString(),
              type: mode,
              senderName: senderName,
              senderPhone: fullPhone,
              content: contentUrl,
              audioDuration: mode === 'audio' ? formatTime(recordingTime) : undefined,
              receivedAt: Date.now(),
              expiresAt: Date.now() + (24 * 60 * 60 * 1000), // +24h
              isRead: false
          };

          const inbox = JSON.parse(localStorage.getItem('ddr_inbox') || '[]');
          inbox.unshift(newMessage); // Add to top
          localStorage.setItem('ddr_inbox', JSON.stringify(inbox));
          
          // Update daily count
          localStorage.setItem(submissionKey, (count + 1).toString());

          // --- LOG ACTION ---
          logAction('NEW_TESTIMONY', `Nouveau témoignage ${mode} reçu de ${senderName}`, 'success');
          // ------------------

          // Simulation délai réseau
          await new Promise(resolve => setTimeout(resolve, 500));

          setLoading(false);
          setSubmitted(true);
          
          // Nettoyage immédiat
          setSenderName('');
          setPhoneNumber('');
          setTextContent('');
          setAudioBlob(null);
          setAudioUrl(null);
          setRecordingTime(0);

      } catch (error: any) {
          console.error("Erreur envoi:", error);
          setErrorMsg(error.message || "Une erreur est survenue lors de l'envoi local.");
          logAction('ERROR_TESTIMONY', `Echec envoi témoignage: ${error.message}`, 'danger');
          setLoading(false);
      }
  };

  const closeModal = () => {
      setShowModal(false);
      setSubmitted(false);
      setErrorMsg('');
      setRecordingTime(0);
      setIsRecording(false);
      setAudioBlob(null);
      setAudioUrl(null);
      setMode('text');
  };

  return (
    <div className="bg-black min-h-screen font-sans overflow-x-hidden selection:bg-brand-500 selection:text-white">
       {/* Background Decor */}
       <div className="fixed inset-0 pointer-events-none">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px]"></div>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
       </div>

       {/* Hero Section */}
       <div className="relative py-24 px-4 border-b border-gray-900 z-10">
           <div className="max-w-4xl mx-auto text-center relative">
               <div className="inline-flex items-center justify-center p-3 mb-6 bg-brand-900/20 rounded-full border border-brand-500/20 shadow-[0_0_20px_rgba(234,88,12,0.15)] animate-fade-in-up">
                   <svg className="w-6 h-6 text-brand-500 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                   <span className="text-brand-500 font-bold uppercase tracking-widest text-xs">Cœurs Apaisés</span>
               </div>
               
               <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight animate-fade-in-up delay-100">
                   Ils ont cherché la vérité,<br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-500">et Allah les a guidés.</span>
               </h1>
               <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto animate-fade-in-up delay-200">
                   Découvrez les récits authentiques et poignants de frères et sœurs ivoiriens qui ont embrassé l'Islam ou retrouvé le chemin de la foi.
               </p>
           </div>
       </div>

       {/* Stories Grid */}
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
           <div className="grid grid-cols-1 gap-20">
               {MOCK_CONVERSIONS.map((story, index) => (
                   <div 
                        key={story.id} 
                        className={`flex flex-col md:flex-row gap-10 lg:gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                   >
                       {/* Image Card */}
                       <div className="w-full md:w-5/12 group perspective-1000">
                           <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 transition-all duration-700 transform group-hover:rotate-y-2 group-hover:scale-105">
                               <div className="aspect-[4/5] relative">
                                   <img 
                                       src={story.mediaUrl} 
                                       alt={story.name} 
                                       className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                               </div>
                               
                               <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition duration-500">
                                   <h3 className="text-3xl font-bold text-white mb-1 font-serif">{story.name}</h3>
                                   <div className="flex items-center gap-2">
                                       <span className="h-0.5 w-8 bg-brand-500"></span>
                                       <p className="text-brand-400 text-sm font-bold uppercase tracking-widest">{story.date}</p>
                                   </div>
                               </div>
                           </div>
                       </div>

                       {/* Text Content */}
                       <div className="w-full md:w-7/12 relative">
                           <div className="bg-[#0f0f11]/80 backdrop-blur-xl p-10 rounded-3xl border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 hover:border-brand-500/30 transition duration-500">
                               <p className="text-gray-200 text-xl leading-relaxed italic mb-8 font-serif">
                                   "{story.story}"
                               </p>
                               
                               <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                                   <div className="h-12 w-12 rounded-full bg-brand-900/50 border border-brand-500 flex items-center justify-center text-brand-500 font-bold text-xl shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                                       {story.name.charAt(0)}
                                   </div>
                                   <div>
                                       <p className="text-white font-bold text-base">Témoignage authentifié</p>
                                       <p className="text-xs text-gray-500 uppercase tracking-wider">Recueilli par l'équipe DDR</p>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
       </div>

       {/* CTA - Share Story */}
       <div className="bg-gradient-to-t from-brand-900/20 to-black py-20 text-center relative overflow-hidden border-t border-gray-900 mt-20">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10 max-w-3xl mx-auto px-4">
               <h2 className="text-3xl font-bold text-white mb-6 font-serif">Vous aussi, vous avez une histoire ?</h2>
               <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                   Votre cheminement vers la lumière peut inspirer et guider d'autres cœurs indécis. 
                   Ne gardez pas ce trésor pour vous.
               </p>
               <button 
                    onClick={() => setShowModal(true)}
                    className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3 mx-auto"
               >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                   Envoyer mon témoignage (Audio ou Écrit)
               </button>
           </div>
       </div>

        {/* MODAL TEMOIGNAGE FIXED - STRUCTURE OVERLAY & SCROLL SAFE */}
        {showModal && (
            <div className="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                {/* Backdrop Fixe */}
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" onClick={closeModal}></div>

                {/* Conteneur Scrollable */}
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    {/* align-items-start sur mobile pour éviter que le haut soit coupé */}
                    <div className="flex min-h-full items-start md:items-center justify-center p-4 text-center sm:p-0">
                        
                        {/* Panneau Modal */}
                        <div className="relative transform overflow-hidden rounded-[2rem] bg-[#0a0a0a] text-left shadow-[0_0_60px_rgba(234,88,12,0.3)] transition-all my-8 w-full max-w-lg border border-gray-800 mb-32"> 
                            {/* mb-32 ajoute une marge de sécurité en bas pour le scroll mobile */}
                            
                            {/* Decorative Top Line */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-yellow-500 to-brand-600 z-20"></div>

                            {/* CLOSE BTN */}
                            <button onClick={closeModal} className="absolute top-5 right-5 p-2 bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition z-20 cursor-pointer border border-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            {!submitted ? (
                                <div className="flex flex-col h-full">
                                    {/* Modal Header */}
                                    <div className="pt-12 pb-8 px-8 text-center bg-gradient-to-b from-[#121214] to-[#0a0a0a] border-b border-gray-800 relative">
                                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none"></div>
                                        
                                        <div className="w-16 h-16 rounded-2xl bg-brand-900/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(234,88,12,0.2)] rotate-3">
                                            <span className="text-3xl">✨</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white font-serif mb-2">Votre Témoignage</h3>
                                        <div className="inline-block px-3 py-1 bg-green-900/20 border border-green-500/20 rounded-full">
                                            <p className="text-green-500 text-[10px] uppercase tracking-wider font-bold flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                Écouté par nos imams
                                            </p>
                                        </div>
                                        
                                        {/* Modern Tab Switcher */}
                                        <div className="flex justify-center mt-8">
                                            <div className="bg-gray-900 p-1.5 rounded-full border border-gray-700 inline-flex relative shadow-inner">
                                                <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-brand-600 rounded-full shadow-lg transition-all duration-300 ease-out ${mode === 'text' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}></div>
                                                
                                                <button 
                                                    onClick={() => { setMode('text'); deleteRecording(); }}
                                                    className={`relative z-10 px-8 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 cursor-pointer ${mode === 'text' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    Écrit
                                                </button>
                                                <button 
                                                    onClick={() => setMode('audio')}
                                                    className={`relative z-10 px-8 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 cursor-pointer ${mode === 'audio' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                                    Vocal
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-8 bg-[#0a0a0a]">
                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-gray-500 pl-2">Votre Prénom & Nom <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={senderName}
                                                    onChange={(e) => setSenderName(e.target.value)}
                                                    placeholder="Prénom ou Pseudonyme" 
                                                    className="w-full bg-[#121214] border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition text-sm mt-1" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-gray-500 pl-2">Numéro de téléphone <span className="text-red-500">*</span></label>
                                                <div className="flex gap-2 mt-1">
                                                    <select 
                                                        className="bg-[#121214] border border-gray-800 rounded-xl px-3 py-4 text-white text-sm outline-none focus:border-brand-500"
                                                        value={phoneCountry}
                                                        onChange={(e) => setPhoneCountry(e.target.value)}
                                                    >
                                                        {COUNTRY_CODES.map((c, i) => (
                                                            <option key={i} value={c.code}>{c.flag} {c.code}</option>
                                                        ))}
                                                    </select>
                                                    <input 
                                                        type="tel" 
                                                        required
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        placeholder="Pour vous recontacter" 
                                                        className="flex-1 bg-[#121214] border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition text-sm" 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {mode === 'text' ? (
                                            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 pl-2">Votre Récit <span className="text-red-500">*</span></label>
                                                    <textarea 
                                                        required 
                                                        rows={5} 
                                                        value={textContent}
                                                        onChange={(e) => setTextContent(e.target.value)}
                                                        placeholder="Racontez-nous ce qui a touché votre cœur..." 
                                                        className="w-full bg-[#121214] border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition resize-none text-sm leading-relaxed mt-1"
                                                    ></textarea>
                                                </div>
                                                
                                                {errorMsg && (
                                                    <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-xs flex gap-2 items-center">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        {errorMsg}
                                                    </div>
                                                )}

                                                <button disabled={loading} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 text-sm uppercase tracking-widest mt-4 transform hover:scale-[1.02]">
                                                    {loading ? 'Envoi en cours...' : <>Envoyer mon récit <span className="text-lg">🚀</span></>}
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="text-center space-y-6 animate-fade-in-up">
                                                <div className={`relative h-40 bg-[#121214] border rounded-3xl flex items-center justify-center overflow-hidden group transition-colors ${isRecording ? 'border-brand-500/50' : 'border-gray-800'}`}>
                                                    {isRecording ? (
                                                        <canvas ref={canvasRef} width="350" height="120" className="w-full h-full opacity-80"></canvas>
                                                    ) : (
                                                        !audioBlob ? (
                                                            <div className="text-gray-600 text-xs uppercase font-bold tracking-widest flex flex-col items-center gap-2">
                                                                <span className="p-3 bg-gray-800 rounded-full text-gray-400 group-hover:text-white transition">🎙️</span>
                                                                Appuyez pour enregistrer
                                                            </div>
                                                        ) : (
                                                            // AUDIO PREVIEW
                                                            <div className="flex flex-col items-center w-full px-6">
                                                                <audio ref={previewAudioRef} src={audioUrl!} onEnded={() => setIsPlayingPreview(false)} className="hidden" />
                                                                <div className="w-full h-1 bg-gray-700 rounded-full mb-4 relative overflow-hidden">
                                                                    <div className={`h-full bg-brand-500 absolute left-0 top-0 transition-all ${isPlayingPreview ? 'w-full duration-[10s]' : 'w-0'}`}></div>
                                                                </div>
                                                                <div className="flex justify-between w-full text-xs text-gray-400 font-mono">
                                                                    <span>{isPlayingPreview ? 'Lecture...' : 'Prêt'}</span>
                                                                    <span>{formatTime(recordingTime)}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                    
                                                    {/* Recording Indicator */}
                                                    {isRecording && (
                                                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-900/30 border border-red-500/30 px-3 py-1 rounded-full">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                            <span className="text-red-400 font-mono text-xs font-bold">{formatTime(recordingTime)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {errorMsg && (
                                                    <div className="text-red-400 text-xs text-center">
                                                        {errorMsg}
                                                    </div>
                                                )}

                                                {/* CONTROLS WHATSAPP STYLE */}
                                                <div className="flex justify-center items-center gap-6">
                                                    
                                                    {/* TRASH (Visible if blob exists) */}
                                                    {audioBlob && !isRecording && (
                                                        <button onClick={deleteRecording} className="p-4 rounded-full bg-red-900/20 text-red-500 hover:bg-red-900/40 transition">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    )}

                                                    {/* MAIN ACTION BUTTON */}
                                                    {!audioBlob ? (
                                                        <button 
                                                            onClick={isRecording ? stopRecording : startRecording}
                                                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 border-4 ${isRecording ? 'bg-white border-red-500' : 'bg-red-600 border-red-800'}`}
                                                        >
                                                            {isRecording ? (
                                                                <div className="w-8 h-8 bg-red-600 rounded-md shadow-sm"></div> 
                                                            ) : (
                                                                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        // PLAY / PAUSE PREVIEW
                                                        <button 
                                                            onClick={togglePreview}
                                                            className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-800 border-4 border-gray-700 hover:bg-gray-700 transition"
                                                        >
                                                            {isPlayingPreview ? (
                                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                                            ) : (
                                                                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                            )}
                                                        </button>
                                                    )}

                                                    {/* SEND (Visible if blob exists) */}
                                                    {audioBlob && !isRecording && (
                                                        <button onClick={handleSubmit} disabled={loading} className="p-4 rounded-full bg-green-600 text-white hover:bg-green-500 shadow-lg transition transform hover:scale-110">
                                                            {loading ? (
                                                                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                            ) : (
                                                                <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center h-full flex flex-col items-center justify-center bg-[#0a0a0a]">
                                    <div className="w-24 h-24 bg-green-500/10 rounded-full border border-green-500/30 flex items-center justify-center mb-6 animate-bounce shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white font-serif mb-4">Barak Allah Oufik !</h3>
                                    <p className="text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed text-sm">
                                        Votre témoignage a bien été reçu. Qu'Allah vous récompense pour ce partage qui, nous l'espérons, guidera d'autres âmes.
                                    </p>
                                    <button onClick={closeModal} className="px-10 py-3 border border-gray-700 rounded-full text-white text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">
                                        Fermer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Conversions;

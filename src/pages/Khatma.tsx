
import React, { useState, useEffect, useRef } from 'react';
import { logAction } from '../services/logService';

interface Verse {
    number: number;
    text: string; // Arabe
    translation: string; // Français
    numberInSurah: number;
    surahName: string;
    audio?: string; // URL Audio
}

// Liste des Récitateurs disponibles (API AlQuran Cloud)
const RECITERS = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
    { id: 'ar.abdurrahmaansudais', name: 'Abdurrahmaan As-Sudais' },
    { id: 'ar.saoodshuraym', name: 'Saood Ash-Shuraym' },
    { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify' }
];

const THEMES = [
    { id: 'dark', name: 'Nuit', bg: 'bg-[#0a0a0a]', text: 'text-gray-300', accent: 'text-gold-500' },
    { id: 'sepia', name: 'Parchemin', bg: 'bg-[#f5e6d3]', text: 'text-[#5c4b37]', accent: 'text-[#8c7b5d]' },
    { id: 'light', name: 'Lumière', bg: 'bg-white', text: 'text-gray-800', accent: 'text-brand-600' }
];

const Khatma = () => {
  const [completedJuzs, setCompletedJuzs] = useState<number[]>([]);
  const [readingJuz, setReadingJuz] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Hijri Date
  const [hijriDate, setHijriDate] = useState('');

  // Reader Settings
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [fontSize, setFontSize] = useState(32); // px

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string | null>(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);

  const readerContentRef = useRef<HTMLDivElement>(null);

  // Charger la progression et la date
  useEffect(() => {
      const stored = localStorage.getItem('ddr_my_quran_progress');
      if (stored) {
          setCompletedJuzs(JSON.parse(stored));
      }

      // Fetch Hijri Date
      fetch(`https://api.aladhan.com/v1/gToH?date=${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`)
        .then(res => res.json())
        .then(data => {
            if (data.data) {
                const h = data.data.hijri;
                setHijriDate(`${h.day} ${h.month.en} ${h.year}`);
            }
        })
        .catch(console.error);
  }, []);

  const toggleJuzCompletion = (juzNum: number) => {
      let updated;
      if (completedJuzs.includes(juzNum)) {
          updated = completedJuzs.filter(n => n !== juzNum);
      } else {
          updated = [...completedJuzs, juzNum];
          logAction('QURAN_PROGRESS', `Juz ${juzNum} marqué comme lu`, 'success');
      }
      setCompletedJuzs(updated);
      localStorage.setItem('ddr_my_quran_progress', JSON.stringify(updated));
  };

  const handleFinishReading = () => {
      if (readingJuz) {
          if (!completedJuzs.includes(readingJuz)) {
              toggleJuzCompletion(readingJuz);
          }
          setShowSuccess(true);
          setTimeout(() => {
              setShowSuccess(false);
              closeReader();
          }, 3500);
      }
  };

  const openReader = async (juzNum: number) => {
      setReadingJuz(juzNum);
      setLoading(true);
      setVerses([]);
      setIsPlaying(false);
      setCurrentAudioSrc(null);
      setCurrentPlayingIndex(null);

      try {
          // 1. Texte Arabe
          const arabicRes = await fetch(`https://api.alquran.cloud/v1/juz/${juzNum}/quran-uthmani`);
          const arabicData = await arabicRes.json();

          // 2. Traduction Française
          const frenchRes = await fetch(`https://api.alquran.cloud/v1/juz/${juzNum}/fr.hamidullah`);
          const frenchData = await frenchRes.json();
          
          // 3. Audio (Selon le récitateur choisi)
          const audioRes = await fetch(`https://api.alquran.cloud/v1/juz/${juzNum}/${selectedReciter}`);
          const audioData = await audioRes.json();

          if (arabicData.code === 200 && frenchData.code === 200) {
              const mergedVerses: Verse[] = arabicData.data.ayahs.map((ayah: any, index: number) => ({
                  number: ayah.number,
                  text: ayah.text,
                  translation: frenchData.data.ayahs[index].text,
                  numberInSurah: ayah.numberInSurah,
                  surahName: ayah.surah.englishName,
                  audio: audioData.data.ayahs[index].audio // URL Audio MP3
              }));
              setVerses(mergedVerses);
              // Précharger le premier audio
              if (mergedVerses.length > 0 && mergedVerses[0].audio) {
                  setCurrentAudioSrc(mergedVerses[0].audio);
                  setCurrentPlayingIndex(0);
              }
          } else {
              throw new Error("Erreur API Quran");
          }
      } catch (error) {
          console.error(error);
          alert("Problème de connexion aux textes sacrés. Vérifiez votre internet.");
          setReadingJuz(null);
      } finally {
          setLoading(false);
      }
  };

  const closeReader = () => {
      setReadingJuz(null);
      setVerses([]);
      setIsPlaying(false);
      if (audioRef.current) {
          audioRef.current.pause();
      }
  };

  // Gestion lecture audio verset par verset
  const playAudio = (index: number) => {
      const verse = verses[index];
      if (verse && verse.audio && audioRef.current) {
          setCurrentPlayingIndex(index);
          setCurrentAudioSrc(verse.audio);
          audioRef.current.src = verse.audio;
          audioRef.current.play();
          setIsPlaying(true);
      }
  };

  const handleAudioEnded = () => {
      // Auto-play next verse
      if (currentPlayingIndex !== null && currentPlayingIndex < verses.length - 1) {
          playAudio(currentPlayingIndex + 1);
      } else {
          setIsPlaying(false);
      }
  };

  const toggleGlobalPlay = () => {
      if (!audioRef.current) return;
      
      if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
      } else {
          if (!currentAudioSrc && verses.length > 0) {
              playAudio(0);
          } else {
              audioRef.current.play();
              setIsPlaying(true);
          }
      }
  };

  const progressPercentage = Math.round((completedJuzs.length / 30) * 100);

  return (
    <div className="min-h-screen bg-black text-white pb-20 relative font-sans selection:bg-gold-500 selection:text-black">
      
      {/* --- FOND D'ÉCRAN SPIRITUEL --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black"></div>
          {/* Ciel étoilé subtil */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
          {/* Arabesque de fond */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 mix-blend-overlay"></div>
          {/* Halo central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">

        {!readingJuz && (
            <>
                {/* --- HEADER NOOR (LUMIÈRE) --- */}
                <div className="relative pt-24 pb-16 px-4 text-center overflow-hidden border-b border-gray-900">
                    <div className="max-w-4xl mx-auto relative z-10">
                        <span className="inline-block py-1 px-3 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-500 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                            {hijriDate || 'Calendrier Hijri'}
                        </span>
                        
                        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-6 font-serif tracking-tight animate-fade-in-up delay-100 drop-shadow-2xl">
                            Le Saint Coran
                        </h1>
                        
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                            "Une guidée et une miséricorde pour les croyants."
                            <br/>
                            <span className="text-sm text-brand-500 font-bold mt-2 block">Lisez à votre rythme, méditez chaque mot.</span>
                        </p>
                    </div>
                </div>

                {/* PROGRESS DASHBOARD */}
                <div className="max-w-5xl mx-auto px-4 -mt-8 mb-12 relative z-20">
                    <div className="bg-[#0f0f11] border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="36" stroke="#333" strokeWidth="6" fill="transparent" />
                                    <circle cx="40" cy="40" r="36" stroke="#d4af37" strokeWidth="6" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * progressPercentage) / 100} className="transition-all duration-1000 ease-out" />
                                </svg>
                                <span className="absolute text-white font-bold text-lg">{progressPercentage}%</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Votre Progression</h3>
                                <p className="text-gray-500 text-sm">Vous avez lu {completedJuzs.length} Juz sur 30.</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="flex-1 bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                                <span className="block text-2xl font-bold text-white">{30 - completedJuzs.length}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Restants</span>
                            </div>
                            <div className="flex-1 bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                                <span className="block text-2xl font-bold text-brand-500">{completedJuzs.length > 0 ? 'Oui' : 'Non'}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Actif</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRID DES 30 JUZ */}
                <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in-up delay-200">
                    <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-gold-500 pl-4">Sélectionnez un Juz</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => {
                            const isCompleted = completedJuzs.includes(juzNum);
                            return (
                                <button 
                                    key={juzNum}
                                    onClick={() => openReader(juzNum)}
                                    className={`group relative p-6 rounded-2xl border transition-all duration-300 h-40 flex flex-col items-center justify-center hover:-translate-y-1 overflow-hidden ${
                                        isCompleted 
                                            ? 'bg-green-900/10 border-green-500/30' 
                                            : 'bg-[#121214] border-gray-800 hover:border-gold-500/50 hover:bg-gray-900'
                                    }`}
                                >
                                    {/* Icone Arrière Plan */}
                                    <div className="absolute -right-4 -bottom-4 text-6xl text-gray-800 opacity-20 font-serif font-bold group-hover:text-gold-500 group-hover:opacity-10 transition-colors">
                                        {juzNum}
                                    </div>
                                    
                                    <span className={`text-3xl font-serif mb-2 transition-colors z-10 ${isCompleted ? 'text-green-500' : 'text-white group-hover:text-gold-400'}`}>
                                        Juz {juzNum}
                                    </span>
                                    
                                    {isCompleted ? (
                                        <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-wider bg-green-900/20 px-2 py-1 rounded">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            Terminé
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider group-hover:text-gray-400">Lire</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </>
        )}

        {/* --- LECTEUR IMMERSIF (FULL SCREEN) --- */}
        {readingJuz && (
            <div className={`fixed inset-0 z-50 flex flex-col animate-fade-in-up ${currentTheme.bg}`}>
                
                {/* 1. TOP BAR (SETTINGS) */}
                <div className={`border-b px-4 py-3 flex flex-col md:flex-row justify-between items-center shadow-sm shrink-0 z-30 transition-colors ${currentTheme.id === 'dark' ? 'border-gray-800 bg-[#0f0f11]' : 'border-gray-300 bg-white/50 backdrop-blur'}`}>
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <button 
                            onClick={closeReader}
                            className={`p-2 rounded-lg transition ${currentTheme.text} hover:bg-gray-500/10`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <h2 className={`${currentTheme.accent} font-serif text-xl font-bold`}>Juz {readingJuz}</h2>
                        <div className="w-8 md:hidden"></div> {/* Spacer mobile */}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 mt-4 md:mt-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {/* Theme Switcher */}
                        <div className="flex bg-gray-500/10 rounded-lg p-1">
                            {THEMES.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setCurrentTheme(t)}
                                    className={`w-6 h-6 rounded-md m-0.5 ${t.bg === 'bg-white' ? 'border border-gray-300' : t.bg} ${currentTheme.id === t.id ? 'ring-2 ring-brand-500' : ''}`}
                                    title={t.name}
                                ></button>
                            ))}
                        </div>

                        {/* Font Size */}
                        <div className="flex items-center gap-2 bg-gray-500/10 rounded-lg p-1 px-2">
                            <button onClick={() => setFontSize(Math.max(20, fontSize - 4))} className={`text-xs font-bold ${currentTheme.text}`}>A-</button>
                            <span className={`text-xs ${currentTheme.text}`}>{fontSize}</span>
                            <button onClick={() => setFontSize(Math.min(60, fontSize + 4))} className={`text-lg font-bold ${currentTheme.text}`}>A+</button>
                        </div>

                        {/* Reciter Select */}
                        <select 
                            value={selectedReciter}
                            onChange={(e) => setSelectedReciter(e.target.value)}
                            className={`text-xs p-2 rounded-lg bg-gray-500/10 border-none outline-none ${currentTheme.text}`}
                        >
                            {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* 2. AUDIO PLAYER BAR (STICKY) */}
                {!loading && (
                    <div className={`border-b p-3 flex items-center justify-between gap-4 shrink-0 z-20 transition-colors ${currentTheme.id === 'dark' ? 'bg-[#1a1a1c] border-gray-800' : 'bg-gray-100 border-gray-300'}`}>
                        <audio 
                            ref={audioRef} 
                            src={currentAudioSrc || ""} 
                            onEnded={handleAudioEnded}
                            className="hidden" 
                        />
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={toggleGlobalPlay}
                                className="w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition shadow-lg"
                            >
                                {isPlaying ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                ) : (
                                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                )}
                            </button>
                            <div className="hidden sm:block">
                                <p className={`text-xs font-bold ${currentTheme.text}`}>Récitation Audio</p>
                                <p className="text-[10px] text-gray-500">{RECITERS.find(r => r.id === selectedReciter)?.name}</p>
                            </div>
                        </div>
                        
                        {/* Status bar */}
                        <div className="flex-1 mx-4 text-center">
                            {currentPlayingIndex !== null && (
                                <span className="text-xs text-brand-500 font-mono animate-pulse">
                                    Lecture du verset {verses[currentPlayingIndex].numberInSurah} ({verses[currentPlayingIndex].surahName})
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. CONTENT SCROLLABLE */}
                <div className={`flex-1 overflow-y-auto relative transition-colors ${currentTheme.bg}`} ref={readerContentRef}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-10 pointer-events-none fixed"></div>
                    
                    <div className="max-w-3xl mx-auto p-6 pb-32 min-h-full">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-[60vh]">
                                <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-6"></div>
                                <p className="text-gold-500 font-serif text-lg animate-pulse tracking-widest">Chargement du Juz {readingJuz}...</p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {/* BISMILLAH */}
                                <div className="text-center py-8 opacity-80">
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/2/27/Basmala.svg" 
                                        alt="Bismillah" 
                                        className={`h-16 mx-auto ${currentTheme.id === 'dark' ? 'filter invert' : ''}`} 
                                    />
                                </div>

                                {verses.map((verse, index) => {
                                    const isNewSurah = index === 0 || verses[index - 1].surahName !== verse.surahName;
                                    const isActive = index === currentPlayingIndex;

                                    return (
                                        <div key={index} id={`verse-${index}`} className={`relative transition-all duration-500 ${isActive ? 'scale-[1.02]' : ''}`}>
                                            {isNewSurah && (
                                                <div className={`my-16 pt-8 border-t text-center ${currentTheme.id === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}>
                                                    <span className={`inline-block px-4 py-1 rounded-full text-xs uppercase tracking-widest font-bold mb-4 ${currentTheme.id === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                                                        Sourate
                                                    </span>
                                                    <h3 className={`text-4xl font-serif mb-8 ${currentTheme.text}`}>{verse.surahName}</h3>
                                                </div>
                                            )}

                                            <div 
                                                className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                                                    isActive 
                                                        ? 'border-brand-500 shadow-[0_0_30px_rgba(234,88,12,0.15)] bg-brand-500/5' 
                                                        : `hover:border-gold-500/30 ${currentTheme.id === 'dark' ? 'bg-[#0f0f11]/60 border-white/5' : 'bg-white/60 border-gray-200'}`
                                                }`}
                                                onClick={() => playAudio(index)}
                                            >
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-mono ${currentTheme.text} ${currentTheme.id === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}>
                                                        {verse.numberInSurah}
                                                    </div>
                                                    <button className={`opacity-0 group-hover:opacity-100 transition ${currentTheme.accent}`}>
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                                                    </button>
                                                </div>

                                                <p 
                                                    className={`text-right font-serif leading-[2.2] mb-8 dir-rtl ${currentTheme.text}`} 
                                                    style={{ direction: 'rtl', fontFamily: "'Amiri', serif", fontSize: `${fontSize}px` }}
                                                >
                                                    {verse.text}
                                                </p>

                                                <p className={`font-light leading-relaxed ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontSize: `${Math.max(16, fontSize * 0.6)}px` }}>
                                                    {verse.translation}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                <div className="text-center pt-16">
                                    <button 
                                        onClick={handleFinishReading}
                                        className="px-10 py-5 bg-gradient-to-r from-gold-600 to-yellow-600 hover:from-gold-500 hover:to-yellow-500 text-black font-bold text-lg rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] transition transform hover:scale-105 uppercase tracking-widest flex items-center gap-3 mx-auto"
                                    >
                                        <span>🤲</span> Terminer la lecture
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* SUCCESS MODAL */}
        {showSuccess && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up">
                <div className="bg-[#121214] border border-gold-500/40 rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 animate-bounce">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2">MachaAllah !</h2>
                        <p className="text-gray-400 mb-6">Qu'Allah accepte votre lecture et illumine votre cœur.</p>
                        <p className="text-xs text-gold-500 uppercase tracking-widest font-bold">Progression sauvegardée</p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Khatma;

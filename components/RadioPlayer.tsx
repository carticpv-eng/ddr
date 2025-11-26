
import React, { useState, useRef, useEffect } from 'react';

interface Station {
    id: string;
    name: string;
    frequency: string;
    type: 'Coran';
    url: string;
    image?: string;
    description: string;
}

// Liste des Sourates (MP3 Fiables - Serveur MP3Quran)
const STATIONS: Station[] = [
    { 
        id: 's001', 
        name: 'Sourate Al-Fatiha', 
        frequency: 'Ch. 001', 
        type: 'Coran',
        url: 'https://server8.mp3quran.net/afs/001.mp3', 
        description: 'L\'Ouverture (Mishary Alafasy)'
    },
    { 
        id: 's036', 
        name: 'Sourate Ya-Sin', 
        frequency: 'Ch. 036', 
        type: 'Coran',
        url: 'https://server8.mp3quran.net/afs/036.mp3', 
        description: 'Le Cœur du Coran'
    },
    { 
        id: 's055', 
        name: 'Sourate Ar-Rahman', 
        frequency: 'Ch. 055', 
        type: 'Coran',
        url: 'https://server8.mp3quran.net/afs/055.mp3', 
        description: 'Le Tout Miséricordieux'
    },
    { 
        id: 's067', 
        name: 'Sourate Al-Mulk', 
        frequency: 'Ch. 067', 
        type: 'Coran',
        url: 'https://server8.mp3quran.net/afs/067.mp3', 
        description: 'La Royauté (Protection)'
    },
    { 
        id: 's112', 
        name: 'Sourate Al-Ikhlas', 
        frequency: 'Ch. 112', 
        type: 'Coran',
        url: 'https://server8.mp3quran.net/afs/112.mp3', 
        description: 'Le Monothéisme Pur'
    },
    { 
        id: 's113', 
        name: 'Sourate Al-Falaq', 
        frequency: 'Ch. 113', 
        type: 'Coran',
        url: 'https://server8.mp3quran.net/afs/113.mp3', 
        description: 'L\'Aube Naissante'
    },
    { 
        id: 's114', 
        name: 'Sourate An-Nas', 
        frequency: 'Ch. 114', 
        type: 'Coran',
        url: 'https://server8.mp3quran.net/afs/114.mp3', 
        description: 'Les Hommes'
    }
];

const RadioPlayer = () => {
    const [currentStationIndex, setCurrentStationIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isListOpen, setIsListOpen] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    const station = STATIONS[currentStationIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) {
            setIsLoading(true);
            setHasError(false);
            
            audioRef.current.pause();
            audioRef.current.load();

            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsLoading(false))
                        .catch((error) => {
                            console.error("Erreur lecture:", error);
                            setIsPlaying(false);
                            setIsLoading(false);
                        });
                }
            } else {
                setIsLoading(false);
            }
        }
    }, [currentStationIndex, station.url]);

    const changeStation = (index: number) => {
        setCurrentStationIndex(index);
        setIsListOpen(false);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            setIsLoading(true);
            setHasError(false);
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsLoading(false))
                    .catch(e => {
                        console.error("Erreur lecture:", e);
                        setIsPlaying(false);
                        setIsLoading(false);
                        setHasError(true);
                    });
            }
        }
    };

    if (!isVisible) return (
        <button 
            onClick={() => setIsVisible(true)}
            className="fixed bottom-24 right-4 z-[55] bg-black border border-brand-500 text-white p-3 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.5)] hover:scale-110 transition flex items-center justify-center group overflow-hidden"
            title="Ouvrir le Lecteur Coran"
        >
             <div className="absolute inset-0 bg-brand-500 opacity-20 group-hover:opacity-30 transition"></div>
             {/* ICONE RADIO RETRO */}
             <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="32" height="22" rx="3" fill="#1A1A1A" stroke="#EA580C" strokeWidth="2"/>
                <circle cx="12" cy="21" r="5" stroke="#EA580C" strokeWidth="1.5"/>
                <circle cx="12" cy="21" r="1.5" fill="#EA580C"/>
                <rect x="20" y="14" width="12" height="4" rx="1" fill="#333"/>
                <rect x="20" y="20" width="12" height="2" rx="1" fill="#333"/>
                <rect x="20" y="24" width="12" height="2" rx="1" fill="#333"/>
                <path d="M8 10L8 4" stroke="#EA580C" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="8" cy="4" r="2" fill="#EA580C"/>
             </svg>
        </button>
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-end pointer-events-none">
            
            <div className={`w-full md:w-96 bg-black/95 backdrop-blur-xl border-t md:border-l md:border-t border-brand-500/30 shadow-2xl transition-all duration-300 pointer-events-auto ${isListOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 h-0'}`}>
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-brand-900/10">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Playlist Coranique
                    </h3>
                    <button onClick={() => setIsListOpen(false)} className="text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {STATIONS.map((s, idx) => (
                        <button 
                            key={s.id}
                            onClick={() => changeStation(idx)}
                            className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all group ${currentStationIndex === idx ? 'bg-brand-900/40 border border-brand-500/50' : 'hover:bg-gray-900 border border-transparent'}`}
                        >
                            <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-lg ${currentStationIndex === idx ? 'bg-brand-500 text-black' : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'}`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                            </div>
                            <div className="text-left flex-1">
                                <div className="flex justify-between">
                                    <span className={`font-bold text-sm ${currentStationIndex === idx ? 'text-white' : 'text-gray-300'}`}>{s.name}</span>
                                    <span className="text-xs font-mono text-brand-500">{s.frequency}</span>
                                </div>
                                <p className="text-xs text-gray-500">{s.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full bg-[#09090b] border-t border-gray-800 shadow-[0_-5px_30px_rgba(0,0,0,0.9)] text-white pointer-events-auto relative">
                
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900">
                    {isPlaying && !isLoading && !hasError && (
                        <div className="h-full bg-gradient-to-r from-brand-600 via-yellow-500 to-brand-600 animate-[shimmer_2s_infinite_linear] w-full"></div>
                    )}
                    {isLoading && (
                        <div className="h-full bg-brand-500 w-1/3 animate-[slide_1s_infinite_ease-in-out]"></div>
                    )}
                    {hasError && (
                        <div className="h-full bg-red-600 w-full"></div>
                    )}
                </div>

                <audio 
                    ref={audioRef} 
                    src={station.url}
                    crossOrigin="anonymous"
                    onEnded={() => {
                        const next = (currentStationIndex + 1) % STATIONS.length;
                        changeStation(next);
                    }}
                    onError={(e) => {
                        console.log("Erreur flux audio", e);
                        setIsLoading(false);
                        setIsPlaying(false);
                        setHasError(true);
                    }}
                    onPlaying={() => {
                        setIsLoading(false);
                        setHasError(false);
                    }}
                    onWaiting={() => setIsLoading(true)}
                />

                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                        {/* ICONE RADIO AVANCEE */}
                        <div className="relative group cursor-pointer w-12 h-12 shrink-0" onClick={() => setIsListOpen(!isListOpen)}>
                            <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" className={`transition-all duration-500 ${isPlaying ? 'drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]' : 'grayscale opacity-70'}`}>
                                <rect x="4" y="10" width="32" height="22" rx="3" fill="#1A1A1A" stroke={isPlaying ? "#EA580C" : "#555"} strokeWidth="2"/>
                                <circle cx="12" cy="21" r="5" stroke={isPlaying ? "#EA580C" : "#555"} strokeWidth="1.5"/>
                                <circle cx="12" cy="21" r="1.5" fill={isPlaying ? "#EA580C" : "#555"}/>
                                <rect x="20" y="14" width="12" height="4" rx="1" fill="#333"/>
                                <rect x="20" y="20" width="12" height="2" rx="1" fill="#333"/>
                                <path d="M8 10L8 4" stroke={isPlaying ? "#EA580C" : "#555"} strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="8" cy="4" r="2" fill={isPlaying ? "#EA580C" : "#555"}/>
                            </svg>
                        </div>
                        
                        <div className="flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-1.5 rounded flex items-center gap-1 uppercase tracking-wider ${hasError ? 'bg-red-500/20 text-red-500' : isPlaying ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                                    {hasError ? 'ERREUR' : isPlaying ? 'LECTURE' : 'PAUSE'}
                                </span>
                                <span className="text-[10px] text-brand-500 font-mono hidden sm:block">{station.frequency}</span>
                            </div>
                            <h4 className="font-bold text-sm md:text-lg text-white truncate leading-tight mt-0.5">{station.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{station.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => {
                                const prev = (currentStationIndex - 1 + STATIONS.length) % STATIONS.length;
                                changeStation(prev);
                            }}
                            className="text-gray-500 hover:text-white hidden sm:block transition"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                        </button>

                        <button 
                            onClick={togglePlay}
                            disabled={isLoading}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg border-4 ${
                                isPlaying 
                                ? 'bg-black border-brand-500 text-brand-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]' 
                                : hasError 
                                    ? 'bg-red-900 border-red-700 text-white'
                                    : 'bg-brand-600 border-brand-600 text-white hover:bg-brand-500'
                            }`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : isPlaying ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            ) : (
                                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            )}
                        </button>

                        <button 
                            onClick={() => {
                                const next = (currentStationIndex + 1) % STATIONS.length;
                                changeStation(next);
                            }}
                            className="text-gray-500 hover:text-white hidden sm:block transition"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <button 
                            onClick={() => setIsListOpen(!isListOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition ${isListOpen ? 'bg-brand-600 border-brand-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                        >
                            <span className="hidden md:inline">Sourates</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        </button>

                        <button 
                            onClick={() => setIsVisible(false)}
                            className="text-gray-600 hover:text-red-500 transition ml-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadioPlayer;

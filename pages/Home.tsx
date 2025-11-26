
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_NEWS, MOCK_DEBATES, MOCK_CONVERSIONS, SPEAKERS, SCHOOL_CAMPAIGN } from '../constants';
import { Link } from 'react-router-dom';
import { searchKnowledgeBaseStream } from '../services/geminiService';
import PrayerTimes from '../components/PrayerTimes';

const SUGGESTED_THEMES = [
  "Qui est Allah ?",
  "Jésus (Issa) dans le Coran",
  "Le but de la vie sur Terre",
  "La mort et l'après-vie",
  "Preuves de la prophétie de Muhammad",
  "La Bible et le Coran : Comparaison",
  "Pourquoi le mal existe-t-il ?",
  "La place de la femme en Islam",
  "Science et Coran",
  "Comment devenir musulman ?"
];

const DAILY_DUAS = [
    { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", fr: "Seigneur ! Accorde-nous belle part ici-bas, et belle part aussi dans l'au-delà; et protège-nous du châtiment du Feu." },
    { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", fr: "Seigneur, ouvre-moi ma poitrine et facilite ma mission." },
    { arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", fr: "Ô Allah, Tu es Pardonneur, Tu aimes le pardon, alors pardonne-moi." }
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const responseBuffer = useRef('');
  
  const [searching, setSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false); 
  const [showSuggestions, setShowSuggestions] = useState(false);
  const resultContainerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLFormElement>(null);
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);

  // Dua Carousel Loop
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentDuaIndex((prev) => (prev + 1) % DAILY_DUAS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Click outside listener to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if ((isTyping || searching) && resultContainerRef.current) {
        const element = resultContainerRef.current;
        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
        if (isNearBottom) {
            element.scrollTop = element.scrollHeight;
        }
    }
  }, [displayedText, isTyping, searching]);

  useEffect(() => {
    let intervalId: any;

    if (isTyping) {
        intervalId = setInterval(() => {
            setDisplayedText((current) => {
                const target = responseBuffer.current;
                
                if (current.length < target.length) {
                    const speed = (target.length - current.length) > 50 ? 2 : 1;
                    return target.slice(0, current.length + speed);
                } else {
                    if (!searching) {
                        setIsTyping(false);
                    }
                    return current;
                }
            });
        }, 30);
    }

    return () => clearInterval(intervalId);
  }, [isTyping, searching]);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    
    const queryToUse = overrideQuery || searchQuery;
    if (!queryToUse.trim()) return;

    if (overrideQuery) setSearchQuery(overrideQuery);

    setSearching(true);
    setIsTyping(true); 
    setDisplayedText(""); 
    responseBuffer.current = ""; 
    setShowSuggestions(false);

    try {
      const stream = await searchKnowledgeBaseStream(queryToUse);
      
      for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
              responseBuffer.current += text;
          }
      }
    } catch (error) {
      console.error(error);
      responseBuffer.current += "\n\n(Une erreur est survenue lors de la consultation des textes sacrés. Veuillez vérifier votre connexion.)";
    } finally {
      setSearching(false); 
    }
  };

  const scrollToSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('search');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
         return <li key={i} className="ml-6 mb-2 text-gray-300 list-disc marker:text-brand-500">{line.replace(/^[*-]\s/, '')}</li>;
      }
      if (line.trim().startsWith('###')) {
          return <h3 key={i} className="text-xl font-bold text-brand-400 mt-4 mb-2">{line.replace(/^###\s/, '')}</h3>
      }
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-3 leading-relaxed text-gray-200">
          {parts.map((part, j) => {
             if (part.startsWith('**') && part.endsWith('**')) {
                 return <strong key={j} className="text-brand-200 font-serif tracking-wide border-b border-brand-900/50">{part.slice(2, -2)}</strong>;
             }
             return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-black text-gray-100 font-sans min-h-screen relative overflow-x-hidden">
      
      {/* --- FOND D'ÉCRAN LUXE & ROYAL --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          {/* Base noire profonde avec dégradé radial central pour la profondeur */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#000000]"></div>
          
          {/* Texture subtile de haute qualité (Motif Cube Coat pour effet 3D léger) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')] opacity-[0.03] mix-blend-overlay"></div>
          
          {/* Orbes de lumière animées (Effet Aurora Borealis Doré) */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-600/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-600/10 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
          
          {/* Poussière d'étoiles (Particules fines) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.07] animate-pulse"></div>

          {/* Vignettage pour focus central */}
          <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,#000000_90%)]"></div>
      </div>

      <div className="relative z-10">
        
        {/* --- MUR DES INVOCATIONS (DUA WALL) --- */}
        <div className="bg-black/80 backdrop-blur-sm border-b border-brand-900/30 overflow-hidden h-12 flex items-center justify-center relative z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none"></div>
            <div key={currentDuaIndex} className="animate-fade-in-up text-center px-4">
                <span className="text-gold-500 font-serif text-sm md:text-base mx-2 tracking-wide">{DAILY_DUAS[currentDuaIndex].arabic}</span>
                <span className="text-gray-500 text-xs hidden md:inline mx-2">•</span>
                <span className="text-gray-400 text-xs italic hidden md:inline">{DAILY_DUAS[currentDuaIndex].fr}</span>
            </div>
        </div>

        {/* Hero Section */}
        <div className="relative border-b border-gray-900 overflow-hidden">
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Petit Badge */}
                <span className="inline-block py-1.5 px-4 rounded-full bg-brand-900/30 border border-brand-500/30 text-brand-500 text-xs font-bold tracking-[0.2em] uppercase mb-8 animate-fade-in-up shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                    La Voie de la Vérité
                </span>
                
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-6 font-serif drop-shadow-2xl">
                    La <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-yellow-400 to-brand-500 animate-pulse">DDR</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                    Dialoguer avec Sagesse. Instruire avec Science. Pacifier avec Amour.
                </p>
                
                <div className="mt-12 flex flex-wrap justify-center gap-6">
                    <a href="#search" onClick={scrollToSearch} className="group relative px-8 py-4 bg-gradient-to-r from-brand-700 to-brand-600 rounded-full text-white font-bold shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_50px_rgba(234,88,12,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 skew-x-12 origin-left"></div>
                        <span className="relative flex items-center gap-3">
                            <span className="text-xl">🤖</span> Poser une question à l'IA
                        </span>
                    </a>
                    <Link to="/debates" className="px-8 py-4 rounded-full border border-gray-600 bg-black/40 backdrop-blur-md text-gray-300 font-bold hover:text-white hover:border-brand-500 hover:bg-brand-900/10 transition duration-300">
                        Voir les débats
                    </Link>
                </div>
            </div>
        </div>

        {/* HORAIRES DE PRIERE */}
        <PrayerTimes />

        {/* SECTION TÉMOIGNAGE DU MOMENT */}
        <div className="bg-[#050505] border-y border-gray-900 py-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl"></div>
             <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                 <div className="flex items-center gap-6">
                     <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-brand-500/50 shadow-lg">
                         <img src={MOCK_CONVERSIONS[0].mediaUrl} className="w-full h-full object-cover" alt="Témoignage" />
                     </div>
                     <div>
                         <span className="text-brand-500 text-xs font-bold uppercase tracking-wider">Témoignage du mois</span>
                         <h3 className="text-white font-serif text-xl mt-1 italic">"{MOCK_CONVERSIONS[0].story.substring(0, 60)}..."</h3>
                         <p className="text-gray-500 text-sm mt-1">- {MOCK_CONVERSIONS[0].name}</p>
                     </div>
                 </div>
                 <Link to="/conversions" className="px-6 py-2 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-white transition text-sm font-bold whitespace-nowrap">
                     Lire tous les témoignages →
                 </Link>
             </div>
        </div>

        {/* SECTION DON / ECOLE - PRIORITAIRE */}
        <div className="border-b border-gray-800 relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-900/5 pattern-dots opacity-20"></div>
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                 <div className="bg-[#0f0f0f]/80 backdrop-blur-md rounded-3xl border border-brand-500/30 overflow-hidden shadow-[0_0_60px_rgba(234,88,12,0.1)] flex flex-col md:flex-row group hover:border-brand-500/50 transition-colors duration-500">
                     <div className="w-full md:w-2/5 relative min-h-[350px] overflow-hidden">
                         <img src={SCHOOL_CAMPAIGN.imageUrl} alt="Projet École" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                         <div className="absolute bottom-6 left-6">
                             <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow animate-pulse mb-2 inline-block tracking-widest uppercase">Urgence Chantier</span>
                             <h3 className="text-3xl font-bold text-white leading-none mb-1 font-serif">Mosquée & École</h3>
                             <p className="text-gray-300 text-sm flex items-center gap-1"><span className="text-brand-500">📍</span> Abidjan, Côte d'Ivoire</p>
                         </div>
                     </div>
                     <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                         <h2 className="text-3xl font-bold text-white mb-4">Construisons l'avenir de la <span className="text-brand-500">Oumma</span></h2>
                         <p className="text-gray-400 mb-8 leading-relaxed">
                             La DDR construit actuellement un complexe éducatif pour former la jeunesse aux sciences et à la foi. 
                             Chaque brique posée est une <em>Sadaqa Jariya</em> pour vous. Nous avons besoin de ciment, de fer et de main d'œuvre.
                         </p>
                         
                         <div className="space-y-3 mb-10">
                             <div className="flex justify-between text-sm font-bold text-gray-300">
                                 <span>Progression du chantier</span>
                                 <span>{Math.round((SCHOOL_CAMPAIGN.currentAmount / SCHOOL_CAMPAIGN.targetAmount) * 100)}%</span>
                             </div>
                             <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                                 <div 
                                    className="bg-gradient-to-r from-brand-700 via-brand-500 to-yellow-500 h-full rounded-full relative shadow-[0_0_10px_rgba(234,88,12,0.5)]" 
                                    style={{ width: `${(SCHOOL_CAMPAIGN.currentAmount / SCHOOL_CAMPAIGN.targetAmount) * 100}%` }}
                                 >
                                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30"></div>
                                 </div>
                             </div>
                             <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
                                 <span>Récolté: <span className="text-white">{SCHOOL_CAMPAIGN.currentAmount.toLocaleString()} F</span></span>
                                 <span>Objectif: <span className="text-gray-400">{SCHOOL_CAMPAIGN.targetAmount.toLocaleString()} F</span></span>
                             </div>
                         </div>

                         <div className="flex gap-4">
                             <button onClick={() => window.location.hash = '#donate'} className="flex-1 bg-brand-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:bg-brand-500 hover:scale-[1.02] transition-all uppercase tracking-wider flex items-center justify-center gap-2">
                                 <span className="text-xl">🙌</span> Faire un Don
                             </button>
                             <Link to="/appointments" className="px-6 py-4 border border-gray-700 rounded-xl text-gray-300 font-bold hover:bg-gray-800 hover:text-white transition-colors">
                                 Don Matériel
                             </Link>
                         </div>
                     </div>
                 </div>
             </div>
        </div>

        {/* Figures de la DDR Section */}
        <div className="bg-gradient-to-b from-transparent to-black/80 py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-brand-500 font-bold uppercase tracking-widest text-xs mb-2 block">Les voix de la sagesse</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">Les Piliers de la <span className="text-brand-600">DDR</span></h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
                        Suivez <strong>Oustaz Diane</strong> et <strong>Ismaël Aka</strong>, les guides qui éclairent les consciences.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {SPEAKERS.map((speaker) => (
                        <div key={speaker.id} className="relative bg-[#0f0f0f]/80 backdrop-blur-sm rounded-[2rem] border border-gray-800 p-8 flex flex-col md:flex-row gap-8 shadow-2xl hover:border-brand-500/30 transition duration-500 group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-bl-full pointer-events-none transition group-hover:bg-brand-500/10"></div>
                            
                            <div className="flex-shrink-0 flex justify-center md:justify-start">
                                 <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-brand-500 to-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                     <img 
                                        src={speaker.imageUrl} 
                                        alt={speaker.name} 
                                        className="w-full h-full object-cover rounded-full border-4 border-black" 
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            // Fallback visuel élégant si image non trouvée
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=400&auto=format&fit=crop"; 
                                        }}
                                     />
                                 </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-3xl font-bold text-white group-hover:text-brand-500 transition-colors font-serif">{speaker.name}</h3>
                                <p className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-gray-800 pb-2 inline-block">{speaker.role}</p>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{speaker.bio}</p>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <a href={speaker.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/30 px-4 py-2 rounded-lg font-bold hover:bg-[#FF0000] hover:text-white transition group/btn">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                        Vidéos
                                    </a>
                                    <a href={speaker.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/30 px-4 py-2 rounded-lg font-bold hover:bg-[#1877F2] hover:text-white transition">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                        Suivre
                                    </a>
                                    <a href={speaker.socials.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 text-white border border-white/20 px-4 py-2 rounded-lg font-bold hover:bg-white hover:text-black transition">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.49-3.35-3.98-5.6-.48-2.24-.08-4.62 1.09-6.64 1.19-2.05 3.29-3.56 5.6-4.05 1.58-.33 3.24-.18 4.79.46V11c-1.28-.65-2.73-.8-4.13-.39-1.27.37-2.33 1.25-2.94 2.42-.62 1.18-.63 2.61-.02 3.8.61 1.2 1.71 2.11 3.01 2.51 1.34.41 2.82.25 4.05-.44 1.24-.7 2.05-2 2.1-3.41.06-2.95.02-5.9.03-8.85h-.01c-.13-.01-.2.01-.53-.02-.85-.22-1.32-.87-1.6-1.58-.23-.6-.32-1.23-.32-1.85V3.06c0-.26.02-.51.05-.76.08-.72.4-1.37.94-1.87.53-.49 1.18-.76 1.91-.79h.03z"/></svg>
                                        Reels
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* AI Search Section (Le Compagnon DDR) */}
        <div id="search" className="py-24 border-t border-gray-800 relative transition-all duration-1000 min-h-[500px]">
            {/* AI Glow Effect */}
            {(searching || isTyping) && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-brand-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
            )}

            <div className="max-w-4xl mx-auto px-4 relative z-10">
               <div className="text-center mb-10">
                   <span className="text-brand-500 text-xs font-bold tracking-[0.2em] uppercase bg-black px-4 py-2 rounded-full border border-brand-500/30 shadow-[0_0_15px_rgba(234,88,12,0.2)]">Intelligence Artificielle</span>
                   <h2 className="text-4xl font-extrabold text-white mt-6 flex items-center justify-center gap-3">
                       Le Compagnon DDR
                   </h2>
                   <p className="text-gray-500 mt-4 text-sm font-light">Posez vos questions sur l'Islam ou le Christianisme. Réponses sourcées et sages.</p>
                   
                   <Link to="/chat" className="inline-block mt-4 text-brand-400 hover:text-white text-sm font-bold underline decoration-brand-500/50 hover:decoration-brand-500 underline-offset-4 transition">
                       Ouvrir le mode discussion complète →
                   </Link>
               </div>

               <form onSubmit={(e) => handleSearch(e)} className="relative group max-w-2xl mx-auto" ref={suggestionsRef}>
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-yellow-600 rounded-3xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${searching ? 'opacity-100 animate-pulse' : ''}`}></div>
                    <input 
                        type="text"
                        value={searchQuery}
                        onFocus={() => setShowSuggestions(true)}
                        onClick={() => setShowSuggestions(true)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ex: Que dit le Coran sur Jésus ?"
                        className="relative w-full bg-[#0a0a0a] border border-gray-800 text-white p-6 pl-8 rounded-3xl shadow-2xl focus:ring-0 focus:outline-none text-lg placeholder-gray-600 transition-all z-20"
                        autoComplete="off"
                    />
                    <button 
                        type="submit" 
                        disabled={searching || isTyping}
                        className="absolute right-3 top-3 bottom-3 bg-brand-600 hover:bg-brand-500 text-white px-6 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg z-20 flex items-center justify-center"
                    >
                        {searching ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        )}
                    </button>

                    {showSuggestions && !searching && !isTyping && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f]/95 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-30 p-4 animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thèmes suggérés</span>
                                <div className="h-px bg-gray-800 flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {SUGGESTED_THEMES.map((theme, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSearch(undefined, theme)}
                                        className="text-left px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-brand-900/30 hover:border-brand-500/30 border border-transparent transition-all duration-200 text-sm font-medium flex items-center group"
                                    >
                                        <span className="mr-3 text-brand-500 opacity-50 group-hover:opacity-100 transition">✦</span>
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
               </form>

               {(displayedText || searching) && (
                   <div className="mt-12 animate-fade-in-up max-w-3xl mx-auto">
                       <div className="bg-[#101010] rounded-2xl border border-brand-900/50 overflow-hidden shadow-[0_0_80px_rgba(234,88,12,0.1)] transition-all duration-500 relative">
                           {/* Decorative Top Border */}
                           <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-yellow-500 to-brand-600"></div>
                           
                           <div className="px-8 py-6 flex items-center gap-4 border-b border-gray-800 bg-black/40">
                               <div className="h-10 w-10 rounded-full bg-brand-900 flex items-center justify-center border border-brand-500/50 shadow-[0_0_15px_rgba(234,88,12,0.3)] shrink-0">
                                   <span className="text-brand-500 text-sm">☪️</span>
                               </div>
                               <div>
                                   <span className="block font-bold text-gray-200">Le Compagnon</span>
                                   <span className="text-xs text-brand-500">Réponse générée par IA</span>
                               </div>
                           </div>
                           
                           <div className="p-8 md:p-10 text-gray-200 font-light text-lg min-h-[150px] max-h-[600px] overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" ref={resultContainerRef}>
                               {formatText(displayedText)}
                               {isTyping && <span className="inline-block w-2 h-5 ml-1 align-middle bg-brand-500 animate-pulse"></span>}
                           </div>
                       </div>
                   </div>
               )}
            </div>
        </div>

        {/* Featured News */}
        <div className="bg-black py-20 px-4">
             <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-4">
                    <div>
                        <span className="text-brand-500 font-bold uppercase tracking-widest text-xs mb-2 block">Dernières nouvelles</span>
                        <h2 className="text-3xl font-bold text-white">À la Une de la <span className="text-brand-500">DDR</span></h2>
                    </div>
                    <Link to="/news" className="text-sm font-bold text-gray-400 hover:text-white transition hidden md:block">Voir tout →</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_NEWS.slice(0, 3).map(news => (
                        <div key={news.id} className="bg-[#121212] rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500/50 transition group hover:-translate-y-2 duration-300 shadow-lg">
                            <div className="h-56 overflow-hidden relative">
                                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition transform group-hover:scale-110 duration-700 opacity-80 group-hover:opacity-100" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{news.category}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center text-xs text-gray-500 mb-3 gap-2">
                                    <span className="text-brand-500">●</span>
                                    <span>{news.createdAt}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-500 transition-colors leading-tight">{news.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{news.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

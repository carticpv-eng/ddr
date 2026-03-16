
import React, { useState, useEffect } from 'react';
import { PROPHET_STORIES } from '../constants'; // Import des histoires

// --- DATA CONSTANTS ---

const DAILY_REMINDERS = [
    { type: 'Verset', arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', text: 'Et dis : "Ô mon Seigneur, accroît mes connaissances !"', ref: 'Sourate Taha, v.114' },
    { type: 'Hadith', arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', text: '"Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne."', ref: 'Rapporté par Al-Bukhari' },
    { type: 'Sagesse', arabic: 'العلم نور', text: '"La science est une lumière que Dieu jette dans le cœur de qui Il veut."', ref: 'Imam Malik' }
];

const FIVE_PILLARS = [
    { num: 1, title: "La Shahada", trans: "L'Attestation de Foi", icon: "☝️", desc: "Témoigner qu'il n'y a de dieu qu'Allah et que Muhammad est Son messager." },
    { num: 2, title: "La Salat", trans: "La Prière", icon: "🤲", desc: "Accomplir les 5 prières quotidiennes obligatoires." },
    { num: 3, title: "La Zakat", trans: "L'Aumône", icon: "💰", desc: "Purifier ses biens en donnant une part aux nécessiteux." },
    { num: 4, title: "Le Sawm", trans: "Le Jeûne", icon: "🌙", desc: "Jeûner le mois de Ramadan pour purifier l'âme." },
    { num: 5, title: "Le Hajj", trans: "Le Pèlerinage", icon: "🕋", desc: "Se rendre à la Mecque au moins une fois dans sa vie si on en a les moyens." }
];

const ARABIC_LETTERS = [
    { char: 'ا', name: 'Alif', sound: 'aa' },
    { char: 'ب', name: 'Ba', sound: 'b' },
    { char: 'ت', name: 'Ta', sound: 't' },
    { char: 'ث', name: 'Tha', sound: 'th' },
    { char: 'ج', name: 'Jim', sound: 'j' },
    { char: 'ح', name: 'Ha', sound: 'h (dur)' },
    { char: 'خ', name: 'Kha', sound: 'kh' },
    { char: 'د', name: 'Dal', sound: 'd' },
    { char: 'ذ', name: 'Dhal', sound: 'dh' },
    { char: 'ر', name: 'Ra', sound: 'r' },
    { char: 'ز', name: 'Zay', sound: 'z' },
    { char: 'س', name: 'Sin', sound: 's' },
    { char: 'ش', name: 'Shin', sound: 'sh' },
    { char: 'ص', name: 'Sad', sound: 'S (emphatique)' },
    { char: 'ض', name: 'Dad', sound: 'D (emphatique)' },
    { char: 'ط', name: 'Ta', sound: 'T (emphatique)' },
    { char: 'ظ', name: 'Zha', sound: 'Z (emphatique)' },
    { char: 'ع', name: '\'Ayn', sound: '3' },
    { char: 'غ', name: 'Ghayn', sound: 'gh' },
    { char: 'ف', name: 'Fa', sound: 'f' },
    { char: 'ق', name: 'Qaf', sound: 'q' },
    { char: 'ك', name: 'Kaf', sound: 'k' },
    { char: 'ل', name: 'Lam', sound: 'l' },
    { char: 'م', name: 'Mim', sound: 'm' },
    { char: 'ن', name: 'Nun', sound: 'n' },
    { char: 'ه', name: 'Ha', sound: 'h (doux)' },
    { char: 'و', name: 'Waw', sound: 'w / ou' },
    { char: 'ي', name: 'Ya', sound: 'y / i' }
];

const SOCIAL_LINKS = [
    { 
        name: 'Facebook', 
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        ), 
        url: 'https://www.facebook.com/Oustazdianeoff', 
        bgClass: 'bg-[#1877F2]',
        borderClass: 'border-[#1877F2]',
        label: 'Rejoindre la communauté',
        subLabel: 'Oustaz Diane Officiel'
    },
    { 
        name: 'YouTube', 
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        ), 
        url: 'https://www.youtube.com/@ddrlavraiechaine', 
        bgClass: 'bg-[#FF0000]',
        borderClass: 'border-[#FF0000]',
        label: 'Voir les débats & lives',
        subLabel: 'DDR La Vraie Chaîne'
    },
    { 
        name: 'TikTok', 
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.49-3.35-3.98-5.6-.48-2.24-.08-4.62 1.09-6.64 1.19-2.05 3.29-3.56 5.6-4.05 1.58-.33 3.24-.18 4.79.46V11c-1.28-.65-2.73-.8-4.13-.39-1.27.37-2.33 1.25-2.94 2.42-.62 1.18-.63 2.61-.02 3.8.61 1.2 1.71 2.11 3.01 2.51 1.34.41 2.82.25 4.05-.44 1.24-.7 2.05-2 2.1-3.41.06-2.95.02-5.9.03-8.85h-.01c-.13-.01-.2.01-.53-.02-.85-.22-1.32-.87-1.6-1.58-.23-.6-.32-1.23-.32-1.85V3.06c0-.26.02-.51.05-.76.08-.72.4-1.37.94-1.87.53-.49 1.18-.76 1.91-.79h.03z"/></svg>
        ), 
        url: 'https://www.tiktok.com/@ddrofficielle', 
        bgClass: 'bg-[#000000]',
        borderClass: 'border-gray-600',
        label: 'Shorts & Reels',
        subLabel: '@ddrofficielle'
    }
];

const SUNNAS = [
    { title: 'Le Sourire', desc: 'Sourire à son frère est une aumône.' },
    { title: 'Main Droite', desc: 'Manger et boire avec la main droite.' },
    { title: 'Le Siwak', desc: 'Purifier sa bouche avant la prière.' },
    { title: 'Le Salam', desc: 'Saluer celui qu\'on connaît et celui qu\'on ne connaît pas.' },
    { title: 'Visiter le Malade', desc: 'Une cause de grande récompense.' }
];

// --- DONNÉES DU COMPARATEUR ---
const COMPARISONS = [
    {
        id: 'jesus',
        title: 'Jésus (Issa)',
        icon: '✝️ vs ☪️',
        islam: {
            source: 'Coran 4:171',
            text: 'Le Messie Jésus, fils de Marie, n\'est qu\'un Messager d\'Allah, Sa parole qu\'Il envoya à Marie, et un souffle venant de Lui.'
        },
        christianity: {
            source: 'Jean 3:16',
            text: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point.'
        },
        verdict: 'L\'Islam honore Jésus comme un grand Prophète (né miraculeusement) mais rejette la Trinité. Dieu est Unique et sans enfant.'
    },
    {
        id: 'wine',
        title: 'Le Vin / Alcool',
        icon: '🍷',
        islam: {
            source: 'Coran 5:90',
            text: 'Le vin, le jeu de hasard... ne sont qu\'une abomination, œuvre du Diable. Écartez-vous en.'
        },
        christianity: {
            source: 'Psaumes 104:15',
            text: 'Le vin qui réjouit le cœur de l\'homme, Et fait plus que l\'huile resplendir son visage...'
        },
        verdict: 'Haram (Interdit) en Islam pour préserver la raison. Permis (avec modération) dans le Christianisme, symbole du sang du Christ.'
    },
    {
        id: 'pork',
        title: 'Le Porc',
        icon: '🐖',
        islam: {
            source: 'Coran 2:173',
            text: 'Certes, Il vous interdit la chair d\'une bête morte, le sang, la viande de porc...'
        },
        christianity: {
            source: 'Marc 7:19',
            text: '(Jésus) déclarait purs tous les aliments... Ce n\'est pas ce qui entre dans la bouche qui souille l\'homme.'
        },
        verdict: 'Considéré impur et interdit en Islam. Autorisé dans le Christianisme moderne qui se détache des lois alimentaires lévitiques.'
    },
    {
        id: 'salvation',
        title: 'Le Salut (Paradis)',
        icon: '🗝️',
        islam: {
            source: 'Coran 103:3',
            text: 'Sauf ceux qui croient et accomplissent les bonnes œuvres, s\'enjoignent mutuellement la vérité...'
        },
        christianity: {
            source: 'Éphésiens 2:8',
            text: 'Car c\'est par la grâce que vous êtes sauvés, par le moyen de la foi. Cela ne vient pas de vos œuvres.'
        },
        verdict: 'En Islam, le salut s\'obtient par la Foi ET les Œuvres. En Christianisme (Protestant), par la Foi seule (Sola Fide).'
    }
];

const LearningCenter = () => {
    const [tasbihCount, setTasbihCount] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedTopic, setSelectedTopic] = useState(0); 
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    
    // NOUVEAU: ETATS POUR L'HISTOIRE DU JOUR
    const [dailyStory, setDailyStory] = useState(() => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const index = dayOfYear % PROPHET_STORIES.length;
        return PROPHET_STORIES[index];
    });

    const [views, setViews] = useState(() => {
        const viewsData = JSON.parse(localStorage.getItem('story_views') || '{}');
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const index = dayOfYear % PROPHET_STORIES.length;
        const storyId = PROPHET_STORIES[index].id;
        return (viewsData[storyId] || 0) + 1;
    });

    const updateViews = (storyId: string) => {
        const viewsData = JSON.parse(localStorage.getItem('story_views') || '{}');
        const currentViews = (viewsData[storyId] || 0) + 1; // Incrémente vue
        viewsData[storyId] = currentViews;
        localStorage.setItem('story_views', JSON.stringify(viewsData));
        return currentViews;
    };

    // Carousel Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % DAILY_REMINDERS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Mise à jour des vues au changement d'histoire
    useEffect(() => {
        const viewsData = JSON.parse(localStorage.getItem('story_views') || '{}');
        if (viewsData[dailyStory.id] !== views) {
            const newViews = updateViews(dailyStory.id);
            setTimeout(() => setViews(newViews), 0);
        }
    }, [dailyStory.id, views]);

    const handleTasbih = () => {
        setTasbihCount(prev => prev + 1);
        if (navigator.vibrate) navigator.vibrate(20);
    };

    // --- FONCTIONS ACTIVES ---
    
    const handleShare = async () => {
        const text = `${dailyStory.title}\n\n"${dailyStory.content.substring(0, 100)}..."\n\nLisez la suite sur La DDR : https://ddr.ci`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: dailyStory.title,
                    text: text,
                    url: window.location.href
                });
            } catch {
                console.log('Partage annulé');
            }
        } else {
            navigator.clipboard.writeText(text);
            setToast({ message: "✅ Texte copié ! Vous pouvez maintenant le coller sur WhatsApp ou Facebook.", type: 'success' });
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleNextStory = () => {
        let nextIndex;
        // Choisir une histoire différente de l'actuelle
        do {
            nextIndex = Math.floor(Math.random() * PROPHET_STORIES.length);
        } while (PROPHET_STORIES[nextIndex].id === dailyStory.id && PROPHET_STORIES.length > 1);
        
        const nextStory = PROPHET_STORIES[nextIndex];
        setDailyStory(nextStory);
        updateViews(nextStory.id);
        window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll vers le début de l'histoire
    };

    const renderStoryContent = (content: string) => {
        return content.split('\n').map((line, i) => {
            if (line.trim().startsWith('**')) return <h4 key={i} className="text-white font-bold mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
            if (line.trim().startsWith('>')) return <blockquote key={i} className="border-l-2 border-brand-500 pl-4 italic text-brand-200 my-4 bg-brand-900/10 py-2 rounded-r">{line.replace('>', '')}</blockquote>;
            if (line.trim().length > 0) return <p key={i} className="mb-2 text-gray-300 leading-relaxed">{line}</p>;
            return null;
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-100 pb-20 relative overflow-x-hidden font-sans">
            
            {/* ATMOSPHERIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-900/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gold-900/10 rounded-full blur-[150px] animate-pulse [animation-delay:2s]"></div>
            </div>

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className="fixed top-24 right-6 z-[110] animate-fade-in-up">
                    <div className={`px-6 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 ${
                        toast.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
                    }`}>
                        <span className="text-lg">{toast.type === 'success' ? '✅' : '❌'}</span>
                        <p className="text-sm font-bold">{toast.message}</p>
                    </div>
                </div>
            )}

            {/* VIDEO MODAL */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur flex items-center justify-center p-4 animate-fade-in-up">
                    <button 
                        onClick={() => setSelectedVideo(null)} 
                        className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                        <iframe 
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} 
                            title="Video Educative"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* --- HERO SECTION & CAROUSEL --- */}
            <div className="relative bg-black border-b border-white/5 pb-32 pt-40 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_#1a1005_0%,_transparent_70%)] opacity-60"></div>
                
                <div className="max-w-7xl mx-auto text-center relative z-10 mb-20">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-in-up backdrop-blur-md">
                        <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.8)]"></span>
                        <span className="text-white font-bold tracking-[0.3em] uppercase text-[10px]">Markaz Al-Ilm • Centre du Savoir</span>
                    </div>
                    <h1 className="text-6xl md:text-[10rem] font-black text-white mb-10 tracking-tighter leading-[0.85] animate-fade-in-up delay-100 uppercase">
                        Éclairer <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-brand-400 to-brand-700">L'Esprit</span>
                    </h1>
                    <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light italic">
                        "La recherche de la science est une obligation pour chaque musulman."
                    </p>
                </div>

                {/* --- CAROUSEL RAPPEL --- */}
                <div className="max-w-5xl mx-auto relative z-20 animate-fade-in-up delay-300">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/10 via-transparent to-gold-900/5"></div>
                        
                        {DAILY_REMINDERS.map((slide, idx) => (
                            <div 
                                key={idx} 
                                className={`transition-all duration-1000 absolute inset-0 flex flex-col items-center justify-center p-12 ${idx === currentSlide ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'}`}
                            >
                                <span className="text-brand-500 text-xs font-black uppercase tracking-[0.4em] mb-8">{slide.type}</span>
                                <h3 className="text-4xl md:text-7xl text-white font-serif mb-10 leading-tight drop-shadow-2xl" style={{ direction: 'rtl' }}>{slide.arabic}</h3>
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-brand-500 to-transparent mb-10"></div>
                                <p className="text-gray-200 italic text-2xl md:text-3xl mb-6 font-light leading-relaxed max-w-3xl">"{slide.text}"</p>
                                <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.3em]">{slide.ref}</p>
                            </div>
                        ))}
                        <div className="invisible">
                            <h3 className="text-7xl mb-10">Placeholder</h3>
                            <p className="text-3xl mb-6">Placeholder text long enough for sizing</p>
                            <p className="text-sm">Ref</p>
                        </div>

                        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4">
                            {DAILY_REMINDERS.map((_, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1 rounded-full transition-all duration-700 ${idx === currentSlide ? 'bg-brand-500 w-16' : 'bg-white/10 w-6 hover:bg-white/30'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">

                {/* --- 0. HISTOIRES & SUNNAH DU JOUR --- */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Sagesse <span className="text-brand-500">Quotidienne</span></h2>
                            <p className="text-gray-500 text-lg">Une nouvelle histoire ou sunnah chaque jour pour illuminer votre cœur et votre esprit.</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="px-4 py-2 bg-dark-900 border border-white/5 rounded-xl text-xs font-bold text-gray-400">
                                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                             </div>
                        </div>
                    </div>

                    <div className="bg-[#0e0e10] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/5 to-transparent"></div>
                        
                        <div className="flex flex-col lg:flex-row">
                            {/* Left: Metadata & Visual */}
                            <div className="lg:w-2/5 p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px]"></div>
                                
                                <div className="relative z-10">
                                    <span className="inline-block bg-brand-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-8">
                                        {dailyStory.category}
                                    </span>
                                    <h3 className="text-4xl md:text-5xl font-black text-white font-serif mb-8 leading-[1.1] tracking-tighter">
                                        {dailyStory.title}
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-6 mb-12">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Source</p>
                                            <p className="text-sm text-gray-200 font-bold">{dailyStory.source}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Lecture</p>
                                            <p className="text-sm text-gray-200 font-bold">{dailyStory.readTime}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 flex items-center gap-4 p-4 bg-brand-500/5 border border-brand-500/20 rounded-2xl">
                                    <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Audience</p>
                                        <p className="text-lg text-white font-black">{views.toLocaleString()} <span className="text-xs text-gray-500 font-normal">lecteurs</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="p-10 md:p-20 lg:w-3/5 bg-[#121215] relative">
                                <div className="prose prose-invert prose-xl max-w-none font-light text-gray-300 leading-relaxed">
                                    {renderStoryContent(dailyStory.content)}
                                </div>
                                
                                <div className="mt-16 pt-10 border-t border-white/5">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <p className="text-sm text-gray-500 italic max-w-xs text-center sm:text-left">
                                            "Celui qui indique un bien a la même récompense que celui qui l'accomplit."
                                        </p>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={handleShare}
                                                className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-2xl text-sm font-bold transition-all flex items-center gap-3 border border-white/5"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                                Partager
                                            </button>
                                            <button 
                                                onClick={handleNextStory}
                                                className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-brand-900/40 flex items-center gap-3"
                                            >
                                                Lire une autre
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 1. LES 5 PILIERS --- */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Les 5 Piliers de l'Islam</h2>
                        <p className="text-gray-500 text-lg">Les fondations sacrées sur lesquelles repose l'édifice de notre foi.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {FIVE_PILLARS.map((pillar) => (
                            <div key={pillar.num} className="group relative h-80 perspective-1000">
                                <div className="absolute inset-0 bg-[#0e0e10] border border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-700 transform group-hover:bg-brand-900/20 group-hover:border-brand-500/50 shadow-2xl group-hover:-translate-y-4">
                                    <div className="text-[10px] font-black text-gray-700 absolute top-6 left-6 tracking-widest">0{pillar.num}</div>
                                    <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500 drop-shadow-2xl">{pillar.icon}</div>
                                    <h3 className="text-xl font-black text-white mb-2">{pillar.title}</h3>
                                    <p className="text-[10px] text-brand-500 uppercase tracking-[0.2em] font-black mb-4">{pillar.trans}</p>
                                    <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-500 absolute bottom-8 px-6 leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 2. COMPARATEUR THÉOLOGIQUE --- */}
                <section className="relative">
                    {/* Header dynamique */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-900/40 to-black rounded-full border border-red-500/30 mb-4 animate-pulse">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-red-400 font-bold text-xs uppercase tracking-widest">Armurerie du Débatteur</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white">Le Choc des Textes</h2>
                        <p className="text-gray-500 mt-2">Comparez les sources en temps réel pour dominer le débat.</p>
                    </div>

                    {/* SELECTEUR STYLISÉ */}
                    <div className="flex justify-center mb-12">
                        <div className="flex gap-2 p-1.5 bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto max-w-full">
                            {COMPARISONS.map((topic, index) => (
                                <button
                                    key={topic.id}
                                    onClick={() => setSelectedTopic(index)}
                                    className={`px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
                                        selectedTopic === index 
                                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40' 
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <span>{topic.icon}</span>
                                    {topic.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* INTERFACE DE COMBAT (VERSUS) */}
                    <div className="relative bg-black rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                            
                            {/* COTÉ ISLAM */}
                            <div key={`islam-${selectedTopic}`} className="p-12 relative group animate-fade-in-up">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-8xl font-serif">☪️</span>
                                </div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-1.5 w-12 bg-green-500 rounded-full"></div>
                                    <h3 className="text-green-500 font-black uppercase tracking-[0.3em] text-xs">Source Islamique</h3>
                                </div>
                                <blockquote className="text-3xl md:text-4xl text-white font-serif leading-tight mb-12 relative z-10 italic">
                                    "{COMPARISONS[selectedTopic].islam.text}"
                                </blockquote>
                                <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest border-l border-green-500/50 pl-4 py-1">
                                    Référence: {COMPARISONS[selectedTopic].islam.source}
                                </div>
                            </div>

                            {/* COTÉ CHRISTIANISME */}
                            <div key={`christianity-${selectedTopic}`} className="p-12 relative group animate-fade-in-up delay-100">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-8xl font-serif">✝️</span>
                                </div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-1.5 w-12 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">Source Biblique</h3>
                                </div>
                                <blockquote className="text-3xl md:text-4xl text-white font-serif leading-tight mb-12 relative z-10 italic">
                                    "{COMPARISONS[selectedTopic].christianity.text}"
                                </blockquote>
                                <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest border-l border-blue-500/50 pl-4 py-1">
                                    Référence: {COMPARISONS[selectedTopic].christianity.source}
                                </div>
                            </div>
                        </div>

                        {/* VERDICT DDR */}
                        <div key={`verdict-${selectedTopic}`} className="bg-white/5 border-t border-white/10 p-12 text-center animate-fade-in-up delay-200">
                            <div className="inline-flex items-center gap-3 mb-6 px-4 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full">
                                <span className="text-brand-500 font-black uppercase text-[10px] tracking-[0.3em]">Verdict Théologique</span>
                            </div>
                            <p className="text-2xl md:text-3xl text-white font-light max-w-4xl mx-auto leading-relaxed italic">
                                {COMPARISONS[selectedTopic].verdict}
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- 3. RESEAUX SOCIAUX OFFICIELS --- */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SOCIAL_LINKS.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`group relative p-6 rounded-2xl border ${link.borderClass} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}
                                style={{ backgroundColor: link.name === 'Facebook' ? 'rgba(24, 119, 242, 0.1)' : link.name === 'YouTube' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                <div className="flex flex-col items-center text-center relative z-10">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${link.bgClass} text-white shadow-lg`}>
                                        {link.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{link.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{link.label}</p>
                                    <p className="text-sm text-gray-400">{link.subLabel}</p>
                                    
                                    <span className="mt-4 px-4 py-2 bg-white/10 rounded-full text-xs font-bold text-white group-hover:bg-white group-hover:text-black transition-colors">
                                        S'abonner →
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* --- 4. TASBIH & SUNNAS (BENTO GRID) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Tasbih Interactif (Large Card) */}
                    <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-transparent opacity-50"></div>
                        
                        <div className="relative z-10 text-center md:text-left">
                            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Tasbih <span className="text-brand-500">Digital</span></h3>
                            <p className="text-gray-400 text-lg max-w-xs mb-8">"L'évocation d'Allah est le repos des cœurs."</p>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <button 
                                    onClick={handleTasbih}
                                    className="px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(234,88,12,0.4)] active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    Zikr
                                </button>
                                <button 
                                    onClick={() => setTasbihCount(0)}
                                    className="w-16 h-16 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl font-bold flex items-center justify-center border border-white/10 transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-64 h-64 rounded-full border-[12px] border-white/5 flex items-center justify-center bg-black shadow-[inset_0_0_40px_rgba(0,0,0,1)] relative transition-transform duration-100 transform" style={{ transform: tasbihCount > 0 ? 'scale(0.98)' : 'scale(1)' }}>
                                <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-ping opacity-20"></div>
                                <span className="text-8xl font-mono text-brand-500 font-black tracking-tighter drop-shadow-[0_0_20px_rgba(234,88,12,0.5)]">{tasbihCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sunnas Checklist (Side Card) */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 flex flex-col shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter relative z-10">Sunnas <span className="text-gold-500">D'Or</span></h3>
                        <div className="space-y-4 relative z-10">
                            {SUNNAS.map((sunna, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/30 transition-all group cursor-default">
                                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-black text-xs group-hover:bg-brand-500 group-hover:text-white transition-all">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm group-hover:text-brand-400 transition-colors">{sunna.title}</h4>
                                        <p className="text-gray-500 text-[10px] leading-tight mt-0.5">{sunna.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 5. ALPHABET ARABE --- */}
                <section>
                    <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                        <h2 className="text-2xl font-bold text-white">L'Alphabet Arabe</h2>
                        <span className="text-xs text-gray-500">Sens de lecture : Droite à Gauche</span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 dir-rtl" style={{ direction: 'rtl' }}>
                        {ARABIC_LETTERS.map((item, index) => (
                            <div 
                                key={index} 
                                className="bg-[#18181b] hover:bg-brand-900/20 border border-gray-800 hover:border-brand-500/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 group cursor-default"
                            >
                                <span className="text-3xl font-serif text-white mb-2 group-hover:scale-125 transition-transform duration-300">{item.char}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold group-hover:text-brand-400">{item.name}</span>
                                <span className="text-[9px] text-gray-600 font-mono mt-1">/{item.sound}/</span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default LearningCenter;

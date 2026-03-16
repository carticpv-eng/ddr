
import React, { useState, useRef } from 'react';
import { logAction } from '../services/logService';
import DonationModal from '../components/DonationModal';
import { toPng, toBlob } from 'html-to-image';

// --- DATA & CONSTANTS ---

const GOLD_PRICE = 42000; // FCFA par gramme (24k)
const SILVER_PRICE = 600; // FCFA par gramme
const NISAB_GOLD_GRAMS = 85;
const NISAB_VALUE = GOLD_PRICE * NISAB_GOLD_GRAMS;

const CATEGORIES = ['Toutes', 'Patience', 'Pardon', 'Science', 'Espoir', 'Invocation'];

const RICH_QUOTES = [
    { 
        id: 1, 
        cat: 'Science',
        arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", 
        phonetic: "Wa qul Rabbi zidni 'ilma", 
        french: "Et dis : Ô mon Seigneur, accroît mes connaissances !", 
        source: "Coran 20:114" 
    },
    { 
        id: 2, 
        cat: 'Patience',
        arabic: "إِنَّ اللّهَ مَعَ الصَّابِرِينَ", 
        phonetic: "Inna Allaha ma'a as-sabirin", 
        french: "Certes, Allah est avec les patients.", 
        source: "Coran 2:153" 
    },
    { 
        id: 3, 
        cat: 'Espoir',
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", 
        phonetic: "Fa inna ma'a al-'usri yusra", 
        french: "A côté de la difficulté est, certes, une facilité !", 
        source: "Coran 94:5" 
    },
    { 
        id: 4, 
        cat: 'Invocation',
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً", 
        phonetic: "Rabbana atina fi dunya hasana...", 
        french: "Seigneur ! Accorde-nous belle part ici-bas, et belle part aussi dans l'au-delà.", 
        source: "Coran 2:201" 
    },
    { 
        id: 5, 
        cat: 'Pardon',
        arabic: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", 
        phonetic: "Inna Allaha Ghafurun Rahim", 
        french: "Certes Allah est Pardonneur et Miséricordieux.", 
        source: "Coran" 
    }
];

const TEMPLATES = [
    { 
        id: 'glass', 
        name: 'Verre Dépoli', 
        bg: 'bg-[url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop")]',
        overlay: 'backdrop-blur-md bg-black/40 border border-white/20',
        text: 'text-white',
        accent: 'text-brand-500'
    },
    { 
        id: 'midnight', 
        name: 'Nuit Profonde', 
        bg: 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]',
        overlay: 'bg-transparent border border-gray-800',
        text: 'text-gray-200',
        accent: 'text-gold-500'
    },
    { 
        id: 'dawn', 
        name: 'Aube Sereine', 
        bg: 'bg-gradient-to-tr from-brand-900 via-purple-900 to-blue-900',
        overlay: 'bg-white/5 backdrop-blur-sm border border-white/10',
        text: 'text-white',
        accent: 'text-cyan-400'
    },
    { 
        id: 'paper', 
        name: 'Parchemin', 
        bg: 'bg-[#f5f5f0]',
        overlay: 'bg-white/80 border border-[#d4c5a3] shadow-inner',
        text: 'text-[#4a4036]',
        accent: 'text-[#8c7b5d]'
    }
];

const Tools = () => {
  const [activeTab, setActiveTab] = useState<'zakat' | 'dawa'>('zakat');
  const [showZakatModal, setShowZakatModal] = useState(false);

  // --- STATE ZAKAT ---
  const [assets, setAssets] = useState({ cash: 0, gold: 0, stocks: 0, debts: 0 });
  const [zakatHistory, setZakatHistory] = useState<any[]>(() => {
      try {
          return JSON.parse(localStorage.getItem('ddr_zakat_history') || '[]');
      } catch { return []; }
  });
  
  const totalAssets = assets.cash + (assets.gold * GOLD_PRICE) + assets.stocks - assets.debts;
  const zakatAmount = totalAssets >= NISAB_VALUE ? totalAssets * 0.025 : 0;
  const progress = Math.min((totalAssets / NISAB_VALUE) * 100, 100);

  const saveZakatCalculation = () => {
      const newCalc = {
          id: Date.now(),
          date: new Date().toISOString(),
          total: totalAssets,
          zakat: zakatAmount,
          assets: { ...assets }
      };
      const newHistory = [newCalc, ...zakatHistory].slice(0, 5);
      setZakatHistory(newHistory);
      localStorage.setItem('ddr_zakat_history', JSON.stringify(newHistory));
  };

  // --- STATE DAWA ---
  const [selectedCat, setSelectedCat] = useState('Toutes');
  const [currentQuote, setCurrentQuote] = useState(RICH_QUOTES[0]);
  const [currentTemplate, setCurrentTemplate] = useState(TEMPLATES[0]);
  const [options, setOptions] = useState({ showArabic: true, showPhonetic: true, showFrench: true });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // REF POUR LA CAPTURE D'IMAGE
  const cardRef = useRef<HTMLDivElement>(null);

  const filteredQuotes = selectedCat === 'Toutes' ? RICH_QUOTES : RICH_QUOTES.filter(q => q.cat === selectedCat);

  const handlePayZakat = () => {
      logAction('ZAKAT_CALC', `Calcul: ${zakatAmount.toLocaleString()} FCFA`, 'info');
      setShowZakatModal(true);
  };

  const handleDownload = async () => {
      if (!cardRef.current) return;
      setGenerating(true);

      try {
          // Génération PNG Haute Qualité
          const dataUrl = await toPng(cardRef.current, { 
              cacheBust: false, 
              pixelRatio: 2,
              style: {
                  borderRadius: '0' // Force sharp corners for download
              }
          });
          
          const link = document.createElement('a');
          link.download = `ddr-rappel-${currentQuote.cat.toLowerCase()}.png`;
          link.href = dataUrl;
          link.click();
          
          logAction('DAWA_DOWNLOAD', `Téléchargement image: ${currentQuote.source}`, 'success');
      } catch (err) {
          console.error('Erreur génération image:', err);
          setError("Erreur lors de la création de l'image. Réessayez.");
          setTimeout(() => setError(null), 5000);
      } finally {
          setGenerating(false);
      }
  };

  const handleShare = async () => {
      if (!cardRef.current) return;
      setGenerating(true);

      try {
          const blob = await toBlob(cardRef.current, { 
              cacheBust: false, 
              pixelRatio: 2 
          });
          if (blob) {
              const file = new File([blob], "ddr-rappel.png", { type: "image/png" });
              
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                  await navigator.share({
                      title: 'Rappel DDR',
                      text: `"${currentQuote.french}" - Créé sur ddr.ci`,
                      files: [file]
                  });
                  logAction('DAWA_SHARE', `Partage image: ${currentQuote.source}`, 'success');
              } else {
                  setError("Le partage direct n'est pas supporté par votre navigateur. L'image va être téléchargée.");
                  setTimeout(() => setError(null), 5000);
                  handleDownload();
              }
          }
      } catch (err) {
          console.error("Erreur partage:", err);
          handleDownload(); // Fallback
      } finally {
          setGenerating(false);
      }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 font-sans selection:bg-brand-500 selection:text-white">
        
        {/* HEADER */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-12">
            {error && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-900/90 text-white px-6 py-3 rounded-full border border-red-500 shadow-2xl animate-fade-in">
                    {error}
                </div>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif">La Boîte à Outils du <span className="text-brand-500">Croyant</span></h1>
            <p className="text-gray-400">Technologie et Design au service de la Foi.</p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-12">
            <div className="bg-gray-900 p-1.5 rounded-full border border-gray-700 inline-flex shadow-xl">
                <button 
                    onClick={() => setActiveTab('zakat')}
                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'zakat' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <span>🧮</span> Zakat Smart
                </button>
                <button 
                    onClick={() => setActiveTab('dawa')}
                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'dawa' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <span>🎨</span> Studio Dawa
                </button>
            </div>
        </div>

        {/* --- ZAKAT SECTION --- */}
        {activeTab === 'zakat' && (
            <div className="max-w-6xl mx-auto px-4 animate-fade-in-up">
                
                {/* TICKER */}
                <div className="bg-brand-900/10 border-y border-brand-500/20 mb-8 overflow-hidden py-2 relative">
                    <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap gap-12 text-xs font-mono text-brand-400 uppercase tracking-widest">
                        <span>Or (24k) : {GOLD_PRICE.toLocaleString()} FCFA/g ▲</span>
                        <span>Argent : {SILVER_PRICE} FCFA/g ▼</span>
                        <span>Nisab (Seuil) : {NISAB_VALUE.toLocaleString()} FCFA</span>
                        <span>Or (24k) : {GOLD_PRICE.toLocaleString()} FCFA/g ▲</span>
                        <span>Argent : {SILVER_PRICE} FCFA/g ▼</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* INPUTS */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#121214] border border-gray-800 rounded-3xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6">1. Vos Avoirs (Annuel)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Argent Liquide / Banque</label>
                                    <div className="relative group">
                                        <input type="number" value={assets.cash || ''} onChange={e => setAssets({...assets, cash: parseFloat(e.target.value)||0})} className="w-full bg-black border border-gray-700 rounded-xl p-4 pl-12 text-white focus:border-brand-500 outline-none transition group-hover:border-gray-600" placeholder="0" />
                                        <span className="absolute left-4 top-4 text-gray-500">💵</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Or (en Grammes)</label>
                                    <div className="relative group">
                                        <input type="number" value={assets.gold || ''} onChange={e => setAssets({...assets, gold: parseFloat(e.target.value)||0})} className="w-full bg-black border border-gray-700 rounded-xl p-4 pl-12 text-white focus:border-yellow-500 outline-none transition group-hover:border-gray-600" placeholder="0" />
                                        <span className="absolute left-4 top-4 text-yellow-500">👑</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Actions / Marchandise</label>
                                    <div className="relative group">
                                        <input type="number" value={assets.stocks || ''} onChange={e => setAssets({...assets, stocks: parseFloat(e.target.value)||0})} className="w-full bg-black border border-gray-700 rounded-xl p-4 pl-12 text-white focus:border-blue-500 outline-none transition group-hover:border-gray-600" placeholder="0" />
                                        <span className="absolute left-4 top-4 text-blue-500">📈</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Dettes (à déduire)</label>
                                    <div className="relative group">
                                        <input type="number" value={assets.debts || ''} onChange={e => setAssets({...assets, debts: parseFloat(e.target.value)||0})} className="w-full bg-black border border-red-900/50 rounded-xl p-4 pl-12 text-red-400 focus:border-red-500 outline-none transition group-hover:border-red-900/80" placeholder="0" />
                                        <span className="absolute left-4 top-4 text-red-500">🔻</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DASHBOARD RESULT */}
                    <div className="bg-gradient-to-b from-[#1a1a1c] to-black border border-gray-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <svg className="w-40 h-40 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white mb-6">Votre Situation</h2>
                            
                            {/* GAUGE NISAB */}
                            <div className="flex justify-center mb-8 relative">
                                <svg className="w-40 h-40 transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="#333" strokeWidth="10" fill="transparent" />
                                    <circle cx="80" cy="80" r="70" stroke={progress >= 100 ? '#ea580c' : '#4ade80'} strokeWidth="10" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * progress) / 100} className="transition-all duration-1000 ease-out" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                                    <span className="text-[10px] text-gray-500 uppercase">du Nisab</span>
                                </div>
                            </div>

                            <div className="space-y-4 text-center">
                                {totalAssets >= NISAB_VALUE ? (
                                    <div className="bg-brand-900/20 border border-brand-500/30 p-4 rounded-xl">
                                        <p className="text-xs text-brand-400 uppercase font-bold mb-1">Zakat Due (2.5%)</p>
                                        <p className="text-3xl font-mono font-bold text-white">{Math.round(zakatAmount).toLocaleString()} F</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Non Imposable</p>
                                        <p className="text-sm text-gray-500">Il manque {(NISAB_VALUE - totalAssets).toLocaleString()} F pour atteindre le seuil.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {zakatAmount > 0 && (
                            <button 
                                onClick={() => {
                                    saveZakatCalculation();
                                    handlePayZakat();
                                }} 
                                className="w-full mt-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                            >
                                Payer ma Zakat
                            </button>
                        )}
                        
                        {/* History Mini List */}
                        {zakatHistory.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-800">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Historique Récent</h4>
                                <div className="space-y-3">
                                    {zakatHistory.map(h => (
                                        <div key={h.id} className="flex justify-between items-center text-xs">
                                            <span className="text-gray-500">{new Date(h.date).toLocaleDateString()}</span>
                                            <span className="text-brand-500 font-bold">{Math.round(h.zakat).toLocaleString()} F</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ZAKAT TIPS */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#121214] p-6 rounded-2xl border border-gray-800">
                        <div className="text-2xl mb-3">💎</div>
                        <h4 className="text-white font-bold mb-2">Qu'est-ce que le Nisab ?</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">C'est le seuil minimal de richesse au-delà duquel la Zakat devient obligatoire. Il correspond à 85g d'or pur.</p>
                    </div>
                    <div className="bg-[#121214] p-6 rounded-2xl border border-gray-800">
                        <div className="text-2xl mb-3">📅</div>
                        <h4 className="text-white font-bold mb-2">Le Hawl (Un an)</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">La Zakat n'est due que si vos avoirs sont restés au-dessus du Nisab pendant une année lunaire complète.</p>
                    </div>
                    <div className="bg-[#121214] p-6 rounded-2xl border border-gray-800">
                        <div className="text-2xl mb-3">🤝</div>
                        <h4 className="text-white font-bold mb-2">Les Bénéficiaires</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">Elle est destinée aux pauvres, aux indigents, et à ceux dont les cœurs sont à gagner, entre autres catégories.</p>
                    </div>
                </div>
            </div>
        )}

        {/* --- DAWA STUDIO SECTION --- */}
        {activeTab === 'dawa' && (
            <div className="max-w-7xl mx-auto px-4 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT: CONTROLS & LIBRARY */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Categories */}
                        <div className="bg-[#121214] border border-gray-800 rounded-2xl p-6">
                            <h3 className="text-white font-bold mb-4 text-sm uppercase">1. Choisissez un thème</h3>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setSelectedCat(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${selectedCat === cat ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quotes List */}
                        <div className="bg-[#121214] border border-gray-800 rounded-2xl p-6 h-96 overflow-y-auto custom-scrollbar">
                            <h3 className="text-white font-bold mb-4 text-sm uppercase">2. Sélectionnez une parole</h3>
                            <div className="space-y-3">
                                {filteredQuotes.map(q => (
                                    <div 
                                        key={q.id} 
                                        onClick={() => setCurrentQuote(q)}
                                        className={`p-4 rounded-xl cursor-pointer border transition-all ${currentQuote.id === q.id ? 'bg-brand-900/20 border-brand-500' : 'bg-black border-gray-800 hover:border-gray-600'}`}
                                    >
                                        <p className="text-gray-300 text-sm line-clamp-2 italic">"{q.french}"</p>
                                        <p className="text-brand-500 text-xs font-bold mt-2 text-right">{q.source}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Options */}
                        <div className="bg-[#121214] border border-gray-800 rounded-2xl p-6">
                            <h3 className="text-white font-bold mb-4 text-sm uppercase">3. Personnalisez</h3>
                            <div className="space-y-3">
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="text-gray-400 text-sm">Afficher Arabe</span>
                                    <input type="checkbox" checked={options.showArabic} onChange={e => setOptions({...options, showArabic: e.target.checked})} className="accent-brand-500 w-5 h-5" />
                                </label>
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="text-gray-400 text-sm">Afficher Phonétique</span>
                                    <input type="checkbox" checked={options.showPhonetic} onChange={e => setOptions({...options, showPhonetic: e.target.checked})} className="accent-brand-500 w-5 h-5" />
                                </label>
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="text-gray-400 text-sm">Afficher Français</span>
                                    <input type="checkbox" checked={options.showFrench} onChange={e => setOptions({...options, showFrench: e.target.checked})} className="accent-brand-500 w-5 h-5" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW & STYLE */}
                    <div className="lg:col-span-8 space-y-8 flex flex-col items-center">
                        
                        {/* Template Selector */}
                        <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
                            {TEMPLATES.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setCurrentTemplate(t)}
                                    className={`w-20 h-20 rounded-xl border-2 shrink-0 transition-all ${t.bg} bg-cover ${currentTemplate.id === t.id ? 'border-brand-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    title={t.name}
                                ></button>
                            ))}
                        </div>

                        {/* PREVIEW CARD (AVEC REF POUR CAPTURE) */}
                        <div 
                            ref={cardRef}
                            className={`relative w-full max-w-md aspect-[4/5] rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-800 transition-all duration-500 bg-cover bg-center ${currentTemplate.bg}`}
                        >
                            {/* Overlay & Content */}
                            <div className={`absolute inset-0 m-0 md:m-4 rounded-none md:rounded-2xl flex flex-col justify-between p-8 text-center transition-all duration-500 ${currentTemplate.overlay}`}>
                                
                                {/* Header */}
                                <div className="opacity-80">
                                    <img src="/logo.png" className="h-12 mx-auto drop-shadow-md" alt="DDR" onError={(e) => e.currentTarget.style.display = 'none'} />
                                </div>

                                {/* Body */}
                                <div className="space-y-6 flex-1 flex flex-col justify-center">
                                    {options.showArabic && (
                                        <p className={`text-3xl font-serif leading-relaxed dir-rtl ${currentTemplate.text} drop-shadow-md`} style={{ direction: 'rtl' }}>
                                            {currentQuote.arabic}
                                        </p>
                                    )}
                                    {options.showPhonetic && (
                                        <p className={`text-sm italic opacity-90 ${currentTemplate.text}`}>
                                            {currentQuote.phonetic}
                                        </p>
                                    )}
                                    {options.showFrench && (
                                        <div className="relative mt-4">
                                            <span className={`text-4xl absolute -top-6 -left-2 opacity-40 ${currentTemplate.text}`}>“</span>
                                            <p className={`text-xl font-medium leading-relaxed ${currentTemplate.text} drop-shadow-sm`}>
                                                {currentQuote.french}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div>
                                    <div className={`inline-block border-t border-b py-1 px-4 mb-2 ${currentTemplate.text} border-current opacity-80`}>
                                        <p className="text-xs font-bold uppercase tracking-[0.2em]">{currentQuote.source}</p>
                                    </div>
                                    <p className={`text-[10px] uppercase tracking-widest opacity-60 ${currentTemplate.text}`}>www.ddr.ci</p>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-4">
                            <button 
                                onClick={handleDownload}
                                disabled={generating}
                                className="bg-white text-black px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition flex items-center gap-3 disabled:opacity-50"
                            >
                                {generating ? '...' : (
                                    <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Télécharger HD
                                    </>
                                )}
                            </button>
                            
                            <button 
                                onClick={handleShare}
                                disabled={generating}
                                className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:bg-brand-500 hover:scale-105 transition flex items-center gap-3 disabled:opacity-50"
                            >
                                {generating ? '...' : (
                                    <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                    Partager
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showZakatModal && <DonationModal onClose={() => setShowZakatModal(false)} />}
    </div>
  );
};

export default Tools;

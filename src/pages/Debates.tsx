
import React, { useEffect, useState } from 'react';
import { fetchYoutubeDebates } from '../services/socialService';
import { SPEAKERS } from '../constants';
import { Debate } from '../types';

const Debates = () => {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tout voir');
  // État pour gérer quelles vidéos sont en train d'être jouées (remplace la miniature par l'iframe)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        const data = await fetchYoutubeDebates();
        setDebates(data);
        setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Header with Search */}
      <div className="bg-dark-900 py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Débats & <span className="text-brand-500">Conférences</span></h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Retrouvez l'intégralité des échanges théologiques. Synchronisé avec nos chaînes officielles.
            </p>
            
            <div className="max-w-xl mx-auto relative">
                <input 
                    type="text" 
                    placeholder="Rechercher un thème, un orateur..." 
                    className="w-full bg-black border border-gray-700 rounded-full py-4 px-6 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-lg"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-brand-600 text-white rounded-full px-6 font-bold hover:bg-brand-500 transition">
                    Rechercher
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="flex-1">
                {/* Filters */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    {['Tout voir', 'Christianisme', 'Islam', 'Athéisme', 'Société'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-brand-600 text-white' : 'bg-dark-900 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="bg-dark-900 rounded-xl overflow-hidden border border-gray-800 h-80 animate-pulse">
                                <div className="h-48 bg-gray-800"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Video Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {debates.map((debate) => (
                            <div key={debate.id} className="bg-dark-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:border-brand-500/50 hover:shadow-brand-900/20 transition-all duration-300 group">
                                {/* Thumbnail Wrapper (Video Player) */}
                                <div className="relative aspect-video bg-black group-hover:opacity-100 transition">
                                    {playingVideoId === debate.id ? (
                                        <iframe 
                                            src={`${debate.videoUrl}?autoplay=1`} 
                                            title={debate.title}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div 
                                            className="w-full h-full relative cursor-pointer"
                                            onClick={() => setPlayingVideoId(debate.id)}
                                        >
                                            <img 
                                                src={debate.thumbnailUrl || `https://img.youtube.com/vi/${debate.id}/maxresdefault.jpg`} 
                                                alt={debate.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                                                onError={(e) => {
                                                    // Fallback si maxresdefault n'existe pas
                                                    e.currentTarget.src = `https://img.youtube.com/vi/${debate.id}/hqdefault.jpg`;
                                                }}
                                            />
                                            {/* Play Button Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-brand-600/90 rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(234,88,12,0.5)] group-hover:scale-110 transition duration-300 backdrop-blur-sm">
                                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                YouTube
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-brand-500 transition-colors" dangerouslySetInnerHTML={{__html: debate.title}}></h3>
                                    </div>
                                    <p className="text-brand-400 text-sm font-medium mb-3">{debate.speaker}</p>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{debate.description}</p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            {debate.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                            YouTube
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar (Speakers Channels) */}
            <div className="w-full lg:w-80 flex-shrink-0">
                <div className="bg-dark-900 border border-gray-800 rounded-xl p-6 sticky top-24">
                    <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-brand-500 pl-3">Chaînes Sources</h3>
                    <p className="text-xs text-gray-500 mb-4">Ces vidéos sont récupérées automatiquement des chaînes officielles.</p>
                    <div className="space-y-6">
                        {SPEAKERS.map(speaker => (
                             <div key={speaker.id} className="flex flex-col items-center text-center p-4 bg-black rounded-lg border border-gray-800 hover:border-brand-500/30 transition">
                                 <img src={speaker.imageUrl} className="w-20 h-20 rounded-full border-2 border-brand-500 mb-3 object-cover" alt={speaker.name} />
                                 <h4 className="font-bold text-white text-sm">{speaker.name}</h4>
                                 <div className="flex gap-2 mt-2">
                                     {speaker.socials.youtube && (
                                         <a href={speaker.socials.youtube} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-500 transition">
                                            S'abonner
                                         </a>
                                     )}
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Debates;

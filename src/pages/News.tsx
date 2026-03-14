
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFacebookNews } from '../services/socialService';
import { NewsItem } from '../types';

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
        setLoading(true);
        const data = await fetchFacebookNews();
        setNews(data);
        setLoading(false);
    };
    loadNews();
  }, []);

  const featured = news[0];
  const others = news.slice(1);

  return (
    <div className="bg-black min-h-screen pb-20 relative selection:bg-brand-500 selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative pt-24 pb-12 px-4 border-b border-gray-900 z-10">
        <div className="max-w-7xl mx-auto text-center">
            <span className="text-brand-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block animate-fade-in-up">La Voix de la DDR</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 font-serif animate-fade-in-up delay-100">
                L'Écho du <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-500">Minbar</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                Suivez l'actualité de nos actions, les comptes-rendus de débats et les annonces officielles en temps réel.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {loading ? (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="h-[600px] bg-[#121214] rounded-3xl border border-gray-800"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="h-96 bg-[#121214] rounded-2xl"></div>
                    <div className="h-96 bg-[#121214] rounded-2xl"></div>
                    <div className="h-96 bg-[#121214] rounded-2xl"></div>
                </div>
            </div>
        ) : (
            <>
                {/* --- FEATURED ARTICLE (LA UNE) --- */}
                {featured && (
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-20 group border border-gray-800 h-[600px] md:h-[700px] transform hover:scale-[1.01] transition-all duration-700">
                        {/* Image Full Background */}
                        <div className="absolute inset-0">
                            <img 
                                src={featured.imageUrl} 
                                alt={featured.title} 
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Gradients pour lisibilité */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4 lg:w-2/3">
                            <div className="flex items-center gap-4 mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100">
                                <span className="bg-brand-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-900/50">
                                    {featured.category}
                                </span>
                                <span className="text-gray-300 text-sm font-mono flex items-center gap-2">
                                    <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    {featured.createdAt}
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-serif drop-shadow-lg">
                                {featured.title}
                            </h2>
                            
                            <p className="text-gray-200 text-lg md:text-xl line-clamp-3 mb-8 leading-relaxed font-light border-l-4 border-brand-500 pl-6">
                                {featured.content}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {featured.tags.map(tag => (
                                    <span key={tag} className="text-xs text-gray-400 border border-gray-600 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm">#{tag}</span>
                                ))}
                            </div>

                            <div className="mt-8">
                                <Link to={`/news/${featured.id}`} className="group/btn inline-flex items-center gap-3 text-white font-bold text-lg hover:text-brand-500 transition-colors">
                                    Lire l'article complet
                                    <span className="bg-white text-black rounded-full p-2 group-hover/btn:bg-brand-500 group-hover/btn:text-white transition-all duration-300">
                                        <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- HEADER SECTION SECONDAIRE --- */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px bg-gray-800 flex-1"></div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">Dernières publications</h3>
                    <div className="h-px bg-gray-800 flex-1"></div>
                </div>

                {/* --- GRID OTHERS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {others.map((item) => (
                        <div key={item.id} className="group flex flex-col bg-[#0f0f0f] rounded-3xl overflow-hidden border border-gray-800 hover:border-brand-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                            
                            {/* Image Container */}
                            <div className="h-64 overflow-hidden relative">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/10 uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-8 flex-1 flex flex-col relative">
                                {/* Decorative line */}
                                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-mono">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        {item.author}
                                    </span>
                                    <span>{item.createdAt}</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 leading-snug font-serif group-hover:text-brand-500 transition-colors">
                                    {item.title}
                                </h3>
                                
                                <p className="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                                    {item.content}
                                </p>

                                <div className="mt-auto pt-6 border-t border-gray-800 flex justify-between items-center">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {/* Fake readers avatars for social proof */}
                                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-black bg-gray-700"></div>
                                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-black bg-gray-600"></div>
                                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-black bg-gray-500 text-[8px] flex items-center justify-center text-white font-bold">+9</div>
                                    </div>
                                    <Link to={`/news/${item.id}`} className="text-brand-500 text-xs font-bold uppercase tracking-wider hover:text-white transition flex items-center gap-1">
                                        Lire
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default News;

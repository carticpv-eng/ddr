
import React, { useEffect, useState } from 'react';
import { fetchFacebookNews } from '../services/socialService';
import { NewsItem } from '../types';

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
        setLoading(true);
        // Ici nous appellerions l'API Facebook ou un Backend
        // Pour l'instant le service retourne les Mocks avec un délai simulé
        const data = await fetchFacebookNews();
        setNews(data);
        setLoading(false);
    };
    loadNews();
  }, []);

  const featured = news[0];
  const others = news.slice(1);

  return (
    <div className="bg-black min-h-screen pb-16">
      {/* Header */}
      <div className="bg-dark-900 py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Actualités & <span className="text-brand-500">Actions</span></h1>
            <p className="mt-4 text-xl text-gray-400">
                Synchronisé avec la page Facebook officielle de la DDR.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="h-[500px] bg-dark-900 rounded-2xl border border-gray-800"></div>
                <div className="grid grid-cols-3 gap-8">
                    <div className="h-64 bg-dark-900 rounded-xl"></div>
                    <div className="h-64 bg-dark-900 rounded-xl"></div>
                    <div className="h-64 bg-dark-900 rounded-xl"></div>
                </div>
            </div>
        ) : (
            <>
                {/* Featured Article */}
                {featured && (
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-16 group border border-gray-800">
                        <div className="absolute inset-0">
                            <img 
                                src={featured.imageUrl} 
                                alt={featured.title} 
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        </div>
                        <div className="relative p-8 md:p-12 flex flex-col justify-end h-[500px]">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-[#1877F2] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    Facebook
                                </span>
                                <span className="text-gray-300 text-sm">📅 {featured.createdAt}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{featured.title}</h2>
                            <p className="text-gray-300 text-lg md:text-xl max-w-3xl line-clamp-2 mb-6">{featured.content}</p>
                            <button className="w-fit px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-brand-500 hover:text-white transition-colors">
                                Lire sur Facebook
                            </button>
                        </div>
                    </div>
                )}

                {/* Grid for other news */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {others.map((item) => (
                        <div key={item.id} className="bg-dark-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col hover:border-brand-500/50 transition-all group">
                            <div className="h-56 overflow-hidden relative">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/70 backdrop-blur text-brand-500 px-3 py-1 rounded text-xs font-bold border border-brand-500/20">{item.category}</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-xs text-gray-500 mb-3 gap-2">
                                    <span>✍️ {item.author}</span>
                                    <span>•</span>
                                    <span>{item.createdAt}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-500 transition-colors">{item.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{item.content}</p>
                                <div className="pt-4 border-t border-gray-800 flex flex-wrap gap-2">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">#{tag}</span>
                                    ))}
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

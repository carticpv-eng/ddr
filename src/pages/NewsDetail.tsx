
import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_NEWS } from '../constants';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = useMemo(() => MOCK_NEWS.find(n => n.id === id) || null, [id]);
  const related = useMemo(() => MOCK_NEWS.filter(n => n.id !== id).slice(0, 2), [id]);

  useEffect(() => {
    if (!article) {
        navigate('/news'); // Redirect si non trouvé
    } else {
        window.scrollTo(0, 0);
    }
  }, [article, navigate]);

  if (!article) return null;

  const renderBody = (text: string) => {
      if (!text) return null;
      return text.split('\n').map((line, i) => {
          if (line.trim().startsWith('**')) {
              // Titre de section
              return <h3 key={i} className="text-2xl font-bold text-white mt-8 mb-4 font-serif">{line.replace(/\*\*/g, '')}</h3>
          }
          if (line.trim().startsWith('* ')) {
              // Liste
              return <li key={i} className="ml-6 list-disc text-gray-300 mb-2 pl-2 marker:text-brand-500">{line.replace('* ', '')}</li>
          }
          if (line.trim().startsWith('>')) {
              // Citation
              return (
                  <blockquote key={i} className="border-l-4 border-brand-500 pl-6 py-2 my-8 italic text-xl text-gray-300 bg-gray-900/30 rounded-r-lg">
                      {line.replace('>', '')}
                  </blockquote>
              )
          }
          // Paragraphe standard
          if (line.trim().length > 0) {
              return <p key={i} className="mb-6 text-gray-300 leading-8 text-lg">{line}</p>
          }
          return null;
      });
  };

  return (
    <div className="bg-black min-h-screen pb-20 font-sans selection:bg-brand-500 selection:text-white">
        
        {/* Progress bar de lecture (simple) */}
        <div className="fixed top-0 left-0 h-1 bg-brand-600 z-50 w-full animate-[loading_1s_ease-out]"></div>

        {/* HERO HEADER */}
        <div className="relative h-[60vh] min-h-[500px]">
            <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"></div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-5xl mx-auto">
                <Link to="/news" className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition w-fit">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Retour aux actualités
                </Link>
                
                <div className="flex items-center gap-4 mb-4">
                    <span className="bg-brand-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{article.category}</span>
                    <span className="text-gray-300 text-sm font-mono">{article.createdAt}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight font-serif mb-6 drop-shadow-lg">
                    {article.title}
                </h1>

                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-900 border border-brand-500 flex items-center justify-center text-brand-500 font-bold">
                        {article.author.charAt(0)}
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Par {article.author}</p>
                        <p className="text-gray-500 text-xs">Rédaction DDR</p>
                    </div>
                </div>
            </div>
        </div>

        {/* ARTICLE BODY */}
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 relative">
            {/* Share buttons floating on desktop */}
            <div className="hidden lg:flex flex-col gap-4 absolute -left-20 top-20 sticky">
                <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition shadow-lg"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
                <button className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition shadow-lg"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></button>
            </div>

            {/* Intro Lead */}
            <p className="text-2xl text-white font-light leading-relaxed mb-10 first-letter:text-5xl first-letter:font-bold first-letter:text-brand-500 first-letter:mr-1 first-letter:float-left">
                {article.content}
            </p>

            {/* Main Content */}
            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                {renderBody(article.body || "Contenu détaillé indisponible pour le moment.")}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-800 flex flex-wrap gap-2">
                {article.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-500 border border-gray-800 px-3 py-1 rounded-full hover:border-brand-500 hover:text-brand-500 transition cursor-default">#{tag}</span>
                ))}
            </div>
        </div>

        {/* RELATED NEWS */}
        <div className="bg-[#0f0f0f] py-16 px-4 border-t border-gray-900">
            <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-brand-500 pl-4">À lire aussi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {related.map(item => (
                        <Link to={`/news/${item.id}`} key={item.id} className="group flex gap-4 items-start p-4 rounded-xl hover:bg-gray-900 transition">
                            <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg leading-tight group-hover:text-brand-500 transition mb-2">{item.title}</h4>
                                <p className="text-gray-500 text-sm line-clamp-2">{item.content}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    </div>
  );
};

export default NewsDetail;

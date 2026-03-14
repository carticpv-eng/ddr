
import React, { useState } from 'react';
import { MOCK_NEWS, MOCK_DEBATES, MOCK_CONVERSIONS } from '../../constants';

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'debates' | 'stories'>('news');

  return (
    <div className="space-y-6 animate-fade-in-up">
       <div className="flex justify-between items-center pb-6 border-b border-gray-800">
        <div>
            <h1 className="text-3xl font-bold text-white">Gestion du Contenu</h1>
            <p className="text-gray-500 mt-1">Publiez, modifiez ou supprimez les éléments du site.</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition transform">
            + Créer Nouveau
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
          <button 
            onClick={() => setActiveTab('news')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'news' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              Actualités ({MOCK_NEWS.length})
          </button>
          <button 
            onClick={() => setActiveTab('debates')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'debates' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              Débats & Vidéos ({MOCK_DEBATES.length})
          </button>
          <button 
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'stories' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              Témoignages ({MOCK_CONVERSIONS.length})
          </button>
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 gap-4">
          {activeTab === 'news' && MOCK_NEWS.map(item => (
              <div key={item.id} className="bg-[#121214] border border-gray-800 p-4 rounded-xl flex gap-4 items-center group hover:border-brand-500/50 transition">
                  <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-lg bg-gray-900" alt="thumbnail" />
                  <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                          <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded uppercase font-bold">{item.category}</span>
                          <span className="text-xs text-gray-500">{item.createdAt}</span>
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{item.content}</p>
                  </div>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition">
                      <button className="p-2 hover:bg-brand-900/30 rounded text-brand-500">Modifier</button>
                      <button className="p-2 hover:bg-red-900/30 rounded text-red-500">Supprimer</button>
                  </div>
              </div>
          ))}

          {activeTab === 'debates' && MOCK_DEBATES.map(item => (
              <div key={item.id} className="bg-[#121214] border border-gray-800 p-4 rounded-xl flex gap-4 items-center group hover:border-brand-500/50 transition">
                   <div className="w-32 h-20 bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
                       {/* Mock Thumbnail */}
                       <img src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`} className="w-full h-full object-cover opacity-60" alt="thumb" />
                       <div className="absolute w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">▶</div>
                   </div>
                   <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                        <p className="text-xs text-brand-500 font-bold uppercase">{item.speaker}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.location} • {item.date}</p>
                   </div>
                   <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition">
                      <button className="p-2 hover:bg-brand-900/30 rounded text-brand-500">Éditer</button>
                  </div>
              </div>
          ))}

          {activeTab === 'stories' && MOCK_CONVERSIONS.map(item => (
              <div key={item.id} className="bg-[#121214] border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 group hover:border-brand-500/50 transition">
                   <div className="flex items-center gap-4">
                       <img src={item.mediaUrl} className="w-16 h-16 rounded-full border-2 border-gray-700 object-cover" alt="avatar" />
                       <div>
                           <h3 className="font-bold text-white">{item.name}</h3>
                           <p className="text-xs text-gray-500">{item.date}</p>
                       </div>
                   </div>
                   <div className="flex-1 bg-black/40 p-4 rounded-lg border border-gray-800/50 italic text-gray-300 text-sm">
                       "{item.story}"
                   </div>
                   <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition items-center">
                      <button className="text-sm font-bold text-green-500 hover:underline">Publié</button>
                      <button className="text-sm text-gray-500 hover:text-white">Retirer</button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default AdminContent;

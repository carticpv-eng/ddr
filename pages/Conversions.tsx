
import React from 'react';
import { MOCK_CONVERSIONS } from '../constants';

const Conversions = () => {
  return (
    <div className="bg-black min-h-screen font-sans overflow-x-hidden selection:bg-brand-500 selection:text-white">
       {/* Background Decor */}
       <div className="fixed inset-0 pointer-events-none">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px]"></div>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
       </div>

       {/* Hero Section */}
       <div className="relative py-24 px-4 border-b border-gray-900 z-10">
           <div className="max-w-4xl mx-auto text-center relative">
               <div className="inline-flex items-center justify-center p-3 mb-6 bg-brand-900/20 rounded-full border border-brand-500/20 shadow-[0_0_20px_rgba(234,88,12,0.15)] animate-fade-in-up">
                   <svg className="w-6 h-6 text-brand-500 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                   <span className="text-brand-500 font-bold uppercase tracking-widest text-xs">Cœurs Apaisés</span>
               </div>
               
               <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight animate-fade-in-up delay-100">
                   Ils ont cherché la vérité,<br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-500">et Allah les a guidés.</span>
               </h1>
               <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto animate-fade-in-up delay-200">
                   Découvrez les récits authentiques et poignants de frères et sœurs ivoiriens qui ont embrassé l'Islam ou retrouvé le chemin de la foi.
               </p>
           </div>
       </div>

       {/* Stories Grid */}
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
           <div className="grid grid-cols-1 gap-20">
               {MOCK_CONVERSIONS.map((story, index) => (
                   <div 
                        key={story.id} 
                        className={`flex flex-col md:flex-row gap-10 lg:gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                   >
                       {/* Image Card */}
                       <div className="w-full md:w-5/12 group perspective-1000">
                           <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 transition-all duration-700 transform group-hover:rotate-y-2 group-hover:scale-105">
                               <div className="aspect-[4/5] relative">
                                   <img 
                                       src={story.mediaUrl} 
                                       alt={story.name} 
                                       className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                               </div>
                               
                               <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition duration-500">
                                   <h3 className="text-3xl font-bold text-white mb-1 font-serif">{story.name}</h3>
                                   <div className="flex items-center gap-2">
                                       <span className="h-0.5 w-8 bg-brand-500"></span>
                                       <p className="text-brand-400 text-sm font-bold uppercase tracking-widest">{story.date}</p>
                                   </div>
                               </div>
                           </div>
                           
                           {/* Decorative Elements around image */}
                           <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-brand-500/30 rounded-tr-3xl -z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition"></div>
                           <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-brand-500/30 rounded-bl-3xl -z-10 group-hover:-translate-x-2 group-hover:translate-y-2 transition"></div>
                       </div>

                       {/* Text Content */}
                       <div className="w-full md:w-7/12 relative">
                           <svg className="absolute -top-10 -left-6 w-24 h-24 text-gray-800 transform opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.0547 15.192 15.192 16.6797 15.192L17.5918 15.192C18.6758 15.192 19.5547 14.2758 19.5547 13.1918L19.5547 8.0625C19.5547 6.97852 18.6758 6.10156 17.5918 6.10156L12.5547 6.10156C11.4707 6.10156 10.5918 6.97852 10.5918 8.0625L10.5918 13.1918C10.5918 14.6508 11.3984 15.9398 12.5977 16.6352L10.0254 20.4883C9.72266 20.9414 9.83789 21.5547 10.291 21.8574C10.7441 22.1582 11.3574 22.043 11.6602 21.5898L14.017 21ZM4.01758 21L4.01758 18C4.01758 16.0547 5.19336 15.192 6.67969 15.192L7.5918 15.192C8.67578 15.192 9.55469 14.2758 9.55469 13.1918L9.55469 8.0625C9.55469 6.97852 8.67578 6.10156 7.5918 6.10156L2.55469 6.10156C1.4707 6.10156 0.591797 6.97852 0.591797 8.0625L0.591797 13.1918C0.591797 14.6508 1.39844 15.9398 2.59766 16.6352L0.0253906 20.4883C-0.277344 20.9414 -0.162109 21.5547 0.291016 21.8574C0.744141 22.1582 1.35742 22.043 1.66016 21.5898L4.01758 21Z"/></svg>
                           
                           <div className="bg-[#0f0f11]/80 backdrop-blur-xl p-10 rounded-3xl border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 hover:border-brand-500/30 transition duration-500">
                               <p className="text-gray-200 text-xl leading-relaxed italic mb-8 font-serif">
                                   "{story.story}"
                               </p>
                               
                               <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                                   <div className="h-12 w-12 rounded-full bg-brand-900/50 border border-brand-500 flex items-center justify-center text-brand-500 font-bold text-xl shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                                       {story.name.charAt(0)}
                                   </div>
                                   <div>
                                       <p className="text-white font-bold text-base">Témoignage authentifié</p>
                                       <p className="text-xs text-gray-500 uppercase tracking-wider">Recueilli par l'équipe DDR</p>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
       </div>

       {/* CTA - Share Story */}
       <div className="bg-gradient-to-t from-brand-900/20 to-black py-20 text-center relative overflow-hidden border-t border-gray-900 mt-20">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10 max-w-3xl mx-auto px-4">
               <h2 className="text-3xl font-bold text-white mb-6 font-serif">Vous aussi, vous avez une histoire ?</h2>
               <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                   Votre cheminement vers la lumière peut inspirer et guider d'autres cœurs indécis. 
                   Ne gardez pas ce trésor pour vous.
               </p>
               <button className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                   Envoyer mon témoignage (Audio ou Écrit)
               </button>
           </div>
       </div>
    </div>
  );
};

export default Conversions;
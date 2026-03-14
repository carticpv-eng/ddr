
import React from 'react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-8 animate-pulse">
            <img src="/logo.png" alt="DDR Logo" className="h-24 w-auto mx-auto drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]" 
                 onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100/ea580c/000000?text=DDR"; }} />
        </div>
        
        <div className="bg-[#121214] border border-brand-500/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="inline-flex items-center justify-center p-3 bg-brand-900/20 rounded-full border border-brand-500/20 mb-6">
                <svg className="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Site en Maintenance</h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Nous effectuons actuellement une mise à jour importante pour améliorer votre expérience.
                <br/>Le site sera de nouveau accessible très bientôt insha'Allah.
            </p>

            <div className="flex flex-col gap-4">
                <div className="p-4 bg-black rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Besoin urgent ?</p>
                    <p className="text-white font-mono text-lg">+225 07 47 32 04 55</p>
                </div>
            </div>
        </div>
        
        <p className="mt-8 text-xs text-gray-600 font-mono">
            Administration : <a href="/#/admin/login" className="text-gray-500 hover:text-brand-500 underline">Accès Staff</a>
        </p>
      </div>
    </div>
  );
};

export default Maintenance;

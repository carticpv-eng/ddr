
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Shahada = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    method: 'presentiel' // presentiel | video
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi prioritaire
    setTimeout(() => {
        setLoading(false);
        setStep(3);
        window.scrollTo(0, 0);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black relative text-white overflow-hidden font-sans selection:bg-gold-500 selection:text-black">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center min-h-screen">
        
        {/* HEADER SPIRITUEL */}
        <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block p-4 rounded-full border border-gold-500/30 bg-gold-500/5 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <svg className="w-12 h-12 text-gold-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-gold-500 to-yellow-600 mb-4 tracking-tight font-serif">
                Le Plus Grand Pas
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Il n'y a de divinité digne d'adoration qu'Allah, et Muhammad est Son messager.
                <br/>Vous êtes sur le point de rejoindre une fraternité de 2 milliards d'âmes.
            </p>
        </div>

        {/* STEP 1: LA SHAHADA */}
        {step === 1 && (
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-gold-500/20 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(212,175,55,0.1)] text-center animate-fade-in-up">
                <h2 className="text-2xl text-gold-500 font-bold mb-8 uppercase tracking-widest text-xs">L'attestation de foi</h2>
                
                <div className="mb-10 space-y-6">
                    <p className="text-3xl md:text-5xl font-serif text-white leading-relaxed dir-rtl" style={{ direction: 'rtl' }}>
                        أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ <br/>
                        وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ
                    </p>
                    <p className="text-lg text-gray-400 italic font-serif">
                        "Ash-hadu an la ilaha illa Allah, <br/> wa ash-hadu anna Muhammadan Rasul Allah"
                    </p>
                    <div className="h-px w-24 bg-gold-500/30 mx-auto"></div>
                    <p className="text-xl font-medium text-white">
                        "J'atteste qu'il n'y a pas de divinité digne d'adoration sauf Allah,<br/>
                        et j'atteste que Muhammad est le Messager d'Allah."
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-6">
                        Si votre cœur reconnait cette vérité, nous sommes prêts à vous accueillir et vous accompagner dans vos premiers pas.
                    </p>
                    <button 
                        onClick={() => setStep(2)}
                        className="w-full py-4 bg-gradient-to-r from-gold-600 to-yellow-600 text-black font-bold text-lg rounded-xl hover:from-yellow-500 hover:to-gold-500 transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                    >
                        JE SUIS PRÊT(E) À ME CONVERTIR
                    </button>
                    <Link to="/appointments" className="block text-sm text-gray-500 hover:text-gold-500 mt-4 transition">
                        J'ai encore des questions, je veux discuter d'abord.
                    </Link>
                </div>
            </div>
        )}

        {/* STEP 2: LE FORMULAIRE */}
        {step === 2 && (
            <div className="w-full max-w-xl bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl animate-fade-in-up">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white transition">
                        ← Retour
                    </button>
                    <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500 w-1/2"></div>
                    </div>
                    <span className="text-gold-500 font-bold text-sm">Étape 2/2</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Bienvenue dans la famille</h2>
                <p className="text-gray-400 text-sm mb-8">
                    Remplissez ce formulaire pour qu'un imam ou un responsable de la DDR vous contacte personnellement pour officialiser votre conversion.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Votre Prénom & Nom</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition"
                            placeholder="Ex: Marc Aurèle"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Numéro de téléphone</label>
                        <input 
                            type="tel" 
                            required
                            className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition"
                            placeholder="Pour vous appeler rapidement"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Votre Ville / Quartier</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition"
                            placeholder="Ex: Yopougon, Abidjan"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Préférence</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, method: 'presentiel'})}
                                className={`p-4 rounded-xl border text-sm font-bold transition ${formData.method === 'presentiel' ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-black border-gray-700 text-gray-400 hover:border-gray-500'}`}
                            >
                                🕌 À la Mosquée / Bureau
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, method: 'video'})}
                                className={`p-4 rounded-xl border text-sm font-bold transition ${formData.method === 'video' ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-black border-gray-700 text-gray-400 hover:border-gray-500'}`}
                            >
                                📱 Par Vidéo / Appel
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50"
                    >
                        {loading ? 'Envoi en cours...' : 'CONFIRMER MA DEMANDE'}
                    </button>
                </form>
            </div>
        )}

        {/* STEP 3: SUCCÈS - TAKBIR */}
        {step === 3 && (
            <div className="w-full max-w-2xl text-center animate-fade-in-up">
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-gold-500 blur-[60px] opacity-40 rounded-full animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-tr from-gold-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-black">
                        <svg className="w-16 h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                    Allahou Akbar !
                </h2>
                <p className="text-xl md:text-2xl text-gold-500 font-serif italic mb-8">
                    "Dieu est le Plus Grand"
                </p>

                <div className="bg-[#121212] border border-gold-500/30 p-8 rounded-3xl max-w-lg mx-auto shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Votre demande a été reçue avec une immense joie par toute l'équipe. 
                        <br/><br/>
                        <strong className="text-white">Un responsable va vous appeler au {formData.phone} dans les plus brefs délais</strong> pour officialiser ce moment béni.
                    </p>
                    <div className="bg-gold-500/10 p-4 rounded-xl border border-gold-500/20">
                        <p className="text-sm text-gold-300">
                            En attendant, sachez qu'Allah efface tous les péchés passés de celui qui embrasse l'Islam. Vous renaissez aujourd'hui.
                        </p>
                    </div>
                </div>

                <div className="mt-12">
                    <Link to="/" className="text-gray-500 hover:text-white underline underline-offset-4 transition">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Shahada;

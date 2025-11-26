
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Appointments = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'Question religieuse / Théologie',
    date: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi
    setTimeout(() => {
        console.log("Submitting appointment:", formData);
        setLoading(false);
        setSubmitted(true);
        window.scrollTo(0, 0);
    }, 1500);
  };

  if (submitted) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-[#09090b] border border-brand-500/20 text-white p-12 rounded-3xl shadow-[0_0_60px_rgba(234,88,12,0.1)] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-600 to-yellow-500"></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-900/50 animate-bounce">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-4xl font-extrabold mb-4 text-white">Demande Reçue</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Barak Allah Oufik <strong>{formData.name}</strong>. Votre demande a bien été transmise au secrétariat de la DDR. Nous vous contacterons au <strong>{formData.phone}</strong> sous 24h pour confirmer le créneau.
                </p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', subject: 'Question religieuse / Théologie', date: '', message: '' }) }} className="w-full py-4 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition">
                        Nouvelle demande
                    </button>
                    <Link to="/" className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-500 transition shadow-lg shadow-brand-900/20">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative selection:bg-brand-500 selection:text-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-b from-brand-900/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-16">
            <span className="text-brand-500 font-bold uppercase tracking-widest text-sm bg-brand-900/20 px-3 py-1 rounded-full border border-brand-500/20">Espace Contact</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-4 tracking-tight">
                Prendre <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-500">Rendez-vous</span>
            </h1>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl leading-relaxed">
                Une question théologique complexe ? Une proposition de débat ? Ou un don matériel volumineux ? Rencontrons-nous.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left Column: Info & Direct Contact */}
            <div className="lg:col-span-5 space-y-8">
                <div className="bg-[#0f0f11] rounded-3xl p-8 border border-gray-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2">Besoin d'une réponse immédiate ?</h3>
                        <p className="text-gray-400 text-sm mb-6">Pour les urgences ou les informations rapides, privilégiez l'appel téléphonique.</p>
                        
                        <div className="space-y-4">
                            <a href="tel:+2250747320455" className="flex items-center gap-4 p-4 bg-black rounded-xl border border-gray-800 hover:border-brand-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] transition-all group/phone">
                                <div className="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Ligne Principale</p>
                                    <p className="text-lg font-bold text-white font-mono group-hover/phone:text-brand-500 transition">+225 07 47 32 04 55</p>
                                </div>
                            </a>
                            <a href="tel:+2250505408685" className="flex items-center gap-4 p-4 bg-black rounded-xl border border-gray-800 hover:border-brand-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] transition-all group/phone">
                                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 group-hover/phone:bg-white group-hover/phone:text-black transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Ligne Secondaire</p>
                                    <p className="text-lg font-bold text-white font-mono group-hover/phone:text-white transition">+225 05 05 40 86 85</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f0f11] rounded-3xl p-8 border border-gray-800/50">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="text-brand-500">📍</span> Siège Social
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Abidjan, Côte d'Ivoire.<br/>
                        Nous recevons physiquement uniquement sur rendez-vous confirmé.
                    </p>
                    <div className="h-40 w-full rounded-xl bg-gray-800 overflow-hidden relative grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-500">
                         <img src="https://images.unsplash.com/photo-1577083288073-40892c0860a4?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Abidjan Map" />
                         <div className="absolute inset-0 flex items-center justify-center">
                             <div className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">Abidjan</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Right Column: The Form */}
            <div className="lg:col-span-7">
                <form onSubmit={handleSubmit} className="bg-[#09090b] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <svg className="w-64 h-64 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-brand-500 transition-colors">Nom complet</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="block w-full bg-[#121214] border border-gray-800 rounded-xl py-4 px-5 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 placeholder-gray-700 transition-all outline-none"
                                    placeholder="Ex: Moussa Koné"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-brand-500 transition-colors">Téléphone</label>
                                <input 
                                    type="tel" 
                                    required 
                                    className="block w-full bg-[#121214] border border-gray-800 rounded-xl py-4 px-5 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 placeholder-gray-700 transition-all outline-none"
                                    placeholder="Ex: 07 07 07 07 07"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-brand-500 transition-colors">Sujet du RDV</label>
                            <div className="relative">
                                <select 
                                    className="block w-full bg-[#121214] border border-gray-800 rounded-xl py-4 px-5 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 appearance-none outline-none transition-all cursor-pointer"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                >
                                    <option>Question religieuse / Théologie</option>
                                    <option>Don matériel / Logistique</option>
                                    <option>Proposition de Débat</option>
                                    <option>Presse / Média</option>
                                    <option>Autre</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-brand-500 transition-colors">Date souhaitée</label>
                            <input 
                                type="date" 
                                required 
                                className="block w-full bg-[#121214] border border-gray-800 rounded-xl py-4 px-5 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none [color-scheme:dark]"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-brand-500 transition-colors">Message (Détails)</label>
                            <textarea 
                                rows={5}
                                className="block w-full bg-[#121214] border border-gray-800 rounded-xl py-4 px-5 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 placeholder-gray-700 transition-all outline-none resize-none"
                                placeholder="Expliquez brièvement l'objet de votre demande..."
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white py-5 rounded-xl font-bold text-lg hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Envoi en cours...
                                    </span>
                                ) : "CONFIRMER LA DEMANDE"}
                            </button>
                            <p className="text-center text-xs text-gray-600 mt-4">
                                En envoyant ce formulaire, vous acceptez d'être recontacté par l'équipe DDR.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;

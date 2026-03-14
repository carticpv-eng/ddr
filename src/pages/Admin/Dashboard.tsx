
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VeoStudio from '../../components/VeoStudio';
import { SCHOOL_CAMPAIGN, MOCK_DONATIONS, MOCK_APPOINTMENTS } from '../../constants';
import { InboxMessage, KhatmaSession } from '../../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  
  // États pour la Newsletter
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  // Compteurs intelligents
  const [pendingAppointments] = useState(() => MOCK_APPOINTMENTS.filter(a => a.status === 'pending').length);
  const [unreadMessages] = useState(() => {
      const storedInbox = localStorage.getItem('ddr_inbox');
      if (storedInbox) {
          const msgs: InboxMessage[] = JSON.parse(storedInbox);
          return msgs.length;
      }
      return 0;
  });
  
  // L'ORACLE (Prédiction)
  const [prediction] = useState(() => {
      const remainingAmount = SCHOOL_CAMPAIGN.targetAmount - SCHOOL_CAMPAIGN.currentAmount;
      const dailyAverage = 150000; 
      const daysNeeded = Math.ceil(remainingAmount / dailyAverage);
      
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysNeeded);
      
      return {
          date: targetDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          daysLeft: daysNeeded,
          average: dailyAverage
      };
  });

  // HALAQA STATE
  const [khatmaProgress] = useState(() => {
      const storedKhatma = localStorage.getItem('ddr_khatma');
      if (storedKhatma) {
          const session: KhatmaSession = JSON.parse(storedKhatma);
          const completed = session.juzs.filter(j => j.status === 'completed').length;
          return Math.round((completed / 30) * 100);
      }
      return 0;
  });

  useEffect(() => {
      // Logic removed as it's now in initializers
  }, []);

  const stats = [
    { label: 'Revenus Totaux', value: '12,450,000 F', change: '+24%', color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Dons ce mois', value: '850,000 F', change: '+12%', color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Nouveaux RDV', value: '14', change: 'En hausse', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Vues Vidéos', value: '145k', change: '+5%', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const handleDownloadReport = () => {
      setDownloadingReport(true);
      setTimeout(() => {
          setDownloadingReport(false);
          alert("📄 Le Rapport Financier Mensuel (PDF) a été généré et téléchargé avec succès.");
      }, 2000);
  };

  const handleSendNewsletter = (e: React.FormEvent) => {
      e.preventDefault();
      setSendingNewsletter(true);
      setTimeout(() => {
          setSendingNewsletter(false);
          setShowNewsletter(false);
          setNewsletterSubject('');
          setNewsletterBody('');
          alert(`✅ Newsletter envoyée avec succès à ${MOCK_DONATIONS.length + 1240} donateurs !`);
      }, 2000);
  };

  const handleNavigate = (path: string) => {
      setShowContentMenu(false);
      navigate(path);
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6 relative z-30">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Vue d'ensemble</h1>
            <p className="text-gray-500 mt-1">Gérez l'impact de la DDR en temps réel.</p>
          </div>
          <div className="flex gap-3 relative">
              <button 
                onClick={handleDownloadReport}
                disabled={downloadingReport}
                className="px-4 py-2 bg-black hover:bg-gray-900 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                 {downloadingReport ? (
                    <svg className="animate-spin h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                 )}
                 {downloadingReport ? 'Génération...' : 'Rapport Financier'}
              </button>
              
              <div className="relative">
                <button 
                    onClick={() => setShowContentMenu(!showContentMenu)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(234,88,12,0.3)] transition flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Ajouter Contenu
                    <svg className={`w-3 h-3 transition-transform ${showContentMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {showContentMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1c] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                        <div className="py-1">
                            <button onClick={() => handleNavigate('/admin/news')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-brand-600 hover:text-white transition flex items-center gap-3">
                                <span className="text-lg">📰</span> Nouvelle Actualité
                            </button>
                            <button onClick={() => handleNavigate('/admin/debates')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-brand-600 hover:text-white transition flex items-center gap-3">
                                <span className="text-lg">🎥</span> Nouveau Débat
                            </button>
                            <button onClick={() => handleNavigate('/admin/conversions')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-brand-600 hover:text-white transition flex items-center gap-3">
                                <span className="text-lg">✨</span> Nouveau Témoignage
                            </button>
                            <div className="border-t border-gray-700 my-1"></div>
                            <button onClick={() => { setShowContentMenu(false); window.scrollTo({ top: 1000, behavior: 'smooth' }); }} className="w-full text-left px-4 py-3 text-sm text-purple-400 hover:bg-purple-900/30 transition flex items-center gap-3 font-bold">
                                <span className="text-lg">🎬</span> Générer Vidéo (Veo)
                            </button>
                        </div>
                    </div>
                )}
              </div>
          </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
            <div key={stat.label} className="bg-[#121214] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition group relative overflow-hidden">
                <div className={`absolute top-0 right-0 p-3 opacity-10 ${stat.color}`}>
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition">{stat.label}</p>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border border-current opacity-80 ${stat.color}`}>
                        {stat.change}
                    </span>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight font-mono relative z-10">{stat.value}</p>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* L'ORACLE FINANCIER (IA PREDICTION) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#121214] to-black p-6 rounded-xl border border-gray-800 shadow-xl flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/10 rounded-full blur-[80px]"></div>
             
             <div className="flex justify-between items-center mb-6 relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900/20 border border-purple-500/50 flex items-center justify-center text-purple-400 text-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse">🔮</div>
                    <div>
                        <h2 className="text-lg font-bold text-white">L'Oracle Financier</h2>
                        <p className="text-xs text-gray-500">Prédiction basée sur la moyenne des dons ({prediction.average.toLocaleString()} F/jour)</p>
                    </div>
                 </div>
             </div>
             
             <div className="flex-1 flex flex-col justify-center items-center text-center p-8 border border-gray-800/50 bg-black/40 rounded-xl relative z-10 backdrop-blur-sm">
                 <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Objectif 50 Millions estimé pour le</p>
                 <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 font-serif">
                     {prediction.date}
                 </h3>
                 <p className="text-sm text-gray-500 bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
                     Soit dans environ <strong className="text-white">{prediction.daysLeft} jours</strong> à ce rythme.
                 </p>
             </div>
          </div>

          {/* Project Status Card */}
          <div className="bg-[#121214] p-0 rounded-xl border border-gray-800 shadow-sm flex flex-col overflow-hidden">
             <div className="relative h-32">
                 <img src={SCHOOL_CAMPAIGN.imageUrl} className="w-full h-full object-cover opacity-50" alt="Chantier" />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121214]"></div>
                 <div className="absolute top-4 left-4 bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">EN COURS</div>
             </div>
             
             <div className="p-6 pt-0 flex-1 flex flex-col">
                 <h2 className="text-lg font-bold text-white mb-1">Projet École & Mosquée</h2>
                 <p className="text-xs text-gray-500 mb-6">Phase 1 : Fondations et Gros Œuvre</p>

                 <div className="flex justify-between items-end mb-2">
                     <span className="text-3xl font-bold text-white font-mono">24%</span>
                     <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded">Actif</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden mb-6 border border-gray-700">
                    <div className="bg-gradient-to-r from-brand-600 to-brand-400 h-2 rounded-full relative" style={{ width: '24%' }}></div>
                 </div>
                 
                 <div className="bg-black/40 rounded-lg p-4 border border-gray-800 space-y-3">
                     <div className="flex justify-between text-xs">
                         <span className="text-gray-500">Budget Estimé</span>
                         <span className="text-white font-mono">{SCHOOL_CAMPAIGN.targetAmount.toLocaleString()} F</span>
                     </div>
                     <div className="flex justify-between text-xs">
                         <span className="text-gray-500">Collecté</span>
                         <span className="text-brand-500 font-bold font-mono">{SCHOOL_CAMPAIGN.currentAmount.toLocaleString()} F</span>
                     </div>
                 </div>

                 <button onClick={() => navigate('/admin/campaigns')} className="mt-6 w-full py-3 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider rounded-lg transition">
                     Gérer le chantier
                 </button>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Recent Transactions Table */}
           <div className="lg:col-span-2 bg-[#121214] rounded-xl border border-gray-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
                    <h2 className="font-bold text-white text-sm uppercase tracking-wider">Transactions Récentes</h2>
                    <button onClick={() => navigate('/admin/donations')} className="text-xs text-brand-500 hover:text-brand-400 font-bold border border-brand-500/30 px-3 py-1 rounded-full">Voir tout</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-black/40 text-xs uppercase font-bold text-gray-500 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Donateur</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Méthode</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {MOCK_DONATIONS.slice(0, 5).map((don) => (
                                <tr key={don.id} className="hover:bg-gray-800/30 transition group">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${don.isAnonymous ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-brand-900/30 border-brand-500/30 text-brand-500'}`}>
                                            {don.isAnonymous ? '?' : don.donorName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm">{don.isAnonymous ? <span className="italic text-gray-500">Anonyme</span> : don.donorName}</p>
                                            <p className="text-[10px] text-gray-600 font-mono">{don.donorPhone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-white group-hover:text-brand-500 transition">{don.amount.toLocaleString()} F</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${
                                            don.method === 'Wave' ? 'border-[#00C2FF]/30 text-[#00C2FF] bg-[#00C2FF]/5' :
                                            don.method === 'OrangeMoney' ? 'border-[#FF7900]/30 text-[#FF7900] bg-[#FF7900]/5' :
                                            don.method === 'MTN' ? 'border-[#FFCC00]/30 text-[#FFCC00] bg-[#FFCC00]/5' :
                                            'border-gray-600 text-gray-300'
                                        }`}>
                                            {don.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">{don.createdAt}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            PAYÉ
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>

           {/* Quick Actions & AI */}
           <div className="space-y-6">
                
                {/* WIDGET HALAQA */}
                <div className="bg-black/60 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gold-900/20 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <span>🤲</span> Khatma Live
                        </h3>
                        <span className="text-gold-500 font-mono text-xl font-bold">{khatmaProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden mb-2">
                        <div className="bg-gold-500 h-full rounded-full transition-all duration-1000" style={{ width: `${khatmaProgress}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-500">Lecture collective en cours.</p>
                </div>

                <VeoStudio />
                
                <div className="bg-[#121214] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Tâches Administratives</h3>
                    <div className="space-y-3">
                        {/* VALIDATION RDV */}
                        <button 
                            onClick={() => navigate('/admin/appointments')}
                            className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 rounded-lg border border-gray-800 hover:border-brand-500/50 text-sm text-gray-300 transition flex items-center gap-3 group"
                        >
                            <span className="p-2 bg-gray-800 rounded-md group-hover:bg-brand-600 group-hover:text-white transition">📅</span> 
                            <span>Valider les rendez-vous</span>
                            {pendingAppointments > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">{pendingAppointments}</span>
                            )}
                        </button>

                        {/* BOITE A LETTRES (VOCAUX/ECRITS) */}
                        <button 
                            onClick={() => navigate('/admin/mailbox')}
                            className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 rounded-lg border border-gray-800 hover:border-brand-500/50 text-sm text-gray-300 transition flex items-center gap-3 group"
                        >
                            <span className="p-2 bg-gray-800 rounded-md group-hover:bg-brand-600 group-hover:text-white transition">📬</span> 
                            <span>Écouter témoignages</span>
                            {unreadMessages > 0 && (
                                <span className="ml-auto bg-brand-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadMessages}</span>
                            )}
                        </button>

                        {/* NEWSLETTER */}
                        <button 
                            onClick={() => setShowNewsletter(true)}
                            className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 rounded-lg border border-gray-800 hover:border-brand-500/50 text-sm text-gray-300 transition flex items-center gap-3 group"
                        >
                            <span className="p-2 bg-gray-800 rounded-md group-hover:bg-brand-600 group-hover:text-white transition">📧</span> 
                            <span>Newsletter Donateurs</span>
                        </button>

                        {/* EVENT */}
                        <button 
                            onClick={() => navigate('/admin/content')}
                            className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 rounded-lg border border-gray-800 hover:border-brand-500/50 text-sm text-gray-300 transition flex items-center gap-3 group"
                        >
                            <span className="p-2 bg-gray-800 rounded-md group-hover:bg-brand-600 group-hover:text-white transition">📢</span> 
                            <span>Annoncer un événement</span>
                        </button>
                    </div>
                </div>
           </div>
      </div>

      {/* NEWSLETTER MODAL */}
      {showNewsletter && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#1a1a1c] w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl p-8 relative animate-fade-in-up">
                  <button onClick={() => setShowNewsletter(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                  
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-brand-900/20 rounded-full border border-brand-500/20">
                          <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-white">Newsletter Donateurs</h2>
                          <p className="text-xs text-gray-400">Envoyer un message à toute la base ({MOCK_DONATIONS.length + 1240} contacts)</p>
                      </div>
                  </div>

                  <form onSubmit={handleSendNewsletter} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sujet</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: Avancement des travaux de l'école..." 
                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                            value={newsletterSubject}
                            onChange={e => setNewsletterSubject(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                          <textarea 
                            required
                            rows={6}
                            placeholder="Chers frères et sœurs..." 
                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                            value={newsletterBody}
                            onChange={e => setNewsletterBody(e.target.value)}
                          ></textarea>
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                          <button 
                            type="button" 
                            onClick={() => setShowNewsletter(false)}
                            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-sm transition"
                          >
                              Annuler
                          </button>
                          <button 
                            type="submit"
                            disabled={sendingNewsletter}
                            className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                              {sendingNewsletter ? 'Envoi en cours...' : <>Envoyer <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></>}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;

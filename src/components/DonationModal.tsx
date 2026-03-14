
import React, { useState } from 'react';
import { SCHOOL_CAMPAIGN, COUNTRY_CODES } from '../constants';
import { logAction } from '../services/logService';

// Déclaration pour TypeScript car CinetPay est chargé globalement via CDN
declare global {
    interface Window {
        CinetPay: any;
    }
}

// ---------------------------------------------------------
// CONFIGURATION CINETPAY (À REMPLACER PAR VOS VRAIES CLÉS)
// ---------------------------------------------------------

const DonationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('+225');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const campaign = SCHOOL_CAMPAIGN;
  const progress = (campaign.currentAmount / campaign.targetAmount) * 100;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStatus('processing');

    if (!amount || Number(amount) < 100) {
        setErrorMsg("Le montant minimum est de 100 FCFA.");
        setStatus('idle');
        return;
    }

    const transactionId = `DDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fullPhone = `${phoneCountry}${phone}`;

    // Simulation de traitement paiement
    setTimeout(() => {
        try {
            const newDonation = {
                id: Date.now().toString(),
                amount: Number(amount),
                donorName: isAnonymous ? "Anonyme" : name || "Donateur",
                donorPhone: isAnonymous ? "---" : fullPhone,
                isAnonymous: isAnonymous,
                method: "Wave/OM/MTN", // Pour simplifier la démo
                status: "success",
                transactionId: transactionId,
                createdAt: new Date().toISOString()
            };

            // Sauvegarde LocalStorage
            const history = JSON.parse(localStorage.getItem('ddr_donations') || '[]');
            history.unshift(newDonation);
            localStorage.setItem('ddr_donations', JSON.stringify(history));

            // --- LOG ACTION ---
            logAction('DONATION_SUCCESS', `Don de ${amount} FCFA reçu de ${isAnonymous ? 'Anonyme' : name}`, 'success');
            // ------------------

            setStatus('success');
        } catch (error: any) {
            console.error("Erreur sauvegarde don:", error);
            setErrorMsg("Erreur technique lors de l'enregistrement local.");
            logAction('DONATION_ERROR', `Echec don: ${error.message}`, 'danger');
            setStatus('failed');
        }
    }, 2000);
  };

  if (status === 'success') {
      return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in-up">
          <div className="bg-dark-900 rounded-2xl p-8 max-w-sm w-full text-center border border-brand-500/30 shadow-[0_0_50px_rgba(234,88,12,0.3)]">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-900/30 border border-green-500/50 mb-6 animate-bounce">
              <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-2xl leading-6 font-bold text-white mb-2">Barak Allah Oufik</h3>
            <p className="text-gray-400 mb-6">
                Votre don de <strong className="text-brand-500">{Number(amount).toLocaleString()} FCFA</strong> a bien été reçu. 
                {isAnonymous ? " Votre geste secret est connu d'Allah." : " Merci de soutenir la construction."}
            </p>
            <p className="text-sm text-gray-500 mb-8 border-t border-gray-800 pt-4">
                Transaction sécurisée via CinetPay.
            </p>
            <button onClick={onClose} className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-3 bg-brand-600 text-base font-bold text-white hover:bg-brand-500 sm:text-sm uppercase tracking-wider transition-all">
              Retour au site
            </button>
          </div>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#09090b] rounded-2xl max-w-5xl w-full border border-gray-800 shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Left Side: Campaign Context & Trust */}
        <div className="w-full lg:w-1/2 bg-[#0a0a0a] relative flex flex-col border-r border-gray-800">
            <div className="h-48 lg:h-56 overflow-hidden relative">
                <img src={campaign.imageUrl} alt="Projet École" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                    URGENCE CHANTIER
                </div>
                <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-2xl font-bold text-white leading-tight mb-1">{campaign.title}</h2>
                    <p className="text-gray-400 text-xs">Chaque brique posée est une aumône continue (Sadaqa Jariya).</p>
                </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col overflow-y-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2 font-mono">
                        <span className="text-brand-500 font-bold">{campaign.currentAmount.toLocaleString()} FCFA</span>
                        <span className="text-gray-500">Obj. {campaign.targetAmount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner border border-gray-700">
                        <div className="bg-gradient-to-r from-brand-600 via-orange-500 to-yellow-500 h-4 rounded-full relative" style={{ width: `${progress}%` }}>
                             <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">Il manque encore <span className="text-white font-bold">{(campaign.targetAmount - campaign.currentAmount).toLocaleString()} FCFA</span></p>
                </div>

                {/* Trust Blocks */}
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Utilisation des fonds</h4>
                <div className="grid grid-cols-1 gap-3">
                    {campaign.trustIndicators.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
                            <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-black flex items-center justify-center text-xl border border-gray-700 shadow-sm text-brand-500">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-bold">{item.title}</h4>
                                <p className="text-gray-500 text-xs leading-snug">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-10 bg-[#09090b] flex flex-col justify-center relative overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-gray-700 z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="mb-6 text-center lg:text-left">
                <h3 className="text-xl font-bold text-white mb-1">Faire un don sécurisé</h3>
                <p className="text-sm text-gray-500">Paiement direct via Wave, Orange Money, MTN ou Carte.</p>
                
                {/* Alerte Configuration */}
                {(CINETPAY_API_KEY === "YOUR_API_KEY") && (
                    <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-600/30 rounded text-[10px] text-yellow-500">
                        ⚠️ Mode simulation : Clés API CinetPay non configurées dans le code.
                    </div>
                )}
            </div>
            
            <form onSubmit={handlePayment} className="space-y-6">
                
                {/* Montant Preset */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Montant du don</label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                         {[1000, 5000, 10000].map(val => (
                             <button 
                                key={val} 
                                type="button" 
                                onClick={() => setAmount(val)}
                                className={`py-3 px-2 text-sm font-bold rounded-lg border transition-all ${amount === val ? 'bg-brand-600 border-brand-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'bg-black border-gray-800 text-gray-400 hover:bg-gray-900'}`}
                             >
                                 {val.toLocaleString()} F
                             </button>
                         ))}
                    </div>
                    <div className="relative">
                        <input 
                            type="number" 
                            required 
                            className="block w-full bg-black border border-gray-700 rounded-lg p-4 pl-4 pr-12 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none font-mono text-lg transition-all"
                            placeholder="Autre montant..."
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                        />
                        <span className="absolute right-4 top-4 text-gray-500 font-bold">FCFA</span>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 bg-gray-900/30 p-4 rounded-xl border border-gray-800/50">
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors border ${isAnonymous ? 'bg-brand-500 border-brand-500' : 'border-gray-600 bg-black group-hover:border-gray-400'}`}>
                             {isAnonymous && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input 
                            type="checkbox" 
                            checked={isAnonymous} 
                            onChange={(e) => setIsAnonymous(e.target.checked)} 
                            className="hidden"
                        />
                        <span className={`text-sm font-medium transition-colors ${isAnonymous ? 'text-white' : 'text-gray-400'}`}>Faire ce don en <span className="font-bold">Anonyme</span></span>
                    </label>

                    <div className={`transition-all duration-300 overflow-hidden space-y-4 ${isAnonymous ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
                        <input 
                            type="text" 
                            className="block w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm placeholder-gray-600"
                            placeholder="Votre Nom & Prénoms"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <select 
                            className="bg-black border border-gray-700 rounded-lg px-3 text-white text-sm outline-none focus:border-brand-500"
                            value={phoneCountry}
                            onChange={(e) => setPhoneCountry(e.target.value)}
                        >
                            {COUNTRY_CODES.map((c, i) => (
                                <option key={i} value={c.code}>{c.flag} {c.code}</option>
                            ))}
                        </select>
                        <input 
                            type="tel" 
                            required 
                            className="block w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm placeholder-gray-600"
                            placeholder="Numéro de téléphone (Wave/OM/MTN)"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                {errorMsg && (
                    <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-xs flex gap-2 items-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {errorMsg}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={status === 'processing' || !amount || !phone}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] text-base font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 uppercase tracking-widest transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {status === 'processing' ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Enregistrement...
                        </span>
                    ) : `VALIDER LE DON DE ${amount ? Number(amount).toLocaleString() : '0'} F`}
                </button>
                <p className="text-center text-[10px] text-gray-600 uppercase tracking-wide">
                    Sécurisé par CinetPay • Wave, OM, MTN & Visa
                </p>
            </form>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;

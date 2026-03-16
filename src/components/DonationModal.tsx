
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SCHOOL_CAMPAIGN, COUNTRY_CODES } from '../constants';
import { logAction } from '../services/logService';
import { toPng } from 'html-to-image';
import { Download, Share2, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Heart } from 'lucide-react';

// Déclaration pour TypeScript car CinetPay est chargé globalement via CDN
declare global {
    interface Window {
        CinetPay: any;
    }
}

// ---------------------------------------------------------
// CONFIGURATION CINETPAY
// ---------------------------------------------------------
const CINETPAY_API_KEY = import.meta.env.VITE_CINETPAY_API_KEY || "YOUR_API_KEY";
const CINETPAY_SITE_ID = import.meta.env.VITE_CINETPAY_SITE_ID || "YOUR_SITE_ID";

const DonationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [donationType, setDonationType] = useState<'money' | 'material'>('money');
  const [amount, setAmount] = useState<number | ''>('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('+225');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [transactionData, setTransactionData] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const campaign = SCHOOL_CAMPAIGN;
  const progress = (campaign.currentAmount / campaign.targetAmount) * 100;

  // Charger le script CinetPay
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.cinetpay.com/sdk/v2/cinetpay.sdk.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const saveDonation = (donation: any) => {
    try {
        const history = JSON.parse(localStorage.getItem('ddr_donations') || '[]');
        const newHistory = [donation, ...history].slice(0, 50);
        localStorage.setItem('ddr_donations', JSON.stringify(newHistory));
        setTransactionData(donation);
        setStatus('success');
        logAction('DONATION_SUCCESS', `Don de ${donation.amount} F par ${donation.donorName}`, 'success');
    } catch (err) {
        console.error("Error saving donation:", err);
    }
  };

  const handlePayment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (donationType === 'money') {
        if (!amount || Number(amount) < 100) {
            setErrorMsg("Le montant minimum est de 100 FCFA.");
            return;
        }

        if (CINETPAY_API_KEY === "YOUR_API_KEY") {
            // Mode Simulation si pas de clé
            setStatus('processing');
            const transactionId = `DDR-SIM-${Date.now()}`;
            setTimeout(() => {
                const mockData = {
                    id: Date.now().toString(),
                    amount: Number(amount),
                    donorName: isAnonymous ? "Anonyme" : name || "Donateur",
                    donorPhone: isAnonymous ? "---" : `${phoneCountry}${phone}`,
                    isAnonymous: isAnonymous,
                    method: "Simulation",
                    status: "success",
                    transactionId: transactionId,
                    createdAt: new Date().toISOString(),
                    type: 'money'
                };
                saveDonation(mockData);
            }, 2000);
            return;
        }

        // Intégration Réelle CinetPay
        try {
            const transactionId = `DDR-${Date.now()}`;
            window.CinetPay.setConfig({
                apikey: CINETPAY_API_KEY,
                site_id: CINETPAY_SITE_ID,
                notify_url: 'https://ddr.ci/api/notify'
            });

            window.CinetPay.getCheckout({
                transaction_id: transactionId,
                amount: Number(amount),
                currency: 'XOF',
                channels: 'ALL',
                description: `Don pour ${campaign.title}`,
                customer_name: isAnonymous ? "Anonyme" : name || "Donateur",
                customer_surname: "DDR",
                customer_email: "contact@ddr.ci",
                customer_phone_number: phone,
                customer_address: "Abidjan",
                customer_city: "Abidjan",
                customer_country: "CI",
                customer_state: "CI",
                customer_zip_code: "00225"
            });

            window.CinetPay.waitResponse((data: any) => {
                if (data.status === "ACCEPTED") {
                    const donationData = {
                        id: Date.now().toString(),
                        amount: Number(amount),
                        donorName: isAnonymous ? "Anonyme" : name || "Donateur",
                        donorPhone: isAnonymous ? "---" : `${phoneCountry}${phone}`,
                        isAnonymous: isAnonymous,
                        method: data.payment_method || "CinetPay",
                        status: "success",
                        transactionId: data.operator_id || transactionId,
                        createdAt: new Date().toISOString(),
                        type: 'money'
                    };
                    saveDonation(donationData);
                } else {
                    setErrorMsg("Le paiement a été annulé ou a échoué.");
                    setStatus('failed');
                }
            });

            window.CinetPay.onError((data: any) => {
                console.error("CinetPay Error:", data);
                setErrorMsg("Une erreur est survenue lors de l'initialisation du paiement.");
                setStatus('failed');
            });

        } catch (err) {
            console.error("CinetPay Init Error:", err);
            setErrorMsg("Impossible de charger le module de paiement.");
            setStatus('failed');
        }
    } else {
        // Don Matériel
        if (!materialDescription) {
            setErrorMsg("Veuillez décrire votre don matériel.");
            return;
        }
        setStatus('processing');
        setTimeout(() => {
            const materialData = {
                id: Date.now().toString(),
                amount: 0,
                description: materialDescription,
                donorName: isAnonymous ? "Anonyme" : name || "Donateur",
                donorPhone: `${phoneCountry}${phone}`,
                isAnonymous: isAnonymous,
                method: "Don Matériel",
                status: "success",
                transactionId: `MAT-${Date.now()}`,
                createdAt: new Date().toISOString(),
                type: 'material'
            };
            saveDonation(materialData);
        }, 1500);
    }
  }, [donationType, amount, materialDescription, isAnonymous, name, phoneCountry, phone, campaign.title]);


  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
        const dataUrl = await toPng(receiptRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `recu-don-ddr-${transactionData.transactionId}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error("Receipt error:", err);
    }
  };

  if (status === 'success' && transactionData) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-fade-in">
        <div className="max-w-md w-full space-y-8">
          {/* Receipt Card */}
          <div 
            ref={receiptRef}
            className="bg-white text-black p-8 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Watermark */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center rotate-[-30deg]">
              <span className="text-8xl font-black uppercase">DDR CI</span>
            </div>

            <div className="flex justify-between items-start mb-8 relative">
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-brand-600">
                    {transactionData.type === 'material' ? 'PROMESSE DE DON' : 'REÇU DE DON'}
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Association La DDR</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Transaction ID</p>
                <p className="text-xs font-mono font-bold">#{transactionData.transactionId}</p>
              </div>
            </div>

            <div className="space-y-6 relative">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Donateur</p>
                <p className="text-lg font-bold">{transactionData.donorName}</p>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                      {transactionData.type === 'material' ? 'Nature du don' : 'Montant'}
                  </p>
                  <p className={`${transactionData.type === 'material' ? 'text-sm' : 'text-2xl font-black'} font-bold text-brand-600`}>
                      {transactionData.type === 'material' ? transactionData.description : `${transactionData.amount.toLocaleString()} FCFA`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Date</p>
                  <p className="text-sm font-bold">{new Date(transactionData.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Projet Soutenu</p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-700">{campaign.title}</p>
                </div>
              </div>

              <div className="text-center pt-8">
                <p className="text-[10px] text-gray-400 italic">
                    {transactionData.type === 'material' 
                        ? "Nous vous contacterons sous peu pour organiser la réception. Barak Allah Oufik."
                        : "Barak Allah Oufik pour votre générosité."}
                </p>
                <p className="text-[8px] text-gray-300 mt-2 uppercase tracking-widest">Document généré par ddr.ci</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={downloadReceipt}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-xl"
            >
              <Download className="w-5 h-5" />
              Télécharger le Reçu
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 transition shadow-xl"
            >
              Retour au site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#09090b] rounded-[2.5rem] max-w-5xl w-full border border-gray-800 shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[95vh]">
        
        {/* Left Side: Campaign Context & Trust */}
        <div className="w-full lg:w-1/2 bg-[#0a0a0a] relative flex flex-col border-r border-gray-800">
          <div className="h-48 lg:h-64 overflow-hidden relative">
            <img src={campaign.imageUrl} alt="Projet École" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              URGENCE CHANTIER
            </div>
            <div className="absolute bottom-6 left-8 right-8">
              <h2 className="text-3xl font-bold text-white leading-tight mb-2 font-serif">{campaign.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Chaque brique posée est une aumône continue (Sadaqa Jariya) qui vous suivra dans l'au-delà.</p>
            </div>
          </div>
          
          <div className="p-8 lg:p-10 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Récolté</p>
                  <p className="text-2xl font-mono font-bold text-brand-500">{campaign.currentAmount.toLocaleString()} F</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Objectif</p>
                  <p className="text-lg font-mono font-bold text-gray-400">{campaign.targetAmount.toLocaleString()} F</p>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-4 overflow-hidden shadow-inner border border-gray-800">
                <div className="bg-gradient-to-r from-brand-700 via-brand-500 to-yellow-500 h-full rounded-full relative" style={{ width: `${progress}%` }}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 flex justify-between">
                <span>{Math.round(progress)}% complété</span>
                <span>Il manque <span className="text-white font-bold">{(campaign.targetAmount - campaign.currentAmount).toLocaleString()} F</span></span>
              </p>
            </div>

            {/* Trust Blocks */}
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Transparence & Impact</h4>
            <div className="grid grid-cols-1 gap-4">
              {campaign.trustIndicators.map((item, idx) => (
                <div key={idx} className="flex gap-5 items-center p-5 rounded-2xl bg-[#121214] border border-gray-800 hover:border-brand-500/30 transition-all group">
                  <div className="h-12 w-12 min-w-[3rem] rounded-2xl bg-black flex items-center justify-center text-2xl border border-gray-800 group-hover:scale-110 transition-transform text-brand-500">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-[#09090b] flex flex-col justify-center relative overflow-y-auto custom-scrollbar">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2.5 bg-gray-800/50 rounded-full hover:bg-gray-700 z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">Faire un Don</h3>
            </div>
            
            {/* Type Tabs */}
            <div className="flex bg-black p-1 rounded-2xl border border-gray-800 mb-8">
                <button 
                    type="button"
                    onClick={() => setDonationType('money')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${donationType === 'money' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    Don Financier
                </button>
                <button 
                    type="button"
                    onClick={() => setDonationType('material')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${donationType === 'material' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    Don Matériel
                </button>
            </div>
          </div>
          
          <form onSubmit={handlePayment} className="space-y-8">
            
            {donationType === 'money' ? (
                <div className="space-y-4">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Montant du don (FCFA)</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[2000, 5000, 10000].map(val => (
                        <button 
                            key={val} 
                            type="button" 
                            onClick={() => setAmount(val)}
                            className={`py-4 px-2 text-sm font-bold rounded-2xl border transition-all ${amount === val ? 'bg-brand-600 border-brand-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-black border-gray-800 text-gray-400 hover:bg-gray-900 hover:border-gray-700'}`}
                        >
                            {val.toLocaleString()} F
                        </button>
                        ))}
                    </div>
                    <div className="relative group">
                        <input 
                        type="number" 
                        required={donationType === 'money'}
                        className="block w-full bg-black border border-gray-800 rounded-2xl p-5 pl-6 pr-16 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none font-mono text-xl transition-all group-hover:border-gray-700"
                        placeholder="Autre montant..."
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold">FCFA</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Description du don</label>
                    <textarea 
                        required={donationType === 'material'}
                        className="block w-full bg-black border border-gray-800 rounded-2xl p-5 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm min-h-[120px] transition-all group-hover:border-gray-700"
                        placeholder="Ex: 50 chaises, 10 sacs de ciment, livres, etc."
                        value={materialDescription}
                        onChange={e => setMaterialDescription(e.target.value)}
                    />
                </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5 bg-[#121214] p-6 rounded-3xl border border-gray-800">
              <label className="flex items-center gap-4 cursor-pointer group select-none">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border-2 ${isAnonymous ? 'bg-brand-500 border-brand-500 scale-110' : 'border-gray-700 bg-black group-hover:border-gray-500'}`}>
                  {isAnonymous && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input 
                  type="checkbox" 
                  checked={isAnonymous} 
                  onChange={(e) => setIsAnonymous(e.target.checked)} 
                  className="hidden"
                />
                <span className={`text-sm font-bold transition-colors ${isAnonymous ? 'text-white' : 'text-gray-500'}`}>Faire ce don en <span className="text-brand-500">Anonyme</span></span>
              </label>

              <div className={`transition-all duration-500 overflow-hidden ${isAnonymous ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                <div className="pt-2">
                  <input 
                    type="text" 
                    className="block w-full bg-black border border-gray-800 rounded-2xl p-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm placeholder-gray-600 transition-all hover:border-gray-700"
                    placeholder="Votre Nom & Prénoms"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select 
                  className="bg-black border border-gray-800 rounded-2xl px-4 text-white text-sm outline-none focus:border-brand-500 hover:border-gray-700 transition-all"
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
                  className="block w-full bg-black border border-gray-800 rounded-2xl p-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm placeholder-gray-600 hover:border-gray-700 transition-all"
                  placeholder="Numéro de téléphone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-400 text-xs flex gap-3 items-center">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <button 
                type="submit" 
                disabled={status === 'processing' || !amount || (!isAnonymous && !name) || !phone}
                className="w-full flex justify-center py-5 px-6 border border-transparent rounded-2xl shadow-[0_0_30px_rgba(234,88,12,0.4)] text-lg font-bold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {status === 'processing' ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Traitement...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Heart className="w-5 h-5 fill-current" />
                    Confirmer le Don
                  </span>
                )}
              </button>
              <p className="text-center text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">
                Propulsé par CinetPay • 100% Sécurisé
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;


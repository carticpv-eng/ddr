
import React, { useState, useEffect } from 'react';
import { SCHOOL_CAMPAIGN, MOCK_DONATIONS } from '../constants';
import { Donation } from '../types';
import DonationModal from '../components/DonationModal';
import { motion } from 'framer-motion';
import { Trophy, Heart, Users, ShieldCheck, ArrowRight, Globe } from 'lucide-react';

const Donations = () => {
    const [showModal, setShowModal] = useState(false);
    const [donations] = useState<Donation[]>(() => {
        const stored = localStorage.getItem('ddr_donations');
        const realDonations = stored ? JSON.parse(stored) : [];
        const all = [...realDonations, ...MOCK_DONATIONS];
        all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return all.slice(0, 10);
    });
    const campaign = SCHOOL_CAMPAIGN;
    const progress = (campaign.currentAmount / campaign.targetAmount) * 100;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block py-1.5 px-4 rounded-full bg-brand-900/30 border border-brand-500/30 text-brand-500 text-xs font-bold tracking-[0.2em] uppercase mb-6"
                    >
                        Sadaqa Jariya
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold text-white mb-6 font-serif"
                    >
                        Investir pour <span className="text-brand-500">l'Éternité</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        Votre don n'est pas une dépense, c'est un placement auprès d'Allah pour la construction d'un complexe éducatif et spirituel majeur.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Campaign Details */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* Main Campaign Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#0f0f11] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <div className="h-80 relative overflow-hidden group">
                                <img 
                                    src={campaign.imageUrl} 
                                    alt={campaign.title} 
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <h2 className="text-3xl font-bold text-white mb-2 font-serif">{campaign.title}</h2>
                                    <p className="text-gray-300 text-sm flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-brand-500" />
                                        Abidjan, Côte d'Ivoire
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 md:p-10">
                                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                                    {campaign.description}
                                </p>

                                {/* Progress Stats */}
                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Récolté</p>
                                            <p className="text-4xl font-mono font-bold text-white">{campaign.currentAmount.toLocaleString()} <span className="text-brand-500 text-xl">F</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Objectif</p>
                                            <p className="text-2xl font-mono font-bold text-gray-400">{campaign.targetAmount.toLocaleString()} F</p>
                                        </div>
                                    </div>

                                    <div className="relative h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-800 shadow-inner">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-700 via-brand-500 to-yellow-500 rounded-full"
                                        >
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                                        </motion.div>
                                    </div>

                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-brand-500">{Math.round(progress)}% complété</span>
                                        <span className="text-gray-500">Il manque {(campaign.targetAmount - campaign.currentAmount).toLocaleString()} F</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowModal(true)}
                                    className="w-full py-5 bg-brand-600 text-white font-bold rounded-2xl shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:bg-brand-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xl uppercase tracking-widest"
                                >
                                    <Heart className="w-6 h-6 fill-current" />
                                    Faire un Don Maintenant
                                </button>
                            </div>
                        </motion.div>

                        {/* Trust Indicators Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {campaign.trustIndicators.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="bg-[#121214] border border-gray-800 p-6 rounded-3xl hover:border-brand-500/30 transition-colors group"
                                >
                                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <h4 className="text-white font-bold mb-2">{item.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Recent Donors & Transparency */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Recent Donors List */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#0f0f11] border border-gray-800 rounded-[2.5rem] p-8 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-brand-500" />
                                    Derniers Donateurs
                                </h3>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Temps réel</span>
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {donations.map((don, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-gray-800/50 hover:border-brand-500/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${don.isAnonymous ? 'bg-gray-900 border-gray-700 text-gray-500' : 'bg-brand-900/20 border-brand-500/30 text-brand-500'}`}>
                                                {don.isAnonymous ? '?' : don.donorName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${don.isAnonymous ? 'text-gray-500 italic' : 'text-white'}`}>
                                                    {don.donorName || 'Anonyme'}
                                                </p>
                                                <p className="text-[10px] text-gray-600 uppercase tracking-widest">{new Date(don.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-brand-500 font-mono font-bold">+{don.amount.toLocaleString()} F</p>
                                            <p className="text-[10px] text-gray-600 uppercase">{don.method}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                                <p className="text-xs text-gray-500 italic">"Celui qui construit une mosquée pour Allah, Allah lui construit une demeure au Paradis."</p>
                            </div>
                        </motion.div>

                        {/* Security & Transparency Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-brand-900/10 border border-brand-500/20 rounded-[2rem] p-8"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-brand-500/20 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-brand-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">100% Sécurisé</h4>
                                    <p className="text-brand-400 text-xs uppercase font-bold tracking-widest">Paiement Certifié</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Vos transactions sont traitées via CinetPay, leader du paiement en Afrique de l'Ouest. Nous ne stockons aucune information bancaire.
                            </p>
                            <div className="flex flex-wrap gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {showModal && <DonationModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Donations;

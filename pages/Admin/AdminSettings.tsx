
import React from 'react';

const AdminSettings = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
       <div className="border-b border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-white">Paramètres</h1>
            <p className="text-gray-500 mt-1">Configuration générale de la plateforme DDR.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#121214] p-8 rounded-2xl border border-gray-800">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <span className="text-brand-500">⚙️</span> Général
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nom du site</label>
                        <input type="text" value="La DDR - Dawa Dans la Rue" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white" readOnly />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email de Contact</label>
                        <input type="email" value="ladawahdanslarue.ddr@gmail.com" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white" readOnly />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Téléphone Principal</label>
                        <input type="tel" value="+225 07 47 32 04 55" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white" readOnly />
                    </div>
                </div>
            </div>

            <div className="bg-[#121214] p-8 rounded-2xl border border-gray-800">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <span className="text-red-500">🔒</span> Sécurité & API
                </h3>
                <div className="space-y-6">
                     <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-xl">
                         <p className="text-yellow-500 text-sm font-bold mb-1">CinetPay (Paiements)</p>
                         <p className="text-xs text-gray-400">Statut: <span className="text-green-500">Actif (Simulation)</span></p>
                     </div>
                     <div className="p-4 bg-brand-900/10 border border-brand-500/20 rounded-xl">
                         <p className="text-brand-500 text-sm font-bold mb-1">Google Gemini (IA)</p>
                         <p className="text-xs text-gray-400">Statut: <span className="text-green-500">Connecté</span></p>
                     </div>
                     <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold text-sm transition">
                         Changer mot de passe Admin
                     </button>
                </div>
            </div>
            
            <div className="lg:col-span-2 bg-red-900/10 border border-red-900/30 p-8 rounded-2xl flex items-center justify-between">
                <div>
                    <h3 className="text-red-500 font-bold mb-1">Zone de Danger</h3>
                    <p className="text-xs text-gray-500">Activer le mode maintenance coupera l'accès public au site.</p>
                </div>
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg shadow-red-900/20">
                    Activer Maintenance
                </button>
            </div>
        </div>
    </div>
  );
};

export default AdminSettings;

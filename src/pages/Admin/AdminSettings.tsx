
import React, { useState, useEffect, useRef } from 'react';
import { getLogs, clearLogs, LogEntry } from '../../services/logService';

const AdminSettings = () => {
  const [isMaintenance, setIsMaintenance] = useState(() => localStorage.getItem('ddr_maintenance') === 'true');
  const [logs, setLogs] = useState<LogEntry[]>(() => getLogs());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      // Rafraichir les logs toutes les 5 secondes (Mode Espion)
      const interval = setInterval(() => {
          setLogs(getLogs());
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  const toggleMaintenance = () => {
      const newState = !isMaintenance;
      setIsMaintenance(newState);
      localStorage.setItem('ddr_maintenance', String(newState));
      
      if (newState) {
          alert("⚠️ MODE MAINTENANCE ACTIVÉ. Le site public est maintenant inaccessible aux visiteurs.");
      } else {
          alert("✅ MODE MAINTENANCE DÉSACTIVÉ. Le site est de nouveau en ligne.");
      }
  };

  const handleClearLogs = () => {
      if (confirm("Effacer tout l'historique d'activité ?")) {
          clearLogs();
          setLogs([]);
      }
  };

  const clearLocalData = () => {
      if (window.confirm("⚠️ ATTENTION : Cela va effacer tous les rendez-vous, témoignages et dons enregistrés localement sur ce navigateur. Continuer ?")) {
          localStorage.removeItem('ddr_appointments');
          localStorage.removeItem('ddr_inbox');
          localStorage.removeItem('ddr_donations');
          localStorage.removeItem('ddr_activity_logs');
          alert("Données effacées avec succès.");
          window.location.reload();
      }
  };

  const handleExportData = () => {
      const data = {
          appointments: JSON.parse(localStorage.getItem('ddr_appointments') || '[]'),
          inbox: JSON.parse(localStorage.getItem('ddr_inbox') || '[]'),
          donations: JSON.parse(localStorage.getItem('ddr_donations') || '[]'),
          logs: JSON.parse(localStorage.getItem('ddr_activity_logs') || '[]'),
          exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ddr_backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result as string);
              
              if (data.appointments) localStorage.setItem('ddr_appointments', JSON.stringify(data.appointments));
              if (data.inbox) localStorage.setItem('ddr_inbox', JSON.stringify(data.inbox));
              if (data.donations) localStorage.setItem('ddr_donations', JSON.stringify(data.donations));
              if (data.logs) localStorage.setItem('ddr_activity_logs', JSON.stringify(data.logs));

              alert("✅ Restauration réussie ! Les données ont été mises à jour.");
              window.location.reload();
          } catch (error) {
              console.error(error);
              alert("Erreur : Le fichier de sauvegarde est invalide.");
          }
      };
      reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
       <div className="border-b border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-white">Paramètres & Sécurité</h1>
            <p className="text-gray-500 mt-1">Gérez le site, sauvegardez vos données et surveillez l'activité.</p>
        </div>

        {/* SECTION SAUVEGARDE */}
        <div className="bg-[#121214] border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 rounded-full blur-[80px]"></div>
            <h3 className="text-white font-bold text-lg mb-6 relative z-10 flex items-center gap-2">
                💾 Sauvegarde & Migration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                    <h4 className="text-gray-300 font-bold mb-2">Exporter les données</h4>
                    <p className="text-gray-500 text-xs mb-4">Téléchargez un fichier contenant tous les RDV, Messages et Dons actuels. Gardez-le en lieu sûr.</p>
                    <button 
                        onClick={handleExportData}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg text-sm transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Télécharger Backup (.json)
                    </button>
                </div>

                <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                    <h4 className="text-gray-300 font-bold mb-2">Restaurer une sauvegarde</h4>
                    <p className="text-gray-500 text-xs mb-4">Importez un fichier de sauvegarde pour récupérer vos données sur cet ordinateur.</p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImportFile} 
                        accept=".json" 
                        className="hidden" 
                    />
                    <button 
                        onClick={handleImportClick}
                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg text-sm transition flex items-center justify-center gap-2 border border-gray-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        Importer un fichier
                    </button>
                </div>
            </div>
        </div>

        {/* SECTION ESPION - LOGS */}
        <div className="bg-[#0f0f11] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="bg-black/50 p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-brand-500 font-mono font-bold text-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    JOURNAL D'ACTIVITÉ (L'ESPION)
                </h3>
                <button onClick={handleClearLogs} className="text-xs text-gray-500 hover:text-white underline">Effacer l'historique</button>
            </div>
            <div className="h-96 overflow-y-auto p-0 custom-scrollbar font-mono text-sm bg-black">
                {logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-600 italic">Aucune activité enregistrée pour le moment.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[#121214] text-gray-500 text-xs uppercase sticky top-0">
                            <tr>
                                <th className="p-3">Heure</th>
                                <th className="p-3">Appareil</th>
                                <th className="p-3">Action</th>
                                <th className="p-3">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-900/50 transition-colors">
                                    <td className="p-3 text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="p-3 text-gray-400 text-xs">{log.device}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            log.category === 'success' ? 'bg-green-900/30 text-green-500' :
                                            log.category === 'danger' ? 'bg-red-900/30 text-red-500' :
                                            log.category === 'warning' ? 'bg-yellow-900/30 text-yellow-500' :
                                            'bg-blue-900/30 text-blue-500'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-300 truncate max-w-xs" title={log.details}>{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`lg:col-span-2 border p-8 rounded-2xl flex items-center justify-between transition-colors ${isMaintenance ? 'bg-red-900/20 border-red-500/50' : 'bg-green-900/10 border-gray-800'}`}>
                <div>
                    <h3 className={`font-bold mb-1 text-lg ${isMaintenance ? 'text-red-500' : 'text-green-500'}`}>
                        {isMaintenance ? '🔴 SITE EN MAINTENANCE' : '🟢 SITE EN LIGNE'}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {isMaintenance 
                            ? "L'accès public est bloqué. Seuls les administrateurs peuvent accéder au site." 
                            : "Le site est visible par tout le monde. Cliquez pour activer le mode maintenance."}
                    </p>
                </div>
                <button 
                    onClick={toggleMaintenance}
                    className={`px-8 py-4 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2 uppercase tracking-wider text-sm ${isMaintenance ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'}`}
                >
                    {isMaintenance ? 'Désactiver Maintenance' : 'Activer Maintenance'}
                </button>
            </div>

            {/* ZONE DANGER */}
            <div className="lg:col-span-2 bg-red-900/10 border border-red-900/30 p-8 rounded-2xl">
                <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
                    <span>⚠️</span> Zone de Danger
                </h3>
                <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        Réinitialiser toutes les données enregistrées (RDV, Messages, Dons) sur ce navigateur.
                    </p>
                    <button 
                        onClick={clearLocalData}
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-sm transition"
                    >
                        Effacer les données locales
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminSettings;

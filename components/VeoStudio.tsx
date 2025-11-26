import React, { useState, useEffect } from 'react';
import { generatePromoVideo } from '../services/geminiService';

const VeoStudio = () => {
  const [prompt, setPrompt] = useState('Une intro cinématique pour un débat religieux en Afrique, coucher de soleil doré, foule attentive, atmosphère de paix, 4k, photoréaliste.');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const [hasKey, setHasKey] = useState(false);

  // Vérifier la présence de la clé au chargement
  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
          setHasKey(true);
      }
  };

  const handleConnect = async () => {
      if (window.aistudio) {
          try {
            await window.aistudio.openSelectKey();
            // On assume le succès pour éviter les race conditions, comme recommandé
            setHasKey(true);
            setError(null);
          } catch (e) {
              console.error(e);
          }
      }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatusText('Initialisation de Veo...');

    try {
      // 1. Démarrage
      setStatusText('Scénarisation et génération des frames...');
      const url = await generatePromoVideo(prompt);
      
      // 2. Succès
      setVideoUrl(url);
      setStatusText('');
    } catch (e: any) {
      if (e.message === 'KEY_REQUIRED') {
          setHasKey(false);
          setError("Veuillez connecter une clé API Google Cloud payante pour utiliser Veo.");
      } else {
          setError(e.message || "Erreur lors de la génération. Vérifiez vos quotas.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121214] p-8 rounded-2xl shadow-xl border border-gray-800 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4 relative z-10">
        <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
             <span className="text-xl">🎬</span>
        </div>
        <div>
            <h2 className="text-xl font-bold text-white">Studio Vidéo (Veo)</h2>
            <p className="text-xs text-gray-500">Générateur vidéo IA haute définition</p>
        </div>
        {!hasKey && (
             <span className="ml-auto px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase rounded border border-red-500/20">Non Connecté</span>
        )}
        {hasKey && (
             <span className="ml-auto px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded border border-green-500/20">Prêt</span>
        )}
      </div>
      
      {!hasKey ? (
          <div className="text-center py-8 space-y-4">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 text-sm text-gray-400 mb-4">
                  ⚠️ La génération de vidéo nécessite une clé API Google Cloud reliée à un projet payant (Billing Enabled).
              </div>
              <button 
                onClick={handleConnect}
                className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition shadow-lg flex items-center justify-center gap-2"
              >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.013-1.147 8.053-3.24 2.08-2.08 2.72-5.027 2.72-7.44 0-.733-.053-1.44-.16-2.12h-10.61z"/></svg>
                  Connecter mon compte Google
              </button>
          </div>
      ) : (
        <div className="space-y-4 relative z-10">
            <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Prompt Vidéo</label>
            <textarea 
                className="w-full bg-black border border-gray-700 rounded-xl p-4 h-32 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-700 transition-all text-sm leading-relaxed"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez la scène..."
                disabled={loading}
            />
            </div>

            <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white py-4 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-bold text-sm uppercase tracking-wider shadow-lg shadow-purple-900/30 transition-all"
            >
                {loading ? (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Génération en cours...</span>
                        </div>
                        <span className="text-[10px] text-purple-200 font-normal">{statusText}</span>
                    </div>
                ) : "🎬 Générer la vidéo (Veo)"}
            </button>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl text-sm flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {videoUrl && (
                <div className="mt-6 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wider">Résultat</h3>
                        <a href={videoUrl} download="ddr-promo.mp4" className="text-xs text-purple-400 hover:text-purple-300 font-bold underline">Télécharger MP4</a>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-700 shadow-2xl relative group">
                        <video 
                            src={videoUrl} 
                            controls 
                            autoPlay 
                            loop 
                            className="w-full aspect-video bg-black" 
                        />
                    </div>
                </div>
            )}
        </div>
      )}
      
      <div className="mt-6 text-[10px] text-gray-600 text-center border-t border-gray-800 pt-4">
          Propulsé par Google Veo 3.1 • Résolution 720p • Format 16:9
      </div>
    </div>
  );
};

export default VeoStudio;
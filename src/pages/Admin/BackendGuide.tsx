import React from 'react';
import { BACKEND_RULES, BACKEND_FUNCTIONS } from '../../constants';

const BackendGuide = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Code copié !');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Backend & Configuration</h1>
        <p className="text-gray-600">
            Voici les fichiers nécessaires pour configurer votre projet Firebase. Copiez ces codes dans votre projet local.
        </p>
      </div>

      {/* Firestore Rules */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">1. Règles de Sécurité Firestore (firestore.rules)</h2>
            <button 
                onClick={() => copyToClipboard(BACKEND_RULES)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
            >
                Copier
            </button>
        </div>
        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono">{BACKEND_RULES}</pre>
        </div>
      </div>

      {/* Cloud Functions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">2. Cloud Functions (functions/index.js)</h2>
             <button 
                onClick={() => copyToClipboard(BACKEND_FUNCTIONS)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
            >
                Copier
            </button>
        </div>
        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
            <pre className="text-blue-300 text-sm font-mono">{BACKEND_FUNCTIONS}</pre>
        </div>
      </div>

       <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2">Instructions de déploiement</h3>
          <ol className="list-decimal ml-5 text-sm text-yellow-800 space-y-1">
              <li>Installez Firebase CLI : <code>npm install -g firebase-tools</code></li>
              <li>Connectez-vous : <code>firebase login</code></li>
              <li>Initialisez : <code>firebase init</code> (Sélectionnez Firestore, Functions, Storage)</li>
              <li>Remplacez le contenu des fichiers générés par ceux ci-dessus.</li>
              <li>Déployez : <code>firebase deploy</code></li>
          </ol>
       </div>
    </div>
  );
};

export default BackendGuide;

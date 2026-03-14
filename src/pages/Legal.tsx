
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Legal = () => {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  useEffect(() => {
      window.scrollTo(0,0);
  }, [location]);

  return (
    <div className="bg-black min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[#121214] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-brand-500/30 pb-4">
            {isPrivacy ? 'Politique de Confidentialité' : 'Mentions Légales'}
        </h1>

        <div className="space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">
            {!isPrivacy ? (
                <>
                    <section>
                        <h2 className="text-xl font-bold text-brand-500 mb-2">1. Éditeur du site</h2>
                        <p>
                            Le site "La DDR" (Dawa Dans la Rue) est édité par l'Association DDR, organisation à but non lucratif enregistrée en Côte d'Ivoire.
                            <br/><strong>Siège Social :</strong> Yopougon Andokoi, Abidjan.
                            <br/><strong>Email :</strong> ladawahdanslarue.ddr@gmail.com
                            <br/><strong>Téléphone :</strong> +225 07 47 32 04 55
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-brand-500 mb-2">2. Hébergement</h2>
                        <p>
                            Ce site est hébergé sur les infrastructures de Google Firebase / Vercel.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-brand-500 mb-2">3. Propriété Intellectuelle</h2>
                        <p>
                            L'ensemble des contenus (textes, vidéos, images) est la propriété exclusive de la DDR ou de ses partenaires. Toute reproduction sans autorisation est interdite.
                        </p>
                    </section>
                </>
            ) : (
                <>
                    <section>
                        <h2 className="text-xl font-bold text-brand-500 mb-2">1. Collecte des données</h2>
                        <p>
                            Nous collectons les informations que vous nous fournissez volontairement via les formulaires de contact, de don ou de conversion (Nom, Téléphone, Ville).
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-brand-500 mb-2">2. Utilisation des données</h2>
                        <p>
                            Vos données sont utilisées uniquement pour :
                            <ul className="list-disc ml-5 mt-2 space-y-1">
                                <li>Vous recontacter suite à une demande de RDV.</li>
                                <li>Traiter vos dons via les passerelles de paiement sécurisées.</li>
                                <li>Vous informer des activités de la DDR (si inscrit).</li>
                            </ul>
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-brand-500 mb-2">3. Protection</h2>
                        <p>
                            Nous ne vendons ni ne louons vos données à des tiers. Les informations de paiement sont traitées exclusivement par nos partenaires certifiés (CinetPay, etc.) et ne sont pas stockées sur nos serveurs.
                        </p>
                    </section>
                </>
            )}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">Dernière mise à jour : {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Legal;

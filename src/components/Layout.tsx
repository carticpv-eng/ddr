
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DonationModal from './DonationModal';
import RadioPlayer from './RadioPlayer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDonate, setShowDonate] = useState(() => location.hash === '#donate');

  // Écoute globale du hash #donate pour ouvrir la modale depuis d'autres pages ou liens
  useEffect(() => {
    if (location.hash === '#donate') {
      setTimeout(() => setShowDonate(true), 0);
    }
  }, [location.hash]);

  const handleCloseDonate = () => {
    setShowDonate(false);
    // Si le hash était présent, on le nettoie
    if (location.hash === '#donate') {
        navigate(location.pathname, { replace: true });
    }
  };

  const isActive = (path: string) => location.pathname === path ? "text-brand-500 font-bold" : "text-gray-300 hover:text-brand-400";

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Discussion IA', path: '/chat' },
    { name: 'Savoir', path: '/learning' },
    { name: 'Le Coran', path: '/khatma' }, // RENOMMAGE ICI
    { name: 'Outils', path: '/tools' },
    { name: 'Actualités', path: '/news' },
    { name: 'Débats', path: '/debates' },
    { name: 'Témoignages', path: '/conversions' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 font-sans relative pb-0">
      {/* Header */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                {/* Logo Image */}
                <img 
                    src="/logo.png" 
                    alt="Logo La DDR" 
                    className="h-14 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(234,88,12,0.5)] transition-all group-hover:drop-shadow-[0_0_12px_rgba(234,88,12,0.8)]"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/150x150/ea580c/000000?text=DDR";
                    }}
                />
                <div className="flex flex-col justify-center">
                    <span className="font-bold text-2xl tracking-tight text-white leading-none">La DDR</span>
                    <span className="text-xs text-brand-500 font-medium tracking-widest uppercase hidden sm:block">Pour ma foi et pour ma religion</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2 py-2 text-sm uppercase tracking-wider font-medium transition-all duration-300 ${isActive(link.path)} ${link.name === 'Discussion IA' ? 'text-brand-400 border border-brand-500/30 rounded-full px-4 hover:bg-brand-900/20' : ''} ${link.name === 'Le Coran' ? 'text-gold-500' : ''}`}
                >
                  {link.name === 'Discussion IA' ? (
                      <span className="flex items-center gap-2">
                          <span className="text-lg">💬</span> {link.name}
                      </span>
                  ) : link.name === 'Le Coran' ? (
                      <span className="flex items-center gap-1">
                          <span>📖</span> {link.name}
                      </span>
                  ) : link.name}
                </Link>
              ))}

              {/* BOUTON SPECIAL CONVERSION */}
              <Link
                to="/shahada"
                className="ml-2 px-3 py-2 bg-gradient-to-r from-gold-600 to-yellow-600 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:scale-105 transition-all flex items-center gap-2"
              >
                 <span>☝️</span> Convertir
              </Link>

              <button 
                onClick={() => setShowDonate(true)}
                className="ml-2 px-3 py-2 border border-brand-500 rounded-full text-xs font-bold text-brand-500 hover:bg-brand-600 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(234,88,12,0.2)] hover:shadow-[0_0_20px_rgba(234,88,12,0.6)] cursor-pointer"
              >
                Faire un Don
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-brand-500 focus:outline-none"
              >
                <span className="sr-only">Ouvrir menu</span>
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-800 absolute w-full z-40 shadow-2xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)}`}
                >
                  {link.name}
                </Link>
              ))}
              
              <Link
                to="/shahada"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center block px-3 py-3 rounded-md text-base font-bold text-black bg-gradient-to-r from-gold-600 to-yellow-600 mt-4 mb-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                 ☝️ Je veux me convertir
              </Link>

              <button
                 onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowDonate(true);
                 }}
                 className="w-full text-left block px-3 py-2 rounded-md text-base font-bold text-black bg-brand-500 mt-2 cursor-pointer"
              >
                Faire un Don
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-black relative z-10 pb-40">
        {children}
      </main>

      {/* Footer Professional */}
      <footer className="bg-[#020202] border-t border-gray-900 pt-16 pb-32 relative overflow-hidden z-20">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-900 via-brand-500 to-brand-900 opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                
                {/* Col 1: Brand & Identity */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="DDR" className="h-12 w-auto" />
                        <div>
                            <span className="block text-2xl font-bold text-white tracking-tight">La DDR</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Depuis 2015</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        L'association de référence pour le dialogue interreligieux en Côte d'Ivoire. Nous prônons la paix par le savoir et la fraternité par la vérité.
                    </p>
                    <p className="text-brand-500 font-serif italic text-sm">
                        "Pour ma foi et pour ma religion"
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href="https://www.facebook.com/Oustazdianeoff" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#1877F2] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                        <a href="https://www.youtube.com/@ddrlavraiechaine" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#FF0000] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                        <a href="https://www.tiktok.com/@ddrofficielle" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.49-3.35-3.98-5.6-.48-2.24-.08-4.62 1.09-6.64 1.19-2.05 3.29-3.56 5.6-4.05 1.58-.33 3.24-.18 4.79.46V11c-1.28-.65-2.73-.8-4.13-.39-1.27.37-2.33 1.25-2.94 2.42-.62 1.18-.63 2.61-.02 3.8.61 1.2 1.71 2.11 3.01 2.51 1.34.41 2.82.25 4.05-.44 1.24-.7 2.05-2 2.1-3.41.06-2.95.02-5.9.03-8.85h-.01c-.13-.01-.2.01-.53-.02-.85-.22-1.32-.87-1.6-1.58-.23-.6-.32-1.23-.32-1.85V3.06c0-.26.02-.51.05-.76.08-.72.4-1.37.94-1.87.53-.49 1.18-.76 1.91-.79h.03z"/></svg></a>
                    </div>
                </div>

                {/* Col 2: Navigation */}
                <div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-gray-800 pb-2 inline-block">Plan du site</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/" className="text-gray-400 hover:text-brand-500 transition flex items-center gap-2"><span>›</span> Accueil</Link></li>
                        <li><Link to="/khatma" className="text-gray-400 hover:text-brand-500 transition flex items-center gap-2"><span>›</span> Le Coran (Lecture)</Link></li>
                        <li><Link to="/learning" className="text-gray-400 hover:text-brand-500 transition flex items-center gap-2"><span>›</span> Centre du Savoir</Link></li>
                        <li><Link to="/tools" className="text-gray-400 hover:text-brand-500 transition flex items-center gap-2"><span>›</span> Outils du Croyant</Link></li>
                        <li><Link to="/debates" className="text-gray-400 hover:text-brand-500 transition flex items-center gap-2"><span>›</span> Médiathèque</Link></li>
                        <li><Link to="/news" className="text-gray-400 hover:text-brand-500 transition flex items-center gap-2"><span>›</span> Presse & Actualités</Link></li>
                        <li><Link to="/appointments" className="text-gray-400 hover:text-brand-500 transition flex items-center gap-2"><span>›</span> Contact & RDV</Link></li>
                    </ul>
                </div>

                {/* Col 3: Siège Social */}
                <div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-gray-800 pb-2 inline-block">Siège Social</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-brand-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                <strong className="text-white block">Yopougon Andokoi</strong>
                                En face du commissariat 23ème Arrondissement<br/>
                                Abidjan, Côte d'Ivoire
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-brand-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>
                            <div className="text-sm text-gray-400">
                                <a href="tel:+2250747320455" className="block hover:text-white transition">+225 07 47 32 04 55</a>
                                <a href="tel:+2250505408685" className="block hover:text-white transition">+225 05 05 40 86 85</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-brand-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
                            <a href="mailto:ladawahdanslarue.ddr@gmail.com" className="text-sm text-gray-400 hover:text-white transition break-all">ladawahdanslarue.ddr@gmail.com</a>
                        </div>
                    </div>
                </div>

                {/* Col 4: Newsletter & Admin */}
                <div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-gray-800 pb-2 inline-block">Restez connecté</h3>
                    <p className="text-gray-500 text-xs mb-4">Recevez les dates des prochains débats.</p>
                    <div className="flex flex-col gap-2">
                        <input type="email" placeholder="Votre email" className="bg-gray-900 border border-gray-800 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition" />
                        <button className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider py-2 rounded transition">
                            S'inscrire
                        </button>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <Link to="/shahada" className="block bg-gradient-to-r from-gold-600 to-yellow-600 text-black text-center font-bold text-sm py-3 rounded-lg hover:brightness-110 transition shadow-lg">
                            Je veux me convertir ☝️
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <p>&copy; {new Date().getFullYear()} Association La DDR. Tous droits réservés.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link to="/admin" className="hover:text-gray-400 transition">Administration</Link>
                    <span className="text-gray-800">|</span>
                    <Link to="/legal/mentions" className="hover:text-gray-400 transition">Mentions Légales</Link>
                    <span className="text-gray-800">|</span>
                    <Link to="/legal/privacy" className="hover:text-gray-400 transition">Politique de Confidentialité</Link>
                </div>
            </div>
        </div>
      </footer>

      {/* Radio Player Fixed Bottom */}
      <RadioPlayer />

      {/* MODAL GLOBAL DE DON */}
      {showDonate && <DonationModal onClose={handleCloseDonate} />}
    </div>
  );
};

export default Layout;

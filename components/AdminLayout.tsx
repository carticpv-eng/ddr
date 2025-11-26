
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Vue d\'ensemble', path: '/admin/dashboard', icon: '📊' },
    { name: 'Campagne École', path: '/admin/campaigns', icon: '🏗️' },
    { name: 'Transactions', path: '/admin/donations', icon: '💳' },
    { name: 'Contenu', path: '/admin/content', icon: '📰' },
    { name: 'Rendez-vous', path: '/admin/appointments', icon: '📅' },
    { name: 'Paramètres', path: '/admin/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path ? "bg-brand-500/10 text-brand-500 border-r-2 border-brand-500" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200";

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans selection:bg-brand-500/30 selection:text-brand-500">
      {/* Sidebar Pro */}
      <div className="w-72 bg-[#09090b] border-r border-gray-800 flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-8 border-b border-gray-800">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-brand-900/50">D</div>
             <span className="text-white text-md font-bold tracking-tight">DDR <span className="text-gray-500 font-normal">Workspace</span></span>
          </div>
        </div>
        
        <div className="p-4">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4 px-4">Menu Principal</p>
            <nav className="space-y-1">
            {menuItems.map((item) => (
                <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-md ${isActive(item.path)}`}
                >
                <span className="mr-3 text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.name}
                </Link>
            ))}
            </nav>
        </div>
        
        <div className="mt-auto border-t border-gray-800 p-4">
             <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/50 rounded-xl border border-gray-800">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-yellow-500 border border-white/10"></div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Admin Principal</span>
                    <span className="text-[10px] text-green-500 font-medium">● En ligne</span>
                </div>
             </div>
             <Link to="/" className="mt-4 block text-center text-xs text-gray-500 hover:text-white transition">← Retour au site public</Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#09090b] relative">
        <header className="bg-[#09090b]/80 backdrop-blur-md border-b border-gray-800 h-16 flex items-center justify-between px-6 md:hidden sticky top-0 z-40">
             <span className="font-bold text-white">DDR Admin</span>
             <Link to="/" className="text-xs text-brand-500 uppercase font-bold">Quitter</Link>
        </header>
        
        <main className="p-8 text-gray-200 max-w-7xl mx-auto w-full">
            {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

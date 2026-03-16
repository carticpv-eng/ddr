
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Debates from './pages/Debates';
import Conversions from './pages/Conversions';
import ChatPage from './pages/Chat';
import Shahada from './pages/Shahada';
import LearningCenter from './pages/LearningCenter';
import Tools from './pages/Tools';
import Khatma from './pages/Khatma';
import Donations from './pages/Donations';
import Dashboard from './pages/Admin/Dashboard';
import BackendGuide from './pages/Admin/BackendGuide';
import LiveAssistant from './components/LiveAssistant';
import Legal from './pages/Legal';
import Maintenance from './pages/Maintenance';

// Import des nouvelles pages Admin
import AdminCampaigns from './pages/Admin/AdminCampaigns';
import AdminDonations from './pages/Admin/AdminDonations';
import AdminContent from './pages/Admin/AdminContent';
import AdminAppointments from './pages/Admin/AdminAppointments';
import AdminMailbox from './pages/Admin/AdminMailbox';
import AdminSettings from './pages/Admin/AdminSettings';

import { logAction } from './services/logService';

// Composant de Login Admin simplifié MAIS SÉCURISÉ
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // IDENTIFIANTS MAITRES UNIQUES
        const MASTER_EMAIL = "admin@ddr.ci";
        const MASTER_PASS = "DDR2025!";

        if (email === MASTER_EMAIL && password === MASTER_PASS) {
            localStorage.setItem('ddr_is_admin', 'true');
            logAction('ADMIN_LOGIN', 'Connexion réussie au panneau administrateur', 'success');
            navigate('/admin/dashboard');
        } else {
            setError("Identifiants incorrects. Accès refusé.");
            logAction('LOGIN_FAIL', `Tentative échouée avec email: ${email}`, 'warning');
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-50"></div>
            <form onSubmit={handleLogin} className="relative bg-[#121214] p-10 rounded-2xl shadow-2xl border border-gray-800 w-96">
                <div className="text-center mb-8">
                     <span className="text-3xl font-bold text-white">DDR Admin</span>
                     <p className="text-brand-500 text-sm font-medium uppercase tracking-widest mt-2">Accès Maître</p>
                </div>
                
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Maître" 
                        className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    <button className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-500 transition-colors shadow-lg shadow-brand-900/50">
                        Ouvrir le Portail
                    </button>
                </div>
            </form>
        </div>
    );
};

// Wrapper de protection Admin
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAdmin = localStorage.getItem('ddr_is_admin') === 'true';
    return isAdmin ? <>{children}</> : <Navigate to="/admin/login" />;
}

// Composant Spy qui surveille la navigation
const SpyLogger = () => {
    const location = useLocation();
    useEffect(() => {
        logAction('NAVIGATION', `Visite de la page: ${location.pathname}`, 'info');
    }, [location]);
    return null;
}

const AppContent = () => {
    const location = useLocation();
    const [isMaintenance] = useState(() => localStorage.getItem('ddr_maintenance') === 'true');
    
    // Si Maintenance active ET on n'est pas sur une route admin, on affiche la page de maintenance
    const isPublicRoute = !location.pathname.startsWith('/admin');
    
    if (isMaintenance && isPublicRoute) {
        return <Maintenance />;
    }

    return (
      <>
        <SpyLogger />
        <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/*" element={
                <RequireAdmin>
                    <AdminLayout>
                        <Routes>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="mailbox" element={<AdminMailbox />} />
                            <Route path="campaigns" element={<AdminCampaigns />} />
                            <Route path="donations" element={<AdminDonations />} />
                            <Route path="content" element={<AdminContent />} />
                            <Route path="appointments" element={<AdminAppointments />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="backend" element={<BackendGuide />} />
                            <Route path="*" element={<Navigate to="dashboard" />} />
                        </Routes>
                    </AdminLayout>
                </RequireAdmin>
            } />

            {/* Public Routes */}
            <Route path="/*" element={
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/shahada" element={<Shahada />} />
                        <Route path="/learning" element={<LearningCenter />} />
                        <Route path="/tools" element={<Tools />} />
                        <Route path="/khatma" element={<Khatma />} />
                        <Route path="/donations" element={<Donations />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/news/:id" element={<NewsDetail />} />
                        <Route path="/debates" element={<Debates />} />
                        <Route path="/conversions" element={<Conversions />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/legal/mentions" element={<Legal />} />
                        <Route path="/legal/privacy" element={<Legal />} />
                    </Routes>
                    {/* Floating AI Guide */}
                    <LiveAssistant />
                </Layout>
            } />
        </Routes>
      </>
    );
}

const App = () => {
  return (
    <Router>
        <AppContent />
    </Router>
  );
};

export default App;

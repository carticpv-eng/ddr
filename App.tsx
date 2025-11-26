
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import News from './pages/News';
import Debates from './pages/Debates';
import Conversions from './pages/Conversions';
import ChatPage from './pages/Chat';
import Shahada from './pages/Shahada';
import LearningCenter from './pages/LearningCenter';
import Dashboard from './pages/Admin/Dashboard';
import BackendGuide from './pages/Admin/BackendGuide';
import LiveAssistant from './components/LiveAssistant';

// Import des nouvelles pages Admin
import AdminCampaigns from './pages/Admin/AdminCampaigns';
import AdminDonations from './pages/Admin/AdminDonations';
import AdminContent from './pages/Admin/AdminContent';
import AdminAppointments from './pages/Admin/AdminAppointments';
import AdminSettings from './pages/Admin/AdminSettings';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Force redirect to Home on first load if not explicitly on a route
  useEffect(() => {
    // This logic is handled by Router, but we can ensure clean slate if needed
  }, []);

  // Simple Admin Login Simulation
  const Login = () => {
    const [email, setEmail] = useState('');
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdmin(true); // Accept any login for demo
    };
    if (isAdmin) return <Navigate to="/admin/dashboard" />;
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-50"></div>
            <form onSubmit={handleLogin} className="relative bg-[#121214] p-10 rounded-2xl shadow-2xl border border-gray-800 w-96">
                <div className="text-center mb-8">
                     <span className="text-3xl font-bold text-white">DDR Admin</span>
                     <p className="text-brand-500 text-sm font-medium uppercase tracking-widest mt-2">Accès Sécurisé</p>
                </div>
                
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Adresse e-mail" 
                        className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors" 
                    />
                    <button className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-500 transition-colors shadow-lg shadow-brand-900/50">
                        Se connecter
                    </button>
                </div>
                <div className="mt-6 text-xs text-center text-gray-600">Pour démo : cliquez juste sur "Se connecter"</div>
            </form>
        </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={
            isAdmin ? (
                <AdminLayout>
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="campaigns" element={<AdminCampaigns />} />
                        <Route path="donations" element={<AdminDonations />} />
                        <Route path="content" element={<AdminContent />} />
                        <Route path="appointments" element={<AdminAppointments />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="backend" element={<BackendGuide />} />
                        <Route path="*" element={<Navigate to="dashboard" />} />
                    </Routes>
                </AdminLayout>
            ) : <Navigate to="/admin/login" />
        } />

        {/* Public Routes */}
        <Route path="/*" element={
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/shahada" element={<Shahada />} />
                    <Route path="/learning" element={<LearningCenter />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/debates" element={<Debates />} />
                    <Route path="/conversions" element={<Conversions />} />
                    <Route path="/appointments" element={<Appointments />} />
                </Routes>
                {/* Floating AI Guide */}
                <LiveAssistant />
            </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserPlus, LogIn, ShieldAlert, Key, LogOut, UserCheck, Heart, Search as SearchIcon, Package, Bell, Stethoscope, Sparkles, LayoutDashboard, Calendar, BarChart3, ArrowLeft, ArrowRight } from 'lucide-react';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import ProfileView from '../components/Profile/ProfileView';
import DonationDashboard from '../components/Donation/DonationDashboard';
import InventoryDashboard from '../components/Inventory/InventoryDashboard';
import SearchDashboard from '../components/Search/SearchDashboard';
import NotificationsDashboard from '../components/Notifications/NotificationsDashboard';
import NotificationBell from '../components/Notifications/NotificationBell';
import NotificationDrawer from '../components/Notifications/NotificationDrawer';
import DoctorDashboard from '../components/Doctor/DoctorDashboard';
import WellnessHub from '../components/Wellness/WellnessHub';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AppointmentHub from '../components/Scheduling/AppointmentHub';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import { Link } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import { Menu, Languages } from 'lucide-react';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';

function MainApp() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const nextLang = currentLanguage.startsWith('ur') ? 'en' : 'ur';
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-[#030303] text-white flex ${currentLanguage.startsWith('ur') ? 'font-urdu' : ''}`} dir={currentLanguage.startsWith('ur') ? 'rtl' : 'ltr'}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        user={user} 
        onLogout={onLogout} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className={`flex-1 ${currentLanguage.startsWith('ur') ? 'lg:mr-72' : 'lg:ml-72'} min-h-screen flex flex-col`}>
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-1 bg-red-600 shadow-lg shadow-red-600/20">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-sm font-black tracking-tighter text-white uppercase">Platform</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Languages size={18} className="text-red-500" />
              <span className="text-[10px] font-bold uppercase">{currentLanguage.startsWith('ur') ? 'EN' : 'اردو'}</span>
            </button>
            <NotificationBell />
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Top Bar (Desktop) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-6 bg-[#030303]/50 backdrop-blur-xl sticky top-0 z-30 border-b border-white/5">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase">
              {t(`dashboard.${activeTab}`)} <span className="text-red-500">{t('dashboard.overview')}</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t('dashboard.welcome')}, {user.name}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end mr-2">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{user.role} {t('dashboard.session')}</p>
              <p className="text-[8px] text-red-500 font-bold uppercase tracking-[0.2em]">Live Status: {t('dashboard.active')}</p>
            </div>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-xs font-bold text-gray-400 hover:text-white"
            >
              <Languages size={16} className="text-red-500" />
              <span>{currentLanguage.startsWith('ur') ? 'English' : 'اردو'}</span>
            </button>
            <NotificationBell />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <div className="max-w-7xl mx-auto h-full">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-[28px] md:rounded-[32px] p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-160px)] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              {/* Subtle Background Glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                {activeTab === 'dashboard' && <ProfileView activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />}
                {activeTab === 'donations' && <DonationDashboard activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />}
                {activeTab === 'inventory' && <InventoryDashboard />}
                {activeTab === 'search' && <SearchDashboard />}
                {activeTab === 'notifications' && <NotificationsDashboard activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />}
                {activeTab === 'doctor' && <DoctorDashboard />}
                {activeTab === 'wellness' && <WellnessHub activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />}
                {activeTab === 'admin' && <AdminDashboard activeSubTab={activeSubTab} />}
                {activeTab === 'scheduling' && <AppointmentHub activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />}
                {activeTab === 'analytics' && <AnalyticsDashboard />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainApp;

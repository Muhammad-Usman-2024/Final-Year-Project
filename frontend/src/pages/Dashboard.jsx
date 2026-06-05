import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserPlus, LogIn, ShieldAlert, Key, LogOut, UserCheck, Heart, Search as SearchIcon, Package, Bell, Stethoscope, Sparkles, LayoutDashboard, Calendar, BarChart3, ArrowLeft, ArrowRight } from 'lucide-react';
import { logout } from '../store/authSlice';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import RolesMatrix from '../components/RolesMatrix';
import TokenDetail from '../components/TokenDetail';
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
import { toast } from 'react-hot-toast';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  if (user) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex">
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
        <NotificationDrawer />

        <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <div className="h-8 w-auto flex items-center justify-center">
                <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
              </div>
              <h2 className="text-sm font-black tracking-tighter text-white uppercase">Platform</h2>
            </div>
            <div className="flex items-center gap-3">
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
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <span className="text-red-500">Overview</span>
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end mr-2">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{user.role} Session</p>
                <p className="text-[8px] text-red-500 font-bold uppercase tracking-[0.2em]">Live Status: Active</p>
              </div>
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


  return (
    <div className="min-h-screen w-full flex bg-[#030303] overflow-hidden">
      {/* Left Panel: Brand & Info — hidden on mobile */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-transparent z-0"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-14 w-auto flex items-center justify-center">
              <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase leading-none">Platform Dashboard</h1>
              <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.4em] mt-2">Next-Gen Blood Platform</p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-6xl font-black text-white leading-[1.1] mb-8">Saving Lives, <span className="text-red-600">Together.</span></h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-12">Join our global network of donors and healthcare professionals. Experience the most advanced blood management ecosystem ever built.</p>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setActiveTab('register')}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border ${activeTab === 'register' ? 'bg-red-600 border-red-500 shadow-[0_10px_20px_rgba(220,38,38,0.3)] text-white' : 'bg-white/5 border-white/10 text-gray-600 group-hover:text-gray-300'}`}>
                  <UserPlus size={24} />
                </div>
                <div>
                  <h4 className={`text-lg font-black uppercase tracking-widest ${activeTab === 'register' ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>New Account</h4>
                  <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Register in 60 seconds</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setActiveTab('login')}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border ${activeTab === 'login' ? 'bg-red-600 border-red-500 shadow-[0_10px_20px_rgba(220,38,38,0.3)] text-white' : 'bg-white/5 border-white/10 text-gray-600 group-hover:text-gray-300'}`}>
                  <LogIn size={24} />
                </div>
                <div>
                  <h4 className={`text-lg font-black uppercase tracking-widest ${activeTab === 'login' ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>Secure Access</h4>
                  <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Enter your dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
          <span>&copy; 2026 Blood Smart Platform</span>
          <div className="flex gap-8">
            <button className="hover:text-white transition-all" onClick={() => setActiveTab('roles')}>Identity Mapping</button>
            <button className="hover:text-white transition-all" onClick={() => setActiveTab('jwt')}>Security Protocol</button>
          </div>
        </div>
      </div>

      {/* Right Panel: Interactive Form */}
      <div className="w-full lg:w-1/2 h-full min-h-screen bg-[#070707] relative flex items-start lg:items-center justify-center p-5 sm:p-8 md:p-12 overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(220,38,38,0.05)_0%,transparent_50%)]"></div>
        
        <div className="w-full max-w-xl relative z-10 py-8 lg:py-0">
          <div className="mb-6 lg:hidden flex flex-col items-center gap-3">
            <div className="h-12 w-auto flex items-center justify-center shadow-lg">
              <img src={logo} alt="BloodSync Logo" className="h-full w-auto object-contain" />
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">BloodSync Platform</h1>
          </div>

          {/* Mobile Tab Toggle */}
          <div className="flex items-center gap-4 mb-5 lg:hidden justify-center">
             <button className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'register' ? 'bg-red-600 text-white' : 'text-gray-500 bg-white/5'}`} onClick={() => setActiveTab('register')}>Register</button>
             <button className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-red-600 text-white' : 'text-gray-500 bg-white/5'}`} onClick={() => setActiveTab('login')}>Login</button>
          </div>

          <div className="bg-white/[0.01] border border-white/[0.03] backdrop-blur-2xl rounded-2xl sm:rounded-[32px] md:rounded-[40px] p-5 sm:p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            {activeTab === 'register' && <RegisterForm />}
            {activeTab === 'login' && <LoginForm />}
            {activeTab === 'roles' && <RolesMatrix />}
            {activeTab === 'jwt' && <TokenDetail />}
          </div>

          {/* Signup Link */}
          {activeTab === 'login' && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest">
                Account nahi hai?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-red-500 hover:text-red-400 font-black underline underline-offset-4 transition-colors"
                >
                  Sign Up karein
                </button>
              </p>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest">
                Already account hai?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-red-500 hover:text-red-400 font-black underline underline-offset-4 transition-colors"
                >
                  Login karein
                </button>
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/landing" className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] hover:text-red-500 transition-all flex items-center justify-center gap-3 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserCheck, 
  Heart, 
  Search, 
  Bell, 
  Sparkles, 
  Calendar, 
  LayoutDashboard, 
  Package, 
  Stethoscope, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

import logo from '../assets/logo.png';

const Sidebar = ({ activeTab, setActiveTab, activeSubTab, setActiveSubTab, user, onLogout, isOpen, setIsOpen }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith('ur');

  let menuItems = [];

  if (user?.role === 'Admin') {
    menuItems = [
      { 
        id: 'dashboard', 
        label: t('dashboard.profile'), 
        icon: UserCheck,
        subItems: [
          { id: 'personal', label: t('dashboard.info') },
          { id: 'admin', label: t('dashboard.admin') },
          { id: 'edit', label: t('dashboard.edit') },
        ]
      },
      { 
        id: 'admin', 
        label: t('dashboard.admin'), 
        icon: LayoutDashboard,
        subItems: [
          { id: 'overview', label: t('dashboard.overview') },
          { id: 'users', label: t('dashboard.management') },
          { id: 'broadcast', label: t('dashboard.broadcasts') },
          { id: 'forecast', label: t('dashboard.forecasting') },
          { id: 'audit', label: t('dashboard.auditLogs') },
        ]
      },
      { id: 'notifications', label: t('dashboard.alerts'), icon: Bell },
    ];
  } else {
    menuItems = [
      { 
        id: 'dashboard', 
        label: t('dashboard.profile'), 
        icon: UserCheck,
        subItems: [
          { id: 'personal', label: t('dashboard.info') },
          { id: user?.role?.toLowerCase() || 'donor', label: user?.role || 'Role' },
          { id: 'edit', label: t('dashboard.edit') },
        ]
      },
      { 
        id: 'donations', 
        label: t('dashboard.donations'), 
        icon: Heart,
        subItems: [
          { id: 'register', label: t('dashboard.schedule') },
          { id: 'eligibility', label: t('dashboard.eligibility') },
          { id: 'history', label: t('dashboard.history') },
          { id: 'process', label: t('dashboard.process') },
        ]
      },
      { id: 'search', label: t('dashboard.search'), icon: Search },
      { 
        id: 'notifications', 
        label: t('dashboard.alerts'), 
        icon: Bell,
        subItems: [
          { id: 'center', label: t('dashboard.center') },
          { id: 'preferences', label: t('dashboard.preferences') },
        ]
      },
      { 
        id: 'wellness', 
        label: t('dashboard.wellness'), 
        icon: Sparkles,
        subItems: [
          { id: 'feed', label: t('dashboard.feed') },
          { id: 'community', label: t('dashboard.community') },
        ]
      },
      { 
        id: 'scheduling', 
        label: t('dashboard.schedule'), 
        icon: Calendar,
        subItems: [
          { id: 'book', label: t('dashboard.schedule') },
          { id: 'my', label: t('dashboard.history') },
          ...(user.role === 'Hospital' || user.role === 'Doctor' ? [{ id: 'manage', label: t('dashboard.management') }] : []),
        ]
      },
    ];
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} h-full w-72 bg-[#0a0a0a] border-white/5 z-50
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Header/Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
              <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-md" />
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.subItems) {
                        setActiveSubTab(item.subItems[0].id);
                      }
                      if (!item.subItems) setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 group
                      ${isActive 
                        ? 'bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)]' 
                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}
                    `}
                  >
                    <Icon size={18} className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-red-500'} transition-colors`} />
                    {item.label}
                    {isActive && !item.subItems && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </button>

                  {/* Sub Items */}
                  {isActive && item.subItems && (
                    <div className="ml-9 space-y-1 pt-1 pb-2">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveSubTab(sub.id);
                            setIsOpen(false);
                          }}
                          className={`
                            w-full text-left px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] transition-all
                            ${activeSubTab === sub.id 
                              ? 'text-red-500 bg-red-500/10' 
                              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                          `}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Profile Summary */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-gray-700 to-gray-800 flex items-center justify-center border border-white/10">
                  <UserCheck size={14} className="text-gray-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-white truncate uppercase tracking-wider">{user?.name || 'User'}</p>
                  <p className="text-[8px] text-red-500 font-bold uppercase tracking-[0.2em]">{user?.role}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all group"
            >
              <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

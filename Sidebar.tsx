import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { User, Plan } from '../../types';
import * as AuthService from '../../services/authService';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const isOwner = user.plan === Plan.OWNER;

  // Mobile drawer classes
  const mobileClasses = isOpen ? "translate-x-0" : "-translate-x-full";
  // Increased z-index to 50 to ensure it is above sticky headers
  const baseClasses = "fixed md:relative inset-y-0 left-0 w-64 bg-surface border-r border-border flex flex-col justify-between shrink-0 h-full z-50 transition-transform duration-300 ease-in-out md:translate-x-0";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`${baseClasses} ${mobileClasses}`}>
        <div className="flex flex-col p-5">
          <div className="flex items-center justify-between pb-8">
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-lg flex items-center justify-center text-white shadow-lg ${isOwner ? 'bg-gradient-to-tr from-yellow-500 to-amber-300 shadow-amber-500/30' : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-900/20'}`}>
                <span className="material-symbols-outlined text-[20px]">{isOwner ? 'admin_panel_settings' : 'candlestick_chart'}</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-white text-base font-bold tracking-tight">TrackStock</h1>
                <p className="text-text-muted text-[10px] font-medium tracking-wide">
                    {isOwner ? 'GOD MODE TERMINAL' : 'PRO TERMINAL'}
                </p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button onClick={onClose} className="md:hidden text-text-muted hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            <div className="px-3 mb-2 text-[10px] font-bold text-text-dim uppercase tracking-widest">Main Menu</div>
            
            <Link to="/" onClick={onClose} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive('/') ? 'bg-surface-highlight text-white shadow-sm ring-1 ring-white/5' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isActive('/') ? 'text-primary' : ''}`}>dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <Link to="/watchlist" onClick={onClose} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive('/watchlist') ? 'bg-surface-highlight text-white shadow-sm ring-1 ring-white/5' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isActive('/watchlist') ? 'text-primary' : ''}`}>star</span>
              <span className="text-sm font-medium">Watchlist</span>
            </Link>

            <Link to="/news" onClick={onClose} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive('/news') ? 'bg-surface-highlight text-white shadow-sm ring-1 ring-white/5' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isActive('/news') ? 'text-primary' : ''}`}>newspaper</span>
              <span className="text-sm font-medium">News</span>
              <span className="ml-auto text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold">Live</span>
            </Link>

            <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-text-dim uppercase tracking-widest">System</div>
            <Link to="/pricing" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-all group">
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span className="text-sm font-medium">Billing & Plans</span>
            </Link>
          </nav>
        </div>

        <div className="p-5 flex flex-col gap-4 border-t border-border bg-surface/50">
          <div className={`relative overflow-hidden p-4 rounded-xl border ${isOwner ? 'bg-gradient-to-br from-amber-900/40 to-yellow-900/20 border-yellow-500/30' : 'bg-gradient-to-br from-[#1c1c22] to-[#121215] border-white/5'}`}>
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="material-symbols-outlined text-4xl">{isOwner ? 'diamond' : 'bolt'}</span>
            </div>
            <div className="flex flex-col gap-1 relative z-10">
              <span className={`text-[10px] font-bold tracking-wider uppercase ${isOwner ? 'text-amber-400' : 'text-emerald-400'}`}>{user.plan} Plan Active</span>
              <p className="text-text-muted text-xs leading-relaxed">
                {isOwner ? 'System Administrator Access.' : user.plan === 'Free' ? 'Upgrade for full access.' : 'Global markets unlocked.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="relative">
              <div className={`bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-surface ring-offset-2 ring-offset-border flex items-center justify-center text-xs font-bold text-white ${isOwner ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 ring-amber-500/30' : 'bg-gradient-to-br from-gray-700 to-gray-600'}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute bottom-0 right-0 size-2.5 border-2 border-surface rounded-full ${isOwner ? 'bg-amber-400' : 'bg-primary'}`}></div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className={`text-sm font-medium truncate ${isOwner ? 'text-amber-200' : 'text-white'}`}>{user.name}</p>
              <p className="text-text-dim text-xs truncate">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="text-text-muted hover:text-white transition-colors" title="Logout">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
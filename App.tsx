import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Pricing from './components/Auth/Pricing';
import MarketOverview from './components/Dashboard/MarketOverview';
import StockDetail from './components/Stock/StockDetail';
import Sidebar from './components/Layout/Sidebar';
import TickerTape from './components/Dashboard/TickerTape';
import Watchlist from './components/Watchlist/Watchlist';
import NewsFeed from './components/News/NewsFeed';
import MobileCharts from './components/Charts/MobileCharts';
import * as AuthService from './services/authService';
import { User } from './types';

const BottomNav: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    
    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-[#1a1a1e] rounded-[2rem] flex items-center justify-between px-8 shadow-2xl z-50 border border-white/5">
            <Link to="/" className={`flex flex-col items-center justify-center transition-colors ${isActive('/') ? 'text-white' : 'text-zinc-500'}`}>
                <span className={`material-symbols-outlined text-[24px] ${isActive('/') ? 'fill-current' : ''}`}>home</span>
            </Link>
            <Link to="/charts" className={`flex flex-col items-center justify-center transition-colors ${isActive('/charts') ? 'text-white' : 'text-zinc-500'}`}>
                <span className={`material-symbols-outlined text-[24px] ${isActive('/charts') ? 'fill-current' : ''}`}>show_chart</span>
            </Link>
            <Link to="/watchlist" className={`flex flex-col items-center justify-center transition-colors ${isActive('/watchlist') ? 'text-white' : 'text-zinc-500'}`}>
                <span className={`material-symbols-outlined text-[24px] ${isActive('/watchlist') ? 'fill-current' : ''}`}>grid_view</span>
            </Link>
            <Link to="/news" className={`flex flex-col items-center justify-center transition-colors ${isActive('/news') ? 'text-white' : 'text-zinc-500'}`}>
                <span className={`material-symbols-outlined text-[24px] ${isActive('/news') ? 'fill-current' : ''}`}>newspaper</span>
            </Link>
        </div>
    );
};

const DashboardLayout: React.FC<{ user: User }> = ({ user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Determine page title for mobile header
    const getPageTitle = () => {
        if (location.pathname === '/') return 'Market Overview';
        if (location.pathname === '/charts') return 'Market Charts';
        if (location.pathname === '/watchlist') return 'Watchlist';
        if (location.pathname === '/news') return 'Market News';
        if (location.pathname.includes('/stock/')) return 'Stock Detail';
        return 'TrackStock';
    };

    return (
        <div className="flex h-screen bg-background text-text-main overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block h-full">
                <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>
            
            <div className="flex-1 flex flex-col h-full min-w-0 relative bg-background">
                {/* Mobile Header (Minimal) */}
                <div className="md:hidden h-14 flex items-center justify-center relative shrink-0 z-30 pt-4 bg-background/95 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white tracking-wide">{getPageTitle()}</span>
                    {/* User Avatar absolute right - Clickable for Menu */}
                    <button 
                        onClick={() => setMobileMenuOpen(true)}
                        className="absolute right-6 top-1/2 mt-2 -translate-y-1/2 size-8 rounded-full bg-surface-highlight flex items-center justify-center text-xs font-bold ring-2 ring-black hover:ring-white/20 transition-all"
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </button>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <Outlet />
                </div>
                
                {/* Desktop Ticker */}
                <div className="hidden md:block">
                    <TickerTape />
                </div>

                {/* Mobile Bottom Nav */}
                <BottomNav />

                {/* Mobile User Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-[60] bg-[#09090b]/95 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-bottom-4 duration-200 flex flex-col">
                        <div className="flex items-center justify-end p-6">
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 -mt-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-emerald-500/20 ring-4 ring-white/5">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-center space-y-1">
                                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                    <p className="text-zinc-400">{user.email}</p>
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-wider text-emerald-400">
                                    {user.plan} Plan Active
                                </div>
                            </div>

                            <div className="w-full max-w-xs flex flex-col gap-4">
                                <button 
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate('/pricing');
                                    }}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-transform active:scale-95"
                                >
                                    <span className="material-symbols-outlined">verified</span>
                                    {user.plan === 'Free' ? 'Upgrade to Pro' : 'Manage Subscription'}
                                </button>

                                <button 
                                    onClick={() => {
                                        AuthService.logout();
                                        navigate('/login');
                                    }}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-lg rounded-2xl border border-white/10 flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    const session = AuthService.getSession();
    setUser(session);
    setLoading(false);

    // Listen for auth changes (login, logout, plan upgrade)
    const handleAuthChange = () => {
        const updatedSession = AuthService.getSession();
        setUser(updatedSession);
    };

    AuthService.authEvents.addEventListener('auth-change', handleAuthChange);

    return () => {
        AuthService.authEvents.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogin = () => {
    setUser(AuthService.getSession());
  };

  if (loading) return null;

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/pricing" element={<Pricing />} />
        
        <Route path="/" element={user ? <DashboardLayout user={user} /> : <Navigate to="/login" />}>
            <Route index element={<MarketOverview user={user!} />} />
            <Route path="charts" element={<MobileCharts user={user!} />} />
            <Route path="stock/:ticker" element={<StockDetail user={user!} />} />
            <Route path="watchlist" element={<Watchlist user={user!} />} />
            <Route path="news" element={<NewsFeed user={user!} />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
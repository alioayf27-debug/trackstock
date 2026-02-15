import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stock, Plan, User } from '../../types';
import { GLOBAL_STOCKS } from '../../constants';
import * as StockService from '../../services/stockService';

interface MarketOverviewProps {
  user: User;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ user }) => {
  const navigate = useNavigate();
  const [liveStocks, setLiveStocks] = useState<Stock[]>(GLOBAL_STOCKS);
  const [regionFilter, setRegionFilter] = useState<'All' | 'US' | 'Europe' | 'Asia' | 'MiddleEast'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Rising' | 'Cheap' | 'Volume'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const isFree = user.plan === Plan.FREE;

  // Real-time polling logic
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    // Update fetch interval: Owner/Elite is 5s, Pro 15s, Free 60s
    const fetchInterval = (user.plan === Plan.ELITE || user.plan === Plan.OWNER) ? 5000 : user.plan === Plan.PRO ? 15000 : 60000;

    const updateData = async () => {
        // Use GLOBAL_STOCKS source to prevent dependency loops with liveStocks state
        const tickersToUpdate = GLOBAL_STOCKS.slice(0, 10).map(s => s.ticker);
        const updatedData = await StockService.getMarketData(tickersToUpdate);
        
        if (updatedData.length > 0) {
            setLiveStocks(prev => {
                const map = new Map(prev.map(s => [s.ticker, s]));
                updatedData.forEach(s => map.set(s.ticker, s));
                return Array.from(map.values());
            });
        }
    };

    // Initial fetch
    updateData();

    // Poll
    intervalId = setInterval(updateData, fetchInterval);

    return () => clearInterval(intervalId);
  }, [user.plan]);


  // Filtering Logic
  const filteredStocks = useMemo(() => {
      let result = liveStocks;

      // Search
      if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          result = result.filter(s => s.ticker.toLowerCase().includes(lower) || s.name.toLowerCase().includes(lower));
      }

      // Region
      if (regionFilter !== 'All') {
          result = result.filter(s => s.region === regionFilter);
      }

      // Category Tabs
      if (categoryFilter === 'Rising') {
          result = [...result].sort((a, b) => b.changePercent - a.changePercent);
      } else if (categoryFilter === 'Cheap') {
          // Filter out negative or zero PE, sort ASC
          result = result.filter(s => (s.peRatio || 0) > 0).sort((a, b) => (a.peRatio || 999) - (b.peRatio || 999));
      } else if (categoryFilter === 'Volume') {
          // Mock sort by parsing volume string (simple heuristic for demo: M > K)
          result = [...result].sort((a, b) => {
              const parseVol = (v: string) => {
                  if(v.includes('T')) return parseFloat(v) * 1000000000000;
                  if(v.includes('B')) return parseFloat(v) * 1000000000;
                  if(v.includes('M')) return parseFloat(v) * 1000000;
                  if(v.includes('K')) return parseFloat(v) * 1000;
                  return parseFloat(v);
              }
              return parseVol(b.volume) - parseVol(a.volume);
          });
      }

      return result;
  }, [searchTerm, regionFilter, categoryFilter, liveStocks]);

  // Data to display
  // If Free, show 3 real + fake rows. If Paid, show all.
  const displayStocks = isFree ? filteredStocks.slice(0, 3) : filteredStocks;
  const isLocked = isFree && filteredStocks.length > 3;

  const getScoreColor = (score: number) => {
      if (score >= 8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      if (score >= 5) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="flex flex-col h-full">
        {/* Header Section */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-surface/30 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center w-full max-w-sm group">
                <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors text-[20px]">search</span>
                    <input 
                        type="text" 
                        className="w-full bg-surface-highlight/50 border border-white/5 hover:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-text-dim transition-all outline-none" 
                        placeholder="Search tickers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 ml-4 hidden md:flex">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-400">
                        {user.plan === Plan.ELITE || user.plan === Plan.OWNER ? 'Real-time Feed' : user.plan === Plan.PRO ? 'Live (15m delay)' : 'Delayed (20m)'}
                    </span>
                </div>
            </div>
        </header>

        {/* Content - Added pb-28 for mobile scroll */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-28 lg:pb-8 scroll-smooth relative">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-white text-2xl font-semibold tracking-tight mb-1">Market Overview</h2>
                        <p className="text-text-muted text-sm">Real-time data across global exchanges.</p>
                    </div>
                    
                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                         <div className="flex gap-2 bg-surface p-1 rounded-lg border border-border overflow-x-auto no-scrollbar">
                            {(['All', 'Rising', 'Cheap', 'Volume'] as const).map((c) => (
                                 <button 
                                    key={c}
                                    onClick={() => setCategoryFilter(c)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${categoryFilter === c ? 'bg-primary/20 text-primary border border-primary/20' : 'text-text-muted hover:text-white'}`}
                                 >
                                 {c}
                             </button>
                            ))}
                        </div>

                        <div className="flex gap-2 bg-surface p-1 rounded-lg border border-border overflow-x-auto no-scrollbar">
                            {(['All', 'US', 'Europe', 'Asia', 'MiddleEast'] as const).map((r) => (
                                 <button 
                                    key={r}
                                    onClick={() => setRegionFilter(r)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${regionFilter === r ? 'bg-surface-highlight shadow-sm text-white' : 'text-text-muted hover:text-white'}`}
                                 >
                                 {r}
                             </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all border ${showFilters ? 'bg-surface-highlight text-white border-white/10' : 'bg-transparent text-text-muted border-transparent hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                        {showFilters ? 'Hide Filters' : 'Advanced Filters'}
                    </button>
                    <button 
                        onClick={() => {
                            setLiveStocks(GLOBAL_STOCKS); // Reset visuals
                        }} 
                        className="text-text-muted hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                        title="Refresh Data"
                    >
                        <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xl shadow-black/40 relative min-h-[400px]">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                    <tr className="bg-surface-highlight/50 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
                        <th className="px-6 py-4 sticky left-0 bg-[#17171c] z-10 border-r border-border/50">Ticker</th>
                        <th className="px-6 py-4">AI Score</th>
                        <th className="px-6 py-4">Company Name</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-right">Change (24h)</th>
                        <th className="px-6 py-4 text-center">Exchange</th>
                        <th className="px-6 py-4 text-right">Volume</th>
                        <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-sm">
                        {displayStocks.map((stock) => (
                            <tr key={stock.ticker} className="table-row-hover group">
                                <td className="px-6 py-4 font-semibold text-white sticky left-0 bg-surface group-hover:bg-[#15151a] transition-colors border-r border-border/50 z-10">
                                <Link to={`/stock/${stock.ticker}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                                    <div className="size-8 rounded-lg bg-white flex items-center justify-center text-black font-bold text-xs overflow-hidden shrink-0">
                                        {stock.logo ? (
                                            <img 
                                                src={stock.logo} 
                                                alt={stock.ticker} 
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-contain p-1"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerText = stock.ticker.charAt(0);
                                                }}
                                            />
                                        ) : (
                                            stock.ticker.charAt(0)
                                        )}
                                    </div>
                                    {stock.ticker}
                                </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${getScoreColor(stock.aiScore)}`}>
                                        <span className="material-symbols-outlined text-[16px]">{stock.aiScore >= 8 ? 'stars' : stock.aiScore >= 5 ? 'trending_flat' : 'warning'}</span>
                                        <span className="font-bold">{stock.aiScore}/10</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-text-muted">{stock.name}</td>
                                <td className="px-6 py-4 text-right text-white font-mono font-medium">
                                    {stock.currency === 'GBP' ? '£' : stock.currency === 'JPY' ? '¥' : stock.currency === 'SAR' ? '﷼' : stock.currency === 'EUR' ? '€' : '$'}
                                    {stock.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${stock.change >= 0 ? 'bg-primary-soft text-primary' : 'bg-danger-soft text-danger'}`}>
                                    <span className="material-symbols-outlined text-[14px]">{stock.change >= 0 ? 'arrow_upward' : 'arrow_downward'}</span>
                                    {Math.abs(stock.changePercent).toFixed(2)}%
                                </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-text-muted border border-white/5">{stock.exchange}</span>
                                </td>
                                <td className="px-6 py-4 text-right text-text-dim font-mono text-xs">{stock.volume || '-'}</td>
                                <td className="px-6 py-4 text-center">
                                <Link to={`/stock/${stock.ticker}`} className="size-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-text-muted hover:text-white transition-colors mx-auto">
                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                </Link>
                                </td>
                            </tr>
                        ))}
                        
                        {/* Fake Rows for Paywall Effect */}
                        {isLocked && Array.from({ length: 6 }).map((_, i) => (
                             <tr key={`fake-${i}`} className="opacity-20 blur-[2px] select-none pointer-events-none grayscale">
                                <td className="px-6 py-4 font-semibold text-white sticky left-0 bg-surface border-r border-border/50 z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded bg-white/10"></div>
                                        <span>XXXX</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">--/10</td>
                                <td className="px-6 py-4">LOCKED ASSET</td>
                                <td className="px-6 py-4 text-right">$000.00</td>
                                <td className="px-6 py-4 text-right">0.00%</td>
                                <td className="px-6 py-4 text-center"><span className="inline-flex px-2 py-1 rounded bg-white/5">NYSE</span></td>
                                <td className="px-6 py-4 text-right">00.0M</td>
                                <td className="px-6 py-4"></td>
                             </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                {/* Free Plan Lock Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/80 to-surface flex flex-col items-center justify-end pb-12 z-20">
                         <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-xl shadow-2xl">
                            <div className="size-12 rounded-full bg-gradient-to-tr from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <span className="material-symbols-outlined text-black text-2xl font-bold">lock</span>
                            </div>
                            <div className="text-center max-w-sm">
                                <h3 className="text-white font-bold text-xl mb-2">Unlock Global Market Data</h3>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    You are viewing a limited Free preview. Upgrade to <strong>Pro</strong> to instantly unlock real-time data for all {filteredStocks.length} global assets, charts, and analysis.
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/pricing')}
                                className="px-8 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-105"
                            >
                                Upgrade Now
                            </button>
                         </div>
                    </div>
                )}
            </div>
            
            <div className="mt-6 flex justify-center">
                <span className="text-[10px] text-text-dim bg-white/5 px-3 py-1 rounded-full border border-white/5">TrackStock provides market analytics only. Not financial advice.</span>
            </div>
        </div>
    </div>
  );
};

export default MarketOverview;
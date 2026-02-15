import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GLOBAL_STOCKS, MOCK_NEWS } from '../../constants';
import { Stock, Plan, User } from '../../types';
import TradingViewWidget from './TradingViewWidget';
import { getStockSummary } from '../../services/geminiService';
import * as UserService from '../../services/userService';
import * as StockService from '../../services/stockService';

interface StockDetailProps {
  user: User;
}

const StockDetail: React.FC<StockDetailProps> = ({ user }) => {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [summary, setSummary] = useState<string>('Analyzing market data...');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const isOwner = user.plan === Plan.OWNER;

  useEffect(() => {
    // Initial Load
    const loadStock = async () => {
        if (!ticker) return;
        
        const staticData = GLOBAL_STOCKS.find(s => s.ticker === ticker);
        if (!staticData) return;

        // Fetch real-time
        const realTimeData = await StockService.getStockData(ticker, true);
        const data = realTimeData || staticData;

        setStock(data);
        
        // Check Watchlist
        const watchlist = UserService.getWatchlist();
        setIsWatched(watchlist.includes(data.ticker));

        // AI Summary
        setLoadingSummary(true);
        getStockSummary(data.ticker, data.name).then(text => {
            setSummary(text);
            setLoadingSummary(false);
        });
    };

    loadStock();
  }, [ticker]);

  const handleToggleWatch = () => {
      if (!stock) return;
      if (isWatched) {
          UserService.removeFromWatchlist(stock.ticker);
          setIsWatched(false);
      } else {
          // Check limits if free
          if (user.plan === Plan.FREE && UserService.getWatchlist().length >= 3) {
              alert("Watchlist limit reached for Free plan. Upgrade to Pro.");
              return;
          }
          UserService.addToWatchlist(stock.ticker);
          setIsWatched(true);
      }
  };

  const handleAlert = () => {
      if (!stock) return;
      if (user.plan === Plan.FREE) {
          alert("Alerts are a Pro feature.");
          return;
      }
      UserService.addAlert({
          id: Date.now().toString(),
          ticker: stock.ticker,
          type: 'PRICE_TARGET',
          condition: 'ABOVE',
          value: stock.price * 1.05,
          active: true,
          createdAt: new Date().toISOString()
      });
      navigate('/alerts');
  };

  if (!stock) return <div className="p-8 text-white">Stock not found or loading...</div>;

  if (user.plan === Plan.FREE) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center relative overflow-hidden">
               <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 blur-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop')" }}></div>
               <div className="z-10 bg-surface/80 p-10 rounded-2xl border border-white/10 backdrop-blur-xl max-w-md">
                    <div className="w-16 h-16 rounded-full bg-surface-highlight flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-glow">
                        <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Pro Feature Locked</h2>
                    <p className="text-text-muted mb-8">Detailed analysis, AI summaries, and advanced charting for <strong>{stock.name}</strong> are available on Pro and Elite plans.</p>
                    <div className="flex flex-col gap-3">
                        <Link to="/pricing" className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                            Upgrade to Unlock
                        </Link>
                        <Link to="/" className="text-sm text-text-dim hover:text-white transition-colors">
                            Return to Dashboard
                        </Link>
                    </div>
               </div>
          </div>
      )
  }

  // Helper for Score Colors
  const getScoreColor = (score: number) => {
      if (score >= 8) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]';
      if (score >= 5) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 shadow-[0_0_15px_-3px_rgba(250,204,21,0.3)]';
      return 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_15px_-3px_rgba(251,113,133,0.3)]';
  };

  // Check if we are using a proxy symbol (ADR or Index ETF)
  const isADR = stock.tradingViewSymbol && !stock.tradingViewSymbol.includes(stock.ticker);

  // Added pb-28 to main container for mobile nav clearance
  return (
    <main className="flex-grow w-full mx-auto p-4 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-8 relative z-10 overflow-y-auto h-full">
        {/* Header */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="flex flex-col gap-4">
                <nav className="flex items-center gap-2 text-xs font-medium text-text-dim mb-1">
                    <Link to="/" className="hover:text-primary transition-colors">Markets</Link>
                    <span>/</span>
                    <span className="text-white">{stock.ticker}</span>
                </nav>
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-lg font-bold shadow-sm text-black border border-white/5 overflow-hidden shrink-0">
                            {stock.logo ? (
                                <img 
                                    src={stock.logo} 
                                    alt={stock.ticker} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-contain p-1.5"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerText = stock.ticker[0];
                                    }}
                                />
                            ) : (
                                stock.ticker[0]
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{stock.name}</h2>
                            <span className="text-sm text-text-muted font-medium">{stock.exchange}: {stock.ticker}</span>
                        </div>
                    </div>
                    {/* AI SCORE BADGE */}
                    <div className={`px-4 py-2 rounded-xl border flex flex-col items-center justify-center min-w-[120px] ${getScoreColor(stock.aiScore)}`}>
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">AI Rating</div>
                        <div className="text-2xl font-bold flex items-center gap-1">
                            {stock.aiScore}<span className="text-sm opacity-60">/10</span>
                        </div>
                        <div className="text-xs font-bold uppercase mt-0.5">{stock.aiVerdict}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:items-end gap-1 w-full lg:w-auto">
                <div className="flex items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-semibold text-white tracking-tighter">
                        {stock.currency === 'USD' ? '$' : stock.currency === 'GBP' ? '£' : ''}{stock.price.toFixed(2)}
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${stock.change >= 0 ? 'bg-primary-soft border-primary/10 text-primary' : 'bg-danger-soft border-danger/10 text-danger'}`}>
                        <span className="material-symbols-outlined text-sm font-bold">{stock.change >= 0 ? 'trending_up' : 'trending_down'}</span>
                        <span className="font-semibold text-sm">{stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                    </div>
                </div>
                <div className="text-sm text-text-muted font-medium mt-1 flex gap-4">
                    <span>Vol <span className="text-gray-300">{stock.volume || 'N/A'}</span></span>
                    <span>MCap <span className="text-gray-300">{stock.marketCap}</span></span>
                </div>
            </div>
             <div className="flex gap-3 w-full lg:w-auto lg:ml-auto">
                <button 
                    onClick={handleAlert}
                    className="flex-1 lg:flex-none h-10 px-4 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 font-medium text-sm transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                    Alert
                </button>
                <button 
                    onClick={handleToggleWatch}
                    className={`flex-1 lg:flex-none h-10 px-6 rounded-lg font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${isWatched ? 'bg-primary text-black hover:bg-primary-hover shadow-primary/10' : 'bg-white hover:bg-gray-200 text-black shadow-white/5'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">{isWatched ? 'check' : 'bookmark'}</span>
                    {isWatched ? 'Watching' : 'Watch'}
                </button>
            </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* Left Column: Chart */}
            <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="glass-panel rounded-2xl p-1 flex flex-col h-[400px] md:h-[600px] shadow-soft relative overflow-hidden group">
                    <div className="px-4 py-3 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex bg-surface-highlight rounded-lg p-1 border border-white/5">
                                {['1D', '1W', '1M', '1Y'].map(tf => (
                                    <button key={tf} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${tf === '1D' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}>{tf}</button>
                                ))}
                            </div>
                            {isADR && (
                                <span className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">info</span>
                                    Chart Source: {stock.tradingViewSymbol}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-text-dim uppercase tracking-wider hidden md:inline-block">Data Source:</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white font-medium bg-white/5 px-2 py-1 rounded">TradingView</span>
                                <span className="text-text-dim text-[10px]">|</span>
                                <a 
                                    href={`https://www.google.com/finance/quote/${stock.ticker}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-xs text-text-muted hover:text-white transition-colors flex items-center gap-1 group/link"
                                >
                                    <span>Google Finance</span>
                                    <span className="material-symbols-outlined text-[12px] group-hover/link:-translate-y-0.5 transition-transform">open_in_new</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Chart Area */}
                    <div className="flex-1 bg-surface relative">
                         <TradingViewWidget symbol={stock.tradingViewSymbol || stock.ticker} />
                    </div>
                </div>
                 {/* Stat Cards - Stacked on mobile */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-panel p-4 rounded-xl flex flex-col justify-between hover:bg-white/5 transition-colors cursor-default">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Market Cap</p>
                        <p className="text-lg font-semibold text-white">{stock.marketCap}</p>
                    </div>
                     <div className="glass-panel p-4 rounded-xl flex flex-col justify-between hover:bg-white/5 transition-colors cursor-default">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">P/E Ratio</p>
                        <p className="text-lg font-semibold text-white">{stock.peRatio}</p>
                    </div>
                     <div className="glass-panel p-4 rounded-xl flex flex-col justify-between hover:bg-white/5 transition-colors cursor-default">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Beta</p>
                        <p className="text-lg font-semibold text-white">{stock.beta || '-'}</p>
                    </div>
                     <div className="glass-panel p-4 rounded-xl flex flex-col justify-between hover:bg-white/5 transition-colors cursor-default">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Dividend</p>
                        <p className="text-lg font-semibold text-white">{stock.dividend || 'N/A'}</p>
                    </div>
                 </div>
            </div>

            {/* Right Column: AI & News */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                {/* AI Card */}
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden shadow-glow group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-white text-[18px]">auto_awesome</span>
                            </div>
                            <h3 className="text-white font-semibold text-sm">AI Summary</h3>
                        </div>
                        <span className="text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/5">Updated Just Now</span>
                    </div>
                    <div className="relative z-10">
                        {loadingSummary ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                <div className="h-4 bg-white/10 rounded w-full"></div>
                                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                            </div>
                        ) : (
                            <p className="text-sm leading-relaxed text-gray-300 font-light">
                                <strong className="text-white font-medium">Gemini Insight:</strong> {summary}
                            </p>
                        )}
                        
                        <div className="mt-4 flex gap-3">
                            <div className="flex-1 bg-white/5 rounded-lg p-2.5 border border-white/5">
                                <p className="text-[10px] text-gray-400 uppercase mb-1">Sentiment</p>
                                <p className="text-primary font-medium text-sm">+84% Positive</p>
                            </div>
                            <div className="flex-1 bg-white/5 rounded-lg p-2.5 border border-white/5">
                                <p className="text-[10px] text-gray-400 uppercase mb-1">Inst. Vol</p>
                                <p className="text-white font-medium text-sm">2.4x Avg</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News */}
                <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Latest News</h3>
                        <button className="text-primary hover:text-primary-hover text-xs font-medium transition-colors">View All</button>
                    </div>
                    <div className="flex flex-col gap-0 divide-y divide-white/5 -mx-2">
                        {MOCK_NEWS.map((news, i) => (
                             <div key={i} className="p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-gray-600'}`}></span>
                                        <span className="text-[10px] font-bold text-gray-300">{news.source}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500">{news.time}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-200 group-hover:text-primary transition-colors line-clamp-2">
                                    {news.headline}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};

export default StockDetail;
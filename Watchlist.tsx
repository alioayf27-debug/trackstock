import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Plan, Stock } from '../../types';
import * as UserService from '../../services/userService';
import { GLOBAL_STOCKS } from '../../constants';

interface WatchlistProps {
  user: User;
}

const Watchlist: React.FC<WatchlistProps> = ({ user }) => {
  const [watchlistTickers, setWatchlistTickers] = useState<string[]>([]);
  const [tickerInput, setTickerInput] = useState('');
  
  useEffect(() => {
    setWatchlistTickers(UserService.getWatchlist());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerInput) return;
    
    // Check limit
    if (user.plan === Plan.FREE && watchlistTickers.length >= 5) {
        alert("Free plan is limited to 5 watchlist items. Upgrade to Pro for unlimited access.");
        return;
    }

    // Validate ticker (Mock validation against GLOBAL_STOCKS for demo, usually via API)
    const stockExists = GLOBAL_STOCKS.some(s => s.ticker.toUpperCase() === tickerInput.toUpperCase());
    if (stockExists) {
        const updated = UserService.addToWatchlist(tickerInput.toUpperCase());
        setWatchlistTickers(updated);
        setTickerInput('');
    } else {
        alert("Stock symbol not found in demo database.");
    }
  };

  const handleRemove = (ticker: string) => {
    const updated = UserService.removeFromWatchlist(ticker);
    setWatchlistTickers(updated);
  };

  // Get stock details for watchlist
  const watchedStocks = watchlistTickers.map(t => GLOBAL_STOCKS.find(s => s.ticker === t)).filter(Boolean) as Stock[];
  const isFree = user.plan === Plan.FREE;
  const isLimitReached = isFree && watchlistTickers.length >= 5;

  // Added pb-28
  return (
    <div className="flex flex-col h-full p-8 pb-28 lg:pb-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
                <h2 className="text-white text-2xl font-semibold tracking-tight mb-1">My Watchlist</h2>
                <p className="text-text-muted text-sm">Track your favorite assets in one place.</p>
            </div>
            
            <form onSubmit={handleAdd} className="relative group w-full md:w-80">
                <input 
                    type="text" 
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value)}
                    placeholder="Add Ticker (e.g. NVDA)..." 
                    className="w-full bg-surface border border-white/10 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLimitReached}
                />
                <button 
                    type="submit"
                    disabled={isLimitReached}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 hover:bg-primary hover:text-black rounded-lg text-text-muted transition-colors disabled:opacity-0"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
            </form>
        </div>

        {isLimitReached && (
            <div className="mb-6 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-400">info</span>
                    <span className="text-sm text-indigo-200">Free plan limit reached (5/5).</span>
                </div>
                <Link to="/pricing" className="text-xs font-bold text-indigo-400 hover:text-white transition-colors">Upgrade Plan</Link>
            </div>
        )}

        {watchedStocks.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-xl bg-surface/30">
                <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-text-muted">list</span>
                </div>
                <p className="text-text-muted text-sm">Your watchlist is empty.</p>
            </div>
        ) : (
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-surface-highlight/50 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
                        <th className="px-6 py-4">Ticker</th>
                        <th className="px-6 py-4">Company Name</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-right">Change</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-sm">
                        {watchedStocks.map((stock) => (
                            <tr key={stock.ticker} className="table-row-hover group">
                                <td className="px-6 py-4 font-semibold text-white">
                                    <div className="flex items-center gap-3">
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
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-text-muted">{stock.name}</td>
                                <td className="px-6 py-4 text-right text-white font-mono font-medium">
                                    {stock.currency === 'USD' ? '$' : stock.currency === 'GBP' ? '£' : ''}{stock.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${stock.change >= 0 ? 'bg-primary-soft text-primary' : 'bg-danger-soft text-danger'}`}>
                                        <span className="material-symbols-outlined text-[14px]">{stock.change >= 0 ? 'arrow_upward' : 'arrow_downward'}</span>
                                        {Math.abs(stock.changePercent).toFixed(2)}%
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/stock/${stock.ticker}`} className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors" title="View Details">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </Link>
                                        <button onClick={() => handleRemove(stock.ticker)} className="p-2 hover:bg-danger-soft hover:text-danger rounded-lg text-text-muted transition-colors" title="Remove">
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};

export default Watchlist;
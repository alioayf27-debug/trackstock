import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TradingViewWidget from '../Stock/TradingViewWidget';
import { GLOBAL_STOCKS } from '../../constants';
import { User, Plan } from '../../types';

interface MobileChartsProps {
  user: User;
}

const MobileCharts: React.FC<MobileChartsProps> = ({ user }) => {
  const [activeTicker, setActiveTicker] = useState(GLOBAL_STOCKS[0].ticker);

  // Helper to get the correct symbol for TradingView (handles native exchange mapping)
  const getTvSymbol = (ticker: string) => {
    const stock = GLOBAL_STOCKS.find(s => s.ticker === ticker);
    return stock?.tradingViewSymbol || ticker;
  };

  // Restrict access for Free plan
  if (user.plan === Plan.FREE) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center relative overflow-hidden pb-28 md:pb-8">
               <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 blur-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop')" }}></div>
               <div className="z-10 bg-surface/80 p-10 rounded-2xl border border-white/10 backdrop-blur-xl max-w-md w-full">
                    <div className="w-16 h-16 rounded-full bg-surface-highlight flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-glow">
                        <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Charts Locked</h2>
                    <p className="text-text-muted mb-8">Advanced real-time charting and technical analysis are available exclusively on Pro and Elite plans.</p>
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
      );
  }

  // Increased padding to pb-28
  return (
    <div className="flex flex-col h-full bg-background pb-28 md:pb-0 overflow-hidden">
      {/* Top Bar: Ticker Selector */}
      <div className="h-16 flex items-center gap-3 overflow-x-auto px-4 border-b border-white/5 bg-surface-highlight/30 no-scrollbar shrink-0 backdrop-blur-md z-10">
        {GLOBAL_STOCKS.map(s => (
          <button
            key={s.ticker}
            onClick={() => setActiveTicker(s.ticker)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl border transition-all min-w-[80px] ${
              activeTicker === s.ticker 
                ? 'bg-primary text-black border-primary shadow-glow transform scale-105 font-bold' 
                : 'bg-surface border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <span className="text-xs">{s.ticker}</span>
            <span className={`text-[10px] ${activeTicker === s.ticker ? 'text-black/70 font-semibold' : 'text-zinc-600'}`}>
                {s.change >= 0 ? '+' : ''}{s.changePercent.toFixed(1)}%
            </span>
          </button>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 w-full bg-surface relative">
         <TradingViewWidget symbol={getTvSymbol(activeTicker)} />
      </div>
    </div>
  );
};

export default MobileCharts;
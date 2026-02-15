import React, { useState, useEffect } from 'react';
import { User, PortfolioItem } from '../../types';
import * as UserService from '../../services/userService';
import * as StockService from '../../services/stockService';
import { GLOBAL_STOCKS } from '../../constants';

interface PortfolioProps {
  user: User;
}

const Portfolio: React.FC<PortfolioProps> = ({ user }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Add position form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicker, setNewTicker] = useState(GLOBAL_STOCKS[0].ticker);
  const [newQty, setNewQty] = useState(10);
  const [newCost, setNewCost] = useState(100);

  // Mobile View States
  const [activeTab, setActiveTab] = useState<'Holdings' | 'Analysis'>('Holdings');
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Day');

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
      setLoading(true);
      const items = UserService.getPortfolio();
      setPortfolio(items);

      // Fetch current prices for calculating P&L
      const newPrices: Record<string, number> = {};
      for (const item of items) {
          const stock = await StockService.getStockData(item.ticker);
          if (stock) {
              newPrices[item.ticker] = stock.price;
          }
      }
      setPrices(newPrices);
      setLoading(false);
  };

  const handleAddPosition = (e: React.FormEvent) => {
      e.preventDefault();
      UserService.addToPortfolio({
          ticker: newTicker,
          quantity: Number(newQty),
          avgCost: Number(newCost),
          purchaseDate: new Date().toISOString()
      });
      setShowAddModal(false);
      loadPortfolio();
  };

  const handleRemove = (ticker: string) => {
      UserService.removeFromPortfolio(ticker);
      loadPortfolio();
  };

  const totalValue = portfolio.reduce((sum, item) => sum + (item.quantity * (prices[item.ticker] || 0)), 0);
  const totalCost = portfolio.reduce((sum, item) => sum + (item.quantity * item.avgCost), 0);
  const totalPL = totalValue - totalCost;

  // Prepare data for Donut Chart
  const chartData = portfolio.map(item => {
      const value = item.quantity * (prices[item.ticker] || 0);
      return { ticker: item.ticker, value, color: '' };
  }).sort((a, b) => b.value - a.value);

  // Assign colors based on index
  const COLORS = ['#34d399', '#facc15', '#fb7185', '#60a5fa', '#a78bfa', '#9ca3af'];
  chartData.forEach((item, index) => {
      item.color = COLORS[index % COLORS.length];
  });

  // Calculate SVG paths for Donut
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-24 md:pb-0 scroll-smooth">
        
        {/* === Mobile Layout Structure === */}
        <div className="flex flex-col items-center pt-2 px-6">
            
            {/* 1. Total Balance Section */}
            <div className="text-center mb-6">
                <span className="text-zinc-400 text-xs font-medium tracking-wide">Total Balance</span>
                <h1 className="text-4xl font-bold text-white mt-1 font-display tracking-tight">
                    ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
            </div>

            {/* 2. Custom Tabs (Expenses | Income style) */}
            <div className="w-full max-w-xs bg-[#1a1a1e] p-1 rounded-2xl flex items-center mb-8 relative border border-white/5">
                <button 
                    onClick={() => setActiveTab('Holdings')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all relative z-10 ${activeTab === 'Holdings' ? 'text-black bg-primary shadow-glow' : 'text-zinc-500 hover:text-white'}`}
                >
                    Holdings
                </button>
                <button 
                    onClick={() => setActiveTab('Analysis')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all relative z-10 ${activeTab === 'Analysis' ? 'text-black bg-primary shadow-glow' : 'text-zinc-500 hover:text-white'}`}
                >
                    Analysis
                </button>
            </div>

            {/* 3. Time Filters */}
            <div className="w-full flex items-center justify-between px-2 mb-8">
                <button className="bg-[#1a1a1e] text-white px-5 py-2 rounded-xl text-xs font-semibold border border-white/5 shadow-sm">Day</button>
                <button className="text-zinc-500 hover:text-white px-4 py-2 text-xs font-medium">Week</button>
                <button className="text-zinc-500 hover:text-white px-4 py-2 text-xs font-medium">Month</button>
                <button className="text-zinc-500 hover:text-white px-4 py-2 text-xs font-medium">Period</button>
            </div>

            {/* 4. Donut Chart Section */}
            <div className="relative size-[240px] flex items-center justify-center mb-8">
                {/* Center Date/Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-zinc-400 text-xs font-medium">Daily P&L</span>
                    <span className={`text-2xl font-bold ${totalPL >= 0 ? 'text-white' : 'text-danger'}`}>
                        {totalPL >= 0 ? '+' : ''}${Math.abs(totalPL).toFixed(2)}
                    </span>
                </div>

                {/* SVG Chart */}
                <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
                    {portfolio.length === 0 ? (
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#27272a"
                            strokeWidth={strokeWidth}
                        />
                    ) : (
                        chartData.map((item, i) => {
                            const percent = totalValue > 0 ? item.value / totalValue : 0;
                            const strokeDasharray = `${percent * circumference} ${circumference}`;
                            const strokeDashoffset = -accumulatedPercent * circumference;
                            accumulatedPercent += percent;

                            return (
                                <circle
                                    key={item.ticker}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            );
                        })
                    )}
                </svg>
            </div>

            {/* 5. Add Button (FAB) */}
            <div className="w-full flex justify-end px-2 -mt-12 mb-4 relative z-10">
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="size-12 rounded-full bg-[#1a1a1e] text-white border border-white/10 flex items-center justify-center shadow-2xl hover:bg-primary hover:text-black transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">add</span>
                </button>
            </div>
        </div>

        {/* 6. List Section */}
        <div className="flex-1 bg-surface-highlight/30 rounded-t-[2.5rem] p-6 pb-24 md:pb-6 border-t border-white/5 backdrop-blur-sm">
            {portfolio.length === 0 ? (
                 <div className="text-center text-zinc-500 py-10">
                    <p>No assets found.</p>
                 </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {chartData.map((item) => {
                        const originalItem = portfolio.find(p => p.ticker === item.ticker);
                        const percent = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                        const stock = GLOBAL_STOCKS.find(s => s.ticker === item.ticker);

                        return (
                            <div key={item.ticker} className="flex items-center justify-between p-1">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-white flex items-center justify-center text-black font-bold text-xs shadow-lg overflow-hidden relative shrink-0">
                                        {stock?.logo ? (
                                             <img 
                                                src={stock.logo} 
                                                alt={item.ticker} 
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-contain p-1.5"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerText = item.ticker.charAt(0);
                                                }}
                                            />
                                        ) : (
                                            item.ticker.charAt(0)
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold text-sm">{item.ticker}</span>
                                        <div className="w-24 h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: item.color }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-white font-mono font-medium text-sm">${item.value.toFixed(2)}</span>
                                        <span className="text-zinc-500 text-xs font-medium">{percent.toFixed(1)}%</span>
                                    </div>
                                    <button onClick={() => handleRemove(item.ticker)} className="text-zinc-600 hover:text-danger">
                                        <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Add Position Modal */}
        {showAddModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                 <div className="relative bg-[#1a1a1e] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold text-lg">Add Asset</h3>
                        <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                     </div>
                     
                     <form onSubmit={handleAddPosition} className="flex flex-col gap-4">
                        <div className="bg-background rounded-2xl p-4 border border-white/5">
                            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-2 block">Ticker Symbol</label>
                            <select 
                                value={newTicker}
                                onChange={e => setNewTicker(e.target.value)}
                                className="w-full bg-transparent text-white text-lg font-semibold outline-none border-b border-white/10 pb-2 focus:border-primary"
                            >
                                {GLOBAL_STOCKS.map(s => <option key={s.ticker} value={s.ticker}>{s.ticker} - {s.name}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background rounded-2xl p-4 border border-white/5">
                                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Quantity</label>
                                <input 
                                    type="number" 
                                    value={newQty} 
                                    onChange={e => setNewQty(Number(e.target.value))} 
                                    className="w-full bg-transparent text-white text-lg font-mono outline-none"
                                />
                            </div>
                            <div className="bg-background rounded-2xl p-4 border border-white/5">
                                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Cost Basis</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    value={newCost} 
                                    onChange={e => setNewCost(Number(e.target.value))} 
                                    className="w-full bg-transparent text-white text-lg font-mono outline-none"
                                />
                            </div>
                        </div>

                        <button type="submit" className="bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-2xl mt-4 shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
                            Confirm Position
                        </button>
                     </form>
                 </div>
            </div>
        )}
    </div>
  );
};

export default Portfolio;
import React from 'react';

const TickerTape: React.FC = () => {
  return (
    <div className="h-9 bg-surface-highlight border-t border-border shrink-0 flex items-center justify-between px-6 text-xs font-medium sticky bottom-0 z-30">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="text-text-dim">SPX</span>
          <span className="text-primary font-mono">4,500.23 <span className="bg-emerald-500/10 px-1 rounded text-[10px] ml-1">+0.5%</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-dim">VIX</span>
          <span className="text-danger font-mono">13.50 <span className="bg-rose-500/10 px-1 rounded text-[10px] ml-1">-2.1%</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-dim">NDX</span>
          <span className="text-primary font-mono">15,300.12 <span className="bg-emerald-500/10 px-1 rounded text-[10px] ml-1">+0.8%</span></span>
        </div>
         <div className="flex items-center gap-2">
          <span className="text-text-dim">FTSE</span>
          <span className="text-primary font-mono">7,680.50 <span className="bg-emerald-500/10 px-1 rounded text-[10px] ml-1">+0.3%</span></span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-text-dim">
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-emerald-500 shadow-glow"></div>
          <span>Operational</span>
        </div>
        <span>Updated: {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', timeZone: 'UTC'})} UTC</span>
      </div>
    </div>
  );
};

export default TickerTape;

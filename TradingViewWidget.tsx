import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    // --- CHART LOGIC ---
    let tvSymbol = symbol;

    // If the symbol already includes an exchange (e.g. "NASDAQ:AAPL" or "TADAWUL:2222"), use it directly.
    // This is passed from constants.ts `tradingViewSymbol`.
    if (symbol.includes(':')) {
        tvSymbol = symbol;
    } else {
        // Fallback heuristic if just a ticker is passed (mostly for legacy/search support)
        if (symbol.endsWith('.SR')) {
          // Native TADAWUL charts often fail in the free embed widget.
          // Fallback to KSA ETF for Middle East region visibility.
          tvSymbol = "AMEX:KSA"; 
        } else if (symbol.endsWith('.L')) {
          tvSymbol = `LSE:${symbol.replace('.L', '')}`;
        } else if (symbol.endsWith('.PA')) {
          tvSymbol = `EURONEXT:${symbol.replace('.PA', '')}`;
        } else if (symbol.endsWith('.DE')) {
          tvSymbol = `XETR:${symbol.replace('.DE', '')}`;
        } else if (symbol.endsWith('.HK')) {
          let clean = symbol.replace('.HK', '');
          if (clean.startsWith('0')) clean = clean.substring(1);
          tvSymbol = `HKEX:${clean}`;
        } else if (symbol.endsWith('.T')) {
          tvSymbol = `TSE:${symbol.replace('.T', '')}`;
        } else {
            // US / Default
            // Try to force exchange if known high volume, else let TV resolve
            const nasdaqList = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'AMD', 'META', 'NFLX'];
            if (nasdaqList.includes(symbol)) {
                tvSymbol = `NASDAQ:${symbol}`;
            } else if (!symbol.includes(':')) {
                // Default to NYSE for generic US tickers if not specified
                tvSymbol = `NYSE:${symbol}`;
            }
        }
    }

    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": tvSymbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "calendar": false,
      "hide_volume": false, 
      "support_host": "https://www.tradingview.com"
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container h-full w-full rounded-2xl overflow-hidden bg-surface" ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
};

export default TradingViewWidget;
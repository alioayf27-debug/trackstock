import { Alert, PortfolioItem } from "../types";

const WATCHLIST_KEY = "trackstock_watchlist";
const ALERTS_KEY = "trackstock_alerts";
const PORTFOLIO_KEY = "trackstock_portfolio";

// --- Watchlist ---
export const getWatchlist = (): string[] => {
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToWatchlist = (ticker: string): string[] => {
  const current = getWatchlist();
  if (!current.includes(ticker)) {
    const updated = [...current, ticker];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    return updated;
  }
  return current;
};

export const removeFromWatchlist = (ticker: string): string[] => {
  const current = getWatchlist();
  const updated = current.filter(t => t !== ticker);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  return updated;
};

// --- Alerts ---
export const getAlerts = (): Alert[] => {
  const stored = localStorage.getItem(ALERTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addAlert = (alert: Alert): Alert[] => {
  const current = getAlerts();
  const updated = [...current, alert];
  localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  return updated;
};

export const removeAlert = (id: string): Alert[] => {
  const current = getAlerts();
  const updated = current.filter(a => a.id !== id);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  return updated;
};

// --- Portfolio ---
export const getPortfolio = (): PortfolioItem[] => {
  const stored = localStorage.getItem(PORTFOLIO_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToPortfolio = (item: PortfolioItem): PortfolioItem[] => {
  const current = getPortfolio();
  // Check if ticker already exists to aggregate
  const index = current.findIndex(p => p.ticker === item.ticker);
  
  let updated: PortfolioItem[];
  
  if (index >= 0) {
    const existing = current[index];
    const newQty = existing.quantity + item.quantity;
    // Weighted Average Cost
    const newAvgCost = ((existing.quantity * existing.avgCost) + (item.quantity * item.avgCost)) / newQty;
    
    updated = [...current];
    updated[index] = {
        ...existing,
        quantity: newQty,
        avgCost: newAvgCost
    };
  } else {
    updated = [...current, item];
  }
  
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updated));
  return updated;
};

export const removeFromPortfolio = (ticker: string): PortfolioItem[] => {
    const current = getPortfolio();
    const updated = current.filter(i => i.ticker !== ticker);
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updated));
    return updated;
};
export enum Plan {
  FREE = 'Free',
  PRO = 'Pro',
  ELITE = 'Elite',
  OWNER = 'Owner'
}

export interface User {
  email: string;
  plan: Plan;
  name: string;
}

export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  exchange: string;
  marketCap: string;
  currency: string;
  peRatio?: number;
  sector?: string;
  logo?: string;
  volume: string;
  region: 'US' | 'Europe' | 'Asia' | 'MiddleEast';
  lastUpdated?: number;
  aiScore: number; // 1-10 Score
  aiVerdict: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  tradingViewSymbol?: string; // Explicit mapping for charts
  beta?: number;
  dividend?: string;
}

export interface MarketStatus {
  isOpen: boolean;
  label: string;
  updatedAt: string;
}

export interface NewsItem {
  source: string;
  time: string;
  headline: string;
  url: string;
}

export interface Alert {
  id: string;
  ticker: string;
  type: 'PRICE_TARGET' | 'PERCENT_CHANGE';
  condition: 'ABOVE' | 'BELOW';
  value: number;
  active: boolean;
  createdAt: string;
}

export interface PortfolioItem {
  ticker: string;
  quantity: number;
  avgCost: number;
  purchaseDate: string;
}
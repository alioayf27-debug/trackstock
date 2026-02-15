import { Stock, NewsItem } from "./types";

export const APP_NAME = "TrackStock";
export const DEMO_USER_EMAIL = "alex@trackstock.io";
export const FINNHUB_API_KEY = "d5u7tjpr01qtjet2aub0d5u7tjpr01qtjet2aubg";

// Expanded stock list with AI Scores, explicit TradingView symbols, and Real Logos
export const GLOBAL_STOCKS: Stock[] = [
  // US Markets (Tech)
  { ticker: "AAPL", name: "Apple Inc.", price: 226.00, change: 1.25, changePercent: 0.55, exchange: "NASDAQ", marketCap: "3.4T", currency: "USD", peRatio: 33.5, sector: "Technology", logo: "https://logo.clearbit.com/apple.com", volume: "45.2M", region: "US", aiScore: 8.8, aiVerdict: "Buy", tradingViewSymbol: "NASDAQ:AAPL", beta: 1.24, dividend: "0.44%" },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: 138.50, change: 2.40, changePercent: 1.76, exchange: "NASDAQ", marketCap: "3.2T", currency: "USD", peRatio: 74.2, sector: "Technology", logo: "https://logo.clearbit.com/nvidia.com", volume: "320M", region: "US", aiScore: 9.5, aiVerdict: "Strong Buy", tradingViewSymbol: "NASDAQ:NVDA", beta: 1.68, dividend: "0.03%" },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 448.20, change: -1.10, changePercent: -0.24, exchange: "NASDAQ", marketCap: "3.1T", currency: "USD", peRatio: 36.1, sector: "Technology", logo: "https://logo.clearbit.com/microsoft.com", volume: "22.1M", region: "US", aiScore: 9.0, aiVerdict: "Buy", tradingViewSymbol: "NASDAQ:MSFT", beta: 0.89, dividend: "0.68%" },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: 178.60, change: 0.80, changePercent: 0.45, exchange: "NASDAQ", marketCap: "2.2T", currency: "USD", peRatio: 26.5, sector: "Technology", logo: "https://logo.clearbit.com/google.com", volume: "18.5M", region: "US", aiScore: 8.2, aiVerdict: "Buy", tradingViewSymbol: "NASDAQ:GOOGL", beta: 1.05, dividend: "0.20%" },
  { ticker: "AMZN", name: "Amazon.com", price: 195.20, change: 3.20, changePercent: 1.66, exchange: "NASDAQ", marketCap: "2.0T", currency: "USD", peRatio: 42.2, sector: "Consumer", logo: "https://logo.clearbit.com/amazon.com", volume: "35.2M", region: "US", aiScore: 8.5, aiVerdict: "Buy", tradingViewSymbol: "NASDAQ:AMZN", beta: 1.15, dividend: "N/A" },
  { ticker: "TSLA", name: "Tesla Inc.", price: 218.50, change: -5.50, changePercent: -2.45, exchange: "NASDAQ", marketCap: "720B", currency: "USD", peRatio: 58.1, sector: "Automotive", logo: "https://logo.clearbit.com/tesla.com", volume: "89.1M", region: "US", aiScore: 4.5, aiVerdict: "Sell", tradingViewSymbol: "NASDAQ:TSLA", beta: 2.30, dividend: "N/A" },
  { ticker: "AMD", name: "Advanced Micro Devices", price: 165.00, change: 4.20, changePercent: 2.61, exchange: "NASDAQ", marketCap: "260B", currency: "USD", peRatio: 45.5, sector: "Technology", logo: "https://logo.clearbit.com/amd.com", volume: "65.4M", region: "US", aiScore: 7.8, aiVerdict: "Hold", tradingViewSymbol: "NASDAQ:AMD", beta: 1.65, dividend: "N/A" },
  
  // US Markets (Finance/Other)
  { ticker: "JPM", name: "JPMorgan Chase", price: 212.00, change: 1.50, changePercent: 0.71, exchange: "NYSE", marketCap: "605B", currency: "USD", peRatio: 12.2, sector: "Finance", logo: "https://logo.clearbit.com/jpmorganchase.com", volume: "8.2M", region: "US", aiScore: 7.5, aiVerdict: "Hold", tradingViewSymbol: "NYSE:JPM", beta: 1.10, dividend: "2.35%" },
  { ticker: "V", name: "Visa Inc.", price: 288.80, change: 0.40, changePercent: 0.14, exchange: "NYSE", marketCap: "580B", currency: "USD", peRatio: 28.1, sector: "Finance", logo: "https://logo.clearbit.com/visa.com", volume: "5.1M", region: "US", aiScore: 8.0, aiVerdict: "Buy", tradingViewSymbol: "NYSE:V", beta: 0.95, dividend: "0.75%" },
  
  // Saudi Arabia (Tadawul)
  { ticker: "2222.SR", name: "Saudi Aramco", price: 27.25, change: 0.10, changePercent: 0.37, exchange: "Tadawul", marketCap: "6.8T", currency: "SAR", peRatio: 15.6, sector: "Energy", logo: "https://logo.clearbit.com/aramco.com", volume: "10.5M", region: "MiddleEast", aiScore: 7.2, aiVerdict: "Hold", tradingViewSymbol: "AMEX:KSA", beta: 0.60, dividend: "6.15%" },
  { ticker: "1120.SR", name: "Al Rajhi Bank", price: 87.50, change: 0.80, changePercent: 0.92, exchange: "Tadawul", marketCap: "96B", currency: "SAR", peRatio: 19.5, sector: "Finance", logo: "https://logo.clearbit.com/alrajhibank.com.sa", volume: "3.8M", region: "MiddleEast", aiScore: 8.1, aiVerdict: "Buy", tradingViewSymbol: "AMEX:KSA", beta: 1.05, dividend: "2.85%" },
  { ticker: "2010.SR", name: "SABIC", price: 73.10, change: -0.40, changePercent: -0.54, exchange: "Tadawul", marketCap: "68B", currency: "SAR", peRatio: 23.2, sector: "Materials", logo: "https://logo.clearbit.com/sabic.com", volume: "1.9M", region: "MiddleEast", aiScore: 5.9, aiVerdict: "Hold", tradingViewSymbol: "AMEX:KSA", beta: 1.20, dividend: "3.55%" },
  
  // UK (LSE)
  { ticker: "VOD.L", name: "Vodafone Group", price: 71.20, change: 0.50, changePercent: 0.71, exchange: "LSE", marketCap: "19.2B", currency: "GBP", peRatio: 15.8, sector: "Telecom", logo: "https://logo.clearbit.com/vodafone.com", volume: "14.5M", region: "Europe", aiScore: 4.8, aiVerdict: "Hold", tradingViewSymbol: "LSE:VOD", beta: 0.75, dividend: "9.50%" },
  { ticker: "SHEL.L", name: "Shell PLC", price: 2510.50, change: -12.00, changePercent: -0.48, exchange: "LSE", marketCap: "175B", currency: "GBP", peRatio: 8.0, sector: "Energy", logo: "https://logo.clearbit.com/shell.com", volume: "8.8M", region: "Europe", aiScore: 7.8, aiVerdict: "Buy", tradingViewSymbol: "LSE:SHEL", beta: 0.68, dividend: "3.95%" },
  { ticker: "AZN.L", name: "AstraZeneca", price: 10320.00, change: 85.00, changePercent: 0.83, exchange: "LSE", marketCap: "182B", currency: "GBP", peRatio: 36.2, sector: "Healthcare", logo: "https://logo.clearbit.com/astrazeneca.com", volume: "1.4M", region: "Europe", aiScore: 8.5, aiVerdict: "Buy", tradingViewSymbol: "LSE:AZN", beta: 0.55, dividend: "2.15%" },
  
  // Europe (Euronext/Xetra)
  { ticker: "MC.PA", name: "LVMH", price: 592.00, change: -5.50, changePercent: -0.92, exchange: "Euronext", marketCap: "298B", currency: "EUR", peRatio: 21.2, sector: "Consumer", logo: "https://logo.clearbit.com/lvmh.com", volume: "550K", region: "Europe", aiScore: 6.1, aiVerdict: "Hold", tradingViewSymbol: "EURONEXT:MC", beta: 1.15, dividend: "2.10%" },
  { ticker: "SAP.DE", name: "SAP SE", price: 218.40, change: 4.20, changePercent: 1.96, exchange: "XETRA", marketCap: "240B", currency: "EUR", peRatio: 49.5, sector: "Technology", logo: "https://logo.clearbit.com/sap.com", volume: "2.2M", region: "Europe", aiScore: 9.1, aiVerdict: "Strong Buy", tradingViewSymbol: "XETR:SAP", beta: 1.08, dividend: "1.35%" },
  
  // Asia
  { ticker: "BABA", name: "Alibaba Group", price: 88.50, change: 1.80, changePercent: 2.08, exchange: "NYSE", marketCap: "228B", currency: "USD", peRatio: 17.8, sector: "Consumer", logo: "https://logo.clearbit.com/alibaba.com", volume: "17.2M", region: "Asia", aiScore: 7.0, aiVerdict: "Buy", tradingViewSymbol: "NYSE:BABA", beta: 0.65, dividend: "1.10%" },
  { ticker: "0700.HK", name: "Tencent", price: 412.00, change: 5.60, changePercent: 1.38, exchange: "HKEX", marketCap: "475B", currency: "HKD", peRatio: 24.8, sector: "Technology", logo: "https://logo.clearbit.com/tencent.com", volume: "20.5M", region: "Asia", aiScore: 8.2, aiVerdict: "Buy", tradingViewSymbol: "HKEX:700", beta: 0.98, dividend: "1.15%" },
  { ticker: "7203.T", name: "Toyota Motor", price: 2710.0, change: 15.0, changePercent: 0.56, exchange: "TSE", marketCap: "235B", currency: "JPY", peRatio: 10.1, sector: "Automotive", logo: "https://logo.clearbit.com/global.toyota", volume: "18.5M", region: "Asia", aiScore: 6.8, aiVerdict: "Hold", tradingViewSymbol: "TSE:7203", beta: 0.58, dividend: "2.85%" },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    source: "Bloomberg",
    time: "2m ago",
    headline: "AI infrastructure spending expected to top $200B this quarter, analysts say.",
    url: "#"
  },
  {
    source: "Reuters",
    time: "15m ago",
    headline: "Oil prices fluctuate as geopolitical tensions rise in the Middle East.",
    url: "#"
  },
  {
    source: "TechCrunch",
    time: "1h ago",
    headline: "New tech IPOs are gaining traction despite market volatility.",
    url: "#"
  },
  {
    source: "WSJ",
    time: "2h ago",
    headline: "Fed officials signal potential rate cut in coming months.",
    url: "#"
  },
  {
    source: "FT",
    time: "3h ago",
    headline: "European luxury sector faces headwinds from slowing demand in China.",
    url: "#"
  }
];
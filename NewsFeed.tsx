import React, { useState, useEffect } from 'react';
import { MOCK_NEWS } from '../../constants';
import { User, Plan, NewsItem } from '../../types';
import * as GeminiService from '../../services/geminiService';

interface NewsFeedProps {
  user: User;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ user }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(MOCK_NEWS);
  const [summaries, setSummaries] = useState<Record<number, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<number, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch news on mount and set up hourly interval
  useEffect(() => {
    fetchLatestNews();

    const intervalId = setInterval(() => {
        fetchLatestNews();
    }, 3600000); // 1 Hour

    return () => clearInterval(intervalId);
  }, []);

  const fetchLatestNews = async () => {
      setIsRefreshing(true);
      const freshNews = await GeminiService.getMarketNews();
      if (freshNews.length > 0) {
          setNewsItems(freshNews);
          // Clear old summaries as they won't match new headlines
          setSummaries({});
      }
      setIsRefreshing(false);
  };

  const handleSummarize = async (index: number, headline: string, source: string) => {
    if (summaries[index]) return; // Already summarized

    setLoadingSummaries(prev => ({ ...prev, [index]: true }));
    
    // Generate summary
    const summary = await GeminiService.getNewsSummary(headline, source);
    
    setSummaries(prev => ({ ...prev, [index]: summary }));
    setLoadingSummaries(prev => ({ ...prev, [index]: false }));
  };

  return (
    <div className="flex flex-col h-full p-6 pb-28 lg:pb-8 overflow-y-auto">
        <div className="mb-8 flex items-end justify-between">
            <div>
                <h2 className="text-white text-2xl font-semibold tracking-tight mb-1">Global Market News</h2>
                <div className="flex items-center gap-2">
                    <p className="text-text-muted text-sm">Real-time headlines and AI-powered insights.</p>
                    {isRefreshing && (
                        <span className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
                            <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
                            Updating...
                        </span>
                    )}
                </div>
            </div>
            <button 
                onClick={fetchLatestNews} 
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                title="Refresh News"
            >
                <span className={`material-symbols-outlined text-[20px] ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news, index) => (
                <div key={index} className="glass-panel p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group flex flex-col h-full animate-in fade-in duration-500">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${index % 2 === 0 ? 'bg-primary' : 'bg-blue-400'}`}></span>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-wide truncate max-w-[150px]">{news.source}</span>
                        </div>
                        <span className="text-[10px] text-text-dim font-medium bg-white/5 px-2 py-0.5 rounded whitespace-nowrap">{news.time}</span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-white font-medium text-lg leading-snug mb-4 group-hover:text-primary transition-colors cursor-pointer">
                        {news.headline}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-4">
                        
                        {/* Summary Section */}
                        {summaries[index] ? (
                            <div className="bg-surface-highlight/50 rounded-xl p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-sm text-indigo-400">auto_awesome</span>
                                    <span className="text-[10px] font-bold text-indigo-300 uppercase">AI Summary</span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {summaries[index]}
                                </p>
                            </div>
                        ) : loadingSummaries[index] ? (
                            <div className="bg-surface-highlight/30 rounded-xl p-3 animate-pulse">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="size-3 rounded-full bg-white/10"></div>
                                    <div className="h-2 w-16 bg-white/10 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/10 rounded"></div>
                                    <div className="h-2 w-5/6 bg-white/10 rounded"></div>
                                </div>
                            </div>
                        ) : null}

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-3">
                            <button 
                                onClick={() => handleSummarize(index, news.headline, news.source)}
                                disabled={!!summaries[index] || loadingSummaries[index]}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                                    summaries[index] 
                                    ? 'text-gray-500 cursor-default' 
                                    : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-[16px] ${loadingSummaries[index] ? 'animate-spin' : ''}`}>
                                    {loadingSummaries[index] ? 'progress_activity' : summaries[index] ? 'check' : 'auto_awesome'}
                                </span>
                                {summaries[index] ? 'Summarized' : 'AI Summary'}
                            </button>
                            
                            <a 
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 transition-colors flex items-center justify-center"
                                title="Read Full Story"
                            >
                                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {user.plan === Plan.FREE && (
             <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-surface-highlight to-surface border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                     <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">lock_open</span>
                     </div>
                     <div>
                         <h4 className="text-sm font-bold text-white">Want more sources?</h4>
                         <p className="text-xs text-text-muted">Pro users get access to 50+ premium news feeds.</p>
                     </div>
                </div>
                <button className="text-xs font-bold text-black bg-primary px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors whitespace-nowrap">
                    Upgrade
                </button>
             </div>
        )}
    </div>
  );
};

export default NewsFeed;
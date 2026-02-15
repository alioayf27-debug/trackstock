import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Plan, Alert } from '../../types';
import * as UserService from '../../services/userService';
import { GLOBAL_STOCKS } from '../../constants';

interface AlertsProps {
  user: User;
}

const Alerts: React.FC<AlertsProps> = ({ user }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [ticker, setTicker] = useState(GLOBAL_STOCKS[0].ticker);
  const [type, setType] = useState<'PRICE_TARGET' | 'PERCENT_CHANGE'>('PRICE_TARGET');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [value, setValue] = useState<string>('');
  
  const isElite = user.plan === Plan.ELITE;

  useEffect(() => {
    setAlerts(UserService.getAlerts());
  }, []);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: Alert = {
      id: Date.now().toString(),
      ticker,
      type,
      condition,
      value: parseFloat(value),
      active: true,
      createdAt: new Date().toISOString()
    };
    const updated = UserService.addAlert(newAlert);
    setAlerts(updated);
    setValue('');
    alert(`Alert created for ${ticker}! (Simulated)`);
  };

  const handleRemoveAlert = (id: string) => {
    const updated = UserService.removeAlert(id);
    setAlerts(updated);
  };

  if (!isElite) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center relative overflow-hidden pb-28 lg:pb-8">
             <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 blur-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop')" }}></div>
             <div className="z-10 bg-surface/80 p-10 rounded-2xl border border-white/10 backdrop-blur-xl max-w-md">
                  <div className="w-16 h-16 rounded-full bg-surface-highlight flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-glow">
                      <span className="material-symbols-outlined text-primary text-3xl">notifications_active</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Elite Alerts Locked</h2>
                  <p className="text-text-muted mb-8">Real-time price targets and volatility alerts are exclusive to TrackStock Elite members.</p>
                  <div className="flex flex-col gap-3">
                      <Link to="/pricing" className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                          Upgrade to Elite
                      </Link>
                      <Link to="/" className="text-sm text-text-dim hover:text-white transition-colors">
                          Return to Dashboard
                      </Link>
                  </div>
             </div>
        </div>
    );
  }

  // Added pb-28
  return (
    <div className="flex flex-col h-full p-8 pb-28 lg:pb-8 overflow-y-auto">
        <div className="mb-8">
            <h2 className="text-white text-2xl font-semibold tracking-tight mb-1">Price Alerts</h2>
            <p className="text-text-muted text-sm">Manage your real-time market notifications.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Alert Form */}
            <div className="lg:col-span-1">
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">add_alert</span>
                        Create New Alert
                    </h3>
                    <form onSubmit={handleCreateAlert} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-text-dim uppercase font-semibold">Asset</label>
                            <select 
                                value={ticker} 
                                onChange={(e) => setTicker(e.target.value)}
                                className="bg-surface-highlight border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary/50"
                            >
                                {GLOBAL_STOCKS.map(s => (
                                    <option key={s.ticker} value={s.ticker}>{s.ticker} - {s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-text-dim uppercase font-semibold">Trigger Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setType('PRICE_TARGET')}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${type === 'PRICE_TARGET' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-white/5 text-text-muted hover:border-white/10'}`}
                                >
                                    Price Target
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setType('PERCENT_CHANGE')}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${type === 'PERCENT_CHANGE' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-white/5 text-text-muted hover:border-white/10'}`}
                                >
                                    % Change
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-text-dim uppercase font-semibold">Condition</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setCondition('ABOVE')}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${condition === 'ABOVE' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-white/5 text-text-muted hover:border-white/10'}`}
                                >
                                    Above / Rise
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setCondition('BELOW')}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${condition === 'BELOW' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-white/5 text-text-muted hover:border-white/10'}`}
                                >
                                    Below / Drop
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-text-dim uppercase font-semibold">Value {type === 'PERCENT_CHANGE' ? '(%)' : '($)'}</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="bg-surface-highlight border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary/50 placeholder-text-dim"
                                placeholder={type === 'PERCENT_CHANGE' ? "5.0" : "150.00"}
                                required
                            />
                        </div>

                        <button type="submit" className="mt-2 w-full py-2.5 bg-primary hover:bg-primary-hover text-black font-semibold rounded-lg transition-colors shadow-lg shadow-primary/20">
                            Set Alert
                        </button>
                    </form>
                </div>
            </div>

            {/* Alert List */}
            <div className="lg:col-span-2">
                <div className="glass-panel rounded-xl border border-white/5 overflow-hidden min-h-[400px]">
                    <div className="px-6 py-4 border-b border-white/5 bg-surface-highlight/30">
                        <h3 className="text-white font-medium">Active Alerts</h3>
                    </div>
                    {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                            <p>No active alerts set.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {alerts.map(alert => (
                                <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-surface-highlight flex items-center justify-center border border-white/5 font-bold text-white">
                                            {alert.ticker.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-semibold">{alert.ticker}</h4>
                                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 border border-white/5">{alert.type === 'PRICE_TARGET' ? 'PRICE' : 'VOLATILITY'}</span>
                                            </div>
                                            <p className="text-sm text-text-muted mt-0.5">
                                                Alert when {alert.type === 'PRICE_TARGET' ? 'price' : 'change'} is <span className="text-primary font-medium">{alert.condition.toLowerCase()}</span> {alert.value}{alert.type === 'PERCENT_CHANGE' ? '%' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg" title="Test Notification">
                                             <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </button>
                                        <button onClick={() => handleRemoveAlert(alert.id)} className="p-2 text-text-muted hover:text-danger hover:bg-danger-soft rounded-lg" title="Delete">
                                             <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Alerts;
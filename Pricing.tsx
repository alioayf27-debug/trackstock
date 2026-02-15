import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plan, User } from '../../types';
import * as AuthService from '../../services/authService';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<'SIGNUP' | 'PAYMENT' | 'PROCESSING'>('SIGNUP');
  const [selectedPlan, setSelectedPlan] = useState<Plan>(Plan.FREE);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Reactive user state to handle signup-in-place
  const [user, setUser] = useState<User | null>(AuthService.getSession());

  useEffect(() => {
      // Refresh user state if it changes (e.g. they logged in via signup form)
      const handleAuthChange = () => {
          setUser(AuthService.getSession());
      };
      AuthService.authEvents.addEventListener('auth-change', handleAuthChange);
      return () => {
          AuthService.authEvents.removeEventListener('auth-change', handleAuthChange);
      }
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    const currentUser = AuthService.getSession(); // Get freshest state
    
    if (plan === Plan.FREE) {
        if (!currentUser) {
            // If free and not logged in, just go to signup flow then redirect
            setStep('SIGNUP');
            setModalOpen(true);
        } else {
            // Already logged in, just downgrading (mock)
            AuthService.upgradePlan(Plan.FREE);
            navigate('/');
        }
        return;
    }

    // Paid plans
    if (currentUser) {
        // Skip signup, go straight to payment
        setStep('PAYMENT');
        setModalOpen(true);
    } else {
        // Need signup first
        setStep('SIGNUP');
        setModalOpen(true);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
      e.preventDefault();
      // Create user locally
      AuthService.login(email, Plan.FREE); // Start as free, then upgrade in next step
      // State listener will update 'user', enabling payment step
      setStep('PAYMENT');
  };

  const handlePayment = (e: React.FormEvent) => {
      e.preventDefault();
      setStep('PROCESSING');
      
      // Simulate API call
      setTimeout(() => {
          AuthService.upgradePlan(selectedPlan);
          setModalOpen(false);
          navigate('/');
      }, 2000);
  };

  return (
    <div className="bg-background text-white font-sans antialiased h-screen overflow-y-auto overflow-x-hidden relative selection:bg-primary selection:text-black">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-glow pointer-events-none opacity-60"></div>
       
       <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="material-symbols-outlined text-primary text-2xl">ssid_chart</span>
                    <span className="text-lg font-semibold tracking-tight">TrackStock</span>
                </div>
                <nav className="flex items-center gap-8">
                    {user ? (
                        <button onClick={() => navigate('/')} className="text-sm font-medium text-text-muted hover:text-white transition-colors">Dashboard</button>
                    ) : (
                        <button onClick={() => navigate('/login')} className="text-sm font-medium text-text-muted hover:text-white transition-colors">Log In</button>
                    )}
                </nav>
            </div>
        </header>

        <main className="flex-grow flex flex-col items-center relative z-10">
            <div className="w-full max-w-7xl px-6 pt-20 pb-12 lg:px-8 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Powerful insights.<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Simple pricing.</span>
                </h1>
                <p className="text-lg text-text-muted max-w-2xl mx-auto mb-16 font-light">
                    Start tracking global markets with precision. Choose the plan that fits your trading style.
                </p>
            </div>

            <div className="w-full max-w-7xl px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    
                    {/* Free */}
                    <div className="relative flex flex-col p-8 rounded-3xl bg-surface border border-white/5 hover:border-white/10 transition-colors">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white mb-2">Free</h3>
                            <p className="text-sm text-text-muted">Essential tools for casual tracking.</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">$0</span>
                            <span className="text-text-muted">/mo</span>
                        </div>
                        <ul className="flex-1 space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-gray-300">
                                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                <span>Top 3 Stocks Access</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-600">
                                <span className="material-symbols-outlined text-gray-700 text-[20px]">cancel</span>
                                <span>Stock Details Locked</span>
                            </li>
                        </ul>
                         <button onClick={() => handleSelectPlan(Plan.FREE)} className="w-full py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/5">
                            {user?.plan === Plan.FREE ? 'Current Plan' : 'Select Free'}
                        </button>
                    </div>

                    {/* Pro */}
                    <div className="relative flex flex-col p-8 rounded-3xl bg-surface-highlight border border-primary/30 shadow-[0_0_40px_rgba(52,211,153,0.1)] transform md:-translate-y-4">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                            Most Popular
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white mb-2">Pro</h3>
                            <p className="text-sm text-text-muted">Advanced tools for active traders.</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">$29.99</span>
                            <span className="text-text-muted">/mo</span>
                        </div>
                         <ul className="flex-1 space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-white">
                                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                <span>Global Market Access</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white">
                                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                <span>Real-time Data Stream</span>
                            </li>
                             <li className="flex items-start gap-3 text-sm text-white">
                                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                <span>Unlock Stock Details</span>
                            </li>
                        </ul>
                        <button onClick={() => handleSelectPlan(Plan.PRO)} className="w-full py-3 rounded-xl bg-primary text-black font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                            {user?.plan === Plan.PRO ? 'Current Plan' : 'Subscribe Pro'}
                        </button>
                    </div>

                    {/* Elite */}
                    <div className="relative flex flex-col p-8 rounded-3xl bg-surface border border-white/5 hover:border-white/10 transition-colors">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white mb-2">Elite</h3>
                            <p className="text-sm text-text-muted">Maximum power for professionals.</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">$79.99</span>
                            <span className="text-text-muted">/mo</span>
                        </div>
                         <ul className="flex-1 space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-gray-300">
                                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                <span>Everything in Pro</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-300">
                                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                <span>AI Sentiment Analysis</span>
                            </li>
                        </ul>
                        <button onClick={() => handleSelectPlan(Plan.ELITE)} className="w-full py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/5">
                            {user?.plan === Plan.ELITE ? 'Current Plan' : 'Subscribe Elite'}
                        </button>
                    </div>

                </div>
            </div>
        </main>

        {/* Subscription Modal */}
        {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
                <div className="relative bg-surface border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
                    
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-surface-highlight/30">
                        <h3 className="text-lg font-semibold text-white">
                            {step === 'SIGNUP' ? 'Create Account' : step === 'PAYMENT' ? 'Secure Checkout' : 'Processing'}
                        </h3>
                        <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 'SIGNUP' && (
                            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                                <p className="text-sm text-text-muted mb-2">Create an account to continue with your {selectedPlan} plan selection.</p>
                                <div>
                                    <label className="text-xs font-semibold text-text-dim uppercase">Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        className="w-full mt-1 bg-surface-highlight border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primary/50"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-dim uppercase">Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full mt-1 bg-surface-highlight border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primary/50"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="mt-2 w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-xl transition-colors">
                                    Continue
                                </button>
                            </form>
                        )}

                        {step === 'PAYMENT' && (
                             <form onSubmit={handlePayment} className="flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white">Plan: <span className="font-bold text-primary">{selectedPlan}</span></span>
                                    <span className="text-sm text-white">{selectedPlan === Plan.PRO ? '$29.99/mo' : '$79.99/mo'}</span>
                                </div>
                                
                                <div className="p-4 bg-surface-highlight/50 rounded-lg border border-white/5 mb-2">
                                    <div className="flex gap-3 mb-4">
                                        <div className="h-6 w-10 bg-white/10 rounded"></div>
                                        <div className="h-6 w-10 bg-white/10 rounded"></div>
                                        <div className="h-6 w-10 bg-white/10 rounded"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-semibold text-text-dim uppercase">Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-primary/50" defaultValue="4242 4242 4242 4242" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-semibold text-text-dim uppercase">Expiry</label>
                                                <input type="text" placeholder="MM/YY" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-primary/50" defaultValue="12/25" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-semibold text-text-dim uppercase">CVC</label>
                                                <input type="text" placeholder="123" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-primary/50" defaultValue="123" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-[10px] text-text-dim text-center">
                                    This is a secure demo transaction. No real payment will be processed.
                                </div>

                                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20">
                                    Pay & Subscribe
                                </button>
                             </form>
                        )}

                        {step === 'PROCESSING' && (
                            <div className="flex flex-col items-center justify-center py-8 gap-4">
                                <div className="size-12 rounded-full border-4 border-white/5 border-t-primary animate-spin"></div>
                                <div className="text-center">
                                    <h4 className="text-white font-medium">Processing Payment...</h4>
                                    <p className="text-sm text-text-muted">Please wait while we activate your {selectedPlan} plan.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Pricing;
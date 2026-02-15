import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as AuthService from '../../services/authService';
import { Plan } from '../../types';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
        // Default to PRO plan for demo ease, or checks predefined email
        const user = AuthService.login(email, Plan.FREE);
        
        if (user.plan === Plan.OWNER) {
            alert(`Welcome, Owner. A confirmation email has been sent to ${email} for security verification.`);
        }
        
        onLogin();
        navigate('/');
    }
  };

  return (
    <div className="font-display bg-[#09090b] text-white overflow-hidden h-screen w-screen relative selection:bg-emerald-500/30 selection:text-emerald-200 flex items-center justify-center">
        {/* Flat Background - No Image */}
        <div className="absolute inset-0 z-0 bg-[#09090b]"></div>
        
        <div className="relative z-20 w-full max-w-[440px] px-4">
            <div className="glass-panel rounded-2xl overflow-hidden transform transition-all shadow-2xl">
                <div className="pt-8 pb-6 px-8 text-center border-b border-white/5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 mb-4 border border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                        <span className="material-symbols-outlined text-2xl">ssid_chart</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">TrackStock</h1>
                    <p className="text-zinc-400 text-sm mt-1">Access global market intelligence.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
                    <div className="group">
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide ml-1" htmlFor="email">Email</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500 text-[20px] transition-colors group-focus-within:text-emerald-500">mail</span>
                            <input 
                                className="w-full bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-zinc-600 h-12 pl-12 pr-4 text-sm transition-all duration-200 outline-none hover:bg-white/[0.07]" 
                                id="email" 
                                type="email" 
                                placeholder="name@trackstock.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide ml-1" htmlFor="password">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500 text-[20px] transition-colors group-focus-within:text-emerald-500">lock</span>
                            <input 
                                className="w-full bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-zinc-600 h-12 pl-12 pr-12 text-sm transition-all duration-200 outline-none hover:bg-white/[0.07]" 
                                id="password" 
                                type="password" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-4">
                        <button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group transform active:scale-[0.98]">
                            <span>Create Account</span>
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </form>
                
                <div className="bg-black/20 p-4 text-center border-t border-white/5 backdrop-blur-md">
                    <p className="text-zinc-500 text-xs">
                        Already initialized? 
                        <a href="#" className="text-white hover:text-emerald-400 font-medium hover:underline underline-offset-4 ml-1 transition-colors">Log in here</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;
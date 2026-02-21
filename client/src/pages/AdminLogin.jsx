import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../apiConfig';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                toast.success('Access Granted. Welcome, Admin!');
                navigate('/admin/dashboard');
            } else {
                toast.error(data.error || 'Access Denied');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Connection failed. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/more-features')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Tools</span>
                </button>

                {/* Login Card */}
                <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#581845] via-[#900C3F] to-[#C70039]"></div>

                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-[#900C3F]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#900C3F]/20">
                            <Lock className="w-8 h-8 text-[#900C3F]" />
                        </div>
                        <h1 className="text-2xl font-black text-white text-center">Admin Portal</h1>
                        <p className="text-gray-400 text-sm mt-2 text-center uppercase tracking-widest font-bold">MSIT_ROOM SECURE ACCESS</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-tighter">Enter Master Password</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-[#242424] border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-[#900C3F]/50 outline-none transition-all placeholder:text-gray-600 font-mono"
                                />
                                <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#900C3F] transition-colors" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#900C3F] hover:bg-[#C70039] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-[#900C3F]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-start gap-3 bg-red-950/20 border border-red-900/30 p-4 rounded-2xl">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-red-200 leading-relaxed font-medium">
                            Warning: This area is for administrators only. All unauthorized access attempts are logged and monitored.
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-gray-600 text-xs font-medium">
                    &copy; 2026 MSIT_ROOM Centralized Academic Registry
                </p>
            </div>
        </div>
    );
};

// Simple ChevronRight since I forgot to import it
const ChevronRight = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default AdminLogin;

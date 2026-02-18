import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { ArrowRight, Clock, Users, Zap, Star, Quote, Shield, FileText, Share2, Trash2, Github, Linkedin, ExternalLink } from 'lucide-react';

const testimonials = [
    { name: "Sourin Roy", text: "The fastest way to share files effortlessly. Seamless experience!", role: "Student" },
    { name: "Bibek Biswas", text: "I love the auto-delete feature. Keeps everything clean and secure.", role: "Student" },
    { name: "Raj Ghorui", text: "Finally, a room app that doesn't require a login. Amazing UI!", role: "Student" },
    { name: "Supriti Bag", text: "Works perfectly on my phone. The best file sharing tool for students.", role: "Student" }
];

const Home = () => {
    const { createRoom, joinRoom } = useRoom();
    const [joinCode, setJoinCode] = useState('');
    const [duration, setDuration] = useState(30);

    const handleCreate = () => {
        createRoom(duration);
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (joinCode.trim().length === 6) {
            joinRoom(joinCode.toUpperCase());
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col overflow-x-hidden relative selection:bg-[#900C3F] selection:text-white">

            {/* Background Pattern - Dot Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.4]"
                style={{
                    backgroundImage: 'radial-gradient(#900C3F 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}>
            </div>

            {/* Floating Background Icons */}
            <div className="absolute top-20 left-10 text-[#900C3F]/10 animate-float-slow hidden md:block">
                <Shield className="w-24 h-24" />
            </div>
            <div className="absolute bottom-40 right-10 text-[#900C3F]/10 animate-float-medium hidden md:block">
                <FileText className="w-32 h-32" />
            </div>
            <div className="absolute top-1/3 right-1/4 text-[#900C3F]/5 animate-float-fast hidden md:block">
                <Zap className="w-16 h-16" />
            </div>

            {/* Header */}
            <header className="px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full z-10 relative">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <img src="/logo.svg" alt="MSIT Room Logo" className="w-12 h-12 transition-transform duration-500 group-hover:rotate-12 drop-shadow-xl" />
                    <span className="text-2xl font-black tracking-tight text-[#581845] hidden md:block group-hover:text-[#900C3F] transition-colors">MSIT ROOM</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center pt-12 pb-12 px-6 text-center max-w-6xl mx-auto w-full z-10">

                {/* Hero */}
                <div className="mb-16 space-y-6 max-w-3xl relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#900C3F]/5 rounded-full blur-3xl"></div>

                    <h1 className="text-5xl md:text-7xl font-black text-[#581845] leading-tight tracking-tighter relative drop-shadow-sm mb-6">
                        Create. <span className="text-[#900C3F]">Send.</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#900C3F] to-[#C70039]">Done.</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm md:text-base tracking-[0.3em] uppercase opacity-80">
                        Simple. Secure. Speed.
                    </p>
                    <div className="pt-4">
                        <Link to="/how-it-works" className="inline-flex items-center gap-2 text-[#900C3F] font-bold border-b-2 border-[#900C3F]/20 hover:border-[#900C3F] transition-colors pb-1 text-sm md:text-base">
                            <Zap className="w-4 h-4" /> See How It Works
                        </Link>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mb-24">

                    {/* Create Room Card */}
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-100 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#900C3F]/20 hover:-translate-y-2 transition-all duration-300 group text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <Zap className="w-40 h-40 text-[#900C3F]" />
                        </div>

                        <div className="w-16 h-16 bg-gradient-to-br from-[#900C3F] to-[#581845] rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-[#900C3F]/30 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Create Room</h2>
                        <p className="text-gray-500 mb-8 font-medium">Start a new session. Expire automatically.</p>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 group-hover:border-[#900C3F]/20 transition-colors">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#900C3F]" />
                                    <span className="text-sm font-bold text-gray-600">Expires in:</span>
                                </div>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="bg-transparent border-none text-lg font-black text-[#900C3F] cursor-pointer focus:ring-0 text-right pr-0 py-0 outline-none"
                                >
                                    <option value={5}>5 Min</option>
                                    <option value={10}>10 Min</option>
                                    <option value={15}>15 Min</option>
                                    <option value={30}>30 Min</option>
                                </select>
                            </div>

                            <button
                                onClick={handleCreate}
                                className="w-full py-4 bg-[#900C3F] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#900C3F]/30 hover:bg-[#700931] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Start Room <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Join Room Card */}
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-100 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#900C3F]/20 hover:-translate-y-2 transition-all duration-300 group text-left flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <Users className="w-40 h-40 text-gray-800" />
                        </div>

                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 text-gray-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Join Room</h2>
                        <p className="text-gray-500 mb-8 font-medium">Enter code to connect existing room.</p>

                        <form onSubmit={handleJoin} className="space-y-4 relative z-10">
                            <input
                                type="text"
                                placeholder="ENTER CODE"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="w-full py-4 px-6 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#900C3F] focus:bg-white focus:shadow-lg text-center text-3xl font-black tracking-[0.3em] text-[#900C3F] placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-bold transition-all appearance-none uppercase"
                            />
                            <button
                                type="submit"
                                disabled={joinCode.length !== 6}
                                className="w-full py-4 bg-white text-[#900C3F] border-2 border-[#900C3F]/10 rounded-xl font-bold text-lg hover:bg-[#900C3F] hover:text-white hover:border-[#900C3F] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                                Join Now
                            </button>
                        </form>
                    </div>

                </div>

                {/* Visual Features Section - CSS "Images" */}
                <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mb-24 px-4">

                    {/* Feature 1: Speed */}
                    <div className="group relative p-8 rounded-[2rem] bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#900C3F]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="w-16 h-16 bg-[#F5E6EC] rounded-2xl flex items-center justify-center mb-6 text-[#900C3F] group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                            <Zap className="w-8 h-8 fill-current" />
                        </div>
                        <h3 className="text-2xl font-black text-[#581845] mb-3">Lightning Fast</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            No login? Check. <br />
                            No setup? Check. <br />
                            Just create a room and start sharing in <span className="text-[#900C3F] font-bold">seconds</span>.
                        </p>
                    </div>

                    {/* Feature 2: Security */}
                    <div className="group relative p-8 rounded-[2rem] bg-gradient-to-br from-[#900C3F] to-[#581845] text-white shadow-xl hover:shadow-2xl hover:shadow-[#900C3F]/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden text-left transform md:scale-110 z-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                            <Shield className="w-8 h-8 fill-current" />
                        </div>
                        <h3 className="text-2xl font-black mb-3">End-to-End Secure</h3>
                        <p className="text-white/80 font-medium leading-relaxed">
                            Your data travels encrypted. <br />
                            Rooms <span className="font-bold text-white border-b-2 border-white/30">auto-destruct</span> after expiry. <br />
                            Zero digital footprint left behind.
                        </p>
                    </div>

                    {/* Feature 3: Anonymity */}
                    <div className="group relative p-8 rounded-[2rem] bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#900C3F]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="w-16 h-16 bg-[#F5E6EC] rounded-2xl flex items-center justify-center mb-6 text-[#900C3F] group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                            <Users className="w-8 h-8 fill-current" />
                        </div>
                        <h3 className="text-2xl font-black text-[#581845] mb-3">True Anonymity</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            No email required. <br />
                            No tracking cookies. <br />
                            <span className="text-[#900C3F] font-bold">Ghost Mode</span> enabled by default. You are invisible.
                        </p>
                    </div>

                </div>

                {/* Testimonials Section */}
                <div className="w-full overflow-hidden py-10 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

                    <h3 className="text-center font-bold text-[#900C3F]/80 uppercase tracking-[0.2em] mb-10 text-xs">Trusted by MSITians</h3>

                    {/* Marquee Container */}
                    <div className="relative flex overflow-x-hidden group">
                        <div className="animate-marquee flex gap-8 whitespace-nowrap py-4">
                            {[...testimonials, ...testimonials].map((t, i) => ( // Duplicate for infinite loop
                                <div key={i} className="inline-block w-80 md:w-96 p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:scale-105 hover:rotate-1 transition-all mx-4 cursor-default">
                                    <div className="flex flex-col gap-4 text-left whitespace-normal">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <p className="text-gray-600 font-medium leading-relaxed italic text-lg opacity-90">"{t.text}"</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="w-12 h-12 rounded-full ring-2 ring-[#900C3F]/10 bg-gradient-to-br from-[#900C3F] to-[#581845] flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-base">{t.name}</h4>
                                                <p className="text-xs font-bold text-[#900C3F] tracking-wide uppercase">{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>

            <footer className="py-8 px-6 md:px-12 text-sm font-medium border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">

                {/* Left Side: Socials */}
                <div className="flex items-center gap-4 order-2 md:order-1">
                    <a href="https://github.com/codewithsumanbyte" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:text-[#900C3F]" aria-label="GitHub">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/suman-banerjee-b83113270/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-blue-50 hover:text-[#0077b5] rounded-full transition-colors" aria-label="LinkedIn">
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>

                {/* Center: Credits */}
                <div className="flex flex-col items-center gap-1 order-1 md:order-2 text-center">
                    <p>From One MSITian to Another. Made with ❤️.</p>
                    <p className="text-xs opacity-80">Created by <span className="text-[#900C3F] font-bold">Suman Banerjee</span></p>
                </div>

                {/* Right: Links */}
                <div className="order-3 flex items-center gap-4">
                    <Link to="/privacy" className="text-gray-400 hover:text-[#900C3F] transition-colors text-xs underline decoration-dotted underline-offset-4">Privacy Policy</Link>
                </div>
            </footer>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    animation: marquee 40s linear infinite;
                    width: max-content;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-medium {
                     0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-5deg); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.05); }
                }
                .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
                .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
                .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default Home;

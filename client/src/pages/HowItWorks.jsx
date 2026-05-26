import React from 'react';
import { ArrowLeft, Zap, Shield, Clock, FileText, Send, Paperclip, Share2, Users, Layout, Lock, ScanLine } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HowItWorks = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#900C3F] selection:text-white pb-24">

            {/* Header */}
            <Navbar showBack={true} backText="Back" />

            <main className="max-w-4xl mx-auto px-6 py-12">

                {/* Hero */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <div className="inline-block p-3 bg-[#900C3F]/5 rounded-2xl mb-6">
                        <Zap className="w-8 h-8 text-[#900C3F]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#581845] mb-6">Master the Room.</h1>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        MSIT Room is designed for <span className="text-[#900C3F] font-bold">speed</span> and <span className="text-[#581845] font-bold">anonymity</span>. Here is exactly how to use it like a pro.
                    </p>
                </div>

                {/* Video Placeholder - CSS Only */}
                {/* Video Embed */}
                <div className="mb-24 relative overflow-hidden rounded-[2rem] shadow-2xl shadow-[#900C3F]/20 border-4 border-white aspect-video bg-gray-900">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/jjwCAJ60QPE"
                        title="MSIT Room Demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>

                {/* Step 1 */}
                <section className="mb-32 grid md:grid-cols-2 gap-12 items-center group">
                    <div className="order-2 md:order-1 transition-transform duration-500 group-hover:-translate-y-2">
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200 relative overflow-hidden shadow-inner">
                            {/* Mockup Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#900C3F] to-[#581845] rounded-xl flex items-center justify-center text-white shadow-md">
                                        <Layout className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="h-2.5 w-24 bg-gray-200 rounded-full mb-1.5"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex gap-2 text-gray-400 text-xs font-bold items-center">
                                            <Clock className="w-3.5 h-3.5" /> Expires in:
                                        </div>
                                        <div className="text-[#900C3F] font-black">30 Min</div>
                                    </div>
                                    <button className="w-full py-3 bg-[#900C3F] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#900C3F]/20 hover:bg-[#700931] transition-colors">
                                        Start Room
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <span className="text-[#900C3F] font-black text-6xl opacity-10 block mb-4 -ml-2 select-none">01</span>
                        <h2 className="text-3xl font-black text-[#581845] mb-4">Create or Join</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-6">
                            You don't need an account. Just pick an expiration time (5 to 30 mins) and click <strong>Start Room</strong>.
                        </p>
                        <ul className="space-y-4 text-gray-600 font-medium">
                            <li className="flex items-center gap-3">
                                <div className="p-1.5 bg-[#900C3F]/10 rounded-full text-[#900C3F]"><Zap className="w-4 h-4" /></div>
                                Generates a unique 6-digit code instantly.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-1.5 bg-[#900C3F]/10 rounded-full text-[#900C3F]"><Share2 className="w-4 h-4" /></div>
                                Share code or QR with friends.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-1.5 bg-[#900C3F]/10 rounded-full text-[#900C3F]"><Users className="w-4 h-4" /></div>
                                Works on Mobile & Desktop perfectly.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Step 2 */}
                <section className="mb-32 grid md:grid-cols-2 gap-12 items-center group">
                    <div>
                        <span className="text-[#900C3F] font-black text-6xl opacity-10 block mb-4 -ml-2 select-none">02</span>
                        <h2 className="text-3xl font-black text-[#581845] mb-4">Share Anything</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-6">
                            Once inside, it's a real-time playground. Chat instantly and drag-and-drop files of any size (up to 500MB).
                        </p>
                        <div className="bg-[#fff0f5] border border-[#900C3F]/10 p-5 rounded-2xl text-[#900C3F] text-sm font-bold flex gap-4 items-start shadow-sm">
                            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>Files are P2P transferred or stored temporarily in secure RAM memory, never permanently on a hard drive.</p>
                        </div>
                    </div>
                    <div className="transition-transform duration-500 group-hover:-translate-y-2">
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200 relative overflow-hidden shadow-inner flex items-center justify-center">
                            {/* Mockup Chat */}
                            <div className="w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-[#900C3F] h-10 w-full flex items-center px-4 gap-2 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                                    <div className="w-20 h-2.5 rounded-full bg-white/20"></div>
                                </div>
                                <div className="p-4 space-y-3 bg-gray-50/50 h-48 flex flex-col justify-end">
                                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 w-3/4">
                                        <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
                                        <div className="h-2 w-1/2 bg-gray-50 rounded-full"></div>
                                    </div>
                                    <div className="bg-[#900C3F] p-3 rounded-2xl rounded-br-none shadow-md w-3/4 ml-auto text-white">
                                        <div className="text-[10px] font-bold opacity-90">Checking out the file!</div>
                                    </div>
                                    {/* File Mockup */}
                                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center gap-3 w-3/4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500"><FileText className="w-4 h-4" /></div>
                                        <div className="flex-1">
                                            <div className="h-2 w-20 bg-gray-200 rounded-full mb-1"></div>
                                            <div className="h-1.5 w-8 bg-gray-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-3">
                                    <Paperclip className="w-4 h-4 text-gray-400" />
                                    <div className="h-8 flex-1 bg-gray-100 rounded-full px-3 text-[10px] text-gray-400 flex items-center">Type a message...</div>
                                    <div className="p-1.5 bg-[#900C3F] rounded-full text-white shadow-sm">
                                        <Send className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3 */}
                <section className="mb-32 grid md:grid-cols-2 gap-12 items-center group">
                    <div className="order-2 md:order-1 transition-transform duration-500 group-hover:-translate-y-2">
                        <div className="bg-gray-50 p-12 rounded-[2rem] border border-gray-200 relative overflow-hidden shadow-inner flex flex-col items-center justify-center text-center">
                            <div className="relative mb-8 group-hover:scale-110 transition-transform duration-500">
                                <div className="w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white shadow-lg">
                                    <div className="w-32 h-32 rounded-full border-[6px] border-[#900C3F] border-t-transparent animate-spin"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center font-black text-3xl text-[#900C3F] tracking-widest">
                                    00:00
                                </div>
                            </div>
                            <div className="bg-white px-8 py-3 rounded-full shadow-lg border border-gray-100 text-gray-500 font-bold text-sm flex items-center gap-2">
                                <Lock className="w-4 h-4 text-[#900C3F]" />
                                Session Expired
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <span className="text-[#900C3F] font-black text-6xl opacity-10 block mb-4 -ml-2 select-none">03</span>
                        <h2 className="text-3xl font-black text-[#581845] mb-4">Zero Footprint</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-6">
                            When the timer hits zero, the room is deleted forever. No history logs, no saved files, no "restore" button.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm font-medium">
                            <strong>Note:</strong> Messages and files within a room also have their own individual expiration timers for maximum security.
                        </div>
                    </div>
                </section>

                {/* Step 4: NEW - Common Room & QR */}
                <section className="mb-32 grid md:grid-cols-2 gap-12 items-center group">
                    <div>
                        <span className="text-[#900C3F] font-black text-6xl opacity-10 block mb-4 -ml-2 select-none">04</span>
                        <h2 className="text-3xl font-black text-[#581845] mb-4">Common Room & QR Scan</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-6">
                            Need a permanent place? The <strong>AIML3 Common Room</strong> stays alive indefinitely, while keeping your messages fresh with automatic pruning.
                        </p>
                        <ul className="space-y-4 text-gray-600 font-medium">
                            <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <div className="p-2 bg-[#900C3F]/10 rounded-lg text-[#900C3F]"><ScanLine className="w-5 h-5 transition-transform group-hover:scale-110" /></div>
                                <span><strong>QR Fast Join:</strong> Scan any room QR code to join instantly without typing.</span>
                            </li>
                            <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <div className="p-2 bg-[#900C3F]/10 rounded-lg text-[#900C3F]"><Users className="w-5 h-5" /></div>
                                <span><strong>Persistent Hub:</strong> Join the AIML3 room for long-term collaboration.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="transition-transform duration-500 group-hover:-translate-y-2">
                        <div className="bg-gradient-to-br from-[#900C3F]/5 to-[#581845]/5 p-8 rounded-[2rem] border-2 border-dashed border-[#900C3F]/20 flex flex-col items-center justify-center">
                            <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 relative group/qr">
                                <div className="absolute inset-0 bg-[#900C3F]/5 opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                    <ScanLine className="w-12 h-12 text-[#900C3F] animate-pulse" />
                                </div>
                                <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-100 flex flex-wrap gap-1 p-2">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className={`w-8 h-8 rounded-sm ${i % 3 === 0 ? 'bg-[#900C3F]/20' : 'bg-gray-100'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <p className="mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest text-center">Scan any Room Code to Join Instantly</p>
                        </div>
                    </div>
                </section>

                {/* Step 4: PWA */}
                <section className="mb-32 grid md:grid-cols-2 gap-12 items-center group">
                    <div className="order-2 md:order-1 transition-transform duration-500 group-hover:-translate-y-2">
                        <div className="bg-gradient-to-br from-[#900C3F] to-[#581845] p-12 rounded-[2rem] shadow-xl text-white flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                            <div className="bg-white/10 p-6 rounded-3xl mb-6 backdrop-blur-md shadow-inner border border-white/20">
                                <Layout className="w-16 h-16 text-white" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Install App</h3>
                            <p className="opacity-80 mb-8 max-w-xs mx-auto font-medium">Get the native app experience. Works offline. Full screen.</p>
                            <button className="bg-white text-[#900C3F] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                                <Users className="w-5 h-5" /> Install Now
                            </button>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <span className="text-[#900C3F] font-black text-6xl opacity-10 block mb-4 -ml-2 select-none">App</span>
                        <h2 className="text-3xl font-black text-[#581845] mb-4">Installable Web App (PWA)</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-6">
                            It installs like a normal mobile app. No app store required.
                        </p>
                        <ul className="space-y-4 text-gray-600 font-medium">
                            <li className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 bg-[#900C3F]/10 rounded-full text-[#900C3F] flex items-center justify-center font-bold">1</div>
                                <span>Open site on your phone.</span>
                            </li>
                            <li className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 bg-[#900C3F]/10 rounded-full text-[#900C3F] flex items-center justify-center font-bold">2</div>
                                <span>Click <span className="text-[#900C3F] font-bold">"Install App"</span> or "Add to Home Screen".</span>
                            </li>
                            <li className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 bg-[#900C3F]/10 rounded-full text-[#900C3F] flex items-center justify-center font-bold">3</div>
                                <span>Use it just like a native app.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* CTA */}
                <div className="mt-32 text-center bg-[#581845] text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#900C3F] rounded-full blur-[120px] opacity-60 -mr-20 -mt-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#900C3F] rounded-full blur-[100px] opacity-60 -ml-20 -mb-20 animate-pulse delay-1000"></div>

                    <h2 className="text-3xl md:text-5xl font-black mb-8 relative z-10 tracking-tight">Ready to verify?</h2>
                    <p className="relative z-10 text-white/70 mb-10 max-w-lg mx-auto text-lg">
                        Experience the fastest way to share files without a trace.
                    </p>
                    <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/" className="inline-flex items-center justify-center gap-2 bg-white text-[#900C3F] px-8 py-4 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform active:scale-95">
                            Create a Room Now
                        </Link>
                        <button onClick={() => navigate('/')} className="inline-flex items-center justify-center gap-2 bg-[#900C3F] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#7a0a35] transition-colors border border-white/10">
                            Join Existing Room
                        </button>
                    </div>
                </div>

            </main>

            <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default HowItWorks;

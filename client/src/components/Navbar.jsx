import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    X,
    Bot,
    BookOpen,
    Calculator,
    Users,
    ArrowLeft,
    ArrowRight,
    Home,
    HelpCircle
} from 'lucide-react';

const Navbar = ({ showBack = false, backText = "Back", onBackClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate(-1);
        }
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const navLinks = [
        { name: "GPA & Syllabus", path: "/more-features", icon: <Calculator className="w-5 h-5" /> },
    ];

    return (
        <div className="sticky top-0 z-50 w-full px-4 sm:px-6 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md border border-gray-150 shadow-xl shadow-gray-200/20 rounded-[2rem] px-6 sm:px-8 h-20 flex items-center justify-between">
                
                {/* 1. Left Side: Back Button or Left Navigation Links (Desktop) */}
                <div className="flex items-center gap-4">
                    {showBack ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-500 hover:text-[#900C3F] transition-all font-bold text-sm group px-3.5 py-2 rounded-xl hover:bg-gray-50 border border-gray-100 shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>{backText}</span>
                        </button>
                    ) : (
                        <nav className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-bold transition-all relative py-1.5 ${
                                        isActive(link.path) 
                                        ? 'text-[#900C3F]' 
                                        : 'text-gray-500 hover:text-[#900C3F]'
                                    }`}
                                >
                                    {link.name}
                                    {isActive(link.path) && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#900C3F] rounded-full animate-pulse" />
                                    )}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                {/* 2. Center: Centered Logo & Brand Name (Desktop Only) */}
                <div className="hidden md:flex items-center justify-center">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img 
                            src="/logo.svg" 
                            alt="MSIT Room Logo" 
                            className="w-10 h-10 transition-transform duration-500 group-hover:rotate-12 drop-shadow-md" 
                        />
                        <span className="text-lg font-black tracking-tight text-[#581845] group-hover:text-[#900C3F] transition-colors uppercase">
                            MSIT ROOM
                        </span>
                    </Link>
                </div>

                {/* 2b. Left Brand Name for Mobile (Floating left on mobile size) */}
                <div className="flex md:hidden items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.svg" alt="MSIT Room Logo" className="w-9 h-9" />
                        <span className="text-base font-black tracking-tight text-[#581845] uppercase">
                            MSIT ROOM
                        </span>
                    </Link>
                </div>

                {/* 3. Right Side: Dynamic Action Button (Desktop Only) */}
                <div className="hidden md:flex items-center gap-6">
                    <Link 
                        to="/msit-gpt" 
                        className="flex items-center gap-2 bg-gradient-to-r from-[#900C3F] to-[#581845] text-white px-5 py-2.5 rounded-full font-black text-xs transition-all shadow-md shadow-[#900C3F]/20 hover:scale-105 active:scale-95 duration-200 border border-[#900C3F]/35"
                    >
                        <span>MSIT GPT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* 3b. Mobile Toggle Button (Double horizontal lines like reference photo) */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden flex flex-col gap-1.5 justify-center items-end w-8 h-8 focus:outline-none group active:scale-95 transition-transform"
                    aria-label="Toggle Menu"
                >
                    <span className="w-6 h-0.5 bg-gray-800 group-hover:bg-[#900C3F] transition-all rounded-full" />
                    <span className="w-4 h-0.5 bg-gray-800 group-hover:bg-[#900C3F] transition-all rounded-full" />
                </button>

            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>

                    {/* Drawer */}
                    <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 border-r border-gray-100">
                        <div className="p-6 flex justify-between items-center border-b border-gray-50">
                            <div className="flex items-center gap-3" onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}>
                                <img src="/logo.svg" alt="MSIT Room Logo" className="w-10 h-10" />
                                <span className="text-lg font-black tracking-tight text-[#581845]">MSIT ROOM</span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:bg-gray-50 hover:text-[#900C3F] rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex flex-col p-6 gap-3">
                            <Link
                                to="/"
                                className={`flex items-center gap-4 text-base font-bold px-4 py-3 rounded-2xl transition-all ${
                                    location.pathname === '/' 
                                    ? 'bg-[#900C3F]/5 text-[#900C3F]' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#900C3F]'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Home className="w-5 h-5" />
                                Home
                            </Link>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-4 text-base font-bold px-4 py-3 rounded-2xl transition-all ${
                                        isActive(link.path) 
                                        ? 'bg-[#900C3F]/5 text-[#900C3F]' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#900C3F]'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                            
                            <Link
                                to="/team"
                                className={`flex items-center gap-4 text-base font-bold px-4 py-3 rounded-2xl transition-all ${
                                    isActive('/team') 
                                    ? 'bg-[#900C3F]/5 text-[#900C3F]' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#900C3F]'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Users className="w-5 h-5" />
                                Our Team
                            </Link>



                            <Link
                                to="/msit-gpt"
                                className="flex items-center gap-4 text-base font-bold px-4 py-3 rounded-2xl bg-gradient-to-r from-[#900C3F] to-[#581845] text-white hover:opacity-95 shadow-md shadow-[#900C3F]/20 mt-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Bot className="w-5 h-5 text-white" />
                                MSIT GPT AI
                            </Link>
                        </div>

                        <div className="mt-auto p-6 border-t border-gray-55 bg-gray-50/50 text-center">
                            <p className="text-xs font-black text-[#581845] uppercase tracking-wider">For Students, By Students.</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">MSIT Room</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;

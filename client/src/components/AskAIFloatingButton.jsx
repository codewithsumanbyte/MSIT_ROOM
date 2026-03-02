import React from 'react';
import { Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AskAIFloatingButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/msit-gpt')}
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 bg-gradient-to-r from-[#581845] to-[#900C3F] text-white p-3 md:px-5 md:py-3 rounded-full shadow-2xl hover:shadow-[#900C3F]/50 hover:-translate-y-1 transition-all duration-300 border border-white/10"
            title="Ask MSIT GPT"
        >
            <Bot className="w-6 h-6 animate-pulse group-hover:animate-none" />
            <span className="font-bold tracking-wide hidden md:block">Ask MSIT GPT</span>

            {/* Ping animation dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff4d88]"></span>
            </span>
        </button>
    );
};

export default AskAIFloatingButton;

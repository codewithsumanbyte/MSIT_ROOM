import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
            {/* Logo Container */}
            <div className="mb-8 animate-[pulse-soft_2s_ease-in-out_infinite]">
                <img src="/logo.svg" alt="MSIT Room" className="w-32 h-32 drop-shadow-2xl" />
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                {/* Visual Progress Fill */}
                <div
                    className="h-full bg-[#900C3F] rounded-full animate-[progress_2s_ease-out_forwards]"
                    style={{ width: '0%' }} // Starting point for animation
                />
            </div>

            {/* Optional Text */}
            <p className="mt-4 text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">Loading Room...</p>
        </div>
    );
};

export default LoadingScreen;

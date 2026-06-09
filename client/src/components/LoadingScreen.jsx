import React from 'react';
import LottieAnimation from './LottieAnimation';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
            {/* Lottie Animation Container */}
            <div className="w-56 h-56 md:w-64 md:h-64 mb-4">
                <LottieAnimation animationPath="/loading_logo.json" className="w-full h-full" />
            </div>

            {/* Progress Bar Container */}
            <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                {/* Visual Progress Fill */}
                <div
                    className="h-full bg-gradient-to-r from-[#900C3F] to-[#C70039] rounded-full animate-[progress_2s_ease-out_forwards]"
                    style={{ width: '0%' }} // Starting point for animation
                />
            </div>

            {/* Optional Text */}
            <p className="mt-4 text-xs font-black text-[#581845]/60 tracking-[0.3em] uppercase">Initializing MSIT Room...</p>
        </div>
    );
};

export default LoadingScreen;

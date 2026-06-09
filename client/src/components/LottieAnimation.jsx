import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieAnimation = ({ animationPath, className = "w-full h-full", animationData = null }) => {
    const containerRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Destroy any existing animation instance
            if (animationRef.current) {
                animationRef.current.destroy();
            }

            animationRef.current = lottie.loadAnimation({
                container: containerRef.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: animationPath,
                animationData: animationData
            });
        }

        return () => {
            if (animationRef.current) {
                animationRef.current.destroy();
            }
        };
    }, [animationPath, animationData]);

    return <div ref={containerRef} className={className} />;
};

export default LottieAnimation;

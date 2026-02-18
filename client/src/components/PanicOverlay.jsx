import React, { useState, useEffect } from 'react';

const PanicOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let lastShiftTime = 0;

        const handleKeyDown = (e) => {
            if (e.key === 'Shift') {
                const currentTime = Date.now();
                if (currentTime - lastShiftTime < 500) {
                    setIsVisible(prev => !prev);
                    lastShiftTime = 0; // Reset to prevent triple-click triggering off immediately if not intended
                } else {
                    lastShiftTime = currentTime;
                }
            } else {
                // optional: reset if another key is pressed between shifts? 
                // meaningful for strict double-shift, but maybe not needed for simple panic
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white text-black font-serif overflow-y-auto">
            {/* Wikipedia-style Header */}
            <div className="border-b border-[#a7d7f9] bg-white p-4 flex items-center gap-4 sticky top-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold font-sans text-xl">W</div>
                <div className="flex-1">
                    <input
                        type="text"
                        value="Python (programming language)"
                        readOnly
                        className="w-full max-w-md px-3 py-2 border border-[#a2a9b1] rounded-sm bg-white text-sm focus:outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
                    />
                </div>
                <div className="text-xs text-[#36c] font-sans flex gap-4">
                    <span>Create account</span>
                    <span>Log in</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-[70rem] mx-auto p-6 grid grid-cols-[1fr_20rem] gap-8">

                {/* Main Article */}
                <main>
                    <h1 className="text-[1.8rem] font-serif border-b border-[#a2a9b1] pb-1 mb-4 font-normal leading-tight">
                        Python (programming language)
                    </h1>

                    <div className="text-sm text-[#202122] leading-relaxed space-y-4">
                        <p>
                            <span className="font-bold">Python</span> is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.
                        </p>
                        <p>
                            Python is dynamic-typed and garbage-collected. It supports multiple programming paradigms, including structured (particularly procedural), object-oriented and functional programming. It is often described as a "batteries included" language due to its comprehensive standard library.
                        </p>
                        <p>
                            Guido van Rossum began working on Python in the late 1980s as a successor to the ABC programming language and first released it in 1991 as Python 0.9.0. Python 2.0 was released in 2000. Python 3.0, released in 2008, was a major revision that is not completely backward-compatible with earlier versions. Python 2.7.18, released in 2020, was the last release of Python 2.
                        </p>
                        <p>
                            Python consistently ranks as one of the most popular programming languages.
                        </p>

                        {/* Fake Table of Contents */}
                        <div className="bg-[#f8f9fa] border border-[#a2a9b1] p-3 inline-block rounded-sm mt-4 min-w-[300px]">
                            <h2 className="text-center font-bold text-xs mb-2 sans-serif">Contents</h2>
                            <ol className="list-decimal list-inside text-[#36c] text-xs space-y-1">
                                <li>History</li>
                                <li>Design philosophy and features</li>
                                <li>Syntax and semantics</li>
                                <li>Programming examples</li>
                                <li>Libraries</li>
                                <li>Development environments</li>
                            </ol>
                        </div>

                        <h2 className="text-[1.5rem] font-serif border-b border-[#a2a9b1] pb-1 mt-8 mb-4 font-normal">History</h2>
                        <p>
                            Python was conceived in the late 1980s by Guido van Rossum at Centrum Wiskunde & Informatica (CWI) in the Netherlands as a successor to the ABC programming language, which was inspired by SETL, capable of exception handling and interfacing with the Amoeba operating system. Its implementation began in December 1989.
                        </p>
                    </div>
                </main>

                {/* Sidebar / Infobox */}
                <aside className="border border-[#a2a9b1] bg-[#f8f9fa] p-3 text-sm h-fit self-start leading-snug">
                    <div className="bg-[#f8f9fa] text-center font-bold mb-2 pb-2 border-b border-[#a2a9b1]">Python</div>
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 bg-[#3776ab] flex items-center justify-center rounded-sm">
                            <span className="text-white font-bold text-4xl font-sans">py</span>
                        </div>
                    </div>
                    <table className="w-full text-xs">
                        <tbody>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">Paradigm</th>
                                <td className="py-1">Multi-paradigm: object-oriented, procedural (imperative), functional, structured, reflective</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">Designed by</th>
                                <td className="py-1">Guido van Rossum</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">Developer</th>
                                <td className="py-1">Python Software Foundation</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">First appeared</th>
                                <td className="py-1">20 February 1991; 35 years ago</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">Stable release</th>
                                <td className="py-1">3.12.1 / 7 December 2023</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">Typing discipline</th>
                                <td className="py-1">Duck, dynamic, strong typing; gradual (since 3.5)</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">OS</th>
                                <td className="py-1">Windows, macOS, Linux/UNIX, Android, and more</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">License</th>
                                <td className="py-1">Python Software Foundation License</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">File extensions</th>
                                <td className="py-1">.py, .pyw, .pyz, .pyi, .pyc, .pyd</td>
                            </tr>
                            <tr>
                                <th className="text-left font-bold pr-2 py-1 align-top">Website</th>
                                <td className="py-1 text-[#36c] underline">python.org</td>
                            </tr>
                        </tbody>
                    </table>
                </aside>
            </div>
        </div>
    );
};

export default PanicOverlay;

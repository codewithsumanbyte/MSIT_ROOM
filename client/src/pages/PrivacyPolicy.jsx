import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#900C3F] selection:text-white pb-20">

            {/* Header */}
            <Navbar showBack={true} backText="Back" />

            <main className="max-w-3xl mx-auto px-6 mt-8 space-y-12">

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Your Privacy Matters.</h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed">
                        MSIT ROOM is designed with one core principle: <span className="text-[#900C3F] font-bold">What happens in the room, stays in the room (until it vanishes).</span>
                    </p>
                </div>

                <div className="grid gap-8">
                    <Section
                        icon={<Trash2 className="w-6 h-6 text-[#900C3F]" />}
                        title="Data Ephemerality"
                        content="We do not store your messages or files permanently. Every room has a built-in self-destruct timer (default 30 mins). Once the timer hits zero, everything is wiped from our servers forever. No backups, no archives."
                    />

                    <Section
                        icon={<Eye className="w-6 h-6 text-[#900C3F]" />}
                        title="No Tracking"
                        content="We don't track you. No cookies, no analytics, no fingerprinting. We don't verify who you are because we don't need to know. You are just a temporary guest in a temporary room."
                    />

                    <Section
                        icon={<Lock className="w-6 h-6 text-[#900C3F]" />}
                        title="End-to-End Encryption"
                        content="While in transit, your data is encrypted using standard SSL/TLS protocols. Within the room, your connection is secure. However, remember that anyone with the Room Code can join, so share it only with trusted peers."
                    />
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Detailed Breakdown</h3>
                    <ul className="space-y-3 text-gray-600 text-sm list-disc pl-5">
                        <li><strong>Messages:</strong> Stored in volatile memory (RAM) only. Deleted when room expires.</li>
                        <li><strong>Files:</strong> Temporarily saved to disk for streaming. Hard-deleted when room expires.</li>
                        <li><strong>Metadata:</strong> We store upload times to permit auto-deletion. Nothing else.</li>
                    </ul>
                </div>

                <footer className="pt-10 border-t border-gray-100 text-center text-gray-400 text-sm">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p className="mt-2">Built for the MSIT community.</p>
                </footer>

            </main>
        </div>
    );
};

const Section = ({ icon, title, content }) => (
    <div className="flex gap-5 md:gap-8 items-start group">
        <div className="w-12 h-12 rounded-2xl bg-[#900C3F]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#900C3F]/10 transition-colors">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">{content}</p>
        </div>
    </div>
);

export default PrivacyPolicy;

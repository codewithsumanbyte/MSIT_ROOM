import React from 'react';
import { ArrowLeft, Github, Linkedin, Mail, Code, Palette, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import sumanImg from '../assets/suman.jpg';
import supritiImg from '../assets/supriti.png';
import rajImg from '../assets/raj.jpg';

const Team = () => {
    const navigate = useNavigate();

    const teamMembers = [
        {
            name: "Suman Banerjee",
            role: "Creator & Founder",
            description: "The visionary behind MSIT Room. Suman built this platform to solve real-world problems for students, combining technical excellence with a deep understanding of academic needs.",
            image: sumanImg,
            icon: <Code className="w-5 h-5 text-blue-500" />,
            color: "blue"
        },
        {
            name: "Supriti Bag",
            role: "Designer",
            description: "The creative mind responsible for the beautiful, intuitive, and modern user interface of MSIT Room. Supriti ensures that every pixel serves a purpose and enhances the user experience.",
            image: supritiImg,
            icon: <Palette className="w-5 h-5 text-pink-500" />,
            color: "pink"
        },
        {
            name: "Raj Ghorui",
            role: "Management Head",
            description: "The operational powerhouse of MSIT Room. Raj manages the vast resources, academic materials, and ensures the platform runs smoothly for all users.",
            image: rajImg,
            icon: <Briefcase className="w-5 h-5 text-amber-500" />,
            color: "amber"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#900C3F] selection:text-white pb-20">
            {/* Header */}
            <header className="px-6 py-6 md:px-12 flex items-center max-w-6xl mx-auto w-full z-10 relative">
                <button onClick={() => navigate('/')} className="hover:bg-gray-200 p-2 rounded-full transition-colors group bg-white shadow-sm border border-gray-100">
                    <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-[#900C3F]" />
                </button>
            </header>

            <main className="max-w-6xl mx-auto px-6 mt-4">
                <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">The Minds Behind <span className="text-[#900C3F]">MSIT Room</span></h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        We are a passionate team dedicated to making academic life easier, more connected, and highly efficient for every student.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {teamMembers.map((member, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 group flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 150}ms` }}>
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 border-4 border-gray-50 shadow-inner group-hover:border-[#900C3F]/20 transition-colors relative">
                                {/* If image path is broken, fallback to gray bg */}
                                <div className="absolute inset-0 bg-gray-200 animate-pulse -z-10"></div>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=random&size=200` }}
                                />
                            </div>

                            <div className={`p-2 rounded-xl mb-3 ${member.color === 'blue' ? 'bg-blue-50' : member.color === 'pink' ? 'bg-pink-50' : 'bg-amber-50'}`}>
                                {member.icon}
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-1">{member.name}</h2>
                            <h3 className="text-sm font-bold text-[#900C3F] uppercase tracking-wider mb-4">{member.role}</h3>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                                {member.description}
                            </p>

                            <div className="flex items-center gap-3 mt-auto">
                                <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors">
                                    <Github className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Team;

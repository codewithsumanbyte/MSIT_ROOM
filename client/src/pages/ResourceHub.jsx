import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    ArrowLeft,
    Download,
    Search,
    BookOpen,
    Layers,
    ChevronRight,
    FileText,
    Library,
    Star,
    Info,
    Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SERVER_URL } from '../utils/config';

const ResourceHub = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeYear, setActiveYear] = useState('1st Year');

    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const categories = ['Organizer', 'Study Notes', 'PYQ'];

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/admin/resources`);
            const data = await response.json();
            setResources(data);
        } catch (error) {
            toast.error('Failed to load academic records');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (res) => {
        const url = `${SERVER_URL}${res.url}`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', res.originalName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`Downloading ${res.title}...`);
    };

    const filteredResources = resources.filter(res => {
        const matchesYear = res.year === activeYear;
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesYear && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <Navbar showBack={true} backText="Back to GPA & Syllabus" onBackClick={() => navigate('/more-features')} />

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
                {/* Hero section inside hub */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-[#581845] tracking-tight mb-4">Centralized Academic Archive</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed">
                        Access Organizers, Subject Notes, and Previous Year Questions (PYQ) curated specifically for MSIT students.
                    </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-2 rounded-3xl border shadow-sm mb-8 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search subjects, topics, or organizers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#900C3F]/20"
                        />
                    </div>
                </div>

                {/* Year Selection Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => setActiveYear(year)}
                            className={`px-6 py-2.5 rounded-2xl font-black text-sm transition-all border ${activeYear === year
                                ? 'bg-[#581845] text-white border-[#581845] shadow-lg shadow-[#581845]/20'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-[#581845]/30'
                                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>

                {/* Content Sections */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Layers className="w-12 h-12 text-gray-200 mb-4" />
                        <div className="h-4 w-48 bg-gray-100 rounded-full mb-2"></div>
                        <div className="h-3 w-32 bg-gray-50 rounded-full"></div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {categories.map(cat => {
                            const catResources = filteredResources.filter(r => r.category === cat);

                            return (
                                <section key={cat} className="space-y-6">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className={`p-2 rounded-xl ${cat === 'Organizer' ? 'bg-purple-100 text-purple-600' :
                                            cat === 'PYQ' ? 'bg-orange-100 text-orange-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {cat === 'Organizer' ? <BookOpen className="w-5 h-5" /> :
                                                cat === 'PYQ' ? <Star className="w-5 h-5" /> :
                                                    <FileText className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-[#581845] tracking-tight">{cat}s</h2>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                                                {activeYear} {cat} Archive
                                            </p>
                                        </div>
                                    </div>

                                    {catResources.length === 0 ? (
                                        <div className="bg-white border rounded-3xl p-12 text-center border-dashed border-gray-200">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No {cat}s available for this year yet</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {catResources.map(res => (
                                                <div key={res.id} className="bg-white border hover:border-[#900C3F]/30 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-[#900C3F]/5 transition-all group relative overflow-hidden">
                                                    {/* Abstract BG Pattern */}
                                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>

                                                    <div className="relative z-10">
                                                        <div className="mb-4 flex items-start justify-between">
                                                            <div className="bg-gray-100 p-3 rounded-2xl group-hover:bg-[#900C3F] group-hover:text-white transition-all duration-300">
                                                                <FileText className="w-6 h-6" />
                                                            </div>
                                                            <span className="text-[10px] font-mono font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-lg">{(res.size / 1024 / 1024).toFixed(1)}MB</span>
                                                        </div>
                                                        <h3 className="font-black text-[#581845] text-lg leading-tight mb-2 group-hover:text-[#900C3F] transition-colors">{res.title}</h3>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Uploaded: {new Date(res.uploadedAt).toLocaleDateString()}</p>

                                                        <button
                                                            onClick={() => handleDownload(res)}
                                                            className="w-full flex items-center justify-center gap-2 bg-[#900C3F]/5 text-[#900C3F] py-3 rounded-2xl font-black text-sm group-hover:bg-[#900C3F] group-hover:text-white transition-all shadow-none group-hover:shadow-lg group-hover:shadow-[#900C3F]/30"
                                                        >
                                                            <Download className="w-4 h-4" /> Download Resource
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-20 flex flex-col items-center gap-6 py-12 border-t border-dashed">
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-start gap-3 max-w-xl border border-blue-100">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium leading-relaxed">
                            Organizers and PYQs are sourced from official MAKAUT examinations and trusted MSIT academic batches. Files are provided purely for educational assistance.
                        </p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        Handcrafted for MSITians by MSIT_ROOM Developers
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ResourceHub;

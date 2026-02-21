import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Upload,
    FileText,
    Trash2,
    LogOut,
    Plus,
    ChevronRight,
    File,
    ExternalLink,
    Search,
    Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('1st Year');
    const [category, setCategory] = useState('Organizer');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        } else {
            fetchResources();
        }
    }, []);

    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        } else {
            fetchResources();
        }
    }, [navigate]);

    const fetchResources = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/admin/resources');
            const data = await response.json();
            setResources(data);
        } catch (error) {
            toast.error('Failed to load resources');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        toast.success('Logged out successfully');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a file');

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('year', year);
        formData.append('category', category);

        try {
            console.log('Uploading to:', 'http://localhost:3000/api/admin/upload');
            const response = await fetch('http://localhost:3000/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Resource uploaded successfully!');
                setTitle('');
                setFile(null);
                fetchResources();
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/admin/resources/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Resource deleted');
                fetchResources();
            } else {
                toast.error(data.error || 'Delete failed');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="bg-white/10 p-2.5 rounded-2xl border border-white/20">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="font-black tracking-tighter text-xl block leading-none">ADMIN HUB</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 block">Management</span>
                    </div>
                </div>

                <nav className="space-y-3">
                    <button className="w-full flex items-center justify-between px-5 py-4 bg-white text-[#581845] rounded-2xl font-black text-sm shadow-xl shadow-black/20 group">
                        <div className="flex items-center gap-3">
                            <Upload className="w-4 h-4" />
                            Manage Gallery
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/resource-hub')}
                        className="w-full flex items-center gap-3 px-5 py-4 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl font-bold text-sm transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Live Hub
                    </button>
                </nav>
            </div>

            <div className="mt-auto p-8 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-red-300 hover:bg-red-500/10 rounded-2xl font-black text-sm transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row">
            {/* Sidebar (Desktop) */}
            <aside className="w-72 bg-[#581845] text-white hidden lg:flex flex-col sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Sidebar (Mobile Overlay) */}
            {showSidebar && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)}></div>
                    <aside className="absolute left-0 top-0 bottom-0 w-80 bg-[#581845] text-white animate-in slide-in-from-left duration-300 shadow-2xl">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#581845]/10 p-2 rounded-xl">
                            <LayoutDashboard className="w-6 h-6 text-[#581845]" />
                        </div>
                        <span className="font-black text-[#581845] tracking-tight">Admin Portal</span>
                    </div>
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="p-2.5 bg-gray-50 rounded-xl border border-gray-100"
                    >
                        <Filter className="w-6 h-6 text-gray-500" />
                    </button>
                </header>

                {/* Desktop Header */}
                <header className="hidden lg:flex bg-white/80 backdrop-blur-md border-b px-10 py-6 items-center justify-between sticky top-0 z-40">
                    <div>
                        <h1 className="text-2xl font-black text-[#581845] tracking-tight">System Dashboard</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active System Connection</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden xl:block mr-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase">Current Session</p>
                            <p className="text-xs font-bold text-[#581845]">Administrator Account</p>
                        </div>
                        <button
                            onClick={() => navigate('/resource-hub')}
                            className="flex items-center gap-2 bg-[#900C3F] text-white px-6 py-2.5 rounded-2xl font-black text-xs hover:bg-[#C70039] transition-all shadow-lg shadow-[#900C3F]/20"
                        >
                            View Site <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-6 md:space-y-10">
                    {/* Upload Card */}
                    <section className="bg-white border-2 border-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-gray-200/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#900C3F]/10 p-4 rounded-3xl">
                                    <Plus className="w-6 h-6 text-[#900C3F]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-[#581845]">New Upload</h2>
                                    <p className="text-sm font-bold text-gray-400">Add materials to the student library</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-wider pl-2">Document Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter subject name..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#F5F7FA] border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:ring-4 focus:ring-[#900C3F]/5 transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-wider pl-2">Effective Year</label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full bg-[#F5F7FA] border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-[#900C3F]/5 transition-all outline-none"
                                >
                                    <option>1st Year</option>
                                    <option>2nd Year</option>
                                    <option>3rd Year</option>
                                    <option>4th Year</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-wider pl-2">Resource Type</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[#F5F7FA] border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-[#900C3F]/5 transition-all outline-none"
                                >
                                    <option>Organizer</option>
                                    <option>Study Notes</option>
                                    <option>PYQ</option>
                                </select>
                            </div>
                            <div className="flex flex-col justify-end">
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className={`flex-1 flex items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-3 cursor-pointer transition-all ${file ? 'border-[#900C3F] bg-[#900C3F]/5 text-[#900C3F]' : 'border-gray-100 hover:border-[#900C3F]/40 hover:bg-gray-50'}`}
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span className="text-xs font-black truncate max-w-[120px]">{file ? file.name : 'Select File'}</span>
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#581845] text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-[#900C3F] disabled:opacity-50 transition-all shadow-xl shadow-[#581845]/20 flex items-center justify-center min-w-[100px]"
                                    >
                                        {loading ? <span className="animate-spin text-lg">◌</span> : 'UPLOAD'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>

                    {/* Resources List (Responsive Table/Cards) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#581845] p-2 rounded-xl">
                                    <File className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-black text-[#581845] tracking-tight">Active Archive</h2>
                            </div>
                            <span className="bg-[#581845]/5 text-[#581845] px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">{resources.length} ITEMS</span>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block bg-white border-2 border-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50">
                            <table className="w-full text-left">
                                <thead className="bg-[#F8F9FB] border-b">
                                    <tr>
                                        <th className="px-10 py-5 text-[10px] uppercase font-black text-gray-400 tracking-widest">Document</th>
                                        <th className="px-6 py-5 text-[10px] uppercase font-black text-gray-400 tracking-widest text-center">Batch</th>
                                        <th className="px-6 py-5 text-[10px] uppercase font-black text-gray-400 tracking-widest text-center">Type</th>
                                        <th className="px-6 py-5 text-[10px] uppercase font-black text-gray-400 tracking-widest text-center">Size</th>
                                        <th className="px-10 py-5 text-[10px] uppercase font-black text-gray-400 tracking-widest text-right">Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {resources.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center opacity-30">
                                                    <Search className="w-12 h-12 mb-4" />
                                                    <p className="font-black uppercase tracking-[0.2em] text-sm">Registry Empty</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : resources.map(res => (
                                        <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-[#F5F7FA] p-3 rounded-2xl group-hover:bg-[#900C3F]/10 group-hover:text-[#900C3F] transition-all">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-[#581845] text-base leading-none mb-1.5 truncate">{res.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{res.originalName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">{res.year}</span>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className={`${res.category === 'Organizer' ? 'bg-purple-50 text-purple-600' : res.category === 'PYQ' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider`}>
                                                    {res.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <p className="text-[11px] font-black text-gray-400 font-mono">{(res.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <button
                                                    onClick={() => handleDelete(res.id)}
                                                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                    title="Delete Permanent"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {resources.length === 0 ? (
                                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 opacity-50">
                                    <p className="font-black text-xs uppercase tracking-widest">No Items</p>
                                </div>
                            ) : resources.map(res => (
                                <div key={res.id} className="bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-200/50 border border-gray-50">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[#900C3F]/10 p-3 rounded-2xl text-[#900C3F]">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-[#581845] leading-tight">{res.title}</h3>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{(res.size / 1024 / 1024).toFixed(1)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(res.id)}
                                            className="p-3 bg-red-50 text-red-500 rounded-2xl active:scale-95 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">{res.year}</span>
                                        <span className={`${res.category === 'Organizer' ? 'bg-purple-50 text-purple-600' : res.category === 'PYQ' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'} px-4 py-1.5 rounded-xl text-[10px] font-black uppercase`}>
                                            {res.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Trash2, 
    Share2, 
    CheckCircle2, 
    BookOpen, 
    ExternalLink, 
    Youtube, 
    FileText, 
    Globe, 
    RefreshCw, 
    AlertCircle, 
    Sparkles, 
    Settings, 
    ArrowRight, 
    X,
    TrendingUp,
    Edit3,
    BookCheck,
    Copy,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { syllabusData, departments } from '../utils/syllabusData';
import { SERVER_URL } from '../utils/config';

const SyllabusRoadmap = () => {
    const navigate = useNavigate();
    
    // Branch & Semester Selection loaded from Profile or defaults
    const [selectedBranch, setSelectedBranch] = useState(() => {
        try {
            const savedProfile = localStorage.getItem('msit_user_profile');
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                return parsed.branch || 'CSE';
            }
        } catch (e) {
            console.error("Failed to parse branch from profile", e);
        }
        return 'CSE';
    });

    const [selectedSemester, setSelectedSemester] = useState(() => {
        try {
            const savedProfile = localStorage.getItem('msit_user_profile');
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                return parsed.semester || 1;
            }
        } catch (e) {
            console.error("Failed to parse semester from profile", e);
        }
        return 1;
    });
    
    // Core Roadmap State
    const [roadmap, setRoadmap] = useState([]);
    const [completedItems, setCompletedItems] = useState({}); // { subjectId_resourceIndex: boolean, subjectId_done: boolean }
    
    // Modal states
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [showAddResource, setShowAddResource] = useState(false);
    const [activeSubjectId, setActiveSubjectId] = useState(null);
    const [showImportPreview, setShowImportPreview] = useState(false);
    const [importedData, setImportedData] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    // Profile settings states
    const [profileBranch, setProfileBranch] = useState(selectedBranch);
    const [profileSemester, setProfileSemester] = useState(selectedSemester);

    // Sync profile selects with current view selection
    useEffect(() => {
        setProfileBranch(selectedBranch);
        setProfileSemester(selectedSemester);
    }, [selectedBranch, selectedSemester]);
    
    // Clipboard indicator
    const [copied, setCopied] = useState(false);

    // Form inputs
    const [newSubject, setNewSubject] = useState({ id: '', name: '', credits: 3 });
    const [newResource, setNewResource] = useState({ title: '', url: '', category: 'YouTube' });

    // 1. Detect Share URL on Load
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const importParam = queryParams.get('import');
        if (importParam) {
            try {
                const decoded = JSON.parse(decodeURIComponent(escape(atob(importParam))));
                if (decoded && decoded.branch && decoded.semester && decoded.roadmap) {
                    setImportedData(decoded);
                    setShowImportPreview(true);
                }
            } catch (e) {
                console.error('Failed to parse import link', e);
                toast.error('Invalid or corrupted sharing link');
            }
        }
    }, []);

    // 2. Load Syllabus Roadmap state from localStorage, static database, and merge dynamic admin subjects
    useEffect(() => {
        const loadSyllabus = async () => {
            const storageKey = `msit_roadmap_${selectedBranch}_sem${selectedSemester}`;
            const savedRoadmap = localStorage.getItem(storageKey);
            const savedProgress = localStorage.getItem(`${storageKey}_progress`);
            
            let baseSubjects = [];
            if (savedRoadmap) {
                try {
                    baseSubjects = JSON.parse(savedRoadmap);
                } catch (e) {
                    baseSubjects = syllabusData[selectedBranch]?.[selectedSemester] || [];
                }
            } else {
                baseSubjects = syllabusData[selectedBranch]?.[selectedSemester] || [];
            }

            // Fetch dynamic admin subjects from backend
            try {
                const response = await fetch(`${SERVER_URL}/api/admin/subjects`);
                if (response.ok) {
                    const adminSubjects = await response.json();
                    // Filter matching admin subjects
                    const matchingAdminSubjects = adminSubjects.filter(
                        s => s.branch === selectedBranch && Number(s.semester) === Number(selectedSemester)
                    );
                    
                    // Merge matching admin subjects into baseSubjects
                    const mergedSubjects = [...baseSubjects];
                    matchingAdminSubjects.forEach(adminSub => {
                        const idx = mergedSubjects.findIndex(s => s.id === adminSub.id);
                        if (idx !== -1) {
                            mergedSubjects[idx] = {
                                ...mergedSubjects[idx],
                                ...adminSub,
                                resources: [
                                    ...(mergedSubjects[idx].resources || []),
                                    ...(adminSub.resources || [])
                                ].reduce((acc, current) => {
                                    const x = acc.find(item => item.url === current.url);
                                    if (!x) {
                                        return acc.concat([current]);
                                    } else {
                                        return acc;
                                    }
                                }, [])
                            };
                        } else {
                            mergedSubjects.push(adminSub);
                        }
                    });
                    setRoadmap(mergedSubjects);
                } else {
                    setRoadmap(baseSubjects);
                }
            } catch (err) {
                console.error("Failed to load admin subjects:", err);
                setRoadmap(baseSubjects);
            }

            if (savedProgress) {
                try {
                    setCompletedItems(JSON.parse(savedProgress));
                } catch (e) {
                    setCompletedItems({});
                }
            } else {
                setCompletedItems({});
            }
        };

        loadSyllabus();
    }, [selectedBranch, selectedSemester]);

    // 3. Sync Changes to Local Storage
    const saveState = (updatedRoadmap, updatedProgress) => {
        const storageKey = `msit_roadmap_${selectedBranch}_sem${selectedSemester}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedRoadmap));
        localStorage.setItem(`${storageKey}_progress`, JSON.stringify(updatedProgress));
    };

    // Toggle items: Resource Completion
    const toggleResource = (subjectId, resourceIndex) => {
        const key = `${subjectId}_res_${resourceIndex}`;
        const updatedProgress = {
            ...completedItems,
            [key]: !completedItems[key]
        };
        setCompletedItems(updatedProgress);
        saveState(roadmap, updatedProgress);
        toast.success(updatedProgress[key] ? 'Resource marked as completed!' : 'Resource pending', { icon: '✅' });
    };

    // Toggle items: Subject Completion
    const toggleSubjectDone = (subjectId) => {
        const key = `${subjectId}_done`;
        const updatedProgress = {
            ...completedItems,
            [key]: !completedItems[key]
        };
        setCompletedItems(updatedProgress);
        saveState(roadmap, updatedProgress);
        toast.success(updatedProgress[key] ? 'Subject completed!' : 'Subject set to in-progress', { icon: '🎓' });
    };

    // Add Custom Subject
    const handleAddSubject = (e) => {
        e.preventDefault();
        if (!newSubject.name.trim()) return;

        const subjectId = newSubject.id.trim() || `CUSTOM-${Date.now().toString().slice(-4)}`;
        const createdSubject = {
            id: subjectId,
            name: newSubject.name.trim(),
            credits: Number(newSubject.credits) || 3,
            resources: []
        };

        const updatedRoadmap = [...roadmap, createdSubject];
        setRoadmap(updatedRoadmap);
        saveState(updatedRoadmap, completedItems);
        
        setShowAddSubject(false);
        setNewSubject({ id: '', name: '', credits: 3 });
        toast.success('Custom subject added to syllabus!');
    };

    // Delete Subject
    const handleDeleteSubject = (subjectId) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        
        const updatedRoadmap = roadmap.filter(s => s.id !== subjectId);
        setRoadmap(updatedRoadmap);
        
        // Clean up progress keys related to this subject
        const updatedProgress = { ...completedItems };
        delete updatedProgress[`${subjectId}_done`];
        Object.keys(updatedProgress).forEach(k => {
            if (k.startsWith(`${subjectId}_res_`)) {
                delete updatedProgress[k];
            }
        });
        
        setCompletedItems(updatedProgress);
        saveState(updatedRoadmap, updatedProgress);
        toast.success('Subject removed');
    };

    // Add Custom Resource
    const handleAddResource = (e) => {
        e.preventDefault();
        if (!newResource.title.trim() || !newResource.url.trim()) return;

        // Simple url validation
        let formattedUrl = newResource.url.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }

        const updatedRoadmap = roadmap.map(s => {
            if (s.id === activeSubjectId) {
                return {
                    ...s,
                    resources: [...s.resources, { ...newResource, url: formattedUrl }]
                };
            }
            return s;
        });

        setRoadmap(updatedRoadmap);
        saveState(updatedRoadmap, completedItems);

        setShowAddResource(false);
        setNewResource({ title: '', url: '', category: 'YouTube' });
        toast.success('New learning resource binder added!');
    };

    // Delete Resource
    const handleDeleteResource = (subjectId, resIndex) => {
        const updatedRoadmap = roadmap.map(s => {
            if (s.id === subjectId) {
                const newRes = [...s.resources];
                newRes.splice(resIndex, 1);
                return { ...s, resources: newRes };
            }
            return s;
        });

        setRoadmap(updatedRoadmap);
        
        // Clean progress indicator for this resource and shift key indexes
        const updatedProgress = { ...completedItems };
        // Delete all resources for this subject and we will rewrite them
        Object.keys(updatedProgress).forEach(k => {
            if (k.startsWith(`${subjectId}_res_`)) {
                delete updatedProgress[k];
            }
        });

        setCompletedItems(updatedProgress);
        saveState(updatedRoadmap, updatedProgress);
        toast.success('Resource removed');
    };

    // Reset current roadmap back to default MAKAUT guidelines
    const handleResetToDefault = () => {
        if (!window.confirm('Reset this semester roadmap back to default official MAKAUT guidelines? This will clear custom items.')) return;
        
        const defaultSubjects = syllabusData[selectedBranch]?.[selectedSemester] || [];
        setRoadmap(defaultSubjects);
        setCompletedItems({});
        
        const storageKey = `msit_roadmap_${selectedBranch}_sem${selectedSemester}`;
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}_progress`);
        toast.success('Reset completed successfully');
    };

    // Generate Compressed Shareable Link
    const generateShareLink = () => {
        const payload = {
            branch: selectedBranch,
            semester: selectedSemester,
            roadmap: roadmap
        };
        try {
            const rawString = JSON.stringify(payload);
            const encoded = btoa(unescape(encodeURIComponent(rawString)));
            const shareUrl = `${window.location.origin}${window.location.pathname}?import=${encoded}`;
            
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Shareable Roadmap URL copied to clipboard!', { icon: '🔗' });
            setTimeout(() => setCopied(false), 3000);
        } catch (e) {
            console.error('Failed to generate sharing URL', e);
            toast.error('Could not generate sharing URL');
        }
    };

    // Handle cloning imported roadmap
    const handleCloneImported = () => {
        if (!importedData) return;

        setSelectedBranch(importedData.branch);
        setSelectedSemester(importedData.semester);
        
        const storageKey = `msit_roadmap_${importedData.branch}_sem${importedData.semester}`;
        localStorage.setItem(storageKey, JSON.stringify(importedData.roadmap));
        localStorage.removeItem(`${storageKey}_progress`); // Start fresh on progress
        
        setRoadmap(importedData.roadmap);
        setCompletedItems({});
        
        setShowImportPreview(false);
        setImportedData(null);
        
        // Clear query parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        toast.success(`Successfully imported custom roadmap for ${importedData.branch} Sem ${importedData.semester}!`);
    };

    // Calculate progress stats
    const calculateProgress = () => {
        let totalItems = 0;
        let finishedItems = 0;

        roadmap.forEach(subject => {
            // Count subject itself as 1 item
            totalItems += 1;
            if (completedItems[`${subject.id}_done`]) {
                finishedItems += 1;
            }

            // Count each resource as 1 item
            subject.resources.forEach((_, idx) => {
                totalItems += 1;
                if (completedItems[`${subject.id}_res_${idx}`]) {
                    finishedItems += 1;
                }
            });
        });

        if (totalItems === 0) return 0;
        return Math.round((finishedItems / totalItems) * 100);
    };

    const overallProgress = calculateProgress();

    // Render helper for resource icons
    const getResourceIcon = (category) => {
        switch (category) {
            case 'YouTube': return <Youtube className="w-4 h-4 text-red-500" />;
            case 'PDF': return <FileText className="w-4 h-4 text-purple-500" />;
            default: return <Globe className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* 1. Header Control Panel */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Branch select */}
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Branch</label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-2xl py-2 px-4 text-sm font-bold text-[#581845] focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20 cursor-pointer"
                        >
                            {departments.map(d => (
                                <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                            ))}
                        </select>
                    </div>

                    {/* Semester select */}
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Semester</label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-200 rounded-2xl py-2 px-4 text-sm font-bold text-[#581845] focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20 cursor-pointer"
                        >
                            {[...Array(8)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                            ))}
                        </select>
                    </div>
                                 <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={generateShareLink}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#900C3F]/5 text-[#900C3F] font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl border border-[#900C3F]/10 hover:bg-[#900C3F] hover:text-white transition-all shadow-none hover:shadow-lg hover:shadow-[#900C3F]/30"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Share Roadmap'}
                    </button>

                    <button
                        onClick={() => setShowSettings(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#581845]/5 text-[#581845] border border-[#581845]/10 hover:bg-[#581845] hover:text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-none hover:shadow-lg hover:shadow-[#581845]/20"
                        title="Configure your default academic profile"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>

                    <button
                        onClick={handleResetToDefault}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all"
                        title="Reset to default official syllabus"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reset Defaults
                    </button>
                </div>  </div>
            </div>

            {/* 2. Global Progress Banner */}
            <div className="bg-gradient-to-br from-[#581845] to-[#900C3F] text-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-[#900C3F]/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Visual Backdrop decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-10 transform scale-150">
                    <TrendingUp className="w-40 h-40" />
                </div>
                
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-max text-xs font-bold border border-white/10 uppercase tracking-widest text-[#FFC300]">
                        <Sparkles className="w-3.5 h-3.5" /> Learning Roadmap Progress
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">{selectedBranch} &bull; Semester {selectedSemester}</h2>
                    <p className="text-white/80 text-xs font-medium max-w-md">Track completed courses and read recommended learning resources below. Click any card to customize binders.</p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 relative z-10 shrink-0">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-black text-[#FFC300]">{overallProgress}%</span>
                        <span className="text-xs uppercase font-black text-white/50 tracking-widest">Syllabus Done</span>
                    </div>
                    
                    {/* Visual Progress Slider Bar */}
                    <div className="w-full md:w-56 h-3.5 bg-white/20 rounded-full overflow-hidden border border-white/10 shadow-inner">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-[#FFC300] to-yellow-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {roadmap.map((subject) => {
                        const subjectDone = completedItems[`${subject.id}_done`];
                        
                        // Count internal resource statistics
                        const resCount = subject.resources?.length || 0;
                        const resDone = subject.resources?.filter((_, i) => completedItems[`${subject.id}_res_${i}`]).length || 0;

                        return (
                            <motion.div
                                key={subject.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={`bg-white border rounded-[2rem] p-6 shadow-sm flex flex-col justify-between transition-all group relative overflow-hidden ${
                                    subjectDone 
                                    ? 'border-emerald-200 shadow-md shadow-emerald-50/50 bg-emerald-50/10' 
                                    : 'hover:border-[#900C3F]/30 hover:shadow-xl hover:shadow-[#900C3F]/5'
                                }`}
                            >
                                <div className="space-y-4">
                                    {/* Subject code & credits row */}
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-mono font-black px-2 py-1 rounded-lg ${
                                            subjectDone 
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {subject.id}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                                                Credits: <strong className="text-[#581845] font-bold">{subject.credits}</strong>
                                            </span>
                                            
                                            {/* Delete subject */}
                                            <button 
                                                onClick={() => handleDeleteSubject(subject.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete Subject"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subject Title */}
                                    <h3 
                                        onClick={() => navigate(`/roadmap/${selectedBranch}/${selectedSemester}/${subject.id}`)}
                                        className={`font-black text-lg leading-tight transition-all cursor-pointer hover:underline hover:text-[#900C3F] ${
                                            subjectDone ? 'text-emerald-800 line-through opacity-70' : 'text-[#581845]'
                                        }`}
                                        title="Click to open full AI Study Planner page"
                                    >
                                        {subject.name}
                                    </h3>

                                    {/* Resources Header */}
                                    <div className="pt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-1.5">
                                                <BookOpen className="w-3.5 h-3.5" /> Playlists & Resources
                                            </span>
                                            {resCount > 0 && (
                                                <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                                                    {resDone}/{resCount} Done
                                                </span>
                                            )}
                                        </div>

                                        {/* Resource Checklist Binder */}
                                        {resCount === 0 ? (
                                            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl py-6 px-4 text-center">
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest italic">No study resources binder added yet</p>
                                                <button
                                                    onClick={() => {
                                                        setActiveSubjectId(subject.id);
                                                        setShowAddResource(true);
                                                    }}
                                                    className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#900C3F] font-black uppercase tracking-wider hover:underline"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Link
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
                                                {subject.resources.map((res, rIdx) => {
                                                    const resDone = completedItems[`${subject.id}_res_${rIdx}`];
                                                    return (
                                                        <div 
                                                            key={rIdx} 
                                                            className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
                                                                resDone 
                                                                ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' 
                                                                : 'bg-white border-gray-200/60 text-gray-600 hover:border-gray-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                                                                <button
                                                                    onClick={() => toggleResource(subject.id, rIdx)}
                                                                    className={`shrink-0 transition-colors ${resDone ? 'text-emerald-500' : 'text-gray-300 hover:text-[#900C3F]'}`}
                                                                    title={resDone ? 'Mark as Pending' : 'Mark as Done'}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 fill-current bg-white rounded-full" />
                                                                </button>
                                                                <span className="shrink-0">{getResourceIcon(res.category)}</span>
                                                                <span className={`font-bold truncate ${resDone ? 'line-through opacity-60' : ''}`}>
                                                                    {res.title}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-1">
                                                                <a 
                                                                    href={res.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="p-1 hover:bg-gray-100 text-gray-400 hover:text-[#900C3F] rounded-lg transition-colors"
                                                                    title="Open Resource Link"
                                                                >
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </a>
                                                                <button
                                                                    onClick={() => handleDeleteResource(subject.id, rIdx)}
                                                                    className="p-1 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                                                                    title="Remove Resource Link"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Subject footer action - Finish toggle */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                                    <button
                                        onClick={() => navigate(`/roadmap/${selectedBranch}/${selectedSemester}/${subject.id}`)}
                                        className="inline-flex items-center gap-1.5 bg-[#900C3F]/5 text-[#900C3F] hover:bg-[#900C3F] hover:text-white px-3.5 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shadow-none"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" /> AI study planner
                                    </button>

                                    <button
                                        onClick={() => toggleSubjectDone(subject.id)}
                                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider border transition-all ${
                                            subjectDone 
                                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                                        }`}
                                    >
                                        <BookCheck className="w-3.5 h-3.5" />
                                        {subjectDone ? 'Subject Done' : 'Complete Subject'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* 4. Add Custom Subject Card Trigger */}
                <button
                    onClick={() => setShowAddSubject(true)}
                    className="border-2 border-dashed border-gray-200 hover:border-[#900C3F]/30 hover:bg-[#900C3F]/5 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3 group transition-all h-full min-h-[220px]"
                >
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#900C3F] group-hover:bg-[#900C3F]/10 group-hover:scale-110 transition-all duration-300">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-700 group-hover:text-[#900C3F] text-base transition-colors">Add Custom Course</h4>
                        <p className="text-gray-400 text-xs font-medium max-w-[200px] mt-1">Want to trace an elective or additional core course? Add it here!</p>
                    </div>
                </button>
            </div>

            {/* 5. Add Custom Subject Modal */}
            <AnimatePresence>
                {showAddSubject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddSubject(false)} />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative z-10 border shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-[#581845] tracking-tight">Add Custom Course</h3>
                                <button onClick={() => setShowAddSubject(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubject} className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Course Code (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. PCC-CS501"
                                        value={newSubject.id}
                                        onChange={(e) => setNewSubject({ ...newSubject, id: e.target.value.toUpperCase() })}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Course Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Theory of Computation"
                                        required
                                        value={newSubject.name}
                                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Credits</label>
                                    <input
                                        type="number"
                                        step="1"
                                        min="1"
                                        max="5"
                                        value={newSubject.credits}
                                        onChange={(e) => setNewSubject({ ...newSubject, credits: Number(e.target.value) })}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#900C3F] text-white rounded-2xl font-black text-base shadow-lg shadow-[#900C3F]/20 hover:bg-[#700931] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Add Subject <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 6. Add Custom Resource Link Modal */}
            <AnimatePresence>
                {showAddResource && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddResource(false)} />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative z-10 border shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-[#581845] tracking-tight">Add Resource Binder</h3>
                                <button onClick={() => setShowAddResource(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddResource} className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Resource Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['YouTube', 'PDF', 'Web'].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setNewResource({ ...newResource, category: cat })}
                                                className={`py-2 rounded-xl font-bold text-xs uppercase transition-all border ${
                                                    newResource.category === cat 
                                                    ? 'bg-[#581845] text-white border-[#581845] shadow-md shadow-[#581845]/10' 
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Resource Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Abdul Bari Algorithm Playlist"
                                        required
                                        value={newResource.title}
                                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Resource Link / URL</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. youtube.com/watch?v=..."
                                        required
                                        value={newResource.url}
                                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#900C3F] text-white rounded-2xl font-black text-base shadow-lg shadow-[#900C3F]/20 hover:bg-[#700931] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Add Binder <Plus className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 7. Sharing URL Import Preview Modal */}
            <AnimatePresence>
                {showImportPreview && importedData && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowImportPreview(false)} />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative z-10 border shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                    <AlertCircle className="w-4 h-4" /> Sharing Link Detected!
                                </div>
                                <button onClick={() => setShowImportPreview(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-[#581845] tracking-tight">Import Syllabus Roadmap?</h3>
                                <p className="text-gray-500 text-xs font-semibold">
                                    Another student shared their syllabus checklist roadmap for <span className="text-[#900C3F] font-bold">{importedData.branch} Semester {importedData.semester}</span> with you!
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Shared Course List Preview</p>
                                {importedData.roadmap.map((s, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs py-1 border-b last:border-0 border-gray-200/50">
                                        <span className="font-bold text-[#581845]">{s.name}</span>
                                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 border rounded text-gray-400">{s.id}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-3 border border-red-100 text-xs font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="leading-relaxed">
                                    <strong>WARNING:</strong> Importing this shared roadmap will overwrite your current local checklist details for <strong>{importedData.branch} Semester {importedData.semester}</strong>. This action is permanent.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowImportPreview(false)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all text-center"
                                >
                                    Cancel Preview
                                </button>
                                <button
                                    onClick={handleCloneImported}
                                    className="flex-1 py-4 bg-[#900C3F] text-white rounded-2xl font-black text-sm shadow-lg shadow-[#900C3F]/20 hover:bg-[#700931] hover:scale-[1.02] transition-all text-center"
                                >
                                    Overwrite & Import
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 8. Profile settings modal */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative z-10 border shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center border-b pb-4">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-[#900C3F]" />
                                    <h3 className="text-xl font-black text-[#581845] tracking-tight">Syllabus Preferences</h3>
                                </div>
                                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Default Branch</label>
                                    <select
                                        value={profileBranch}
                                        onChange={(e) => setProfileBranch(e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold text-[#581845] focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20 cursor-pointer"
                                    >
                                        {departments.map(d => (
                                            <option key={d.code} value={d.code}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Default Semester</label>
                                    <select
                                        value={profileSemester}
                                        onChange={(e) => setProfileSemester(Number(e.target.value))}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold text-[#581845] focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20 cursor-pointer"
                                    >
                                        {[...Array(8)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <p className="text-gray-400 text-[10px] font-medium leading-relaxed px-1">
                                    Saving these preferences will cache them on your device. Every time you return to the Syllabus Roadmap, it will load this branch and semester automatically!
                                </p>

                                <button
                                    onClick={() => {
                                        const profile = { branch: profileBranch, semester: Number(profileSemester) };
                                        localStorage.setItem('msit_user_profile', JSON.stringify(profile));
                                        
                                        // Update active states
                                        setSelectedBranch(profileBranch);
                                        setSelectedSemester(Number(profileSemester));
                                        
                                        setShowSettings(false);
                                        toast.success(`Default Syllabus Profile saved: ${profileBranch} Sem ${profileSemester}!`, { icon: '⚙️' });
                                    }}
                                    className="w-full py-4 bg-[#900C3F] text-white rounded-2xl font-black text-base shadow-lg shadow-[#900C3F]/20 hover:bg-[#700931] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Save Preferences <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default SyllabusRoadmap;

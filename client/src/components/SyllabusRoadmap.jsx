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
    Check,
    Download,
    ChevronDown,
    Clock
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
    const [showManualImportModal, setShowManualImportModal] = useState(false);
    const [manualImportInput, setManualImportInput] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [shareCode, setShareCode] = useState('');
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

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

    // Exam Countdown & Heatmap States
    const [examDate, setExamDate] = useState(() => {
        return localStorage.getItem(`msit_exam_date_${selectedBranch}_sem${selectedSemester}`) || '';
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    // Overall Todo list search and filters
    const [todoSearchQuery, setTodoSearchQuery] = useState('');
    const [todoCategoryFilter, setTodoCategoryFilter] = useState('All');

    // Sync exam date when branch/semester selection changes
    useEffect(() => {
        const savedDate = localStorage.getItem(`msit_exam_date_${selectedBranch}_sem${selectedSemester}`);
        setExamDate(savedDate || '');
        setTimeLeft(null);
    }, [selectedBranch, selectedSemester]);

    // Countdown interval calculation
    useEffect(() => {
        if (!examDate) {
            setTimeLeft(null);
            return;
        }

        const calculateTimeLeft = () => {
            // Parse target date (local midnight)
            const target = new Date(examDate + 'T00:00:00');
            const difference = +target - +new Date();
            let newTimeLeft = null;

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    expired: false
                };
            } else {
                newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
            }
            setTimeLeft(newTimeLeft);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [examDate]);

    // Helper to calculate individual course checklist completion
    const getSubjectProgress = (subject) => {
        let totalItems = 1; // 1 for subject done check itself
        let finishedItems = completedItems[`${subject.id}_done`] ? 1 : 0;

        if (subject.resources && subject.resources.length > 0) {
            totalItems += subject.resources.length;
            subject.resources.forEach((_, idx) => {
                if (completedItems[`${subject.id}_res_${idx}`]) {
                    finishedItems += 1;
                }
            });
        }
        return Math.round((finishedItems / totalItems) * 100);
    };

    // Helper to gather all pending syllabus tasks (overall todo list)
    const getPendingTodos = () => {
        const todos = [];
        roadmap.forEach(subject => {
            if (!completedItems[`${subject.id}_done`]) {
                subject.resources?.forEach((res, index) => {
                    if (!completedItems[`${subject.id}_res_${index}`]) {
                        todos.push({
                            subjectId: subject.id,
                            subjectName: subject.name,
                            resourceIndex: index,
                            title: res.title,
                            url: res.url,
                            category: res.category
                        });
                    }
                });
            }
        });
        return todos;
    };

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
            
            setShareLink(shareUrl);
            setShareCode(encoded);
            setShowShareModal(true);
            setCopiedLink(false);
            setCopiedCode(false);
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

        // Update default academic profile settings in local storage to prevent refresh reset
        try {
            const profile = { branch: importedData.branch, semester: Number(importedData.semester) };
            localStorage.setItem('msit_user_profile', JSON.stringify(profile));
        } catch (e) {
            console.error("Failed to save default profile during import", e);
        }

        toast.success(`Successfully imported custom roadmap for ${importedData.branch} Sem ${importedData.semester}!`);
    };

    // Handle manual syllabus import (accepts full URLs or raw Base64 strings)
    const handleProcessManualImport = (e) => {
        e.preventDefault();
        if (!manualImportInput.trim()) return;

        let base64Payload = manualImportInput.trim();

        // If the user pasted a full URL, extract the `import` query parameter
        if (base64Payload.includes('?import=')) {
            try {
                const url = new URL(base64Payload);
                const importParam = url.searchParams.get('import');
                if (importParam) {
                    base64Payload = importParam;
                } else {
                    toast.error('The pasted URL does not contain a valid syllabus import payload.');
                    return;
                }
            } catch (err) {
                toast.error('Invalid URL format.');
                return;
            }
        } else if (base64Payload.includes('import=')) {
            // Fallback for partial URL or queries like "more-features?import=..."
            const parts = base64Payload.split('import=');
            if (parts.length > 1) {
                base64Payload = parts[1].split('&')[0];
            }
        }

        try {
            const decoded = JSON.parse(decodeURIComponent(escape(atob(base64Payload))));
            if (decoded && decoded.branch && decoded.semester && decoded.roadmap) {
                setImportedData(decoded);
                setShowManualImportModal(false);
                setManualImportInput('');
                setShowImportPreview(true);
            } else {
                toast.error('Invalid import data structure.');
            }
        } catch (e) {
            console.error('Failed to parse manually imported code', e);
            toast.error('Invalid or corrupted import code.');
        }
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
                
                {/* Left Side: Selectors Card */}
                <div className="lg:col-span-5 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between gap-5 relative overflow-hidden group">
                    {/* Subtle decorative background gradient */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#900C3F]/5 rounded-full blur-2xl group-hover:bg-[#900C3F]/10 transition-colors duration-500 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-[#900C3F] uppercase tracking-[0.2em] block">Active Curriculum</span>
                        <h3 className="text-lg font-black text-[#581845] mt-1">Academic Selection</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                        {/* Branch select */}
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Branch</label>
                            <div className="relative">
                                <select
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-[#581845] appearance-none focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20 focus:border-[#900C3F]/30 focus:bg-white transition-all cursor-pointer shadow-sm"
                                >
                                    {departments.map(d => (
                                        <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Semester select */}
                        <div className="flex flex-col gap-1.5 sm:w-36">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Semester</label>
                            <div className="relative">
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(Number(e.target.value))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-[#581845] appearance-none focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20 focus:border-[#900C3F]/30 focus:bg-white transition-all cursor-pointer shadow-sm"
                                >
                                    {[...Array(8)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tools Panel */}
                <div className="lg:col-span-7 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between gap-5">
                    <div>
                        <span className="text-[10px] font-black text-[#581845]/60 uppercase tracking-[0.2em] block">Curriculum Actions</span>
                        <h3 className="text-lg font-black text-[#581845] mt-1">Management & Sharing</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Share button */}
                        <button
                            onClick={generateShareLink}
                            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 hover:border-[#900C3F]/30 hover:bg-white transition-all duration-300 hover:shadow-md hover:shadow-[#900C3F]/5 group cursor-pointer text-center active:scale-[0.97] select-none"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#900C3F]/5 flex items-center justify-center text-[#900C3F] group-hover:scale-110 transition-transform duration-300">
                                {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-black text-xs text-gray-800">{copied ? 'Copied!' : 'Share'}</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-0.5">Copy link</span>
                            </div>
                        </button>

                        {/* Import button */}
                        <button
                            onClick={() => setShowManualImportModal(true)}
                            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 hover:border-[#900C3F]/30 hover:bg-white transition-all duration-300 hover:shadow-md hover:shadow-[#900C3F]/5 group cursor-pointer text-center active:scale-[0.97] select-none"
                            title="Import a shared syllabus roadmap using a code or link"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#900C3F]/5 flex items-center justify-center text-[#900C3F] group-hover:scale-110 transition-transform duration-300">
                                <Download className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-black text-xs text-gray-800">Import</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-0.5">Load code</span>
                            </div>
                        </button>

                        {/* Settings button */}
                        <button
                            onClick={() => setShowSettings(true)}
                            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 hover:border-[#581845]/30 hover:bg-white transition-all duration-300 hover:shadow-md hover:shadow-[#581845]/5 group cursor-pointer text-center active:scale-[0.97] select-none"
                            title="Configure your default academic profile"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#581845]/5 flex items-center justify-center text-[#581845] group-hover:scale-110 transition-transform duration-300">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-black text-xs text-gray-800">Settings</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-0.5">Set profile</span>
                            </div>
                        </button>

                        {/* Reset button */}
                        <button
                            onClick={handleResetToDefault}
                            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 hover:border-red-200 hover:bg-white transition-all duration-300 hover:shadow-md hover:shadow-red-50 group cursor-pointer text-center active:scale-[0.97] select-none"
                            title="Reset to default official syllabus"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                                <RefreshCw className="w-5 h-5 animate-hover-spin" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-black text-xs text-gray-800">Reset</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-0.5">Defaults</span>
                            </div>
                        </button>
                    </div>
                </div>
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

            {/* 2.5 Exam Urgency & Syllabus Heatmap Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
                
                {/* Countdown Card (col-span-12) */}
                <div className="col-span-12 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
                    {/* Glowing background accent */}
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#900C3F]/5 rounded-full blur-2xl group-hover:bg-[#900C3F]/10 transition-colors duration-500 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                        <div className="shrink-0">
                            <span className="text-[10px] font-black text-[#900C3F] uppercase tracking-[0.2em] block">Countdown Tracker</span>
                            <h3 className="text-lg font-black text-[#581845] mt-1 whitespace-nowrap">Exam Urgency</h3>
                        </div>

                        {/* Timer Display Area */}
                        <div className="flex items-center justify-center sm:justify-start flex-1">
                            {showDatePicker ? (
                                <div className="flex items-center gap-2 w-full max-w-xs animate-in fade-in zoom-in-95 duration-200">
                                    <input
                                        type="date"
                                        value={examDate}
                                        onChange={(e) => {
                                            const newDate = e.target.value;
                                            setExamDate(newDate);
                                            localStorage.setItem(`msit_exam_date_${selectedBranch}_sem${selectedSemester}`, newDate);
                                            setShowDatePicker(false);
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-[#581845] focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20 outline-none"
                                    />
                                    <button
                                        onClick={() => setShowDatePicker(false)}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition-all font-bold text-xs"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : examDate ? (
                                timeLeft ? (
                                    <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5">
                                        <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-155 rounded-2xl w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 shadow-sm shrink-0">
                                            <span className="text-xl xs:text-2xl font-black text-[#900C3F] tracking-tight">{timeLeft.days}</span>
                                            <span className="text-[8px] xs:text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Days</span>
                                        </div>
                                        <div className="text-lg xs:text-xl font-black text-gray-300 animate-pulse shrink-0">:</div>
                                        <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-155 rounded-2xl w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 shadow-sm shrink-0">
                                            <span className="text-xl xs:text-2xl font-black text-[#581845] tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</span>
                                            <span className="text-[8px] xs:text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Hours</span>
                                        </div>
                                        <div className="text-lg xs:text-xl font-black text-gray-300 animate-pulse shrink-0">:</div>
                                        <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-155 rounded-2xl w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 shadow-sm shrink-0">
                                            <span className="text-xl xs:text-2xl font-black text-[#581845] tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                            <span className="text-[8px] xs:text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Mins</span>
                                        </div>
                                        <div className="text-lg xs:text-xl font-black text-gray-300 animate-pulse shrink-0">:</div>
                                        <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-155 rounded-2xl w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 shadow-sm shrink-0">
                                            <span className="text-xl xs:text-2xl font-black text-[#900C3F] tracking-tight">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                            <span className="text-[8px] xs:text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Secs</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-400 font-bold">Calculating countdown...</div>
                                )
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                                    <span className="text-xs text-gray-400 font-bold">Set your exam date to start countdown.</span>
                                    <button
                                        onClick={() => setShowDatePicker(true)}
                                        className="text-xs font-black text-[#900C3F] hover:text-[#700931] uppercase tracking-wider bg-[#900C3F]/5 hover:bg-[#900C3F]/10 px-3 py-1.5 rounded-xl border border-[#900C3F]/10 transition-all cursor-pointer"
                                    >
                                        Set Date
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings / Badge Area */}
                    <div className="relative z-10 flex flex-row items-center justify-end gap-3 shrink-0">
                        {examDate && !showDatePicker && timeLeft && (
                            <>
                                {/* Urgency Badge */}
                                {timeLeft.expired ? (
                                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                                        <BookCheck className="w-3.5 h-3.5" /> Done
                                    </div>
                                ) : timeLeft.days <= 14 ? (
                                    <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                        <AlertCircle className="w-3.5 h-3.5" /> Critical
                                    </div>
                                ) : timeLeft.days <= 30 ? (
                                    <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> Moderate
                                    </div>
                                ) : (
                                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" /> Safe
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowDatePicker(true)}
                                    className="text-[10px] font-black text-gray-500 hover:text-gray-800 uppercase tracking-wider bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200 transition-all cursor-pointer"
                                >
                                    Change
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Pending Syllabus Tasks Card (col-span-12) */}
                <div className="col-span-12 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-[10px] font-black text-[#581845]/60 uppercase tracking-[0.2em] block">Study Agenda</span>
                            <h3 className="text-lg font-black text-[#581845] mt-1">Pending Syllabus Tasks</h3>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-[#900C3F]/5 text-[#900C3F] font-black text-[10px] uppercase tracking-wider">
                                {getPendingTodos().length} remaining
                            </span>
                        </div>
                    </div>

                    {roadmap.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-center p-6 border-2 border-dashed border-gray-150 rounded-2xl">
                            <span className="text-xs text-gray-400 uppercase font-black tracking-widest italic">No subjects loaded for this semester</span>
                        </div>
                    ) : getPendingTodos().length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-emerald-50/20 border border-emerald-100 rounded-3xl space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <BookCheck className="w-6 h-6 animate-bounce" />
                            </div>
                            <div>
                                <h4 className="font-black text-[#581845] text-base">All Caught Up!</h4>
                                <p className="text-gray-400 text-xs font-semibold mt-1">Excellent work! You have completed all syllabus resources for this semester.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Search & Filters Controls */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Search input */}
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search pending tasks..."
                                        value={todoSearchQuery}
                                        onChange={(e) => setTodoSearchQuery(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 pl-4 pr-10 text-xs font-bold text-[#581845] focus:outline-none focus:ring-2 focus:ring-[#900C3F]/20 focus:border-[#900C3F]/30 focus:bg-white transition-all shadow-sm"
                                    />
                                    {todoSearchQuery && (
                                        <button 
                                            onClick={() => setTodoSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                {/* Category Filters */}
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/80 p-1 rounded-2xl shrink-0 overflow-x-auto">
                                    {['All', 'YouTube', 'PDF', 'Web'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setTodoCategoryFilter(cat)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                                                todoCategoryFilter === cat
                                                ? 'bg-white text-[#900C3F] shadow-sm font-black border border-gray-200/40'
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Task Rows List */}
                            <div className="max-h-72 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                                {(() => {
                                    const filtered = getPendingTodos().filter(todo => {
                                        const matchesCategory = todoCategoryFilter === 'All' || todo.category === todoCategoryFilter;
                                        const matchesSearch = todoSearchQuery === '' || 
                                            todo.title.toLowerCase().includes(todoSearchQuery.toLowerCase()) ||
                                            todo.subjectId.toLowerCase().includes(todoSearchQuery.toLowerCase()) ||
                                            todo.subjectName.toLowerCase().includes(todoSearchQuery.toLowerCase());
                                        return matchesCategory && matchesSearch;
                                    });

                                    if (filtered.length === 0) {
                                        return (
                                            <div className="text-center py-6 text-gray-400 text-xs font-semibold italic uppercase tracking-wider">
                                                No matching pending tasks found
                                            </div>
                                        );
                                    }

                                    return filtered.map((todo, idx) => {
                                        const handleRowClick = () => {
                                            const element = document.getElementById(`subject-card-${todo.subjectId}`);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                element.classList.add('ring-2', 'ring-[#900C3F]/30');
                                                setTimeout(() => {
                                                    element.classList.remove('ring-2', 'ring-[#900C3F]/30');
                                                }, 1500);
                                            }
                                        };

                                        return (
                                            <div 
                                                key={`${todo.subjectId}_${todo.resourceIndex}_${idx}`} 
                                                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md hover:shadow-gray-100/50 transition-all duration-300 group/row"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
                                                    {/* Complete Task checkbox */}
                                                    <button
                                                        onClick={() => toggleResource(todo.subjectId, todo.resourceIndex)}
                                                        className="shrink-0 text-gray-300 hover:text-emerald-500 transition-colors"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5 fill-current bg-white rounded-full transition-transform group-hover/row:scale-105" />
                                                    </button>

                                                    <span className="shrink-0 p-1 bg-gray-50 rounded-lg">{getResourceIcon(todo.category)}</span>
                                                    
                                                    {/* Subject ID Tag */}
                                                    <button 
                                                        onClick={handleRowClick}
                                                        className="shrink-0 text-[10px] font-mono font-black px-2 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-[#900C3F]/10 hover:text-[#900C3F] transition-colors"
                                                        title={`Scroll to ${todo.subjectId}`}
                                                    >
                                                        {todo.subjectId}
                                                    </button>
                                                    
                                                    {/* Title */}
                                                    <span className="font-bold text-xs text-[#581845] truncate" title={todo.title}>
                                                        {todo.title}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0">
                                                    {/* Subject Name label */}
                                                    <span className="hidden md:inline text-[10px] font-bold text-gray-400 max-w-[150px] truncate" title={todo.subjectName}>
                                                        {todo.subjectName}
                                                    </span>

                                                    {/* External Link */}
                                                    <a 
                                                        href={todo.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="p-2 hover:bg-[#900C3F]/5 text-gray-400 hover:text-[#900C3F] rounded-xl transition-colors border border-transparent hover:border-[#900C3F]/10"
                                                        title="Open Resource Link"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}
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
                                id={`subject-card-${subject.id}`}
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

            {/* 7.5. Manual Syllabus Import Modal */}
            <AnimatePresence>
                {showManualImportModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowManualImportModal(false)} />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative z-10 border shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center border-b pb-4">
                                <div className="flex items-center gap-2">
                                    <Download className="w-5 h-5 text-[#900C3F]" />
                                    <h3 className="text-xl font-black text-[#581845] tracking-tight">Import Syllabus Roadmap</h3>
                                </div>
                                <button onClick={() => setShowManualImportModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleProcessManualImport} className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Share Link or Import Code</label>
                                    <textarea
                                        placeholder="Paste the full syllabus share link or the raw syllabus import code here..."
                                        required
                                        rows={5}
                                        value={manualImportInput}
                                        onChange={(e) => setManualImportInput(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#900C3F]/20 transition-all resize-none"
                                    />
                                </div>

                                <p className="text-gray-400 text-[10px] font-medium leading-relaxed px-1">
                                    Pasting a valid sharing link or its corresponding base64 code will parse the subjects list and open an import preview. This allows you to verify the syllabus contents before applying.
                                </p>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#900C3F] text-white rounded-2xl font-black text-base shadow-lg shadow-[#900C3F]/20 hover:bg-[#700931] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Proceed to Preview <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 7.8 Share Syllabus Roadmap Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative z-10 border shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center border-b pb-4">
                                <div className="flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-[#900C3F]" />
                                    <h3 className="text-xl font-black text-[#581845] tracking-tight">Share Syllabus Roadmap</h3>
                                </div>
                                <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-500 text-xs font-semibold">
                                    Share your custom checklist and playlisted resources for <span className="text-[#900C3F] font-bold">{selectedBranch} Semester {selectedSemester}</span> with other students!
                                </p>

                                {/* 1. Sharing Link */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Option A: Shareable Link</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={shareLink}
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-gray-600 focus:outline-none"
                                            onClick={(e) => e.target.select()}
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(shareLink);
                                                setCopiedLink(true);
                                                toast.success('Sharing URL copied!');
                                                setTimeout(() => setCopiedLink(false), 2000);
                                            }}
                                            className="bg-[#900C3F] hover:bg-[#700931] text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 flex items-center justify-center gap-1 shadow-md shadow-[#900C3F]/10"
                                        >
                                            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            {copiedLink ? 'Copied!' : 'Copy Link'}
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Raw Syllabus Import Code */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Option B: Syllabus Import Code</label>
                                    <div className="flex gap-2">
                                        <textarea
                                            readOnly
                                            rows={4}
                                            value={shareCode}
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] font-mono font-bold text-gray-600 focus:outline-none resize-none"
                                            onClick={(e) => e.target.select()}
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(shareCode);
                                                setCopiedCode(true);
                                                toast.success('Import Code copied!');
                                                setTimeout(() => setCopiedCode(false), 2000);
                                            }}
                                            className="bg-[#581845] hover:bg-[#400d31] text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 flex items-center justify-center gap-1 shadow-md shadow-[#581845]/10 h-10 align-middle self-start"
                                        >
                                            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            {copiedCode ? 'Copied!' : 'Copy Code'}
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-[10px] font-medium leading-relaxed px-1">
                                    The **Import Code** is a secure, compressed representation of your custom curriculum. Other students can paste either the full link or the import code into their **&quot;Import Syllabus&quot;** tab to load it instantly!
                                </p>
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

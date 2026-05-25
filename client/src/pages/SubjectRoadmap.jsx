import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    CheckCircle2, 
    Plus, 
    Trash2, 
    Bot, 
    Sparkles, 
    Loader2, 
    FileText, 
    Youtube, 
    Globe, 
    ExternalLink, 
    AlertCircle, 
    RefreshCw, 
    ListTodo, 
    Check, 
    X,
    ClipboardList,
    HelpCircle,
    TrendingUp,
    BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusData, defaultResources } from '../utils/syllabusData';
import { SERVER_URL } from '../utils/config';

const SubjectRoadmap = () => {
    const { branch, semester, subjectId } = useParams();
    const navigate = useNavigate();

    // Subject Details from static dataset
    const [subject, setSubject] = useState(null);

    // Active Interactive States
    const [todos, setTodos] = useState([]);
    const [newTodoText, setNewTodoText] = useState('');
    
    // MSIT GPT AI States
    const [syllabusInput, setSyllabusInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiResponseText, setAiResponseText] = useState('');

    // Modal & Resource States
    const [showAddResourceModal, setShowAddResourceModal] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', url: '', category: 'YouTube' });

    // Add Custom Resource Link
    const handleAddResource = (e) => {
        e.preventDefault();
        if (!newResource.title.trim() || !newResource.url.trim()) return;

        let formattedUrl = newResource.url.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }

        const storageKey = `msit_roadmap_${branch}_sem${semester}`;
        const savedRoadmap = localStorage.getItem(storageKey);
        let activeRoadmap = [];

        if (savedRoadmap) {
            activeRoadmap = JSON.parse(savedRoadmap);
        } else {
            activeRoadmap = syllabusData[branch]?.[semester] || [];
        }

        const updatedRoadmap = activeRoadmap.map(s => {
            if (s.id === subjectId) {
                const existingRes = s.resources || [];
                return {
                    ...s,
                    resources: [...existingRes, { title: newResource.title.trim(), url: formattedUrl, category: newResource.category }]
                };
            }
            return s;
        });

        localStorage.setItem(storageKey, JSON.stringify(updatedRoadmap));

        const updatedSubject = updatedRoadmap.find(s => s.id === subjectId);
        if (updatedSubject) {
            setSubject(updatedSubject);
        }

        setShowAddResourceModal(false);
        setNewResource({ title: '', url: '', category: 'YouTube' });
        toast.success('Learning resource added directly to this subject binder!', { icon: '📂' });
    };

    // Delete Resource Link
    const handleDeleteResource = (idxToDelete) => {
        if (!window.confirm('Are you sure you want to remove this resource link?')) return;

        const storageKey = `msit_roadmap_${branch}_sem${semester}`;
        const savedRoadmap = localStorage.getItem(storageKey);
        let activeRoadmap = [];

        if (savedRoadmap) {
            activeRoadmap = JSON.parse(savedRoadmap);
        } else {
            activeRoadmap = syllabusData[branch]?.[semester] || [];
        }

        const updatedRoadmap = activeRoadmap.map(s => {
            if (s.id === subjectId) {
                const existingRes = s.resources || [];
                const filtered = existingRes.filter((_, idx) => idx !== idxToDelete);
                return {
                    ...s,
                    resources: filtered
                };
            }
            return s;
        });

        localStorage.setItem(storageKey, JSON.stringify(updatedRoadmap));

        const updatedSubject = updatedRoadmap.find(s => s.id === subjectId);
        if (updatedSubject) {
            setSubject(updatedSubject);
        }
        toast.success('Resource link removed successfully');
    };

    // Load subject details & checklist on mount
    useEffect(() => {
        try {
            // Find subject in database
            const deptSyllabus = syllabusData[branch] || {};
            const semSubjects = deptSyllabus[Number(semester)] || deptSyllabus[String(semester)] || [];
            const foundSubject = semSubjects.find(s => s.id === subjectId);

            // Fallback for custom subject
            if (foundSubject) {
                setSubject(foundSubject);
            } else {
                // Check in localStorage if custom subject details are stored
                const storageKey = `msit_roadmap_${branch}_sem${semester}`;
                const customRoadmap = localStorage.getItem(storageKey);
                if (customRoadmap) {
                    try {
                        const parsed = JSON.parse(customRoadmap);
                        if (Array.isArray(parsed)) {
                            const foundCustom = parsed.find(s => s.id === subjectId);
                            if (foundCustom) {
                                setSubject(foundCustom);
                            } else {
                                setSubject({ id: subjectId, name: subjectId.replace(/-/g, ' '), credits: 3, resources: [] });
                            }
                        } else {
                            setSubject({ id: subjectId, name: subjectId.replace(/-/g, ' '), credits: 3, resources: [] });
                        }
                    } catch (e) {
                        console.error("Failed to parse custom roadmap from storage", e);
                        setSubject({ id: subjectId, name: subjectId.replace(/-/g, ' '), credits: 3, resources: [] });
                    }
                } else {
                    setSubject({ id: subjectId, name: subjectId.replace(/-/g, ' '), credits: 3, resources: [] });
                }
            }
        } catch (error) {
            console.error("Error loading subject details from static database", error);
            setSubject({ id: subjectId, name: subjectId.replace(/-/g, ' '), credits: 3, resources: [] });
        }

        // Load to-dos from localStorage
        try {
            const todoKey = `msit_subject_todo_${branch}_sem${semester}_${subjectId}`;
            const savedTodos = localStorage.getItem(todoKey);
            if (savedTodos) {
                const parsed = JSON.parse(savedTodos);
                if (Array.isArray(parsed)) {
                    setTodos(parsed);
                } else {
                    throw new Error("Saved todos in storage is not an array");
                }
            } else {
                // Default initial to-dos
                setTodos([
                    { id: 't1', text: 'Read the official textbook recommended chapters', done: false },
                    { id: 't2', text: 'Review previous year exam questions (PYQ)', done: false },
                    { id: 't3', text: 'Examine bound syllabus playlists and resources', done: false }
                ]);
            }
        } catch (e) {
            console.error("Failed to load todos from storage. Falling back to default list.", e);
            setTodos([
                { id: 't1', text: 'Read the official textbook recommended chapters', done: false },
                { id: 't2', text: 'Review previous year exam questions (PYQ)', done: false },
                { id: 't3', text: 'Examine bound syllabus playlists and resources', done: false }
            ]);
        }
    }, [branch, semester, subjectId]);

    // Save to-dos helper
    const saveTodos = (updatedTodos) => {
        setTodos(updatedTodos);
        const todoKey = `msit_subject_todo_${branch}_sem${semester}_${subjectId}`;
        localStorage.setItem(todoKey, JSON.stringify(updatedTodos));
    };

    // Add To-Do manually
    const handleAddTodo = (e) => {
        e?.preventDefault();
        if (!newTodoText.trim()) return;

        const updated = [
            ...todos,
            { id: Date.now().toString(), text: newTodoText.trim(), done: false }
        ];
        saveTodos(updated);
        setNewTodoText('');
        toast.success('Task added successfully!');
    };

    // Toggle To-Do
    const toggleTodo = (id) => {
        const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
        saveTodos(updated);
    };

    // Delete To-Do
    const handleDeleteTodo = (id) => {
        const updated = todos.filter(t => t.id !== id);
        saveTodos(updated);
        toast.success('Task removed');
    };

    // Clear all To-Dos
    const handleClearAllTodos = () => {
        if (!window.confirm('Clear all tasks in your roadmap?')) return;
        saveTodos([]);
        toast.success('To-Do list cleared');
    };

    // 🤖 Query MSIT GPT for study roadmap
    const handleGenerateAiRoadmap = async () => {
        setIsAiLoading(true);
        setAiResponseText('');
        toast.loading('MSIT GPT is generating your study checklist...', { id: 'ai-gen' });

        const promptText = `
You are MSIT GPT, an advanced academic planner for Meghnad Saha Institute of Technology. 
The student is taking the course: "${subject?.name || subjectId}" (Course Code: ${subjectId}) in department ${branch}, Semester ${semester}.
Your task is to analyze this subject ${syllabusInput.trim() ? `and these syllabus details provided by the student:\n"""\n${syllabusInput.trim()}\n"""` : ''} 
and generate a step-by-step, sequential learning checklist of exactly what to do "next by next" to master this subject.

CRITICAL: Output your response as a valid, parsable JSON array of strings ONLY. Do not write any introductions, code-block syntax, markdown summaries, or conversational text. Output the array.
Example response format:
[
  "Understand basic concepts of X",
  "Learn how Y works in detail",
  "Practice solving problems on Z",
  "Study MAKAUT PYQs on this subject"
]
`;

        try {
            const response = await fetch(`${SERVER_URL}/api/gpt/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: promptText }]
                })
            });

            if (!response.ok) throw new Error('API failed');

            const data = await response.json();
            const reply = data.reply;
            setAiResponseText(reply);

            // Attempt to parse JSON array
            let parsedTasks = [];
            let cleanText = reply.trim();
            
            // Strip markdown JSON wrappers if present
            if (cleanText.includes('```')) {
                const match = cleanText.match(/```(?:json)?([\s\S]*?)```/);
                if (match && match[1]) {
                    cleanText = match[1].trim();
                }
            }

            try {
                parsedTasks = JSON.parse(cleanText);
            } catch (jsonErr) {
                // Robust Fallback parsing strategy
                console.warn('JSON parsing failed. Falling back to newline list parsing.', jsonErr);
                const lines = reply.split('\n');
                parsedTasks = lines
                    .map(line => line.trim().replace(/^[-*+\d.\[\]\s]+/, '').trim())
                    .filter(line => line.length > 5 && !line.toLowerCase().includes('[') && !line.toLowerCase().includes('json') && !line.toLowerCase().includes('here is'));
            }

            if (parsedTasks && Array.isArray(parsedTasks) && parsedTasks.length > 0) {
                const newAiTodos = parsedTasks.map((taskText, idx) => ({
                    id: `ai_${Date.now()}_${idx}`,
                    text: taskText,
                    done: false
                }));

                const mergedTodos = [...todos, ...newAiTodos];
                saveTodos(mergedTodos);
                toast.success(`MSIT GPT successfully injected ${newAiTodos.length} sequential tasks!`, { id: 'ai-gen' });
                setSyllabusInput('');
            } else {
                throw new Error('No valid tasks parsed');
            }

        } catch (error) {
            console.error('AI generation error:', error);
            toast.error('Failed to parse AI checklist. Generating generic plan instead.', { id: 'ai-gen' });
            
            // Fallback generic checklist
            const fallback = [
                { id: `fb_${Date.now()}_1`, text: `Research foundational topics of ${subject?.name || subjectId}`, done: false },
                { id: `fb_${Date.now()}_2`, text: 'Gather reference syllabus PDF and syllabus guidelines', done: false },
                { id: `fb_${Date.now()}_3`, text: 'Identify core chapters and check off practice questions', done: false }
            ];
            saveTodos([...todos, ...fallback]);
        } finally {
            setIsAiLoading(false);
        }
    };

    // Calculate progress stats
    const doneTodos = todos.filter(t => t.done).length;
    const totalTodos = todos.length;
    const todoPercentage = totalTodos > 0 ? Math.round((doneTodos / totalTodos) * 100) : 0;

    // Helper for category icon
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'YouTube': return <Youtube className="w-5 h-5 text-red-500" />;
            case 'PDF': return <FileText className="w-5 h-5 text-purple-500" />;
            default: return <Globe className="w-5 h-5 text-blue-500" />;
        }
    };

    if (!subject) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <Loader2 className="w-10 h-10 animate-spin text-[#900C3F]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            
            {/* Header Sticky Navigation */}
            <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/more-features?import=')} 
                        className="flex items-center gap-2 text-gray-400 hover:text-[#900C3F] transition-colors font-bold text-sm group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Syllabus
                    </button>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#900C3F] animate-pulse" />
                        <span className="font-black text-[#581845] tracking-tighter uppercase text-sm">AI SUBJECT BINDER</span>
                    </div>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </header>

            {/* Main content grid */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12 space-y-10">
                
                {/* 1. Immersive Subject Hero Card */}
                <div className="bg-gradient-to-br from-[#581845] to-[#900C3F] text-white p-8 rounded-[2.5rem] shadow-2xl shadow-[#900C3F]/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-3 relative z-10">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-yellow-400">
                                {branch} &bull; Sem {semester}
                            </span>
                            <span className="bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest">
                                {subject.id}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">{subject.name}</h1>
                        <p className="text-white/80 font-bold text-xs uppercase tracking-widest">
                            Academic Credits: <strong className="text-yellow-400 font-black">{subject.credits}</strong>
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2 relative z-10 shrink-0">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl md:text-5xl font-black text-[#FFC300]">{todoPercentage}%</span>
                            <span className="text-xs uppercase font-black text-white/50 tracking-widest">Roadmap Cleared</span>
                        </div>
                        <div className="w-full md:w-56 h-3 bg-white/20 rounded-full overflow-hidden border border-white/10 shadow-inner">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-[#FFC300] to-yellow-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${todoPercentage}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Interactive Study Center Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left & Center: Interactive To-Do List Generator */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-2">
                                    <ListTodo className="w-6 h-6 text-[#900C3F]" />
                                    <h2 className="text-xl font-black text-[#581845] tracking-tight">Active Learning Steps</h2>
                                </div>
                                {todos.length > 0 && (
                                    <button 
                                        onClick={handleClearAllTodos}
                                        className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Manual todo adding */}
                            <form onSubmit={handleAddTodo} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter custom learning task (e.g. Solve Chapter 3 exercises)..."
                                    value={newTodoText}
                                    onChange={(e) => setNewTodoText(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#900C3F]/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#900C3F] hover:bg-[#700931] text-white px-5 py-3 rounded-2xl font-black text-sm transition-all shrink-0 flex items-center justify-center gap-1 shadow-md shadow-[#900C3F]/20"
                                >
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </form>

                            {/* To-Do Checklist Output */}
                            <div className="space-y-3 pt-2">
                                {todos.length === 0 ? (
                                    <div className="border border-dashed rounded-3xl p-12 text-center border-gray-200/80 bg-gray-50/50">
                                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h4 className="font-black text-gray-600 text-sm">Your study checklist is empty!</h4>
                                        <p className="text-gray-400 text-xs font-medium max-w-xs mx-auto mt-1">Use the MSIT GPT planner widget on the right to auto-generate logical learning steps, or add custom tasks manually.</p>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {todos.map((todo) => (
                                            <motion.div
                                                key={todo.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className={`flex items-center justify-between p-4 rounded-2xl border text-sm transition-all ${
                                                    todo.done 
                                                    ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800' 
                                                    : 'bg-white border-gray-200/70 text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 mr-3 overflow-hidden">
                                                    <button
                                                        onClick={() => toggleTodo(todo.id)}
                                                        className={`shrink-0 transition-colors ${todo.done ? 'text-emerald-500' : 'text-gray-300 hover:text-[#900C3F]'}`}
                                                    >
                                                        <CheckCircle2 className="w-5 h-5 fill-current bg-white rounded-full" />
                                                    </button>
                                                    <span className={`font-bold leading-relaxed ${todo.done ? 'line-through opacity-50' : ''}`}>
                                                        {todo.text}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteTodo(todo.id)}
                                                    className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all"
                                                    title="Delete task"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>

                        {/* Subject Recommended Playlists */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-4">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <h3 className="font-black text-[#581845] text-lg tracking-tight uppercase text-xs tracking-widest text-[#900C3F] flex items-center gap-1.5 leading-none">
                                    <BookOpen className="w-4 h-4" /> Curriculum Study Playlists
                                </h3>
                                <button
                                    onClick={() => setShowAddResourceModal(true)}
                                    className="inline-flex items-center gap-1 bg-[#900C3F]/5 text-[#900C3F] hover:bg-[#900C3F] hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                    <Plus className="w-3 h-3" /> Add Link
                                </button>
                            </div>

                            {subject.resources?.length === 0 ? (
                                <div className="bg-gray-50 border border-dashed rounded-3xl p-8 text-center border-gray-200/80 bg-gray-50/50 flex flex-col items-center justify-center gap-3">
                                    <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest italic leading-none">
                                        No study resources bound yet.
                                    </p>
                                    <button
                                        onClick={() => setShowAddResourceModal(true)}
                                        className="inline-flex items-center gap-1.5 bg-[#900C3F] hover:bg-[#700931] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#900C3F]/20"
                                    >
                                        <Plus className="w-4 h-4" /> Add Custom Resource
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {subject.resources?.map((res, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200/70 hover:border-[#900C3F]/30 hover:bg-white hover:shadow-lg transition-all rounded-2xl group"
                                        >
                                            <a
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 flex-1 min-w-0"
                                            >
                                                <div className="shrink-0 p-2.5 bg-white border rounded-xl shadow-sm group-hover:bg-[#900C3F]/5 transition-colors">
                                                    {getCategoryIcon(res.category)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-black text-gray-800 text-sm truncate group-hover:text-[#900C3F] transition-colors">{res.title}</h4>
                                                    <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest">{res.category} Binder</span>
                                                </div>
                                            </a>
                                            <div className="flex items-center gap-1.5 pl-3">
                                                <a 
                                                    href={res.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-gray-100 text-gray-400 hover:text-[#900C3F] rounded-xl transition-colors shrink-0"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteResource(idx)}
                                                    className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-colors shrink-0"
                                                    title="Remove Resource Link"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: MSIT GPT AI Planner */}
                    <div className="space-y-6">
                        
                        {/* AI Planner Card */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6 relative overflow-hidden">
                            {/* Decorative Sparkle behind */}
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Bot className="w-32 h-32 text-[#900C3F]" />
                            </div>

                            <div className="space-y-2 relative z-10">
                                <div className="flex items-center gap-2 bg-[#900C3F]/5 border border-[#900C3F]/10 px-3 py-1 rounded-full w-max text-[10px] font-black uppercase tracking-widest text-[#900C3F]">
                                    <Bot className="w-3.5 h-3.5" /> AI study planer
                                </div>
                                <h3 className="text-lg font-black text-[#581845] tracking-tight">MSIT GPT Study Planner</h3>
                                <p className="text-gray-500 text-xs font-semibold leading-relaxed">
                                    MSIT GPT will analyze the curriculum scope and automatically compile a sequential, step-by-step learning roadmap of to-dos directly into your checklist.
                                </p>
                            </div>

                            {/* Prompt/Syllabus Input area */}
                            <div className="space-y-3 relative z-10">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1">
                                    Syllabus sub-topics <span className="text-[8px] font-bold text-gray-300 italic">(Optional)</span>
                                </label>
                                <textarea
                                    placeholder="Paste specific chapters, exam topics, or syllabus text here to let the AI organize them chronologically... (e.g. Unit 1: OS structures, Unit 2: Processes, Unit 3: Threads)"
                                    value={syllabusInput}
                                    onChange={(e) => setSyllabusInput(e.target.value)}
                                    rows={4}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#900C3F]/20 transition-all resize-none"
                                />
                            </div>

                            {/* Generate Buttons */}
                            <button
                                onClick={handleGenerateAiRoadmap}
                                disabled={isAiLoading}
                                className="w-full py-4 bg-[#900C3F] hover:bg-[#700931] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm shadow-lg shadow-[#900C3F]/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:scale-100"
                            >
                                {isAiLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Planning Course...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 animate-pulse" />
                                        <span>Generate AI Study Plan</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Extra Tip Card */}
                        <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/20 p-6 rounded-[2rem] border border-blue-100/50 space-y-2">
                            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                                <HelpCircle className="w-4 h-4 text-indigo-500" /> Study Tips
                            </h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                                Complete your foundational topics first. Lab assignments and programming exercises usually carry practical credits that dramatically boost your overall SGPA. Make sure to check off previous papers (PYQ) before writing final exams!
                            </p>
                        </div>

                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="py-8 bg-white border-t mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">Academic Binder Hub &bull; Handcrafted for MSITians by MSIT_ROOM Developers</p>
                </div>
            </footer>
        </div>
    );
};

export default SubjectRoadmap;

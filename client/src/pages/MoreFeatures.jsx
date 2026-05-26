import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, BookOpen, Rocket, Plus, Trash2, RefreshCw, ChevronRight, Zap, Library } from 'lucide-react';
import toast from 'react-hot-toast';
import SyllabusRoadmap from '../components/SyllabusRoadmap';
import Navbar from '../components/Navbar';

const getGradeFromPoints = (points) => {
    const p = parseFloat(points);
    if (isNaN(p) || p < 0) return '-';
    if (p >= 10) return 'O';
    if (p >= 9) return 'E';
    if (p >= 8) return 'A';
    if (p >= 7) return 'B';
    if (p >= 6) return 'C';
    if (p >= 5) return 'D';
    if (p >= 2) return 'F';
    return '-';
};

const MoreFeatures = () => {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search);
    const hasImport = queryParams.has('import');
    const [activeTab, setActiveTab] = useState(hasImport ? 'syllabus' : 'calculator'); // 'calculator' | 'syllabus' | 'upcoming'
    const [calcMode, setCalcMode] = useState('sgpa'); // 'sgpa' | 'cgpa'

    // SGPA State
    const [subjects, setSubjects] = useState([
        { id: 1, name: '', credits: '', gradeLetter: '-', points: 0, creditPoints: 0 }
    ]);

    // CGPA State
    const [semesters, setSemesters] = useState([
        { id: 1, sgpa: '', credits: '' }
    ]);

    const [result, setResult] = useState(null);

    const addSubject = () => {
        setSubjects([...subjects, { id: Date.now(), name: '', credits: '', gradeLetter: '-', points: 0, creditPoints: 0 }]);
    };

    const addSemester = () => {
        setSemesters([...semesters, { id: Date.now(), sgpa: '', credits: '' }]);
    };

    const removeSubject = (id) => {
        if (subjects.length === 1) return;
        setSubjects(subjects.filter(s => s.id !== id));
    };

    const removeSemester = (id) => {
        if (semesters.length === 1) return;
        setSemesters(semesters.filter(s => s.id !== id));
    };

    const updateSubject = (id, field, value) => {
        setSubjects(subjects.map(s => {
            if (s.id === id) {
                const updated = { ...s, [field]: value };

                // Real-time auto calculations based on Points and Credits
                updated.gradeLetter = getGradeFromPoints(updated.points);

                const pts = parseFloat(updated.points);
                const credits = parseFloat(updated.credits);

                updated.creditPoints = (!isNaN(pts) && !isNaN(credits)) ? (pts * credits).toFixed(2) : 0;

                return updated;
            }
            return s;
        }));
    };

    const updateSemester = (id, field, value) => {
        setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const calculateResult = () => {
        if (calcMode === 'sgpa') {
            let totalCreditPoints = 0;
            let totalCredits = 0;
            let hasError = false;

            subjects.forEach(s => {
                const credits = parseFloat(s.credits);
                const points = parseFloat(s.points);
                if (isNaN(credits) || credits <= 0 || isNaN(points) || points < 0 || points > 10) {
                    hasError = true;
                    return;
                }
                totalCreditPoints += credits * points;
                totalCredits += credits;
            });

            if (hasError) {
                toast.error("Please enter valid Points (0-10) and Credits");
                return;
            }
            setResult((totalCreditPoints / totalCredits).toFixed(2));
        } else {
            // CGPA Calculation: Add all SGPAs and divide by number of semesters
            let totalSgpa = 0;
            let totalSemesters = 0;
            let hasError = false;

            semesters.forEach(s => {
                const sgpa = parseFloat(s.sgpa);
                if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) {
                    hasError = true;
                    return;
                }
                totalSgpa += sgpa;
                totalSemesters += 1;
            });

            if (hasError) {
                toast.error("Please enter valid SGPA (0-10) for all semesters");
                return;
            }
            if (totalSemesters === 0) return;
            setResult((totalSgpa / totalSemesters).toFixed(2));
        }
    };

    const resetCalculator = () => {
        setSubjects([{ id: 1, name: '', credits: '', gradeLetter: '-', points: 0, creditPoints: 0 }]);
        setSemesters([{ id: 1, sgpa: '', credits: '' }]);
        setResult(null);
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation Header */}
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
                {/* Feature Selector Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('calculator')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm ${activeTab === 'calculator'
                            ? 'bg-[#900C3F] text-white scale-105 shadow-[#900C3F]/20'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Calculator className="w-5 h-5" />
                        GPA Calculator
                    </button>
                    <button
                        onClick={() => setActiveTab('syllabus')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm ${activeTab === 'syllabus'
                            ? 'bg-[#900C3F] text-white scale-105 shadow-[#900C3F]/20'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <BookOpen className="w-5 h-5" />
                        Syllabus Roadmap
                    </button>
                    <button
                        onClick={() => navigate('/resource-hub')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-[#900C3F]/20`}
                    >
                        <Library className="w-5 h-5 text-[#900C3F]" />
                        Academic Hub (PYQ)
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {activeTab === 'calculator' && (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex flex-col">
                                            <h2 className="text-2xl font-black text-gray-800">Academic Calculator</h2>
                                            <p className="text-gray-500 text-sm">MAKAUT Standard SGPA/CGPA logic applied</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                            <button
                                                onClick={() => { setCalcMode('sgpa'); setResult(null); }}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${calcMode === 'sgpa' ? 'bg-white text-[#900C3F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                SGPA
                                            </button>
                                            <button
                                                onClick={() => { setCalcMode('cgpa'); setResult(null); }}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${calcMode === 'cgpa' ? 'bg-white text-[#900C3F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                CGPA
                                            </button>
                                        </div>
                                        <button
                                            onClick={resetCalculator}
                                            className="p-2 text-gray-400 hover:text-[#900C3F] hover:bg-red-50 rounded-full transition-all"
                                            title="Reset All"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {calcMode === 'sgpa' ? (
                                        <div className="space-y-4">
                                            {/* Table Headers for Desktop */}
                                            <div className="hidden md:grid md:grid-cols-[1fr,100px,70px,70px,90px,40px] gap-2 px-4 mb-2 text-[10px] uppercase font-black text-gray-400">
                                                <span>Subject Name</span>
                                                <span className="text-center">Points</span>
                                                <span className="text-center">Grade</span>
                                                <span className="text-center">Credit</span>
                                                <span className="text-center">Credit Pts</span>
                                                <span></span>
                                            </div>

                                            {subjects.map((subject) => (
                                                <div key={subject.id} className="flex flex-col md:grid md:grid-cols-[1fr,100px,70px,70px,90px,40px] gap-3 items-end md:items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors group">
                                                    <div className="w-full">
                                                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block md:hidden">Subject Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. Mathematics-II"
                                                            value={subject.name}
                                                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                                                            className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#900C3F]/20 shadow-sm transition-all"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 md:contents w-full gap-3">
                                                        <div className="w-full md:w-auto">
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block md:hidden">Points (0-10)</label>
                                                            <input
                                                                type="number"
                                                                step="1"
                                                                min="0"
                                                                max="10"
                                                                placeholder="Pts"
                                                                value={subject.points}
                                                                onChange={(e) => updateSubject(subject.id, 'points', e.target.value)}
                                                                className="w-full md:text-center bg-white border-none rounded-xl px-2 py-2 text-sm focus:ring-2 focus:ring-[#900C3F]/20 shadow-sm font-bold text-[#900C3F]"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col items-center justify-center w-full md:w-auto bg-white/50 md:bg-transparent rounded-xl md:rounded-none p-1 md:p-0">
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 block md:hidden">Grade</label>
                                                            <span className="font-black text-[#581845] text-sm md:text-base">{subject.gradeLetter}</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:contents w-full gap-3">
                                                        <div className="w-full md:w-auto">
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block md:hidden">Credit</label>
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                placeholder="0"
                                                                value={subject.credits}
                                                                onChange={(e) => updateSubject(subject.id, 'credits', e.target.value)}
                                                                className="w-full md:text-center bg-white border-none rounded-xl px-2 py-2 text-sm focus:ring-2 focus:ring-[#900C3F]/20 shadow-sm"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col items-center justify-center w-full md:w-auto bg-white/50 md:bg-transparent rounded-xl md:rounded-none p-1 md:p-0">
                                                            <label className="text-[10px] uppercase font-bold mb-0.5 block md:hidden text-[#900C3F]">Points</label>
                                                            <span className="font-mono font-black text-[#900C3F] text-sm md:text-base">{subject.creditPoints || 0}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeSubject(subject.id)}
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
                                                        title="Delete Row"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Summary Row for SGPA */}
                                            {subjects.length > 0 && (
                                                <div className="hidden md:grid md:grid-cols-[1fr,100px,70px,70px,90px,40px] gap-2 px-4 py-3 bg-gray-100/50 rounded-2xl border border-dashed border-gray-200">
                                                    <span className="font-black text-[#581845] text-xs">GRAND TOTAL</span>
                                                    <span></span>
                                                    <span></span>
                                                    <span className="text-center font-black text-[#581845]">
                                                        {subjects.reduce((sum, s) => sum + (parseFloat(s.credits) || 0), 0)}
                                                    </span>
                                                    <span className="text-center font-black text-[#900C3F]">
                                                        {subjects.reduce((sum, s) => sum + (parseFloat(s.creditPoints) || 0), 0).toFixed(1)}
                                                    </span>
                                                    <span></span>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                    onClick={addSubject}
                                                    className="flex items-center gap-2 text-[#900C3F] font-bold hover:bg-[#900C3F]/5 px-4 py-2 rounded-xl transition-all"
                                                >
                                                    <Plus className="w-5 h-5" /> Add Subject
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {semesters.map((sem, idx) => (
                                                <div key={sem.id} className="flex flex-col md:flex-row gap-3 items-end md:items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <div className="flex-1 w-full">
                                                        <div className="text-xs font-black text-[#581845] mb-2 px-1">SEMESTER {idx + 1}</div>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block px-1">SGPA</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    placeholder="0.00"
                                                                    value={sem.sgpa}
                                                                    onChange={(e) => updateSemester(sem.id, 'sgpa', e.target.value)}
                                                                    className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#900C3F]/20 shadow-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeSemester(sem.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={addSemester}
                                                className="flex items-center gap-2 text-[#900C3F] font-bold hover:bg-[#900C3F]/5 px-4 py-2 rounded-xl transition-all"
                                            >
                                                <Plus className="w-5 h-5" /> Add Semester
                                            </button>
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-col md:flex-row items-center justify-end gap-6 pt-8 border-t border-gray-100">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            {result !== null && (
                                                <div className="bg-[#900C3F]/5 px-6 py-3 rounded-2xl border border-[#900C3F]/10">
                                                    <span className="text-gray-500 font-medium text-sm mr-2">{calcMode === 'sgpa' ? 'SGPA' : 'CGPA'}:</span>
                                                    <span className="text-2xl font-black text-[#900C3F]">{result}</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={calculateResult}
                                                className="flex-1 md:flex-none px-8 py-3 bg-[#900C3F] text-white font-black rounded-2xl shadow-lg shadow-[#900C3F]/20 hover:scale-105 active:scale-95 transition-all text-sm md:text-base uppercase tracking-wider"
                                            >
                                                Calculate {calcMode.toUpperCase()}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                         {activeTab === 'syllabus' && (
                            <SyllabusRoadmap />
                        )}

                    </div>

                    {/* Sidebar / Reference Info */}
                    <div className="space-y-6">
                        {activeTab === 'calculator' && (
                            <div className="bg-[#900C3F] rounded-3xl p-6 text-white shadow-xl shadow-[#900C3F]/20">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Calculator className="w-5 h-5" />
                                    Grading Scale
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {[
                                        { g: 'O', p: '10', d: '90-100%' },
                                        { g: 'E', p: '9', d: '80-89%' },
                                        { g: 'A', p: '8', d: '70-79%' },
                                        { g: 'B', p: '7', d: '60-69%' },
                                        { g: 'C', p: '6', d: '50-59%' },
                                        { g: 'D', p: '5', d: '40-49%' },
                                        { g: 'F', p: '2', d: '< 40%' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between py-1 border-b border-white/10 last:border-0">
                                            <span className="font-bold">{item.g}</span>
                                            <span>{item.d}</span>
                                            <span className="opacity-80 font-mono">{item.p} pts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-2">Did you know?</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                MAKAUT uses a Credit-Based system. Your SGPA is calculated by multiplying your grade point by the subject credit and dividing the total by total credits.
                            </p>
                            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-blue-600 text-xs font-medium flex gap-2">
                                <div className="mt-0.5 flex-shrink-0">💡</div>
                                Keep track of your lab credits, they usually have a high impact!
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 bg-white border-t mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">From One MSITian to Another. Made with ❤️ by Suman Banerjee.</p>
                </div>
            </footer>
        </div>
    );
};

export default MoreFeatures;

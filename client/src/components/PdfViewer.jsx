import React, { useState, useEffect, useRef } from 'react';
import { 
    X, ZoomIn, ZoomOut, Download, Printer, Undo2, Redo2, 
    Trash2, Hand, Pencil, Highlighter, Eraser, Check, Save, 
    Sparkles, Info, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { SERVER_URL } from '../utils/config';

// Individual PDF Page Component with drawing canvas overlay
const PdfPage = ({ 
    pageNumber, 
    pdfDoc, 
    zoom, 
    tool, 
    penColor, 
    penSize, 
    annotations, 
    onSaveAnnotations 
}) => {
    const pdfCanvasRef = useRef(null);
    const annotationCanvasRef = useRef(null);
    const containerRef = useRef(null);
    const isDrawing = useRef(false);
    const currentPoints = useRef([]);
    const renderTaskRef = useRef(null);
    const [pageWidth, setPageWidth] = useState(0);
    const [pageHeight, setPageHeight] = useState(0);

    // Redraw annotations on scale or strokes change
    const redrawAnnotations = (canvas, strokes) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        strokes.forEach((stroke) => {
            if (!stroke.points || stroke.points.length < 1) return;

            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (stroke.tool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.strokeStyle = 'rgba(0,0,0,1)';
                ctx.lineWidth = stroke.size * 3.5;
            } else if (stroke.tool === 'highlighter') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = stroke.color; // color has transparency already
                ctx.lineWidth = stroke.size * 3.0; // make highlighters thicker
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = stroke.color;
                ctx.lineWidth = stroke.size;
            }

            const firstPoint = stroke.points[0];
            ctx.moveTo(firstPoint.x * canvas.width, firstPoint.y * canvas.height);

            for (let i = 1; i < stroke.points.length; i++) {
                const pt = stroke.points[i];
                ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
            }
            ctx.stroke();
        });

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
    };

    // Load page and render to canvas
    useEffect(() => {
        let isCurrent = true;

        pdfDoc.getPage(pageNumber).then((page) => {
            if (!isCurrent) return;

            const viewport = page.getViewport({ scale: zoom });
            const canvas = pdfCanvasRef.current;
            const annCanvas = annotationCanvasRef.current;
            if (!canvas || !annCanvas) return;

            // Update dimensions state
            setPageWidth(viewport.width);
            setPageHeight(viewport.height);

            // Set actual canvas resolutions
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            annCanvas.width = viewport.width;
            annCanvas.height = viewport.height;

            // Draw current annotations immediately on resize
            redrawAnnotations(annCanvas, annotations);

            const context = canvas.getContext('2d');
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            // Cancel previous render task if active
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }

            renderTaskRef.current = page.render(renderContext);
            renderTaskRef.current.promise.catch((err) => {
                if (err.name !== 'RenderingCancelledException') {
                    console.error('Render error:', err);
                }
            });
        });

        return () => {
            isCurrent = false;
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdfDoc, pageNumber, zoom]);

    // Redraw when strokes array changes externally (e.g. undo/redo)
    useEffect(() => {
        redrawAnnotations(annotationCanvasRef.current, annotations);
    }, [annotations]);

    // Draw operations
    const getCoordinates = (e) => {
        const canvas = annotationCanvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Normalize coords relative to bounds
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        return { x, y };
    };

    const startDrawing = (e) => {
        if (tool === 'pan') return;

        const coords = getCoordinates(e);
        if (!coords) return;

        isDrawing.current = true;
        currentPoints.current = [coords];

        // Draw initial point on canvas
        const canvas = annotationCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        
        const size = tool === 'eraser' ? penSize * 3.5 : tool === 'highlighter' ? penSize * 3.0 : penSize;
        ctx.arc(coords.x * canvas.width, coords.y * canvas.height, size / 2, 0, Math.PI * 2);

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = penColor;
        }
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    };

    const draw = (e) => {
        if (!isDrawing.current) return;

        // Prevent standard touch scrolling when drawing
        if (e.touches) {
            e.preventDefault();
        }

        const coords = getCoordinates(e);
        if (!coords) return;

        const canvas = annotationCanvasRef.current;
        if (!canvas) return;

        const prevPoint = currentPoints.current[currentPoints.current.length - 1];
        currentPoints.current.push(coords);

        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = penSize * 3.5;
        } else if (tool === 'highlighter') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = penColor;
            ctx.lineWidth = penSize * 3.0;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = penColor;
            ctx.lineWidth = penSize;
        }

        ctx.moveTo(prevPoint.x * canvas.width, prevPoint.y * canvas.height);
        ctx.lineTo(coords.x * canvas.width, coords.y * canvas.height);
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;

        if (currentPoints.current.length > 0) {
            const newStroke = {
                tool,
                color: penColor,
                size: penSize,
                points: currentPoints.current
            };
            onSaveAnnotations([...annotations, newStroke]);
        }
        currentPoints.current = [];
    };

    return (
        <div 
            ref={containerRef}
            className="relative bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 mx-auto my-6"
            style={{ 
                width: pageWidth ? `${pageWidth}px` : 'auto', 
                height: pageHeight ? `${pageHeight}px` : 'auto',
                maxWidth: '100%'
            }}
        >
            {/* Background PDF Page */}
            <canvas ref={pdfCanvasRef} className="absolute inset-0 w-full h-full" />

            {/* Annotation Canvas Overlay */}
            <canvas 
                ref={annotationCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className={`absolute inset-0 w-full h-full z-10 select-none ${
                    tool === 'pan' ? 'cursor-grab active:cursor-grabbing pointer-events-none' : 'cursor-crosshair pointer-events-auto'
                }`}
            />

            {/* Page number tag */}
            <div className="absolute bottom-4 right-4 z-20 bg-gray-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-white tracking-widest pointer-events-none">
                PAGE {pageNumber}
            </div>
        </div>
    );
};

// Main PDF Viewer Modal Component
const PdfViewer = ({ resource, onClose }) => {
    if (!resource) return null;

    const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1.4);
    
    // Tools: 'pan', 'pen', 'highlighter', 'eraser'
    const [tool, setTool] = useState('pan');
    const [penColor, setPenColor] = useState('#ef4444');
    const [penSize, setPenSize] = useState(4);

    // Annotations State: { [pageNumber]: [strokes] }
    const [annotations, setAnnotations] = useState({});
    const [history, setHistory] = useState([{}]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const pdfUrl = `${SERVER_URL}${resource.url}`;
    const storageKey = `pdf_annotations_${resource.id || resource.title}`;

    // Color presets
    const colors = [
        { name: 'Red', value: '#ef4444' },
        { name: 'Green', value: '#10b981' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Black', value: '#1f2937' }
    ];

    // Highlighter presets (semi-transparent)
    const highlighterColors = [
        { name: 'Yellow', value: 'rgba(253, 224, 71, 0.45)' },
        { name: 'Green', value: 'rgba(110, 231, 183, 0.45)' },
        { name: 'Blue', value: 'rgba(147, 197, 253, 0.45)' },
        { name: 'Orange', value: 'rgba(253, 186, 116, 0.45)' }
    ];

    // Set defaults when tool changes
    useEffect(() => {
        if (tool === 'highlighter') {
            setPenColor(highlighterColors[0].value);
            setPenSize(8);
        } else if (tool === 'pen') {
            setPenColor(colors[0].value);
            setPenSize(4);
        }
    }, [tool]);

    // Load PDF.js from CDN
    useEffect(() => {
        if (window.pdfjsLib) {
            setPdfjsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
        script.async = true;
        script.onload = () => {
            const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
            if (pdfjsLib) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
                setPdfjsLoaded(true);
            } else {
                toast.error('Failed to parse PDF engine');
            }
        };
        script.onerror = () => {
            toast.error('Failed to load PDF viewer engine.');
        };
        document.body.appendChild(script);

        return () => {
            // keep script loaded for future views
        };
    }, []);

    // Load PDF Document when engine is ready
    useEffect(() => {
        if (!pdfjsLoaded) return;

        setLoading(true);
        const loadingTask = window.pdfjsLib.getDocument({
            url: pdfUrl,
            withCredentials: false
        });

        loadingTask.promise.then(
            (pdf) => {
                setPdfDoc(pdf);
                setNumPages(pdf.numPages);
                
                // Load saved annotations
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        setAnnotations(parsed);
                        setHistory([parsed]);
                        setHistoryIndex(0);
                    } catch (e) {
                        console.error('Failed to parse annotations', e);
                    }
                } else {
                    setAnnotations({});
                    setHistory([{}]);
                    setHistoryIndex(0);
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error loading PDF:', error);
                toast.error('Failed to preview PDF. Downloading instead...');
                // Fallback to direct download
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.setAttribute('download', resource.originalName || resource.title);
                document.body.appendChild(link);
                link.click();
                link.remove();
                onClose();
            }
        );
    }, [pdfjsLoaded, pdfUrl]);

    // Save history & localStorage
    const updateAnnotations = (newAnnotations) => {
        // Prune future states if we were in the middle of undo stack
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newAnnotations);
        
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setAnnotations(newAnnotations);

        setIsSaving(true);
        localStorage.setItem(storageKey, JSON.stringify(newAnnotations));
        setTimeout(() => setIsSaving(false), 600);
    };

    const handleSavePageAnnotations = (pageNo, pageStrokes) => {
        const nextAnns = {
            ...annotations,
            [pageNo]: pageStrokes
        };
        updateAnnotations(nextAnns);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setHistoryIndex(prevIndex);
            setAnnotations(history[prevIndex]);
            localStorage.setItem(storageKey, JSON.stringify(history[prevIndex]));
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setHistoryIndex(nextIndex);
            setAnnotations(history[nextIndex]);
            localStorage.setItem(storageKey, JSON.stringify(history[nextIndex]));
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all markings on this PDF?')) {
            updateAnnotations({});
        }
    };

    const handlePrint = () => {
        window.open(pdfUrl, '_blank');
    };

    // Zoom adjustments
    const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3.0));
    const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-gray-950/90 backdrop-blur-md flex flex-col h-screen overflow-hidden text-white"
            >
                {/* Header Toolbar */}
                <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex flex-col md:flex-row gap-4 items-center justify-between z-30 shadow-lg shrink-0">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={onClose}
                            className="p-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-2xl transition-all"
                            title="Close Viewer"
                        >
                            <X className="w-5 h-5 text-gray-300" />
                        </button>
                        <div className="min-w-0">
                            <h2 className="font-black text-sm md:text-base tracking-tight truncate max-w-[250px] md:max-w-[350px]">{resource.title}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                                    {isSaving ? 'Saving sketch...' : 'Sketch Autosaved'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Annotation Toolbar Floating Center */}
                    {!loading && (
                        <div className="flex flex-wrap items-center justify-center bg-gray-800/80 border border-white/10 p-1.5 rounded-3xl gap-1 shadow-inner">
                            <button
                                onClick={() => setTool('pan')}
                                className={`p-2.5 rounded-2xl transition-all ${
                                    tool === 'pan' 
                                    ? 'bg-[#900C3F] text-white shadow-md shadow-[#900C3F]/20' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                title="Scroll & Navigation"
                            >
                                <Hand className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setTool('pen')}
                                className={`p-2.5 rounded-2xl transition-all ${
                                    tool === 'pen' 
                                    ? 'bg-[#900C3F] text-white shadow-md shadow-[#900C3F]/20' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                title="Solve Pen"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setTool('highlighter')}
                                className={`p-2.5 rounded-2xl transition-all ${
                                    tool === 'highlighter' 
                                    ? 'bg-[#900C3F] text-white shadow-md shadow-[#900C3F]/20' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                title="Highlight Text"
                            >
                                <Highlighter className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setTool('eraser')}
                                className={`p-2.5 rounded-2xl transition-all ${
                                    tool === 'eraser' 
                                    ? 'bg-[#900C3F] text-white shadow-md shadow-[#900C3F]/20' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                title="Eraser"
                            >
                                <Eraser className="w-4 h-4" />
                            </button>

                            {/* Separator */}
                            {tool !== 'pan' && tool !== 'eraser' && (
                                <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
                            )}

                            {/* Color Selector */}
                            {tool === 'pen' && (
                                <div className="flex items-center gap-1.5 px-2">
                                    {colors.map(c => (
                                        <button
                                            key={c.value}
                                            onClick={() => setPenColor(c.value)}
                                            style={{ backgroundColor: c.value }}
                                            className={`w-5 h-5 rounded-full border relative transition-all duration-300 ${
                                                penColor === c.value 
                                                ? 'scale-125 border-white ring-2 ring-[#900C3F]/40' 
                                                : 'border-transparent hover:scale-110'
                                            }`}
                                            title={c.name}
                                        >
                                            {penColor === c.value && <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {tool === 'highlighter' && (
                                <div className="flex items-center gap-1.5 px-2">
                                    {highlighterColors.map(c => (
                                        <button
                                            key={c.value}
                                            onClick={() => setPenColor(c.value)}
                                            style={{ backgroundColor: c.value.replace('0.45', '1') }} // solid look on dot
                                            className={`w-5 h-5 rounded-full border relative transition-all duration-300 ${
                                                penColor === c.value 
                                                ? 'scale-125 border-white ring-2 ring-[#900C3F]/40' 
                                                : 'border-transparent hover:scale-110'
                                            }`}
                                            title={c.name}
                                        >
                                            {penColor === c.value && <Check className="w-3 h-3 text-gray-900 absolute inset-0 m-auto" />}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Size Slider */}
                            {tool !== 'pan' && (
                                <div className="flex items-center gap-2 px-2 shrink-0">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Size</span>
                                    <input 
                                        type="range" 
                                        min={tool === 'highlighter' ? 6 : 2} 
                                        max={tool === 'highlighter' ? 30 : 15}
                                        value={penSize} 
                                        onChange={(e) => setPenSize(Number(e.target.value))}
                                        className="w-16 accent-[#900C3F] bg-gray-700 h-1 rounded-lg outline-none cursor-pointer"
                                    />
                                    <span className="text-[10px] font-mono text-gray-300 w-4 font-bold">{penSize}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions Side */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        {/* Zoom */}
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
                            <button 
                                onClick={zoomOut}
                                className="p-1.5 hover:bg-white/5 active:scale-95 rounded-xl transition-all"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-4 h-4 text-gray-300" />
                            </button>
                            <span className="text-[10px] font-black font-mono w-12 text-center text-gray-300">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button 
                                onClick={zoomIn}
                                className="p-1.5 hover:bg-white/5 active:scale-95 rounded-xl transition-all"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4 text-gray-300" />
                            </button>
                        </div>

                        {/* History */}
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
                            <button 
                                onClick={handleUndo}
                                disabled={historyIndex === 0}
                                className="p-1.5 hover:bg-white/5 active:scale-95 disabled:opacity-20 rounded-xl transition-all"
                                title="Undo annotation"
                            >
                                <Undo2 className="w-4 h-4 text-gray-300" />
                            </button>
                            <button 
                                onClick={handleRedo}
                                disabled={historyIndex >= history.length - 1}
                                className="p-1.5 hover:bg-white/5 active:scale-95 disabled:opacity-20 rounded-xl transition-all"
                                title="Redo annotation"
                            >
                                <Redo2 className="w-4 h-4 text-gray-300" />
                            </button>
                        </div>

                        {/* Clear */}
                        <button 
                            onClick={handleClearAll}
                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 active:scale-95 border border-red-500/20 rounded-2xl transition-all text-red-400"
                            title="Clear all annotations"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Print / Open Original */}
                        <button 
                            onClick={handlePrint}
                            className="p-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-2xl transition-all text-gray-300"
                            title="Open original / Print"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Info Bar */}
                {!loading && (
                    <div className="bg-[#900C3F]/10 border-b border-[#900C3F]/20 px-6 py-2 flex items-center justify-between text-xs text-red-200 shrink-0">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#900C3F] shrink-0" />
                            <span><strong>Study Mode active:</strong> Use <strong>Pen</strong> or <strong>Highlighter</strong> to solve, tick, or annotate questions. Scroll by enabling the grab-hand button.</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1.5 font-bold uppercase tracking-widest text-[9px] text-[#900C3F]">
                            <Info className="w-3.5 h-3.5" /> Auto-saved in browser
                        </div>
                    </div>
                )}

                {/* PDF Canvas scrollable viewport container */}
                <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-gray-950 items-start select-none">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400 py-40">
                            <Loader2 className="w-10 h-10 text-[#900C3F] animate-spin" />
                            <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Initializing academic paper...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {Array.from({ length: numPages }, (_, idx) => (
                                <PdfPage
                                    key={idx + 1}
                                    pageNumber={idx + 1}
                                    pdfDoc={pdfDoc}
                                    zoom={zoom}
                                    tool={tool}
                                    penColor={penColor}
                                    penSize={penSize}
                                    annotations={annotations[idx + 1] || []}
                                    onSaveAnnotations={(pageStrokes) => handleSavePageAnnotations(idx + 1, pageStrokes)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PdfViewer;

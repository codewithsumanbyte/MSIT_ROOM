import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { Send, Paperclip, ArrowLeft, Download, FileText, Clock, MoreVertical, Copy, LogOut, File, Smile, QrCode, X, Check, Share2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { QRCodeSVG } from 'qrcode.react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LoadingScreen from '../components/LoadingScreen';


const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const {
        userId,
        messages,
        files,
        users,
        uploadProgress,
        isUploading,
        sendMessage,
        uploadFile,
        socket,
        joinRoom
    } = useRoom();

    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const textareaRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [vh, setVh] = useState(window.innerHeight * 0.01);

    useEffect(() => {
        // Simulate premium loading experience
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Visual Viewport Height Fix for Mobile (Realme/Samsung/iOS)
    useEffect(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                // Update the height variable based on the visual viewport
                // This shifts the UI up when the keyboard appears
                const height = window.visualViewport.height;
                const offset = window.innerHeight - height;
                document.documentElement.style.setProperty('--vvh', `${height}px`);
                document.documentElement.style.setProperty('--vvo', `${offset}px`);
                setVh(height * 0.01);
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
            window.visualViewport.addEventListener('scroll', handleResize);
            // Initial call
            handleResize();
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
                window.visualViewport.removeEventListener('scroll', handleResize);
            }
        };
    }, []);

    // Helper to generate consistent color from string
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (userId && socket) {
            joinRoom(roomId);
        }
    }, [roomId, userId, socket]);

    // Cleanup emoji picker logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [newMessage]);

    const handleSend = (e) => {
        e?.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        // Disable Enter-to-send on mobile devices
        if (window.innerWidth < 768) return;

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileUpload = async (e) => {
        const filesToUpload = e.target.files ? Array.from(e.target.files) : [];
        if (filesToUpload.length === 0) return;

        for (const file of filesToUpload) {
            if (file.size > 500 * 1024 * 1024) {
                toast.error(`File ${file.name} too large (Max 500MB)`);
                continue;
            }
            try {
                // We await each upload for now to show sequential progress
                // Or we could fire all at once, but the single progress bar in context would flicker.
                // For MVP, sequential is safer for the progress bar.
                await uploadFile(file);
            } catch (err) {
                console.error(err);
            }
        }
        setShowSidebar(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            for (const file of files) {
                if (file.size > 500 * 1024 * 1024) {
                    toast.error(`File ${file.name} too large (Max 500MB)`);
                    continue;
                }
                await uploadFile(file);
            }
            setShowSidebar(true);
        }
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomId);
        toast.success('Room code copied');
    };

    const copyMessage = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Content copied');
    };

    const getExpiryString = (expiresAt) => {
        if (!expiresAt) return null;
        const diff = expiresAt - currentTime;
        if (diff <= 0) return 'Expired';
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    // Detect if message is code-like and return the language
    const detectCode = (text) => {
        if (!text) return { isCode: false, language: 'javascript' };

        const languages = [
            { name: 'python', indicators: ['def ', 'print(', 'elif:', 'import os', 'import sys', 'if __name__ =='] },
            { name: 'java', indicators: ['public class', 'private class', 'System.out.print', 'public static void', 'new String[]'] },
            { name: 'cpp', indicators: ['#include', 'using namespace', 'int main(', 'printf(', 'cout <<'] },
            { name: 'php', indicators: ['$this->', '<?php', 'echo "'] },
            { name: 'css', indicators: ['body {', '.class {', '#id {', 'display:', 'margin:', 'padding:', 'color:', 'background:'] },
            { name: 'html', indicators: ['<!DOCTYPE', '<html', '<head>', '<body', '</div>', '</span>'] },
            { name: 'javascript', indicators: ['const ', 'let ', 'var ', 'function', 'import ', 'export ', '=>', 'console.', 'return '] }
        ];

        let detectedLang = 'javascript';
        let foundIndicator = false;

        for (const lang of languages) {
            if (lang.indicators.some(ind => text.includes(ind))) {
                detectedLang = lang.name;
                foundIndicator = true;
                break;
            }
        }

        // Character based patterns (e.g., balanced braces, frequent semicolons)
        const hasBraces = (text.match(/{/g) || []).length > 0 && (text.match(/}/g) || []).length > 0;
        const hasSemicolons = (text.match(/;/g) || []).length > 0;
        const lines = text.split('\n');

        // Points system for detection
        let points = 0;
        if (foundIndicator) points += 2;
        if (hasBraces) points += 1;
        if (hasSemicolons) points += 1;
        if (lines.length > 2) points += 1;

        // Regex for function calls or variable assignments
        const codePattern = /[a-zA-Z0-9_]+\s*\(.*\)|[a-zA-Z0-9_]+\s*=[^=]/;
        if (codePattern.test(text)) points += 1;

        return { isCode: points >= 2, language: detectedLang };
    };


    const timeline = [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div
            className="flex flex-col bg-gray-50 font-sans overflow-hidden relative"
            style={{
                height: 'var(--vvh, 100dvh)',
                maxHeight: 'var(--vvh, 100dvh)'
            }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Drag Overlay */}
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-[#900C3F]/90 flex flex-col items-center justify-center text-white backdrop-blur-sm animate-fade-in border-4 border-white border-dashed m-4 rounded-3xl pointer-events-none">
                    <Download className="w-24 h-24 mb-4 animate-bounce" />
                    <h2 className="text-4xl font-black">Drop Files Here</h2>
                    <p className="text-xl opacity-80 mt-2">to upload instantly</p>
                </div>
            )}

            {/* Header - Maroon Theme */}
            <header className="flex-none h-16 bg-[#900C3F] flex items-center justify-between px-4 z-40 text-white shadow-md relative">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="hover:bg-black/10 p-2 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col cursor-pointer" onClick={() => setShowSidebar(!showSidebar)}>
                        <h1 className="font-bold text-lg leading-tight">Room {roomId}</h1>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                            {/* Live Users Avatars */}
                            <div className="flex -space-x-2">
                                {users.map((u, i) => (
                                    <div
                                        key={u.socketId}
                                        className="w-5 h-5 rounded-full border border-[#900C3F] flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
                                        style={{ backgroundColor: stringToColor(u.id) }}
                                        title={u.id}
                                    >
                                        {u.id.substring(5, 7).toUpperCase()}
                                    </div>
                                ))}
                            </div>
                            <span>{users.length} Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowQR(true)}
                        className="p-2 hover:bg-black/10 rounded-full transition-colors"
                        title="Show QR Code"
                    >
                        <QrCode className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className={`p-2 rounded-full transition-colors lg:hidden ${showSidebar ? 'bg-black/20' : 'hover:bg-black/10'}`}
                        title="Room Info"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={copyRoomCode}
                            className="p-2 hover:bg-black/10 rounded-full transition-colors"
                            title="Copy Code"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-black/10 rounded-full transition-colors text-white/90"
                            title="Leave Room"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">

                {/* Chat Area */}
                <main className="flex-1 flex flex-col relative w-full">
                    {/* Clean Background - No Pattern */}
                    <div className="absolute inset-0 bg-gray-50 z-0"></div>

                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24 scroll-smooth z-10">

                        <div className="flex justify-center my-4">
                            <span className="bg-gray-200 text-gray-500 text-[10px] md:text-xs px-3 py-1 rounded-full font-medium text-center">
                                Messages are end-to-end encrypted & auto-expire
                            </span>
                        </div>

                        {timeline.map((item, index) => {
                            const isMe = item.userId === userId || (!item.userId && item.senderId === userId);
                            const expiry = getExpiryString(item.expiresAt);
                            const { isCode: isCodeBlock, language: detectedLang } = detectCode(item.text);

                            return (
                                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group w-full`}>
                                    <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>

                                        <div className={`
                                            relative px-3 py-2 md:px-4 md:py-3 shadow-sm text-sm group min-w-[100px] transition-all
                                            ${isMe
                                                ? 'bg-[#900C3F] text-white rounded-2xl rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-2xl rounded-bl-none border border-gray-100'
                                            }
                                        `}>

                                            {isCodeBlock ? (
                                                <div className="rounded-md overflow-hidden my-1 border border-white/20 text-xs md:text-sm relative group/code">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity z-10 flex gap-2">

                                                        <button
                                                            onClick={() => copyMessage(item.text)}
                                                            className="p-1.5 bg-gray-700/50 hover:bg-gray-700 text-white rounded-md backdrop-blur-sm transition-colors"
                                                            title="Copy Code"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <SyntaxHighlighter
                                                        language={detectedLang}
                                                        style={vscDarkPlus}
                                                        customStyle={{ margin: 0, padding: '0.75rem', borderRadius: '0.375rem', fontSize: '13px' }}
                                                        wrapLongLines={true}
                                                    >
                                                        {item.text}
                                                    </SyntaxHighlighter>
                                                </div>
                                            ) : (
                                                <p className={`whitespace-pre-wrap leading-relaxed break-all md:break-words text-sm md:text-base ${isMe ? 'text-white' : 'text-gray-800'}`}>{item.text}</p>
                                            )}

                                            {/* Copy Button - Always visible on mobile, hover on desktop */}
                                            {!isCodeBlock && (
                                                <button
                                                    onClick={() => copyMessage(item.text)}
                                                    className={`absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/20 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity ${isMe ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                                    title="Copy Content"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            )}

                                            <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 select-none ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                                {expiry && <span className="flex items-center gap-0.5 opacity-70"><Clock className="w-3 h-3" /> {expiry}</span>}
                                                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area - Fixed at bottom for mobile reliability */}
                    <div className={`
                        flex-none bg-white p-3 border-t border-gray-200 z-50 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-[max(0.75rem,env(safe-area-inset-bottom))] relative
                        transition-all duration-300 ease-in-out transform
                        ${showSidebar ? 'translate-y-full opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto' : 'translate-y-0 opacity-100 pointer-events-auto'}
                    `}>

                        {/* Upload Progress Bar */}
                        {isUploading && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                                <div
                                    className="h-full bg-[#900C3F] transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}

                        <div className="max-w-7xl mx-auto flex items-center gap-2 relative pr-4 md:pr-0">

                            {/* Emoji Picker */}
                            {showEmojiPicker && (
                                <div className="absolute bottom-full right-16 mb-4 z-50 shadow-2xl rounded-2xl" ref={emojiPickerRef}>
                                    <EmojiPicker
                                        onEmojiClick={(emojiObject) => setNewMessage(prev => prev + emojiObject.emoji)}
                                        theme="light"
                                        searchDisabled={true}
                                        width={300}
                                        height={400}
                                        previewConfig={{ showPreview: false }}
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileUpload}
                            />

                            {/* 1. Paperclip (Left) */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-gray-400 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 mb-1"
                                title="Upload File"
                            >
                                <Paperclip className="w-6 h-6" />
                            </button>

                            {/* 2. Input Field (Center-Left) */}
                            <div className="flex-1 bg-gray-50 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-[#900C3F]/20 transition-all border border-transparent focus-within:border-[#900C3F]/30">
                                <textarea
                                    ref={textareaRef}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    rows={1}
                                    className="flex-1 bg-transparent py-2 outline-none text-gray-900 placeholder:text-gray-400 min-w-0 text-base resize-none max-h-32 scrollbar-thin scrollbar-thumb-gray-300"
                                    style={{ minHeight: '44px' }}
                                />
                            </div>

                            {/* 3. Emoji Button (Right) - Hidden on mobile to prevent cutout/overflow issues */}
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-3 rounded-full transition-colors flex-shrink-0 mb-1 hidden md:flex ${showEmojiPicker ? 'text-[#900C3F]' : 'text-gray-400 hover:bg-gray-100'}`}
                                title="Add Emoji"
                            >
                                <Smile className="w-6 h-6" />
                            </button>

                            {/* 4. Send Button (Far Right) */}
                            <button
                                onClick={handleSend}
                                disabled={!newMessage.trim()}
                                className="p-3 bg-[#900C3F] text-white rounded-2xl shadow-lg shadow-[#900C3F]/20 hover:bg-[#700931] hover:scale-105 active:scale-95 transition-all flex-shrink-0 disabled:opacity-50 disabled:scale-100 disabled:shadow-none mb-1"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Mobile Backdrop */}
                {showSidebar && (
                    <div
                        className="absolute inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setShowSidebar(false)}
                    />
                )}

                {/* Sidebar - Files & Room Info */}
                <aside className={`
                    w-80 bg-white border-l border-gray-200 flex flex-col z-30 shadow-2xl 
                    absolute right-0 top-0 bottom-0 h-full
                    transform transition-transform duration-300 ease-in-out
                    lg:static lg:transform-none lg:shadow-xl lg:z-20
                    ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-6 bg-gray-50 border-b border-gray-100 text-center flex-none relative group/sidebar-header">
                        <button
                            onClick={() => setShowSidebar(false)}
                            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 bg-[#900C3F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Share2 className="w-8 h-8 text-[#900C3F]" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Shared Files</h2>
                        <p className="text-xs text-gray-500 mt-1">Files appear here</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 min-h-0 overscroll-contain">
                        {files.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-60">
                                <FileText className="w-12 h-12" />
                                <p className="text-sm font-medium">No files yet</p>
                            </div>
                        )}

                        <div className="space-y-3 pb-24 lg:pb-0"> {/* Extra padding for mobile bottom */}
                            {files.map((file, i) => (
                                <div key={i} className="flex gap-3 items-start p-3 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer group" onClick={() => window.open(`${SERVER_URL}${file.url}`, '_blank')}>
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalName) ? (
                                            <img src={`${SERVER_URL}${file.url}`} alt="thumb" className="w-full h-full object-cover" />
                                        ) : (
                                            <FileText className="w-6 h-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-[#900C3F] transition-colors">{file.originalName}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">{file.size ? Math.round(file.size / 1024) + ' KB' : 'FILE'}</p>
                                            <Download className="w-4 h-4 text-gray-400 group-hover:text-[#900C3F]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white flex-none">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span>Room Code:</span>
                            <span className="font-mono font-bold text-gray-600 cursor-pointer hover:text-[#900C3F]" onClick={copyRoomCode}>{roomId}</span>
                        </div>
                        <button
                            onClick={copyRoomCode}
                            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors mb-2 flex items-center justify-center gap-2"
                        >
                            <Copy className="w-4 h-4" /> Copy Code
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-2 bg-[#900C3F]/10 hover:bg-[#900C3F]/20 text-[#900C3F] rounded-lg text-sm font-bold transition-colors lg:hidden flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Leave Room
                        </button>
                        <div className="mt-2 text-center text-[10px] text-gray-400">
                            Created by <span className="font-bold text-[#900C3F]">Suman Banerjee</span>
                        </div>
                    </div>
                </aside>

            </div>




            {/* QR Code Modal - Maroon Theme */}
            {showQR && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowQR(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in scale-100" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Scan to Join</h3>
                            <button onClick={() => setShowQR(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-xl border-2 border-[#900C3F]/10 inline-block mb-6 shadow-inner">
                            <QRCodeSVG
                                value={`https://msit-room.vercel.app/room/${roomId}`} // Ideally use absolute URL
                                size={200}
                                level="H"
                                includeMargin={true}
                                fgColor="#900C3F"
                            />
                        </div>

                        <p className="text-gray-500 text-sm mb-6">
                            Point your camera at the QR code to instantly join Room <span className="font-bold text-[#900C3F]">{roomId}</span>
                        </p>

                        <button
                            onClick={copyRoomCode}
                            className="w-full py-3 bg-[#900C3F] text-white rounded-xl font-bold hover:bg-[#700931] transition-colors flex items-center justify-center gap-2"
                        >
                            <Copy className="w-4 h-4" /> Copy Room URL
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Room;

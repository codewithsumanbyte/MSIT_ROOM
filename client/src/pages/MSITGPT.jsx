import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Trash2, Cpu, Loader2, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SERVER_URL } from '../utils/config';
import toast from 'react-hot-toast';

const CopyButton = ({ text, className = '' }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className={`p-1.5 hover:text-white transition-colors rounded-md flex items-center gap-1.5 font-medium text-xs ${copied ? 'text-green-400 hover:bg-green-400/10' : 'text-gray-400 hover:bg-white/10'} ${className}`} title="Copy">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

const TypewriterMarkdown = ({ content, isAnimated, components }) => {
    const [displayedContent, setDisplayedContent] = useState(isAnimated ? '' : content);
    const [isDone, setIsDone] = useState(!isAnimated);

    useEffect(() => {
        if (!isAnimated) {
            setDisplayedContent(content);
            setIsDone(true);
            return;
        }

        let i = 0;
        setIsDone(false);
        const intervalId = setInterval(() => {
            setDisplayedContent(content.slice(0, i + 3)); // Type 3 chars at a time for fast streaming
            i += 3;
            if (i >= content.length) {
                setDisplayedContent(content);
                clearInterval(intervalId);
                setIsDone(true);
            }
        }, 15);

        return () => clearInterval(intervalId);
    }, [content, isAnimated]);

    useEffect(() => {
        if (!isAnimated || isDone) return;
        const mainElement = document.getElementById('chat-main');
        if (mainElement) {
            const isNearBottom = mainElement.scrollHeight - mainElement.scrollTop - mainElement.clientHeight < 150;
            if (isNearBottom) {
                mainElement.scrollTop = mainElement.scrollHeight;
            }
        }
    }, [displayedContent, isAnimated, isDone]);

    return (
        <div className="flex flex-col w-full h-full">
            <ReactMarkdown components={components}>
                {displayedContent}
            </ReactMarkdown>
            {isDone && (
                <div className="mt-2 flex justify-start opacity-0 animate-in fade-in duration-500">
                    <CopyButton text={content} className="bg-gray-800/30 border border-gray-700/50" />
                </div>
            )}
        </div>
    );
};

const MSITGPT = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Load history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('msitGptHistory');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history");
            }
        } else {
            // Initial greeting
            setMessages([{
                role: 'assistant',
                content: "Hello! I am **MSIT GPT**. I'm here to help you debug code, understand complex engineering concepts, or answer any questions you have about your coursework. How can I help you today?"
            }]);
        }
    }, []);

    // Save history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('msitGptHistory', JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear the chat history?")) {
            const greeting = [{
                role: 'assistant',
                content: "Hello! I am **MSIT GPT**. I'm here to help you debug code, understand complex engineering concepts, or answer any questions you have about your coursework. How can I help you today?"
            }];
            setMessages(greeting);
            localStorage.setItem('msitGptHistory', JSON.stringify(greeting));
            toast.success("Chat cleared");
        }
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');

        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Only send the last 10 messages to keep context window reasonable
            const contextMessages = newMessages.slice(-10).map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await fetch(`${SERVER_URL}/api/gpt/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: contextMessages })
            });

            if (!response.ok) {
                throw new Error("Failed to get response from server");
            }

            const data = await response.json();

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

        } catch (error) {
            console.error("Chat Error:", error);
            toast.error("Failed to connect to MSIT GPT. Please try again.");
            // Remove the user message if it failed or add an error message
            setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ *An error occurred while connecting to the AI core. Please check your connection and try again.*" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#111111] text-gray-100 font-sans selection:bg-[#900C3F] selection:text-white">

            {/* Header */}
            <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-gray-800 shadow-sm z-10 w-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white group"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#900C3F] to-[#581845] rounded-xl flex items-center justify-center shadow-lg shadow-[#900C3F]/20 border border-white/10 p-1.5">
                            <img src="/logo.svg" alt="MSIT" className="w-full h-full drop-shadow-md" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                MSIT GPT
                            </h1>

                        </div>
                    </div>
                </div>

                <button
                    onClick={handleClearChat}
                    className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
                    title="Clear Conversation"
                >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear Chat</span>
                </button>
            </header>

            {/* Chat Area */}
            <main id="chat-main" className="flex-1 overflow-y-auto w-full scroll-smooth flex flex-col items-center">
                <div className="w-full max-w-3xl flex flex-col gap-6 pt-10 pb-6 px-4 sm:px-0">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            {msg.role === 'assistant' ? (
                                <div className="flex gap-4 w-full">
                                    {/* Assistant Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#900C3F] to-[#581845] flex items-center justify-center flex-shrink-0 shadow-md border border-white/5 p-1">
                                        <img src="/logo.svg" alt="AI" className="w-full h-full drop-shadow-sm" />
                                    </div>
                                    {/* Assistant Content */}
                                    <div className="flex-1 min-w-0 prose prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent max-w-none text-base text-gray-200">
                                        <TypewriterMarkdown
                                            content={msg.content}
                                            isAnimated={idx === messages.length - 1 && msg.role === 'assistant'}
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <div className="rounded-xl overflow-hidden border border-gray-700 my-4 shadow-lg bg-[#1e1e1e]">
                                                            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-gray-700">
                                                                <span className="text-xs font-mono text-gray-400">{match[1]}</span>
                                                                <CopyButton text={String(children).replace(/\n$/, '')} />
                                                            </div>
                                                            <SyntaxHighlighter
                                                                {...props}
                                                                children={String(children).replace(/\n$/, '')}
                                                                style={vscDarkPlus}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <code {...props} className={`${className} bg-gray-800 text-[#ff4d88] px-1.5 py-0.5 rounded-md font-mono text-sm`}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </TypewriterMarkdown>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-[75%] bg-gray-800 rounded-3xl rounded-tr-sm px-5 py-3.5 shadow-sm text-gray-100 text-base leading-relaxed border border-gray-700">
                                    {msg.content}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4 w-full justify-start animate-in fade-in">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#900C3F] to-[#581845] flex items-center justify-center flex-shrink-0 shadow-md border border-white/5 p-1">
                                <img src="/logo.svg" alt="AI" className="w-full h-full drop-shadow-sm" />
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium py-1">
                                <Loader2 className="w-4 h-4 animate-spin text-[#900C3F]" />
                                <span className="animate-pulse">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </main>

            {/* Input Area */}
            <div className="w-full flex-shrink-0 pb-6 pt-2 px-4 bg-gradient-to-t from-[#111111] via-[#111111] to-transparent">
                <div className="max-w-3xl mx-auto relative">
                    <form onSubmit={handleSend} className="relative flex items-end gap-2 bg-[#1a1a1a] border border-gray-700 rounded-3xl p-2.5 focus-within:border-[#900C3F] focus-within:ring-2 focus-within:ring-[#900C3F]/20 transition-all shadow-xl">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Message MSIT GPT..."
                            className="w-full max-h-48 min-h-[44px] bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none py-2.5 px-4 text-base pr-12 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent rounded-2xl"
                            rows={1}
                            style={{ height: 'auto' }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 bottom-3 p-2 bg-[#900C3F] hover:bg-[#C70039] text-white rounded-full disabled:opacity-40 disabled:hover:bg-[#900C3F] transition-all transform active:scale-95 disabled:active:scale-100 flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-500 mt-2 font-medium">
                        MSIT GPT can make mistakes. Consider verifying important academic information.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default MSITGPT;

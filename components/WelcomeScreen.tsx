import React, { useState, useEffect, useRef } from 'react';
import { 
    ArrowRight, 
    Sparkles, 
    Bot,
    Rocket,
    Compass,
    ShieldCheck,
    MessageSquare,
    Terminal,
    Github
} from 'lucide-react';
import { RecentItem, Panel } from '../types';

interface WelcomeScreenProps {
    onNewFile: () => void;
    onCloneRepo?: () => void;
    onOpenCommandPalette: () => void;
    onOpenSettings: () => void;
    isMac?: boolean;
    onClose?: () => void;
    userName?: string;
    activeModelId?: string;
    onAIAppGen?: (prompt: string, mode?: 'chat' | 'app') => void;
    onOpenDocs?: () => void;
    onOpenRecorder?: () => void;
    recents?: RecentItem[];
    onOpenCollaboration?: () => void;
    onOpenWhiteboard?: () => void;
    onChangePanel?: (panel: Panel) => void;
    userPlan?: 'Hobby' | 'Pro' | 'Enterprise';
    onRestrictedClick?: (featureName: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
    userName = "Engineer",
    onAIAppGen,
    onChangePanel,
}) => {
    const [prompt, setPrompt] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleAIPromptSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && onAIAppGen) {
            onAIAppGen(prompt, 'chat');
        }
    };

    const CORE_ENGINES = [
        { 
            id: 'production-engineer', 
            title: 'AI Production Engineer', 
            badge: 'Flagship System',
            description: 'Analyze repositories, patch vulnerabilities, generate multi-stage Dockerfiles, Terraform IaC, and verify cloud readiness.', 
            icon: <Rocket size={26} className="text-cyan-400" />, 
            color: 'text-cyan-400', 
            bg: 'bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/80 shadow-cyan-950/40',
            buttonText: 'Launch Production Engineer',
            action: () => onChangePanel?.(Panel.PRODUCTION_ENGINEER),
        },
        { 
            id: 'ai-chat', 
            title: 'AI Chat Assistant', 
            badge: 'Pair Programming',
            description: 'Direct dialogue with Gemini, Claude, and GPT models for architecture consultations, debugging, and code generation.', 
            icon: <Bot size={26} className="text-blue-400" />, 
            color: 'text-blue-400', 
            bg: 'bg-blue-950/40 border border-blue-500/30 hover:border-blue-400/80 shadow-blue-950/40',
            buttonText: 'Open AI Chat',
            action: () => onAIAppGen?.("Let's analyze this codebase and prepare it for production.", 'chat'),
        },
    ];

    return (
        <div ref={scrollContainerRef} className="h-full w-full bg-[#0a0d14] relative overflow-y-auto custom-scrollbar flex flex-col p-8 md:p-14 text-slate-100">
            {/* Subtle background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />
            
            <div className="relative z-10 max-w-4xl mx-auto w-full my-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 backdrop-blur-md">
                        <Sparkles size={13} className="text-cyan-400" />
                        <span>SAI — Software to Production</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                        Your code works. <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                            Now make it production-ready.
                        </span>
                    </h1>
                    
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
                        Welcome back, <strong className="text-white">{userName}</strong>. SAI combines autonomous production engineering with conversational AI to verify, containerize, and deploy software.
                    </p>
                </div>

                {/* AI Prompt Input Bar */}
                <div className="mb-12 w-full">
                    <form onSubmit={handleAIPromptSubmit} className="relative group">
                        <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl group-focus-within:border-cyan-500/80 transition-all">
                            <div className="pl-4 pr-3 text-cyan-400">
                                <Compass size={22} strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask AI Chat or describe what repository to harden..."
                                className="flex-1 bg-transparent text-white text-base font-mono focus:outline-none placeholder-slate-500"
                            />
                            <button 
                                type="submit" 
                                className="px-5 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:from-cyan-300 hover:to-blue-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                            >
                                <span>Send</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Core Two Engines (AI Production Engineer & AI Chat) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CORE_ENGINES.map(engine => (
                        <div
                            key={engine.id}
                            className={`p-7 rounded-3xl transition-all flex flex-col justify-between shadow-2xl relative group ${engine.bg}`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {engine.icon}
                                    </div>
                                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                                        {engine.badge}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{engine.title}</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">{engine.description}</p>
                            </div>

                            <button
                                onClick={engine.action}
                                className="mt-6 w-full py-3.5 bg-white/10 hover:bg-cyan-500 hover:text-black text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border border-white/10 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                            >
                                <span>{engine.buttonText}</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Quick Shortcuts Bar */}
                <div className="mt-12 pt-8 border-t border-slate-800/80 flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
                    <button 
                        onClick={() => onChangePanel?.(Panel.PRODUCTION_ENGINEER)}
                        className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                    >
                        <ShieldCheck size={14} /> 5-Pillar Scorecard
                    </button>
                    <span>&bull;</span>
                    <button 
                        onClick={() => onAIAppGen?.("Show me how to deploy this to Azure Container Apps", 'chat')}
                        className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                    >
                        <Terminal size={14} /> Azure ACA Deployment
                    </button>
                    <span>&bull;</span>
                    <button 
                        onClick={() => onAIAppGen?.("Analyze multi-cloud costs and FinOps arbitrage", 'chat')}
                        className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                    >
                        <MessageSquare size={14} /> FinOps Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
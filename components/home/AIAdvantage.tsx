import React from 'react';
import { Cpu, Zap, Timer } from 'lucide-react';

interface AIAdvantageProps {
    dict: {
        aiAdvantage: {
            title: string;
            content: string;
        };
    };
}

export default function AIAdvantage({ dict }: AIAdvantageProps) {
    const { title, content } = dict.aiAdvantage;

    return (
        <section className="relative w-full py-24 bg-zinc-950 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D83484]/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#D83484] text-xs font-bold tracking-[0.2em] uppercase">
                                <Cpu size={14} />
                                <span>Future-Proof Engineering</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight font-outfit">
                                {title}
                            </h2>

                            <p className="text-lg md:text-xl text-zinc-400 font-outfit font-light leading-relaxed">
                                {content}
                            </p>

                            <div className="pt-4 flex flex-wrap gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                                        <Zap size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-white font-outfit tracking-tight">Hyper-Efficiency</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                                        <Timer size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-white font-outfit tracking-tight">35% Faster Cycles</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            {/* Visual representation of AI Advantage */}
                            <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-white/10 p-8 flex flex-col justify-between group-hover:border-[#D83484]/30 transition-colors duration-500 overflow-hidden">
                                <div className="space-y-6">
                                    <div className="h-2 w-32 bg-[#D83484] rounded-full" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-white/5 rounded-full" />
                                        <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                                        <div className="h-4 w-4/6 bg-white/5 rounded-full" />
                                    </div>
                                </div>

                                <div className="relative h-40 w-full">
                                    {/* Abstract code/agent grid */}
                                    <div className="absolute inset-0 grid grid-cols-6 gap-2">
                                        {[...Array(18)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="bg-white/5 rounded-md transition-all duration-700 hover:bg-[#D83484]/20"
                                                style={{ height: `${((i * 7 + 3) % 10) * 10}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="text-5xl font-black text-white font-outfit tracking-tighter">2026</div>
                                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">AI-Agent Ready</div>
                                </div>
                            </div>

                            {/* Floating decorative elements */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#D83484] rounded-2xl opacity-20 blur-2xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

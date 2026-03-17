import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface SoftwareDevAdvantageProps {
    dict: {
        title: string;
        items: Array<{ title: string }>;
    };
}

export default function SoftwareDevAdvantage({ dict }: SoftwareDevAdvantageProps) {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <header className="flex items-center gap-4 mb-16">
                    <div className="w-1.5 h-12 bg-purple-600 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 font-outfit uppercase tracking-tighter">
                        {dict.title}
                    </h2>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dict.items.map((item, idx) => {
                        const isElite = item.title === "Elite Talent Only";
                        return (
                            <div 
                                key={idx} 
                                className={clsx(
                                    "relative overflow-hidden flex items-center gap-4 p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 transition-all duration-300 hover:border-purple-500/20",
                                    isElite && "bg-gradient-to-r from-purple-50 to-white"
                                )}
                            >
                                {isElite && (
                                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] animate-shimmer pointer-events-none" />
                                )}
                                <CheckCircle2 size={24} className="text-purple-600 flex-shrink-0" />
                                <span className="font-outfit font-bold text-zinc-900 uppercase tracking-wider text-sm">
                                    {item.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

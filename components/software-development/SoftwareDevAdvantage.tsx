import React from 'react';
import { Award, Sparkles, Globe, Zap } from 'lucide-react';
import clsx from 'clsx';

interface SoftwareDevAdvantageProps {
    dict: {
        title: string;
        items: Array<{ title: string; desc?: string }>;
    };
}

const icons = [Award, Sparkles, Globe, Zap];

export default function SoftwareDevAdvantage({ dict }: SoftwareDevAdvantageProps) {
    return (
        <section className="py-20 md:py-24 bg-white border-t border-zinc-100">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 font-outfit uppercase tracking-tight">
                        {dict.title}
                    </h2>
                </div>

                {/* Advantage Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {dict.items.map((item, idx) => {
                        const Icon = icons[idx] || Award;
                        return (
                            <div 
                                key={idx} 
                                className="flex flex-col p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500 group"
                            >
                                {/* Icon Circle */}
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand transition-colors duration-500">
                                    <Icon size={28} className="text-brand group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-zinc-900 mb-2 font-outfit uppercase tracking-tight">
                                    {item.title}
                                </h3>
                                
                                {/* Description (rendered if exists) */}
                                {item.desc ? (
                                    <p className="text-zinc-500 font-outfit font-light leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                ) : (
                                    <p className="text-zinc-500 font-outfit font-light leading-relaxed text-sm opacity-60">
                                        Dibrand engineering standard for high-performance squads.
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import { Check } from 'lucide-react';

interface ComplianceSectionProps {
    dict: {
        compliance: {
            title: string;
            items: {
                title: string;
                desc: string;
            }[];
        };
    };
}

export default function ComplianceSection({ dict }: ComplianceSectionProps) {
    const { title, items } = dict.compliance;

    return (
        <section className="py-16 bg-white font-outfit" id="compliance">
            <div className="container mx-auto px-6">
                {/* Compact Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
                        {title}
                    </h2>
                </div>

                {/* 3 Pillars Grid - Horizontal Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 max-w-7xl mx-auto">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 group">
                            {/* Purple Checkbox */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white mt-1 transform group-hover:rotate-12 transition-transform duration-300">
                                <Check size={18} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-zinc-900 font-outfit tracking-tight mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-zinc-500 font-outfit leading-relaxed font-light">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

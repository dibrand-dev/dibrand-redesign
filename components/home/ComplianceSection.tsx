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
        <section className="py-24 md:py-32 bg-white font-outfit" id="compliance">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section - Standardized */}
                <div className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight">
                        {title}
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-brand" />
                </div>

                {/* 3 Pillars Grid - Horizontal Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 group">
                            {/* Purple Checkbox */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white mt-1 transform group-hover:rotate-12 transition-transform duration-300">
                                <Check size={18} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl md:text-2xl font-bold font-outfit text-zinc-900 tracking-tight mb-2 leading-snug">
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

import React from 'react';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

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

const icons = [ShieldCheck, Lock, Globe];

export default function ComplianceSection({ dict }: ComplianceSectionProps) {
    const { title, items } = dict.compliance;

    return (
        <section className="py-24 bg-white font-outfit">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-tight max-w-3xl mx-auto">
                        {title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {items.map((item, index) => {
                        const Icon = icons[index] || ShieldCheck;
                        return (
                            <div key={index} className="flex flex-col items-center text-center p-8 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-[#D83484]/5 hover:-translate-y-2 transition-all duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#D83484] mb-8 shadow-sm">
                                    <Icon size={32} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-500 font-light leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

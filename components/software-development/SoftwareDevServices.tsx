import React from 'react';
import { Code2, Cpu, Database, LayoutPanelLeft } from 'lucide-react';

interface SoftwareDevServicesProps {
    dict: {
        title: string;
        items: Array<{ title: string; desc: string }>;
    };
}

const icons = [Code2, Cpu, Database, LayoutPanelLeft];

export default function SoftwareDevServices({ dict }: SoftwareDevServicesProps) {
    return (
        <section className="py-24 bg-zinc-50">
            <div className="container mx-auto px-6">
                <header className="flex items-center gap-4 mb-20">
                    <div className="w-1.5 h-12 bg-purple-600 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 font-outfit uppercase tracking-tighter">
                        {dict.title}
                    </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {dict.items.map((service, idx) => {
                        const Icon = icons[idx] || Code2;
                        return (
                            <div 
                                key={idx} 
                                className="group p-8 md:p-10 rounded-[2.5rem] bg-white border border-zinc-200/60 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/5"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mb-8 group-hover:bg-purple-600 transition-colors duration-500">
                                    <Icon size={28} className="text-purple-600 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-4 font-outfit uppercase tracking-tight leading-tight">
                                    {service.title}
                                </h3>
                                <p className="text-zinc-500 font-outfit font-light leading-relaxed">
                                    {service.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

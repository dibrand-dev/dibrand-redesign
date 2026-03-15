import React from 'react';
import { Shield, Target, Users } from 'lucide-react';

interface BrandValuesProps {
    dict: {
        title: string;
        items: {
            title: string;
            desc: string;
        }[];
    };
}

export default function BrandValues({ dict }: BrandValuesProps) {
    const icons = [Users, Target, Shield];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight uppercase">
                        {dict.title}
                    </h2>
                    <div className="w-20 h-1.5 bg-brand mx-auto mt-6" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {dict.items.map((item, idx) => {
                        const Icon = icons[idx] || Shield;
                        return (
                            <div key={idx} className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 group hover:shadow-xl transition-all duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-brand transition-colors duration-500">
                                    <Icon size={32} className="text-brand group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-xl font-bold font-outfit text-zinc-900 mb-4 uppercase tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-500 font-outfit font-light leading-relaxed">
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

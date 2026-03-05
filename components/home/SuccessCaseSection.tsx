import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface SuccessCaseSectionProps {
    dict: {
        successCase: {
            title: string;
            copy: string;
            cta: string;
        };
    };
    lang: string;
}

export default function SuccessCaseSection({ dict, lang }: SuccessCaseSectionProps) {
    const { title, copy, cta } = dict.successCase;

    return (
        <section className="relative w-full py-12 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto rounded-[4rem] bg-zinc-900 overflow-hidden text-white flex flex-col lg:flex-row items-stretch">
                    {/* Left content */}
                    <div className="p-12 lg:p-20 flex flex-col justify-center lg:w-3/5 space-y-10">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-brand text-sm font-black tracking-widest uppercase">
                            <TrendingUp size={18} />
                            <span>Business Results</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-6xl font-black font-outfit tracking-tighter leading-tight text-white">
                                "{title}"
                            </h2>
                            <p className="text-xl md:text-2xl text-zinc-400 font-outfit font-light leading-relaxed">
                                {copy}
                            </p>
                        </div>

                        <div className="pt-8 mb-4">
                            <Link
                                href={`/${lang}/success-stories`}
                                className="group inline-flex items-center gap-4 py-6 px-12 bg-white text-zinc-900 rounded-[2.5rem] font-black font-outfit uppercase text-sm transition-all hover:bg-zinc-100 shadow-xl shadow-black/20"
                            >
                                {cta}
                                <ArrowUpRight size={22} className="text-brand group-hover:rotate-45 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Right visual/stat */}
                    <div className="lg:w-2/5 md:w-full bg-brand flex flex-col items-center justify-center p-12 text-center text-zinc-900">
                        <div className="font-outfit font-black text-8xl md:text-9xl tracking-tighter mb-4">+25%</div>
                        <div className="font-outfit font-black text-3xl md:text-4xl tracking-tighter uppercase leading-none opacity-80">Monthly Revenue</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SpontaneousApplicationCardProps {
    lang: string;
    dict: any;
}

export default function SpontaneousApplicationCard({ lang, dict }: SpontaneousApplicationCardProps) {
    const isEn = lang === 'en';

    const title = dict?.spontaneousTitle || (isEn ? 'Spontaneous Application' : 'Postulación Espontánea');
    const subtitle = dict?.spontaneousSubtitle || (isEn 
        ? "Don't see a role that fits? Join our Talent Pool and we'll contact you when a match opens up."
        : "¿No encuentras el rol ideal? Súmate a nuestro Talent Pool y te contactaremos cuando surja una oportunidad.");
    const cta = dict?.joinTalentPool || (isEn ? 'Join Talent Pool' : 'Sumarse al Talent Pool');

    return (
        <Link href={`/${lang}/join-us/spontaneous`} className="lg:col-span-2">
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative bg-[#101828] border border-[#1d2939] rounded-[16px] p-8 shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 cursor-pointer overflow-hidden h-full"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] -ml-24 -mb-24 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:justify-between text-center md:text-left h-full">
                    <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
                        {/* Icon Slot */}
                        <div className="shrink-0 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <Sparkles size={32} className="text-brand" />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-white font-inter mb-2 uppercase tracking-tight italic">
                                {title}
                            </h3>
                            <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-xl">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="shrink-0">
                        <div className="flex items-center gap-3 px-8 py-4 bg-brand text-white text-sm font-bold rounded-xl shadow-lg shadow-brand/20 group-hover:bg-brand/90 transition-all">
                            {cta}
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

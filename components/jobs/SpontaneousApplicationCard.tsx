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
                className="group relative bg-[#101828] border border-[#1d2939] rounded-[20px] p-10 shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 cursor-pointer overflow-hidden h-full flex flex-col justify-center"
            >
                {/* Background Image With Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700 pointer-events-none" 
                    style={{ backgroundImage: 'url("/images/spontaneous-bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#101828] via-[#101828]/80 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:justify-between text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
                        {/* Icon Slot - More Prominent */}
                        <div className="shrink-0 w-20 h-20 bg-brand/20 rounded-2xl flex items-center justify-center text-white border border-brand/30 shadow-2xl group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm">
                            <Sparkles size={40} className="text-brand" />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <h3 className="text-3xl font-black text-white font-inter mb-3 uppercase tracking-tight italic leading-none">
                                {title}
                            </h3>
                            <p className="text-white text-lg font-medium leading-relaxed max-w-xl">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {/* CTA Button - Enhanced Contrast */}
                    <div className="shrink-0">
                        <div className="flex items-center gap-3 px-10 py-5 bg-brand text-white text-base font-black rounded-xl shadow-xl shadow-brand/30 group-hover:bg-brand/90 group-hover:shadow-brand/40 transition-all uppercase tracking-wider">
                            {cta}
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SpontaneousApplicationForm from './SpontaneousApplicationForm';

interface SpontaneousApplicationCardProps {
    lang: string;
    dict: any;
}

export default function SpontaneousApplicationCard({ lang, dict }: SpontaneousApplicationCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isEn = lang === 'en';

    const title = dict?.spontaneousTitle || (isEn ? 'Spontaneous Application' : 'Postulación Espontánea');
    const subtitle = dict?.spontaneousSubtitle || (isEn 
        ? "Don't see a role that fits? Join our Talent Pool and we'll contact you when a match opens up."
        : "¿No encuentras el rol ideal? Súmate a nuestro Talent Pool y te contactaremos cuando surja una oportunidad.");
    const cta = dict?.joinTalentPool || (isEn ? 'Join Talent Pool' : 'Sumarse al Talent Pool');

    return (
        <>
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={() => setIsOpen(true)}
                className="group relative bg-[#101828] border border-[#1d2939] rounded-[16px] p-8 shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 cursor-pointer overflow-hidden lg:col-span-2"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] -ml-24 -mb-24 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:justify-between text-center md:text-left">
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
                        <button className="flex items-center gap-3 px-8 py-4 bg-brand text-white text-sm font-bold rounded-xl shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all active:scale-95">
                            {cta}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Application Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#101828] rounded-xl flex items-center justify-center text-white">
                                        <UserPlus size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 font-inter uppercase tracking-tight italic">
                                        {title}
                                    </h2>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <SpontaneousApplicationForm 
                                    lang={lang} 
                                    dict={dict} 
                                    onSuccess={() => setTimeout(() => setIsOpen(false), 3000)}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

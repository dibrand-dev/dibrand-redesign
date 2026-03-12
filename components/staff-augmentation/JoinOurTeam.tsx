'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Share2, Building2, Globe, Clock, Briefcase } from 'lucide-react';
import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

interface JobOpening {
    id: string;
    title: string;
    title_es?: string;
    title_en?: string;
    location: string;
    location_es?: string;
    location_en?: string;
    industry: string;
    employment_type: string;
    is_active: boolean;
    description: string;
    description_es?: string;
    description_en?: string;
    requirements: string;
    requirements_es?: string;
    requirements_en?: string;
    seniority: string;
    modality: string;
}

interface JoinOurTeamProps {
    jobs: JobOpening[];
    lang: string;
    dict?: any;
}

export default function JoinOurTeam({ jobs, lang, dict }: JoinOurTeamProps) {
    const activeJobs = jobs || [];
    const [openShareId, setOpenShareId] = useState<string | null>(null);
    const isEn = lang === 'en';

    // Fallback texts
    const texts = {
        title: dict?.title || (isEn ? 'Join Our Tech Boutique' : 'Únete a nuestra Boutique Tech'),
        subtitle: dict?.subtitle || (isEn ? 'We are looking for elite talent to build the future of software engineering.' : 'Buscamos talento de élite para construir el futuro de la ingeniería de software.'),
        viewOpening: dict?.viewOpening || (isEn ? 'Apply Now' : 'Postularme'),
        shareOpening: dict?.shareOpening || (isEn ? 'Share' : 'Compartir'),
        shareLinkedIn: dict?.shareLinkedIn || (isEn ? 'LinkedIn' : 'LinkedIn'),
        shareWhatsApp: dict?.shareWhatsApp || (isEn ? 'WhatsApp' : 'WhatsApp'),
        fallbackText: dict?.fallbackText || (isEn ? 'No openings today, but we are always scouting.' : 'Sin vacantes hoy, pero siempre estamos buscando.'),
        fallbackLink: dict?.fallbackLink || (isEn ? 'Send CV' : 'Enviar CV')
    };

    const handleShare = (job: JobOpening, platform: 'linkedin' | 'whatsapp') => {
        const url = `${window.location.origin}/${lang}/join-us/${job.id}`;
        const title = isEn ? (job.title_en || job.title) : (job.title_es || job.title);
        const text = isEn
            ? `Check out this opening at Dibrand: ${title}`
            : `Mira esta vacante en Dibrand: ${title}`;

        if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        }
        setOpenShareId(null);
    };

    return (
        <section className="bg-white py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header - Consistent with Portfolio */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mb-20"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black font-outfit text-zinc-900 tracking-tighter leading-none uppercase mb-6">
                        {texts.title}
                    </h2>
                    <div className="h-1.5 w-32 bg-brand mb-8" />
                    <p className="text-lg md:text-xl text-zinc-600 font-outfit font-light leading-relaxed max-w-2xl">
                        {texts.subtitle}
                    </p>
                </motion.div>

                {/* Openings Grid */}
                <div className="max-w-7xl">
                    {activeJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {activeJobs.map((job, index) => {
                                const jobTitle = isEn ? (job.title_en || job.title) : (job.title_es || job.title);
                                const jobLocation = isEn ? (job.location_en || job.location) : (job.location_es || job.location);
                                const jobDesc = isEn ? (job.description_en || job.description) : (job.description_es || job.description);

                                return (
                                    <motion.div 
                                        key={job.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group relative flex flex-col bg-zinc-50 border border-zinc-100 rounded-3xl p-10 hover:bg-white hover:shadow-2xl hover:shadow-brand/5 transition-all duration-500"
                                    >
                                        {/* Status / Meta Header */}
                                        <div className="flex flex-wrap items-center gap-2 mb-8">
                                            <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em] bg-brand/5 px-3 py-1.5 rounded-lg border border-brand/10">
                                                {job.seniority || 'Expert'}
                                            </span>
                                            <span className="text-zinc-300 mx-2">•</span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                                <Building2 size={12} />
                                                {job.industry}
                                            </div>
                                        </div>

                                        {/* Title & Body */}
                                        <div className="flex flex-col mb-10">
                                            <h3 className="text-3xl md:text-4xl font-black text-zinc-900 font-outfit tracking-tighter leading-tight mb-6 group-hover:text-brand transition-colors">
                                                {jobTitle}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-brand/60" />
                                                    {jobLocation}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-brand/60" />
                                                    {job.employment_type?.replace('_', ' ') || 'Full-time'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={14} className="text-brand/60" />
                                                    <span className="text-brand">{job.modality}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Snippet */}
                                        <div className="text-zinc-500 mb-12 line-clamp-3 font-outfit font-light leading-relaxed text-base italic">
                                            "{jobDesc?.replace(/[#*`]/g, '')?.slice(0, 180)}..."
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto flex items-center justify-between gap-6 border-t border-zinc-100 pt-8">
                                            <Link
                                                href={`/${lang}/join-us/${job.id}`}
                                                className="flex-1 inline-flex items-center justify-center gap-3 bg-brand text-white font-black font-outfit uppercase tracking-widest text-[11px] py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-brand/20 active:scale-95 group/btn"
                                            >
                                                <span>{texts.viewOpening}</span>
                                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenShareId(openShareId === job.id ? null : job.id)}
                                                    className="w-12 h-12 flex items-center justify-center bg-zinc-100 text-zinc-500 rounded-2xl hover:bg-zinc-200 transition-all border border-transparent hover:border-zinc-300"
                                                    title={texts.shareOpening}
                                                >
                                                    <Share2 size={20} />
                                                </button>

                                                <AnimatePresence>
                                                    {openShareId === job.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setOpenShareId(null)} />
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute bottom-full right-0 mb-4 w-48 bg-white border border-zinc-200 rounded-2xl py-3 z-20 shadow-2xl overflow-hidden"
                                                            >
                                                                <button
                                                                    onClick={() => handleShare(job, 'linkedin')}
                                                                    className="w-full px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-[#0077b5] hover:bg-zinc-50 flex items-center gap-3 transition-all"
                                                                >
                                                                    <FaLinkedinIn size={16} />
                                                                    {texts.shareLinkedIn}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleShare(job, 'whatsapp')}
                                                                    className="w-full px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-[#25D366] hover:bg-zinc-50 flex items-center gap-3 transition-all"
                                                                >
                                                                    <FaWhatsapp size={16} />
                                                                    {texts.shareWhatsApp}
                                                                </button>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="p-16 bg-zinc-50 rounded-[2.5rem] border border-dashed border-zinc-200 text-center"
                        >
                            <Globe className="mx-auto text-zinc-300 mb-6" size={48} />
                            <p className="text-xl text-zinc-600 font-outfit font-light">
                                {texts.fallbackText}
                                <Link href={`/${lang}/contact`} className="ms-3 text-brand font-black underline decoration-brand/30 hover:decoration-brand underline-offset-8 transition-all">
                                    {texts.fallbackLink}
                                </Link>
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Share2, Linkedin, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface JobOpening {
    id: string;
    title: string;
    location: string;
    employment_type: string;
    is_active: boolean;
    description: string;
    requirements?: string;
    seniority?: string;
    department?: string;
}

interface JoinOurTeamProps {
    jobs: JobOpening[];
    lang: string;
    dict?: {
        title?: string;
        subtitle?: string;
        viewOpening?: string;
        fallbackText?: string;
        fallbackLink?: string;
    };
}

export default function JoinOurTeam({ jobs, lang, dict }: JoinOurTeamProps) {
    const activeJobs = jobs || [];
    const [openShareId, setOpenShareId] = useState<string | null>(null);

    const isEn = lang === 'en';

    // Fallback texts
    const texts = {
        title: dict?.title || (isEn ? 'We are excited to hear from you' : 'Nos entusiasma saber de ti'),
        subtitle: dict?.subtitle || (isEn ? 'Join our team and be part of a community where innovation and collaboration thrive.' : 'Únete a nuestro equipo y forma parte de una comunidad donde la innovación y la colaboración prosperan.'),
        viewOpening: dict?.viewOpening || (isEn ? 'Apply' : 'Aplicar'),
        shareOpening: (dict as any)?.shareOpening || (isEn ? 'Share position' : 'Compartir vacante'),
        fallbackText: dict?.fallbackText || (isEn ? 'No open positions at the moment, but we are always looking for talent.' : 'No hay posiciones abiertas en este momento, pero siempre buscamos talento.'),
        fallbackLink: dict?.fallbackLink || (isEn ? 'Send us your CV!' : '¡Envíanos tu CV!')
    };

    const handleShare = (job: JobOpening, platform: 'linkedin' | 'whatsapp') => {
        const url = `${window.location.origin}/${lang}/join-us#${job.id}`;
        const text = isEn
            ? `Check out this opportunity at Dibrand! ${job.title}`
            : `¡Mira esta oportunidad en Dibrand! ${job.title}`;

        if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        }
        setOpenShareId(null);
    };

    return (
        <section className="bg-white pt-12 pb-16">
            <div className="container mx-auto px-6">
                {/* Header Section - Compact & Shared Style */}
                <div className="max-w-4xl mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4 font-outfit tracking-tight leading-tight">
                        {texts.title}
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-600 font-outfit font-light leading-relaxed">
                        {texts.subtitle}
                    </p>
                </div>

                {/* Openings Grid - Flat & Clean */}
                <div className="max-w-6xl">
                    {activeJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {activeJobs.map((job) => (
                                <div key={job.id} id={job.id} className="flex flex-col bg-white border border-zinc-200 rounded-2xl p-8 hover:bg-zinc-50/50 transition-colors relative">
                                    <div className="flex flex-col mb-6">
                                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                                            {job.seniority || job.department || 'Senior / Expert'}
                                        </span>
                                        <h3 className="text-2xl font-bold text-[#D83484] font-outfit mb-4">
                                            {job.title}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 font-outfit">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-zinc-400" />
                                                {job.location}
                                            </div>
                                            <div className="px-2.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium uppercase tracking-tight">
                                                {job.employment_type.replace('_', ' ')}
                                            </div>
                                            <div className="px-2.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium uppercase tracking-tight">
                                                Remote
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Body - Rich Text Render */}
                                    <div className="prose prose-zinc prose-sm max-w-none text-zinc-600 mb-8 prose-headings:text-zinc-900 prose-strong:text-zinc-900 prose-li:marker:text-zinc-400 prose-li:my-1">
                                        <ReactMarkdown>
                                            {job.description}
                                        </ReactMarkdown>
                                    </div>

                                    <div className="mt-auto flex items-center gap-6">
                                        <Link
                                            href={`/${lang}/contact?job=${job.id}`}
                                            className="inline-flex items-center gap-2 bg-[#D83484] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#c02d75] transition-all duration-300"
                                        >
                                            <span>{texts.viewOpening}</span>
                                            <ArrowRight size={18} />
                                        </Link>

                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenShareId(openShareId === job.id ? null : job.id)}
                                                className="text-zinc-500 hover:text-zinc-900 text-sm font-medium underline underline-offset-4 transition-colors flex items-center gap-2"
                                            >
                                                <Share2 size={16} />
                                                {texts.shareOpening}
                                            </button>

                                            {openShareId === job.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setOpenShareId(null)}
                                                    />
                                                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-zinc-200 rounded-xl py-2 z-20 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                        <button
                                                            onClick={() => handleShare(job, 'linkedin')}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                                                        >
                                                            <Linkedin size={16} className="text-[#0077b5]" />
                                                            LinkedIn
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare(job, 'whatsapp')}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                                                        >
                                                            <MessageCircle size={16} className="text-[#25D366]" />
                                                            WhatsApp
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <p className="text-lg text-zinc-600 font-outfit">
                                {texts.fallbackText} {' '}
                                <Link href={`/${lang}/contact`} className="text-[#D83484] font-bold underline">
                                    {texts.fallbackLink}
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

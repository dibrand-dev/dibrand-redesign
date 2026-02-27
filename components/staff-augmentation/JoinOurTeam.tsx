'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Share2, Building2 } from 'lucide-react';
import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';

interface JobOpening {
    id: string;
    title: string;
    location: string;
    industry: string;
    employment_type: string;
    is_active: boolean;
    description: string;
    requirements: string;
    seniority: string;
    modality: string;
}

interface JoinOurTeamProps {
    jobs: JobOpening[];
    lang: string;
    dict?: {
        title?: string;
        subtitle?: string;
        viewOpening?: string;
        shareOpening?: string;
        shareLinkedIn?: string;
        shareWhatsApp?: string;
        applyNow?: string;
        fullName?: string;
        email?: string;
        linkedin?: string;
        sendApplication?: string;
        sending?: string;
        success?: string;
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
        shareOpening: dict?.shareOpening || (isEn ? 'Share position' : 'Compartir vacante'),
        shareLinkedIn: dict?.shareLinkedIn || (isEn ? 'Share on LinkedIn' : 'Compartir en LinkedIn'),
        shareWhatsApp: dict?.shareWhatsApp || (isEn ? 'Send via WhatsApp' : 'Enviar por WhatsApp'),
        applyNow: dict?.applyNow || (isEn ? 'Apply for this position' : 'Postúlate para esta posición'),
        fullName: dict?.fullName || (isEn ? 'Full Name' : 'Nombre Completo'),
        email: dict?.email || (isEn ? 'Email Address' : 'Correo Electrónico'),
        linkedin: dict?.linkedin || (isEn ? 'LinkedIn Profile / Portfolio URL' : 'Perfil de LinkedIn / URL de Portfolio'),
        sendApplication: dict?.sendApplication || (isEn ? 'Send Application' : 'Enviar Postulación'),
        sending: dict?.sending || (isEn ? 'Sending...' : 'Enviando...'),
        success: dict?.success || (isEn ? 'Application Sent!' : '¡Postulación Enviada!'),
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
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                                                {job.seniority || 'Expert'}
                                            </span>
                                            <span className="text-zinc-300">•</span>
                                            <span className="text-[10px] font-bold text-[#D83484] uppercase tracking-[0.2em] flex items-center gap-1">
                                                <Building2 size={10} />
                                                {job.industry}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-zinc-900 font-outfit mb-4">
                                            {job.title}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 font-outfit">
                                            <div className="flex items-center gap-1.5 opacity-70">
                                                <MapPin size={14} className="text-zinc-400" />
                                                {job.location}
                                            </div>
                                            <div className="px-2.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-lg text-xs font-bold uppercase tracking-tight">
                                                {job.employment_type.replace('_', ' ')}
                                            </div>
                                            {job.modality && (
                                                <div className="px-2.5 py-0.5 bg-fuchsia-50 text-[#D83484] rounded-lg text-xs font-bold uppercase tracking-tight">
                                                    {job.modality}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Brief summary (extracted or first part) */}
                                    <div className="text-zinc-600 mb-8 line-clamp-3 font-outfit font-light leading-relaxed">
                                        {job.description.replace(/[#*`]/g, '').slice(0, 160)}...
                                    </div>

                                    <div className="mt-auto flex items-center gap-6">
                                        <Link
                                            href={`/${lang}/join-us/${job.id}`}
                                            className="inline-flex items-center gap-2 bg-[#D83484] text-white font-bold py-3.5 px-8 rounded-xl hover:opacity-90 transition-all duration-300 shadow-sm shadow-[#D83484]/10 active:scale-95 text-center"
                                        >
                                            <span>{texts.viewOpening}</span>
                                            <ArrowRight size={18} />
                                        </Link>

                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenShareId(openShareId === job.id ? null : job.id)}
                                                className="text-zinc-500 hover:text-zinc-900 text-sm font-medium underline underline-offset-4 transition-colors flex items-center gap-2 group/share"
                                            >
                                                <Share2 size={16} className="text-zinc-400 group-hover/share:text-zinc-900 transition-colors" />
                                                {texts.shareOpening}
                                            </button>

                                            {openShareId === job.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setOpenShareId(null)}
                                                    />
                                                    <div className="absolute bottom-full left-0 mb-3 w-56 bg-white border border-zinc-200 rounded-xl py-2 z-20 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                        <button
                                                            onClick={() => handleShare(job, 'linkedin')}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-zinc-600 hover:text-[#0077b5] hover:bg-zinc-50 flex items-center gap-3 transition-all group/item"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center group-hover/item:bg-[#0077b5]/10 transition-colors">
                                                                <FaLinkedinIn size={16} className="text-zinc-400 group-hover/item:text-[#0077b5] transition-colors" />
                                                            </div>
                                                            <span className="font-medium">{texts.shareLinkedIn}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare(job, 'whatsapp')}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-zinc-600 hover:text-[#25D366] hover:bg-zinc-50 flex items-center gap-3 transition-all group/item"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center group-hover/item:bg-[#25D366]/10 transition-colors">
                                                                <FaWhatsapp size={18} className="text-zinc-400 group-hover/item:text-[#25D366] transition-colors" />
                                                            </div>
                                                            <span className="font-medium">{texts.shareWhatsApp}</span>
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

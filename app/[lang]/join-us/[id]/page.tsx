import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Building2, Clock, DollarSign, Bookmark } from 'lucide-react';
import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import { supabase } from "@/lib/supabase";
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import JobApplicationForm from '@/components/jobs/JobApplicationForm';

interface Props {
    params: Promise<{ lang: 'en' | 'es', id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, lang } = await params;
    
    try {
        const { data: job, error } = await supabase
            .from('job_openings')
            .select('title, title_es, title_en')
            .eq('id', id)
            .single();

        if (error) throw error;

        const title = job ? (lang === 'en' ? (job.title_en || job.title) : (job.title_es || job.title)) : 'Job Detail';

        return {
            title: `${title} | Dibrand Careers`,
        };
    } catch (e) {
        console.error('Metadata error:', e);
        return {
            title: `Job Opening | Dibrand Careers`,
        };
    }
}

export default async function JobDetailPage({ params }: Props) {
    const { lang, id } = await params;
    const dict = await getDictionary(lang);
    const isEn = lang === 'en';

    let job = null;
    try {
        const { data, error } = await supabase
            .from('job_openings')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        job = data;
    } catch (e) {
        console.error('Job query error:', e);
    }

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Job not found</h1>
                <Link href={`/${lang}/join-us`} className="text-brand font-semibold underline">
                    Back to careers
                </Link>
            </div>
        );
    }

    const jobTitle = isEn ? (job.title_en || job.title) : (job.title_es || job.title);
    const jobDescription = isEn ? (job.description_en || job.description) : (job.description_es || job.description);
    const jobRequirements = isEn ? (job.requirements_en || job.requirements) : (job.requirements_es || job.requirements);
    const jobLocation = isEn ? (job.location_en || job.location) : (job.location_es || job.location);

    const shareUrl = `https://dibrand.co/${lang}/join-us/${id}`;
    const shareText = isEn
        ? `Check out this opening at Dibrand: ${jobTitle}`
        : `Mira esta vacante en Dibrand: ${jobTitle}`;

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* Navigation and Share Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <Link
                            href={`/${lang}/join-us`}
                            className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand transition-colors font-outfit text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span>{isEn ? 'Back to all openings' : 'Volver a todas las vacantes'}</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                                {dict.joinOurTeam.shareOpening}
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                                    title="LinkedIn"
                                >
                                    <FaLinkedinIn size={18} />
                                </a>
                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                                    title="WhatsApp"
                                >
                                    <FaWhatsapp size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* New SaaS Hero Header */}
                    <header className="mb-12 bg-zinc-50 border border-zinc-200 rounded-[24px] p-8 md:p-12 shadow-sm">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                            
                            {/* Left Content Block */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 flex-1">
                                {/* Logo Slot */}
                                <div className="shrink-0 w-20 h-20 bg-[#101828] rounded-[18px] flex items-center justify-center text-white shadow-lg shadow-zinc-200">
                                    <div className="font-black text-3xl italic tracking-tighter opacity-90">di</div>
                                </div>

                                {/* Info Block */}
                                <div className="flex-1 text-center md:text-left min-w-0">
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 font-inter tracking-tight leading-tight mb-4 truncate">
                                        {jobTitle}
                                    </h1>

                                    {/* Meta Icons Row */}
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3 mb-6 opacity-70">
                                        <div className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                                            <Building2 size={18} strokeWidth={2} />
                                            <span>{job.industry}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                                            <MapPin size={18} strokeWidth={2} />
                                            <span>{jobLocation}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                                            <Clock size={18} strokeWidth={2} />
                                            <span>{isEn ? 'Posted recently' : 'Publicado recientemente'}</span>
                                        </div>
                                        {job.salary_range && (
                                            <div className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                                                <DollarSign size={18} strokeWidth={2} />
                                                <span>{job.salary_range}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Badges Row */}
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                        <span className="px-4 py-1.5 bg-[#EFF8FF] text-[#175CD3] text-xs font-bold rounded-full border border-[#B2DDFF] uppercase tracking-wider">
                                            {job.employment_type?.replace('_', ' ') || 'Full Time'}
                                        </span>
                                        <span className="px-4 py-1.5 bg-[#ECFDF3] text-[#027A48] text-xs font-bold rounded-full border border-[#ABEFC6] uppercase tracking-wider">
                                            {isEn ? 'Public' : 'Público'}
                                        </span>
                                        <span className="px-4 py-1.5 bg-[#FFFAEB] text-[#B54708] text-xs font-bold rounded-full border border-[#FEDF89] uppercase tracking-wider">
                                            {isEn ? 'Urgent' : 'Urgente'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Action Block */}
                            <div className="flex items-center justify-center lg:justify-end gap-4 shrink-0">
                                <button 
                                    onClick={() => {
                                        const form = document.getElementById('application-form');
                                        form?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-10 py-5 bg-brand text-white font-bold rounded-[14px] hover:bg-brand/90 hover:scale-[1.02] transition-all shadow-xl shadow-brand/20 active:scale-95 font-inter text-base flex-1 md:flex-none text-center"
                                >
                                    {isEn ? 'Apply For Job' : 'Postularme Ahora'}
                                </button>
                                <button className="w-16 h-16 flex items-center justify-center bg-white border border-zinc-200 text-zinc-500 rounded-[14px] hover:bg-zinc-50 transition-all shadow-sm hover:border-zinc-300">
                                    <Bookmark size={24} />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Split View Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Columna Izquierda: Descripción (65% aprox) */}
                        <div className="lg:col-span-8">
                            <article className="prose prose-zinc max-w-none
                                prose-headings:font-outfit prose-headings:font-bold prose-headings:text-zinc-900 prose-headings:mb-8 prose-headings:mt-16 first:prose-headings:mt-0
                                prose-p:text-zinc-600 prose-p:leading-[1.8] prose-p:text-justify prose-p:font-light prose-p:mb-10
                                prose-strong:text-zinc-900 prose-strong:font-bold
                                prose-li:marker:text-brand prose-li:text-zinc-600 prose-li:font-light prose-li:mb-3
                                prose-ul:mt-4 prose-ul:mb-8
                            ">
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {jobDescription || ''}
                                </ReactMarkdown>

                                {jobRequirements && (
                                    <div className="mt-20 pt-12 border-t border-zinc-100">
                                        <h2 className="text-4xl mb-8 font-outfit font-bold">{isEn ? 'Requirements' : 'Requisitos'}</h2>
                                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                            {jobRequirements}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </article>
                        </div>

                        {/* Columna Derecha: Formulario Sticky (35% aprox) */}
                        <div className="lg:col-span-4 lg:relative" id="application-form">
                            <div className="lg:sticky lg:top-32 bg-white border border-zinc-200 rounded-3xl p-8 transition-all">
                                <JobApplicationForm
                                    jobId={id}
                                    lang={lang}
                                    dict={dict.joinOurTeam}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer dict={dict} lang={lang} />
        </div>
    );
}

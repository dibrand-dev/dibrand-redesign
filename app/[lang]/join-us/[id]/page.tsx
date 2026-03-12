import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase } from 'lucide-react';
import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import { supabase } from "@/lib/supabase";
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import JobApplicationForm from '@/components/jobs/JobApplicationForm';
import JobDetailHeader from '@/components/jobs/JobDetailHeader';

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

                    {/* New SaaS Hero Header - Client Component to handle interactivity */}
                    <JobDetailHeader 
                        job={job}
                        jobTitle={jobTitle}
                        jobLocation={jobLocation}
                        isEn={isEn}
                    />

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

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Building2, Share2 } from 'lucide-react';
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
    const { data: job } = await supabase
        .from('job_openings')
        .select('title')
        .eq('id', id)
        .single();

    return {
        title: job ? `${job.title} | Dibrand Careers` : 'Job Detail | Dibrand',
    };
}

export default async function JobDetailPage({ params }: Props) {
    const { lang, id } = await params;
    const dict = await getDictionary(lang);
    const isEn = lang === 'en';

    const { data: job } = await supabase
        .from('job_openings')
        .select('*')
        .eq('id', id)
        .single();

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Job not found</h1>
                <Link href={`/${lang}/join-us`} className="text-[#D83484] font-semibold underline">
                    Back to careers
                </Link>
            </div>
        );
    }

    const shareUrl = `https://dibrand.co/${lang}/join-us/${id}`;
    const shareText = isEn
        ? `Check out this opening at Dibrand: ${job.title}`
        : `Mira esta vacante en Dibrand: ${job.title}`;

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    {/* Back Link */}
                    <Link
                        href={`/${lang}/join-us`}
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#D83484] transition-colors mb-12 font-outfit"
                    >
                        <ArrowLeft size={18} />
                        <span>{isEn ? 'Back to all openings' : 'Volver a todas las vacantes'}</span>
                    </Link>

                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
                                {job.seniority || 'Expert'}
                            </span>
                            <span className="text-zinc-200">•</span>
                            <span className="text-xs font-bold text-[#D83484] uppercase tracking-[0.2em] flex items-center gap-1">
                                <Building2 size={12} />
                                {job.industry}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 font-outfit leading-tight lg:max-w-3xl">
                            {job.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-zinc-500 font-outfit">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-zinc-400" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase size={18} className="text-zinc-400" />
                                <span>{job.employment_type}</span>
                            </div>
                        </div>
                    </header>

                    {/* Share Buttons */}
                    <div className="flex items-center gap-4 mb-12 py-6 border-y border-zinc-100">
                        <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                            {dict.joinOurTeam.shareOpening}
                        </span>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-[#0077b5] hover:bg-[#0077b5]/5 rounded-xl transition-all"
                            title="LinkedIn"
                        >
                            <FaLinkedinIn size={20} />
                        </a>
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-[#25D366] hover:bg-[#25D366]/5 rounded-xl transition-all"
                            title="WhatsApp"
                        >
                            <FaWhatsapp size={20} />
                        </a>
                    </div>

                    {/* Content */}
                    <div className="prose prose-zinc max-w-none mb-20
                        prose-headings:font-outfit prose-headings:font-bold prose-headings:text-zinc-900
                        prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:text-justify
                        prose-strong:text-zinc-900
                        prose-li:marker:text-[#D83484] prose-li:text-zinc-600
                    ">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {job.description}
                        </ReactMarkdown>

                        {job.requirements && (
                            <>
                                <h2 className="text-2xl mt-12 mb-6">Requirements</h2>
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {job.requirements}
                                </ReactMarkdown>
                            </>
                        )}
                    </div>

                    {/* Application Form Section */}
                    <div id="apply" className="bg-zinc-50 rounded-3xl p-8 md:p-12 border border-zinc-200 scroll-mt-32">
                        <JobApplicationForm
                            jobId={id}
                            lang={lang}
                            dict={dict.joinOurTeam}
                        />
                    </div>
                </div>
            </main>
            <Footer dict={dict} lang={lang} />
        </div>
    );
}

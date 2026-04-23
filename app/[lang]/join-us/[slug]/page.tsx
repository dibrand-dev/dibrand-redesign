import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
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
    params: Promise<{ lang: 'en' | 'es', slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    
    try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        
        let query = supabase
            .from('job_openings')
            .select('id, slug, title, title_es, title_en');

        if (isUUID) {
            query = query.or(`slug.eq.${slug},id.eq.${slug}`);
        } else {
            query = query.eq('slug', slug);
        }

        let { data: job, error } = await query.maybeSingle();

        // Fallback for metadata if slug column is missing
        if (error && isUUID) {
            const { data: fallback } = await supabase
                .from('job_openings')
                .select('id, title, title_es, title_en')
                .eq('id', slug)
                .maybeSingle();
            job = fallback as any;
        }

        const title = job ? (lang === 'en' ? (job.title_en || job.title) : (job.title_es || job.title)) : 'Job Detail';
        
        const finalSlug = job?.slug || job?.id || slug;
        const canonical = `https://dibrand.co/${lang}/join-us/${finalSlug}`;

        return {
            title: `${title} | Dibrand Careers`,
            alternates: {
                canonical: canonical
            }
        };
    } catch (e) {
        console.error('Metadata error:', e);
        return {
            title: `Job Opening | Dibrand Careers`,
        };
}
}

export default async function JobDetailPage({ params }: Props) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);
    const isEn = lang === 'en';

    let job = null;
    try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        
        // Try to find by slug or ID
        const query = supabase
            .from('job_openings')
            .select(`
                id, slug,
                title, title_es, title_en,
                location, location_es, location_en,
                description, description_es, description_en,
                requirements, requirements_es, requirements_en,
                industry, seniority, modality, employment_type,
                is_active, created_at,
                job_opening_stacks(
                    sort_order,
                    tech_stacks(id, name, icon_url)
                )
            `);

        if (isUUID) {
            query.or(`slug.eq.${slug},id.eq.${slug}`);
        } else {
            query.eq('slug', slug);
        }

        const { data, error } = await query.maybeSingle();

        // If there was an error (e.g. slug column missing), try fallback with only ID
        if (error || !data) {
            if (isUUID) {
                const { data: fallbackData } = await supabase
                    .from('job_openings')
                    .select('*')
                    .eq('id', slug)
                    .maybeSingle();
                job = fallbackData as any;
            } else {
                job = data;
            }
        } else {
            // If we found the job by ID but it has a slug, redirect 301 to the slug URL
            if (data && data.id === slug && data.slug && data.slug !== slug) {
                redirect(`/${lang}/join-us/${data.slug}`);
            }
            job = data;
        }
    } catch (e) {
        if ((e as any)?.digest?.includes('NEXT_REDIRECT')) throw e;
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

    const shareUrl = `https://dibrand.co/${lang}/join-us/${job.slug || job.id}`;
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
                                {/* Role Description */}
                                <div 
                                    className="job-content"
                                    dangerouslySetInnerHTML={{ __html: jobDescription || '' }}
                                />

                                {jobRequirements && (
                                    <div className="mt-6 pt-6 border-t border-zinc-100">
                                        <h2 className="text-2xl font-bold text-zinc-900 mt-0 mb-4 font-heading uppercase tracking-tight">{isEn ? 'Requirements' : 'Requisitos'}</h2>
                                        <div 
                                            className="job-content"
                                            dangerouslySetInnerHTML={{ __html: jobRequirements }}
                                        />
                                    </div>
                                )}
                        </div>

                        {/* Columna Derecha: Formulario Sticky (35% aprox) */}
                        <div className="lg:col-span-4 lg:relative" id="application-form">
                            <div className="lg:sticky lg:top-32 bg-white border border-zinc-200 rounded-3xl p-8 transition-all">
                                <JobApplicationForm
                                    jobId={job.id}
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

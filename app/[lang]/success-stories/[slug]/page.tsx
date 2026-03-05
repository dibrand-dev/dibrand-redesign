import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Building2, FolderKanban, Wrench, UserSquare2 } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { createAdminClient } from "@/lib/supabase-server";
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface Props {
    params: Promise<{ lang: 'en' | 'es'; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const supabase = createAdminClient();

    const { data: caseStudy } = await supabase
        .from('case_studies')
        .select('title, summary')
        .ilike('slug', slug)
        .single();

    return {
        title: caseStudy ? `${caseStudy.title} | Dibrand Success Stories` : 'Success Story | Dibrand',
        description: caseStudy?.summary || 'Explore our high-impact engineering case studies.',
    };
}

export default async function CaseStudyDetailPage({ params }: Props) {
    try {
        const { lang, slug } = await params;
        const dict = await getDictionary(lang);
        const supabase = createAdminClient();
        const isEn = lang === 'en';

        // Fetch by Slug strictly
        let { data: caseStudy, error } = await supabase
            .from('case_studies')
            .select(`
                *,
                testimonial:testimonial_id (
                    content_es,
                    content_en,
                    author_name,
                    role_es,
                    role_en,
                    client_name
                )
            `)
            .ilike('slug', slug)
            .single();

        // Graceful fallback if testimonial_id join fails
        if (error && (error.message.includes('testimonial_id') || error.code === 'PGRST204')) {
            const { data: retryData, error: retryError } = await supabase
                .from('case_studies')
                .select('*')
                .ilike('slug', slug)
                .single();

            caseStudy = retryData;
            error = retryError;
        }

        if (error || !caseStudy) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
                    <h1 className="text-2xl font-bold mb-4 font-outfit uppercase tracking-tighter">Case study not found</h1>
                    <Link href={`/${lang}/success-stories`} className="px-8 py-3 bg-brand text-white rounded-xl font-bold font-outfit uppercase text-[10px] tracking-widest">
                        Back to all stories
                    </Link>
                </div>
            );
        }

        const shareUrl = `https://dibrand.co/${lang}/success-stories/${caseStudy.slug}`;
        const challenge = caseStudy.challenge;
        const solution = caseStudy.solution;
        const outcomeImpact = caseStudy.outcome_impact;
        const summary = caseStudy.summary;
        const metrics = caseStudy.results_metrics || [];
        const hasMetrics = Array.isArray(metrics) && metrics.length > 0;
        const heroImage = caseStudy.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop';

        const testimonial = caseStudy.testimonial || (caseStudy.testimonial_text ? {
            content: caseStudy.testimonial_text,
            author: caseStudy.testimonial_author
        } : null);

        let pTypeRaw = caseStudy.project_type || caseStudy.tags?.[0] || 'Software Development';
        let pServices = Array.isArray(caseStudy.services) ? caseStudy.services : [];
        let cleanMetrics = metrics;

        if (hasMetrics) {
            const metaObj = metrics.find((m: any) => m.label === '__METADATA__');
            if (metaObj && metaObj.value) {
                try {
                    const parsed = JSON.parse(metaObj.value);
                    if (parsed.project_type) pTypeRaw = parsed.project_type;
                    if (parsed.services && Array.isArray(parsed.services)) pServices = parsed.services;
                } catch (e) { }
            }
            cleanMetrics = metrics.filter((m: any) => m.label !== '__METADATA__');
        }

        const PROJECT_TYPE_MAP: Record<string, string> = {
            'webapp': 'Web App', 'mobileapp': 'Mobile App', 'plataforma': 'Full-Stack Platform',
            'migracion': 'Migración', 'mvp': 'MVP', 'aisolution': 'AI Solution', 'otro': 'Otro',
            'Web Development': 'Web App', 'Mobile Development': 'Mobile App'
        };
        const pTypeDisplay = PROJECT_TYPE_MAP[pTypeRaw] || pTypeRaw;

        const INDUSTRY_MAP: Record<string, string> = {
            'media': 'Media & Entertainment', 'fintech': 'Fintech', 'ecommerce': 'E-commerce & Retail',
            'healthcare': 'Healthcare', 'edtech': 'EdTech', 'logistics': 'Logistics & Supply Chain',
            'realestate': 'Real Estate', 'saas': 'SaaS / Enterprise Software', 'gov': 'Gov'
        };
        const industryDisplay = caseStudy.industry ? (INDUSTRY_MAP[caseStudy.industry] || caseStudy.industry) : '-';

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "CaseStudy",
            "name": caseStudy.title,
            "description": summary,
            "image": caseStudy.image_url,
            "about": caseStudy.tags?.join(', '),
            "identifier": shareUrl,
            "author": {
                "@type": "Organization",
                "name": "Dibrand"
            }
        };

        return (
            <div className="flex min-h-screen flex-col bg-white pt-28">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <main className="flex-grow container mx-auto px-6 max-w-7xl">

                    {/* Navigation */}
                    <div className="flex items-center justify-between w-full mb-10">
                        <Link
                            href={`/${lang}/success-stories`}
                            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors font-outfit text-xs font-bold uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} />
                            <span>{dict.home.caseDetail.backLink}</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:inline">
                                {dict.home.caseDetail.share}
                            </span>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-zinc-500 hover:text-brand transition-colors"
                            >
                                <FaLinkedinIn size={16} />
                            </a>
                        </div>
                    </div>

                    {/* H1 Title */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-zinc-900 font-outfit tracking-tighter leading-[0.95] max-w-5xl not-italic">
                            {caseStudy.title}
                        </h1>
                    </div>

                    {/* Hero Image (Premium Card Style) */}
                    <section className="relative w-full aspect-[21/9] min-h-[300px] max-h-[680px] overflow-hidden rounded-3xl border border-zinc-100 shadow-sm mb-12">
                        <Image
                            src={heroImage}
                            alt={caseStudy.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                    </section>

                    {/* Metadata Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-zinc-100 mb-16 px-4">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 mb-1">
                                <UserSquare2 size={16} className="text-brand" />
                                <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest font-outfit">Client</span>
                            </div>
                            <span className="text-[15px] font-bold text-zinc-900 font-outfit truncate">{caseStudy.client_name}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 mb-1">
                                <Building2 size={16} className="text-brand" />
                                <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest font-outfit">Industry</span>
                            </div>
                            <span className="text-[15px] font-bold text-zinc-900 font-outfit truncate">{industryDisplay}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 mb-1">
                                <FolderKanban size={16} className="text-brand" />
                                <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest font-outfit">Project Type</span>
                            </div>
                            <span className="text-[15px] font-bold text-zinc-900 font-outfit truncate">{pTypeDisplay}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 mb-1">
                                <Wrench size={16} className="text-brand" />
                                <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest font-outfit">Services</span>
                            </div>
                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                                {(pServices.length > 0) ? (
                                    pServices.map((srv: string, i: number) => {
                                        const isSpecial = srv === 'Staff Augmentation' || srv === 'Outsourcing';
                                        return (
                                            <span
                                                key={i}
                                                className={`text-[15px] font-bold font-outfit flex items-center gap-1 ${isSpecial ? 'text-brand' : 'text-zinc-900'}`}
                                            >
                                                {isSpecial && <span className="text-xs">✺</span>}
                                                {srv}
                                                {i < pServices.length - 1 && <span className="text-zinc-300 ml-1 font-normal">,</span>}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span className="text-[15px] font-bold text-zinc-900 font-outfit truncate">
                                        {isEn ? 'Engineering Squad' : 'Desarrollo a Medida'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {summary && (
                        <section className="mb-16">
                            <p className="text-lg text-zinc-800 font-outfit font-medium leading-[1.8] max-w-3xl">
                                {summary}
                            </p>
                        </section>
                    )}

                    {/* ═══════════════════════════════════════════════ */}
                    {/* CONTENT — Split View below the intro           */}
                    {/* ═══════════════════════════════════════════════ */}
                    <div className="pb-16 md:pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-start">

                            {/* ─── LEFT COLUMN (65%) ─── */}
                            <div className="lg:col-span-8 space-y-14">

                                {challenge && (
                                    <section id="challenge">
                                        <h2 className="text-3xl md:text-4xl font-bold font-outfit text-zinc-900 mb-6 uppercase tracking-tight not-italic">
                                            {dict.home.caseDetail.challenge}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-zinc-600 prose-p:font-normal prose-p:font-outfit prose-li:text-zinc-600 prose-li:font-outfit prose-li:leading-[1.8] prose-strong:text-zinc-900">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{challenge}</ReactMarkdown>
                                        </article>

                                        {/* Secondary Gallery */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 mb-6">
                                            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
                                                <Image src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop" alt="Development process" fill className="object-cover" />
                                            </div>
                                            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
                                                <Image src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" alt="Data analysis" fill className="object-cover" />
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {solution && (
                                    <section id="solution" className="pt-14 border-t border-zinc-100 mt-14">
                                        <h2 className="text-3xl md:text-4xl font-bold font-outfit text-zinc-900 mb-6 uppercase tracking-tight not-italic">
                                            {dict.home.caseDetail.solution}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-zinc-600 prose-p:font-normal prose-p:font-outfit prose-li:text-zinc-600 prose-li:font-outfit prose-li:leading-[1.8] prose-strong:text-zinc-900">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{solution}</ReactMarkdown>
                                        </article>
                                    </section>
                                )}

                                {outcomeImpact && (
                                    <section id="impact" className="pt-14 border-t border-zinc-100 mt-14">
                                        <h2 className="text-3xl md:text-4xl font-bold font-outfit text-zinc-900 mb-6 uppercase tracking-tight not-italic">
                                            {isEn ? "BUSINESS IMPACT" : "IMPACTO DE NEGOCIO"}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-zinc-600 prose-p:font-normal prose-p:font-outfit prose-li:text-zinc-600 prose-li:font-outfit prose-li:leading-[1.8] prose-strong:text-zinc-900">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{outcomeImpact}</ReactMarkdown>
                                        </article>
                                    </section>
                                )}

                                {/* Key Metrics inline — only if data exists */}
                                {hasMetrics && (
                                    <section id="metrics" className="pt-14 border-t border-zinc-100">
                                        <h2 className="text-sm font-bold font-outfit text-brand mb-8 uppercase tracking-widest not-italic">
                                            {dict.home.caseDetail.metrics}
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                            {metrics.map((m: any, i: number) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-4xl md:text-5xl font-bold font-outfit tracking-tighter text-zinc-900 mb-1">{m.value}</span>
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{m.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {testimonial && (
                                    <section className="pt-14 border-t border-zinc-100 flex justify-center">
                                        <div className="p-8 max-w-2xl w-full text-center">
                                            <span className="block text-4xl text-brand font-serif leading-none select-none mb-3">&ldquo;</span>
                                            <p className="text-base text-zinc-800 font-outfit font-medium leading-[1.8] mb-6 md:px-6">
                                                {testimonial.content || testimonial.content_es || testimonial.content_en}
                                            </p>
                                            {(testimonial.author || testimonial.author_name) && (
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-brand font-bold font-outfit uppercase tracking-widest text-[10px]">
                                                        {testimonial.author || testimonial.author_name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* ─── RIGHT COLUMN (35% — Sticky) ─── */}
                            <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-6">

                                {/* Tech Stack */}
                                {caseStudy.tags && caseStudy.tags.length > 0 && (
                                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-5 border-b border-zinc-50 pb-3">
                                            {dict.home.caseDetail.techStack}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {caseStudy.tags.map((tag: string, i: number) => (
                                                <span key={i} className="px-3 py-1.5 bg-white border border-brand text-brand rounded-md text-[10px] font-bold font-outfit uppercase shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA Card — Sticky */}
                                <div className="bg-brand rounded-2xl p-8 shadow-xl shadow-brand/20 flex flex-col items-center text-center">
                                    <h3 className="text-white font-bold font-outfit text-xl mb-3 leading-snug">
                                        {isEn ? "Ready to accelerate your roadmap?" : "¿Listo para acelerar tu roadmap?"}
                                    </h3>
                                    <p className="text-white/80 font-outfit text-sm mb-6 max-w-[200px]">
                                        {isEn ? "Let's discuss how we can help your team." : "Hablemos sobre cómo podemos potenciar a tu equipo."}
                                    </p>
                                    <Link
                                        href={`/${lang}/contact`}
                                        className="flex items-center justify-center w-full py-4 bg-white text-brand rounded-xl font-bold font-outfit uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-md"
                                    >
                                        BOOK A CALL
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                <Footer dict={dict} lang={lang} />
            </div>
        );
    } catch (err: any) {
        return (
            <div className="p-20 text-red-500 font-mono">
                <h1 className="text-2xl mb-4">500 Internal Server Error</h1>
                <pre>{err.message || String(err)}</pre>
            </div>
        );
    }
}

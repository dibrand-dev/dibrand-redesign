import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Building2, FolderKanban, Wrench, UserSquare2, Search, Layout, Code, Cloud, CheckCircle2, Globe, Cpu, Rocket, Sparkles, Box, Play, Palette, UserSearch } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { createAdminClient } from "@/lib/supabase-server";
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import ScheduleButton from '@/components/ui/ScheduleButton';
import { CASE_INDUSTRIES, MAP_OLD_PROJECT_TYPE, cleanOldServiceName, MAP_OLD_INDUSTRY } from '@/lib/case-constants';

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
        .select('title, title_es, title_en, summary, summary_es, summary_en, tags')
        .ilike('slug', slug)
        .single();

    // Fetch stacks to resolve IDs for metadata
    const { data: stacks } = await supabase.from('tech_stacks').select('id, name');
    const stackMap: Record<string, string> = {};
    (stacks || []).forEach(s => { stackMap[s.id] = s.name; });

    const resolvedTags = (caseStudy?.tags || []).map((t: string) => stackMap[t] || t);

    const displayTitle = lang === 'en' ? (caseStudy?.title_en || caseStudy?.title) : (caseStudy?.title_es || caseStudy?.title);
    const displaySummary = lang === 'en' ? (caseStudy?.summary_en || caseStudy?.summary) : (caseStudy?.summary_es || caseStudy?.summary);

    return {
        title: caseStudy ? `${displayTitle} | Dibrand Success Stories` : 'Success Story | Dibrand',
        description: displaySummary || 'Explore our high-impact engineering case studies.',
        keywords: resolvedTags.join(', '),
        alternates: {
            canonical: `https://dibrand.co/${lang}/success-stories/${slug}`,
            languages: {
                'en': `https://dibrand.co/en/success-stories/${slug}`,
                'es': `https://dibrand.co/es/success-stories/${slug}`,
            },
        }
    };
}

export default async function CaseStudyDetailPage({ params }: Props) {
    try {
        const { lang, slug } = await params;
        const dict = await getDictionary(lang);
        const supabase = createAdminClient();
        const isEn = lang === 'en';

        // Fetch stacks for resolution
        const { data: stacks } = await supabase.from('tech_stacks').select('id, name');
        const stackMap: Record<string, string> = {};
        (stacks || []).forEach(s => { stackMap[s.id] = s.name; });

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
        const challenge = isEn ? (caseStudy.challenge_en || caseStudy.challenge) : (caseStudy.challenge_es || caseStudy.challenge);
        const solution = isEn ? (caseStudy.solution_en || caseStudy.solution) : (caseStudy.solution_es || caseStudy.solution);
        const outcomeImpact = isEn ? (caseStudy.outcome_impact_en || caseStudy.outcome_impact) : (caseStudy.outcome_impact_es || caseStudy.outcome_impact);
        const summary = isEn ? (caseStudy.summary_en || caseStudy.summary) : (caseStudy.summary_es || caseStudy.summary);
        const title = isEn ? (caseStudy.title_en || caseStudy.title) : (caseStudy.title_es || caseStudy.title);
        const metrics = caseStudy.results_metrics || [];
        const hasMetrics = Array.isArray(metrics) && metrics.length > 0;
        const heroImage = caseStudy.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop';

        const testimonial = caseStudy.testimonial || (caseStudy.testimonial_text ? {
            content: caseStudy.testimonial_text,
            author: caseStudy.testimonial_author
        } : null);

        const CASE_TECH_STACK_NAMES = ['Python', 'JavaScript', 'Java', 'React', 'Node.js', 'Next.js', 'Typescript', 'PostgreSQL', 'AWS', 'Azure', 'GCP']; // Minimal check or import if possible
        let pTypeRaw = caseStudy.project_type;

        // Fallback robusto: si no hay project_type, intentamos con tags pero que no sean del stack técnico
        if (!pTypeRaw) {
            const firstNonTechTag = caseStudy.tags?.find((t: string) => !CASE_TECH_STACK_NAMES.some(ts => t.toLowerCase().includes(ts.toLowerCase())));
            pTypeRaw = firstNonTechTag || 'Software Development';
        }

        let pServices = Array.isArray(caseStudy.services) ? caseStudy.services : [];
        let cleanMetrics = metrics;

        if (hasMetrics) {
            const metaObj = metrics.find((m: any) => m.label === '__METADATA__');
            if (metaObj && metaObj.value) {
                try {
                    const parsed = typeof metaObj.value === 'string' ? JSON.parse(metaObj.value) : metaObj.value;
                    if (parsed.project_type) pTypeRaw = parsed.project_type;
                    if (parsed.services && Array.isArray(parsed.services)) {
                        pServices = parsed.services.map(cleanOldServiceName);
                    }
                } catch (e) { }
            }
            cleanMetrics = metrics.filter((m: any) => m.label && m.label !== '__METADATA__' && m.value && m.value !== 'null' && m.value !== '');
        }
        const hasRealMetrics = cleanMetrics.length > 0;

        // Sanitize content fields to remove any leaked metadata or raw JSON
        const cleanContent = (text: any) => {
            if (typeof text !== 'string') return '';
            return text
                .replace(/\{"project_type":.*?\}/g, '')
                .replace(/__METADATA__/g, '')
                .trim();
        };

        const cleanedChallenge = cleanContent(challenge);
        const cleanedSolution = cleanContent(solution);
        const cleanedOutcomeImpact = cleanContent(outcomeImpact);

        const pTypeDisplay = MAP_OLD_PROJECT_TYPE[pTypeRaw] || pTypeRaw;
        const rawIndustry = caseStudy.industry || '';
        const cleanIndustry = MAP_OLD_INDUSTRY[rawIndustry] || rawIndustry;
        const industryObj = CASE_INDUSTRIES.find(ind => ind.value === cleanIndustry);

        const resolvedTags = (caseStudy.tags || []).map((tag: string) => stackMap[tag] || tag);
        const SERVICE_ICONS: Record<string, any> = {
            'Product Discovery & Strategy': Search,
            'UI/UX Design': Layout,
            'Web Development': Code,
            'Cloud & DevOps': Cloud,
            'QA & Testing': CheckCircle2,
            'Staff Augmentation': UserSquare2,
            'Outsourcing': Globe,
            'Mobile Development': Rocket,
            'AI & Data Science': Cpu,
            'Engineering Squad': Cpu,
            'Desarrollo a Medida': Code,
            '3D Design & Modeling': Box,
            'Motion Graphics': Play,
            'Art Direction': Palette,
            'Technical Recruitment & Vetting': UserSearch
        };

        const industryDisplay = industryObj ? industryObj.label : (cleanIndustry || '-');

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "CaseStudy",
            "name": title,
            "description": summary,
            "image": heroImage,
            "about": resolvedTags.join(', '),
            "identifier": shareUrl,
            "author": {
                "@type": "Organization",
                "name": "Dibrand"
            },
            "client": caseStudy.client_name,
            "industry": industryDisplay,
            "techStack": resolvedTags
        };

        return (
            <div className="flex min-h-screen flex-col bg-white pt-24 md:pt-28">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <main className="flex-grow container mx-auto px-6 max-w-7xl">

                    {/* Navigation */}
                    <div className="flex items-center justify-between w-full mb-8">
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

                    {/* Strategic Header Redesign — Exact Match to ficha.png */}
                    <div className="flex flex-col mb-20 lg:mb-32">
                        {/* Level 1: Full-Width Title */}
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 font-outfit tracking-tighter leading-tight not-italic">
                                {title}
                            </h1>
                        </div>

                        {/* Level 2: Metadata & Services Header Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-zinc-100 mb-8">
                            {/* Client */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <UserSquare2 size={16} className="text-[#a04c97] shrink-0" />
                                    <span className="text-[10px] font-black text-[#a04c97] uppercase tracking-[0.2em] font-outfit">Client</span>
                                </div>
                                <span className="text-base font-bold text-zinc-900 font-outfit leading-tight pl-0.5">{caseStudy.client_name}</span>
                            </div>

                            {/* Industry */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <Building2 size={16} className="text-[#a04c97] shrink-0" />
                                    <span className="text-[10px] font-black text-[#a04c97] uppercase tracking-[0.2em] font-outfit">Industry</span>
                                </div>
                                <span className="text-base font-bold text-zinc-900 font-outfit leading-tight pl-0.5">{industryDisplay}</span>
                            </div>

                            {/* Project Type */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <FolderKanban size={16} className="text-[#a04c97] shrink-0" />
                                    <span className="text-[10px] font-black text-[#a04c97] uppercase tracking-[0.2em] font-outfit">Project Type</span>
                                </div>
                                <span className="text-base font-bold text-zinc-900 font-outfit leading-tight pl-0.5">{pTypeDisplay}</span>
                            </div>

                            {/* Services Label Column (Aligned with the list below) */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <Wrench size={16} className="text-[#a04c97] shrink-0" />
                                    <span className="text-[10px] font-black text-[#a04c97] uppercase tracking-[0.2em] font-outfit">Services</span>
                                </div>
                            </div>
                        </div>

                        {/* Level 3: Dual Column Hero Content (Image Left / Services Right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                            {/* Large Hero Image (Spans approximately 75% | 9 cols) */}
                            <div className="lg:col-span-9">
                                <div className="relative w-full aspect-[16/10] md:aspect-[21/10] overflow-hidden rounded-3xl border border-zinc-100 shadow-2xl shadow-zinc-200/50 group">
                                    <Image
                                        src={heroImage}
                                        alt={title}
                                        fill
                                        priority
                                        className="object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
                                        sizes="(max-width: 1024px) 100vw, 75vw"
                                    />
                                    <div className="absolute inset-0 bg-zinc-950/5" />
                                </div>
                            </div>

                            {/* Vertical Services List (Spans remaining width | 3 cols) */}
                            <div className="lg:col-span-3 flex flex-col gap-4">
                                {(pServices.length > 0) ? (
                                    pServices.map((srv: string, i: number) => {
                                        const Icon = SERVICE_ICONS[srv] || Sparkles;
                                        return (
                                            <div
                                                key={i}
                                                className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl border border-[#a04c97]/20 bg-white text-zinc-800 hover:border-[#a04c97]/50 hover:bg-[#a04c97]/5 transition-all duration-300 shadow-sm group/srv"
                                            >
                                                <div className="p-2 rounded-lg bg-[#a04c97]/5 text-[#a04c97] group-hover/srv:bg-[#a04c97] group-hover/srv:text-white transition-colors">
                                                    <Icon size={16} />
                                                </div>
                                                <span className="text-[13px] font-bold font-outfit tracking-tight">{srv}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl border border-[#a04c97]/20 bg-white text-zinc-800">
                                        <div className="p-2 rounded-lg bg-[#a04c97]/5 text-[#a04c97]">
                                            <Code size={16} />
                                        </div>
                                        <span className="text-[13px] font-bold font-outfit tracking-tight">
                                            {isEn ? 'Engineering Squad' : 'Desarrollo a Medida'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {summary && (
                        <section className="mb-24">
                            <p className="text-xl md:text-2xl text-zinc-700 font-outfit font-light leading-[1.6] max-w-4xl tracking-tight">
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
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-outfit text-zinc-900 mb-6 uppercase tracking-tight not-italic">
                                            {dict.home.caseDetail.challenge}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-zinc-600 prose-p:font-normal prose-p:font-outfit prose-li:text-zinc-600 prose-li:font-outfit prose-li:leading-[1.8] prose-strong:text-zinc-900">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{cleanedChallenge}</ReactMarkdown>
                                        </article>

                                    </section>
                                )}

                                {solution && (
                                    <section id="solution" className="pt-14 border-t border-zinc-100 mt-14">
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-outfit text-zinc-900 mb-6 uppercase tracking-tight not-italic">
                                            {dict.home.caseDetail.solution}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-zinc-600 prose-p:font-normal prose-p:font-outfit prose-li:text-zinc-600 prose-li:font-outfit prose-li:leading-[1.8] prose-strong:text-zinc-900">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{cleanedSolution}</ReactMarkdown>
                                        </article>
                                    </section>
                                )}

                                {outcomeImpact && (
                                    <section id="impact" className="pt-14 border-t border-zinc-100 mt-14">
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-outfit text-zinc-900 mb-6 uppercase tracking-tight not-italic">
                                            {isEn ? "BUSINESS IMPACT" : "IMPACTO DE NEGOCIO"}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-zinc-600 prose-p:font-normal prose-p:font-outfit prose-li:text-zinc-600 prose-li:font-outfit prose-li:leading-[1.8] prose-strong:text-zinc-900">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{cleanedOutcomeImpact}</ReactMarkdown>
                                        </article>
                                    </section>
                                )}

                                {/* Key Metrics inline — only if data exists */}
                                {hasRealMetrics && (
                                    <section id="metrics" className="pt-14 border-t border-zinc-100">
                                        <h2 className="text-sm font-bold font-outfit text-brand mb-8 uppercase tracking-widest not-italic">
                                            {dict.home.caseDetail.metrics}
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                            {cleanMetrics.map((m: any, i: number) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-4xl md:text-5xl font-bold font-outfit tracking-tighter text-zinc-900 mb-1">{m.value}</span>
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{m.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {testimonial && (
                                    <section className="pt-20 border-t border-zinc-100">
                                        <div className="max-w-3xl mx-auto px-4">
                                            {/* Testimonial Bubble (Globo) */}
                                            <div className="relative bg-[#a04c97] rounded-[2.5rem] p-10 md:p-14 mb-10 shadow-2xl shadow-[#a04c97]/20 group">
                                                {/* Quote Text */}
                                                <p className="text-white text-lg md:text-2xl font-outfit font-light leading-[1.6] italic relative z-10">
                                                    &ldquo;{testimonial.content || testimonial.content_es || testimonial.content_en}&rdquo;
                                                </p>

                                                {/* Bubble Tail */}
                                                <div className="absolute -bottom-4 left-16 w-10 h-10 bg-[#a04c97] rotate-45 -z-0" />

                                                {/* Decorative Accent (Dots like in image) */}
                                                <div className="absolute bottom-6 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                                    <div className="grid grid-cols-3 gap-1.5">
                                                        {[...Array(9)].map((_, i) => (
                                                            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Author Info (Outside the bubble) */}
                                            {(testimonial.author || testimonial.author_name) && (
                                                <div className="pl-20">
                                                    <h4 className="text-[#a04c97] font-black font-outfit uppercase tracking-[0.2em] text-sm mb-1">
                                                        {testimonial.author || testimonial.author_name}
                                                    </h4>
                                                    {(testimonial.role_es || testimonial.role_en || testimonial.client_name) && (
                                                        <span className="text-zinc-400 font-bold font-outfit uppercase tracking-widest text-[10px]">
                                                            {isEn
                                                                ? (testimonial.role_en || testimonial.client_name)
                                                                : (testimonial.role_es || testimonial.client_name)}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* ─── RIGHT COLUMN (35% — Sticky) ─── */}
                            <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-6">

                                {/* Tech Stack */}
                                {resolvedTags && resolvedTags.length > 0 && (
                                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-5 border-b border-zinc-50 pb-3">
                                            {dict.home.caseDetail.techStack}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {resolvedTags.map((tag: string, i: number) => (
                                                <span key={i} className="px-3 py-1.5 bg-white border border-brand text-brand rounded-md text-[10px] font-bold font-outfit uppercase shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Global CTA Section — Full Width at bottom */}
                            <div className="mt-32 lg:col-span-full">
                                <div className="relative rounded-[3rem] overflow-hidden min-h-[600px] flex items-center p-8 md:p-24 group">
                                    {/* Background Image with Overlay */}
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                            src="/consultation_cta_bg.png"
                                            alt="Consultation Background"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                        />
                                        <div className="absolute inset-0 bg-zinc-950/40" />
                                        <div className="absolute inset-0 bg-[#a04c97]/15" />
                                    </div>

                                    <div className="relative z-10 max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold font-outfit tracking-tighter leading-[1.1] text-white">
                                            {isEn ? 'Ready to build your own success story?' : '¿Listo para construir tu propia historia de éxito?'}
                                        </h2>
                                        <p className="text-zinc-200 text-lg md:text-2xl font-outfit font-light leading-relaxed max-w-2xl">
                                            {isEn
                                                ? "Let's transform your technical challenges into a competitive advantage with our senior engineering team."
                                                : 'Transformemos tus desafíos técnicos en una ventaja competitiva con nuestro equipo de ingeniería senior.'}
                                        </p>
                                        <div className="pt-8">
                                            <ScheduleButton
                                                text={isEn ? 'Book an Appointment' : 'Agendar una Cita'}
                                                className="!bg-white/10 !backdrop-blur-md !border !border-white/30 !text-white hover:!bg-[#a04c97] hover:!border-transparent hover:!scale-105 transition-all duration-300 shadow-2xl px-12 py-6 text-lg"
                                            />
                                        </div>
                                    </div>
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

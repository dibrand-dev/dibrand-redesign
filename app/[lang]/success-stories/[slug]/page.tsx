import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
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

        console.log(`[CaseStudyDetail] Request for Slug: ${slug}`);

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
            console.error(`[CaseStudyDetail] NotFound/Error for slug "${slug}":`, error?.message || 'No data');
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="text-2xl font-bold mb-4 font-outfit uppercase tracking-tighter">Case study not found</h1>
                    <Link href={`/${lang}/success-stories`} className="px-8 py-3 bg-[#D83484] text-white rounded-xl font-bold font-outfit uppercase text-[10px] tracking-widest">
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

        const testimonial = caseStudy.testimonial || (caseStudy.testimonial_text ? {
            content: caseStudy.testimonial_text,
            author: caseStudy.testimonial_author
        } : null);

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
            <div className="flex min-h-screen flex-col bg-white">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <main className="flex-grow pt-8 pb-16">
                    <div className="container mx-auto px-6 max-w-7xl">
                        {/* Navigation Bar */}
                        <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                            <Link
                                href={`/${lang}/success-stories`}
                                className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#D83484] transition-colors font-outfit text-xs font-bold uppercase tracking-widest"
                            >
                                <ArrowLeft size={14} />
                                <span>{dict.home.caseDetail.backLink}</span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                                    {dict.home.caseDetail.share}
                                </span>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-zinc-400 hover:text-[#D83484] transition-colors"
                                >
                                    <FaLinkedinIn size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Title Section */}
                        <header className="mb-10">
                            <div className="flex items-center gap-2 text-[#D83484] font-black tracking-widest uppercase text-[9px] mb-3 font-outfit">
                                <span>{caseStudy.client_name}</span>
                                <span className="text-zinc-200">•</span>
                                <span>{caseStudy.industry}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-zinc-900 font-outfit tracking-tighter leading-none lg:max-w-4xl not-italic">
                                {caseStudy.title}
                            </h1>
                        </header>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 items-start">
                            <div className="lg:col-span-8 space-y-16">
                                {summary && (
                                    <section id="summary" className="relative group">
                                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D83484] to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block" />
                                        <article className="prose prose-zinc max-w-none">
                                            <p className="text-xl md:text-2xl text-zinc-900 font-outfit font-medium leading-[1.8] tracking-tight">
                                                {summary}
                                            </p>
                                        </article>
                                    </section>
                                )}

                                {challenge && (
                                    <section id="challenge">
                                        <h2 className="text-sm font-bold font-outfit text-[#D83484] mb-3 uppercase tracking-widest not-italic">
                                            {dict.home.caseDetail.challenge}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:text-zinc-500 prose-p:font-normal prose-p:font-outfit">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{challenge}</ReactMarkdown>
                                        </article>
                                    </section>
                                )}

                                {solution && (
                                    <section id="solution">
                                        <h2 className="text-sm font-bold font-outfit text-[#D83484] mb-3 uppercase tracking-widest not-italic">
                                            {dict.home.caseDetail.solution}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:text-zinc-500 prose-p:font-normal prose-p:font-outfit">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{solution}</ReactMarkdown>
                                        </article>
                                    </section>
                                )}

                                {outcomeImpact && (
                                    <section id="impact">
                                        <h2 className="text-sm font-bold font-outfit text-[#D83484] mb-3 uppercase tracking-widest not-italic">
                                            {isEn ? "BUSINESS IMPACT" : "IMPACTO DE NEGOCIO"}
                                        </h2>
                                        <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-[1.8] prose-p:text-zinc-500 prose-p:font-normal prose-p:font-outfit">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{outcomeImpact}</ReactMarkdown>
                                        </article>
                                    </section>
                                )}

                                {testimonial && (
                                    <section className="pt-16 border-t border-zinc-100">
                                        <div className="relative p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                                            <span className="absolute -top-6 left-10 text-6xl text-[#D83484] font-serif leading-none italic select-none">&ldquo;</span>
                                            <p className="text-xl md:text-2xl text-zinc-900 font-outfit italic font-light leading-[1.8] mb-6 relative z-10">
                                                {testimonial.content || testimonial.content_es || testimonial.content_en}
                                            </p>
                                            {(testimonial.author || testimonial.author_name) && (
                                                <div className="flex items-center gap-4">
                                                    <div className="h-px w-8 bg-[#D83484]" />
                                                    <span className="text-zinc-900 font-bold font-outfit uppercase tracking-widest text-[10px]">
                                                        {testimonial.author || testimonial.author_name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-10">
                                {/* Key Metrics - only rendered when data exists */}
                                {hasMetrics && (
                                    <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 flex flex-col items-center text-center">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8">
                                            {dict.home.caseDetail.metrics}
                                        </h3>
                                        <div className="space-y-10 w-full">
                                            {metrics.map((m: any, i: number) => (
                                                <div key={i} className="flex flex-col border-b border-zinc-100 pb-8 last:border-0 last:pb-0">
                                                    <span className="text-5xl font-bold font-outfit tracking-tighter mb-2 text-zinc-900">{m.value}</span>
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{m.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {caseStudy.image_url && (
                                    <div className="relative aspect-[16/10] bg-zinc-100 rounded-[2.5rem] overflow-hidden border border-zinc-200">
                                        <Image src={caseStudy.image_url} alt={caseStudy.title} fill className="object-cover" />
                                    </div>
                                )}

                                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-10">
                                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8 text-center border-b border-zinc-50 pb-4">
                                        {dict.home.caseDetail.techStack}
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {caseStudy.tags && caseStudy.tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-600 text-[10px] font-bold font-outfit uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-10">
                                        <Link
                                            href={`/${lang}/contact`}
                                            className="flex items-center justify-center w-full py-6 bg-[#D83484] text-white rounded-2xl font-bold font-outfit uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform"
                                        >
                                            <span>{dict.home.caseDetail.cta}</span>
                                        </Link>
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

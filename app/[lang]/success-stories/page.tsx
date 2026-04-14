import React from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionaries';
import { createAdminClient } from '@/lib/supabase-server';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import Footer from '@/components/layout/Footer';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import PortfolioFilters from '@/components/portfolio/PortfolioFilters';
import { MAP_OLD_INDUSTRY } from '@/lib/case-constants';
import { Calendar } from 'lucide-react';
import ScheduleButton from '@/components/ui/ScheduleButton';
import PortfolioTracker from '@/components/portfolio/PortfolioTracker';

interface CaseStudy {
    id: string;
    title: string;
    client_name: string;
    summary: string;
    tags: string[];
    image_url: string | null;
    is_published: boolean;
    created_at: string;
    slug: string;
    industry?: string;
    services?: string[];
    results_metrics?: any[];
}

export default async function SuccessStoriesPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    noStore();
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const supabase = createAdminClient();
    const isEn = params.lang === 'en';

    const [{ data: rawCases, error: caseError }, { data: stacks }] = await Promise.all([
        (async () => {
            try {
                // Try full select first
                const res = await supabase
                    .from('case_studies')
                    .select('*')
                    .eq('is_published', true)
                    .order('sort_order', { ascending: true });
                if (res.error) throw res.error;
                return res;
            } catch (e: any) {
                console.warn('Frontend query error, trying safe fallback:', e.message);
                // Fallback 1: Try without sort_order if it failed on that
                // Fallback 2: Try without multilingual columns if it failed on those
                const res = await supabase
                    .from('case_studies')
                    .select('id, title, client_name, summary, image_url, is_published, slug, industry, services, tags, results_metrics, created_at, sort_order')
                    .eq('is_published', true)
                    .order('sort_order', { ascending: true })
                    .order('created_at', { ascending: false });

                return res;
            }
        })(),
        supabase
            .from('tech_stacks')
            .select('id, name')
    ]);

    const stackMap: Record<string, string> = {};
    (stacks || []).forEach(s => {
        stackMap[s.id] = s.name;
    });



    // Process metadata for filtering
    const casesWithMeta = (rawCases || []).map((c: any) => {
        let services = c.services || [];
        if (Array.isArray(c.results_metrics)) {
            const meta = c.results_metrics.find((m: any) => m.label === '__METADATA__');
            if (meta && meta.value) {
                try {
                    const parsed = JSON.parse(meta.value);
                    if (parsed.services) services = parsed.services;
                } catch (e) { }
            }
        }

        // Normalize industry for filtering
        const rawIndustry = c.industry || '';
        const industry = MAP_OLD_INDUSTRY[rawIndustry] || rawIndustry;

        // Resolve tag IDs to names
        const resolvedTags = (c.tags || []).map((tag: string) => stackMap[tag] || tag);

        const title = isEn ? (c.title_en || c.title) : (c.title_es || c.title);
        const summary = isEn ? (c.summary_en || c.summary) : (c.summary_es || c.summary);

        return { ...c, title, summary, services, industry, tags: resolvedTags };
    });

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <PortfolioTracker />
            <main className="flex-grow pt-8 pb-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* Header Section */}
                    <header className="mb-14 pb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 text-brand text-[10px] font-black tracking-[0.2em] uppercase mb-4">
                            <TrendingUp size={14} />
                            <span>Business Impact</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-zinc-900 mb-6 font-outfit tracking-tighter leading-tight lg:max-w-4xl not-italic">
                            {dict.home.portfolio.headline}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-400 font-outfit font-light leading-relaxed max-w-3xl">
                            {dict.home.portfolio.subheadline}
                        </p>
                    </header>

                    {/* Interactive Filter Grid */}
                    <PortfolioFilters
                        initialCases={casesWithMeta}
                        lang={params.lang}
                        dict={dict}
                    />

                    {/* Global CTA Section - Restored Image Background with New Border Radius */}
                    <footer className="mt-32">
                        <div className="relative rounded-[1.2rem] overflow-hidden min-h-[500px] flex items-center justify-center p-8 md:p-24 group">
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/consultation_cta_bg.png"
                                    alt="Consultation Background"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                />
                                {/* Brand Overlay - #a04c97 at 30% + Dark Base */}
                                <div className="absolute inset-0 bg-zinc-950/60" />
                                <div className="absolute inset-0 bg-[#a04c97]/25" />
                            </div>

                            <div className="relative z-10 max-w-4xl space-y-8 text-center flex flex-col items-center">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit tracking-tighter leading-tight text-white drop-shadow-lg">
                                    {isEn ? 'Ready to build your own success story?' : '¿Listo para construir tu propia historia de éxito?'}
                                </h2>
                                <p className="text-white text-lg md:text-xl font-outfit font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                                    {isEn
                                        ? "Let's transform your technical challenges into a competitive advantage with our senior engineering team."
                                        : 'Transformemos tus desafíos técnicos en una ventaja competitiva con nuestro equipo de ingeniería senior.'}
                                </p>
                                <div className="pt-4">
                                    <ScheduleButton
                                        text={isEn ? 'Start Your Project' : 'Iniciar Proyecto'}
                                        className="shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
            <Footer dict={dict} lang={params.lang} />
        </div>
    );
}

import React from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionaries';
import { createAdminClient } from '@/lib/supabase-server';
import Footer from '@/components/layout/Footer';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import PortfolioFilters from '@/components/portfolio/PortfolioFilters';
import { MAP_OLD_INDUSTRY } from '@/lib/case-constants';
import { Calendar } from 'lucide-react';
import ScheduleButton from '@/components/ui/ScheduleButton';

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
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const supabase = createAdminClient();
    const isEn = params.lang === 'en';

    const [{ data: rawCases }, { data: stacks }] = await Promise.all([
        supabase
            .from('case_studies')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false }),
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

        return { ...c, services, industry, tags: resolvedTags };
    });

    return (
        <div className="flex min-h-screen flex-col bg-white">
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

                    {/* Global CTA Section */}
                    <footer className="mt-32">
                        <div className="relative rounded-[3rem] overflow-hidden min-h-[600px] flex items-center p-8 md:p-24 group">
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/consultation_cta_bg.png"
                                    alt="Consultation Background"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                />
                                {/* Brand Overlay - #a04c97 at 20% + Dark Base */}
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
                    </footer>
                </div>
            </main>
            <Footer dict={dict} lang={params.lang} />
        </div>
    );
}

import React from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionaries';
import { createAdminClient } from '@/lib/supabase-server';
import Footer from '@/components/layout/Footer';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import PortfolioFilters from '@/components/portfolio/PortfolioFilters';
import { MAP_OLD_INDUSTRY } from '@/lib/case-constants';

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

    const { data: rawCases, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });



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

        return { ...c, services, industry };
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
                        <div className="bg-zinc-900 rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden text-white border border-white/5">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 space-y-8">
                                <h2 className="text-4xl lg:text-7xl font-black font-outfit tracking-tighter leading-none">
                                    {isEn ? 'Ready to Scale?' : '¿Listo para Escalar?'}
                                </h2>
                                <p className="text-zinc-400 text-xl lg:text-2xl font-outfit font-light max-w-2xl mx-auto leading-relaxed">
                                    {isEn
                                        ? 'Integrate an AI-augmented squad and transform your roadmap into velocity.'
                                        : 'Integra un squad aumentado por IA y transforma tu roadmap en velocidad.'}
                                </p>
                                <div className="pt-8">
                                    <Link
                                        href={`/${params.lang}/contact`}
                                        className="inline-block px-12 py-6 bg-brand text-white rounded-2xl font-black font-outfit tracking-tight hover:scale-105 transition-all uppercase text-sm not-italic shadow-xl shadow-brand/20"
                                    >
                                        {isEn ? 'Start Your Project' : 'Iniciar tu Proyecto'}
                                    </Link>
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

import React from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionaries';
import { createAdminClient } from '@/lib/supabase-server';
import Footer from '@/components/layout/Footer';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

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
}

export default async function SuccessStoriesPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const supabase = createAdminClient();
    const isEn = params.lang === 'en';

    const { data: cases, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <main className="flex-grow pt-6 pb-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-zinc-100 pb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 text-[#D83484] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                            <TrendingUp size={14} />
                            <span>Business Impact</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3 font-outfit tracking-tighter leading-tight lg:max-w-4xl not-italic">
                            {dict.home.portfolio.headline}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-400 font-outfit font-light leading-relaxed max-w-3xl">
                            {dict.home.portfolio.subheadline}
                        </p>
                    </header>

                    {/* Grid Section */}
                    {error || !cases || cases.length === 0 ? (
                        <div className="text-center py-32 bg-zinc-50 rounded-[3rem] border border-zinc-100">
                            <p className="text-zinc-400 text-lg font-outfit">{isEn ? 'No success stories found yet. Check back soon!' : 'No se encontraron historias de éxito. ¡Vuelve pronto!'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {cases.map((caseStudy: CaseStudy) => (
                                <Link
                                    key={caseStudy.id}
                                    href={`/${params.lang}/success-stories/${caseStudy.slug || caseStudy.id}`}
                                    className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden hover:border-[#D83484]/30 transition-all duration-500"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <Image
                                            src={caseStudy.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}
                                            alt={caseStudy.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-10 flex-1 flex flex-col">
                                        <span className="text-[#D83484] font-black tracking-widest uppercase text-[10px] mb-4 font-outfit">
                                            {caseStudy.client_name}
                                        </span>
                                        <h3 className="text-2xl font-black text-zinc-900 mb-6 group-hover:text-[#D83484] transition-colors leading-tight font-outfit tracking-tight">
                                            {caseStudy.title}
                                        </h3>
                                        <p className="text-zinc-500 font-outfit font-light leading-relaxed mb-10 flex-1 line-clamp-3">
                                            {caseStudy.summary}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-50">
                                            {caseStudy.tags && caseStudy.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-1.5 bg-zinc-50 text-zinc-400 text-[10px] font-bold rounded-full border border-zinc-100 font-outfit"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Global CTA Section */}
                    <footer className="mt-20">
                        <div className="bg-zinc-900 rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden text-white">
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
                                        className="inline-block px-12 py-6 bg-[#D83484] text-white rounded-2xl font-black font-outfit tracking-tight hover:opacity-90 transition-opacity uppercase text-sm not-italic"
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

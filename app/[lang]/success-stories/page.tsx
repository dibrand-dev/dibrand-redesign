import React from 'react';
import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase-server';
import { getDictionary } from '@/lib/dictionaries';

interface CaseStudy {
    id: string;
    title: string;
    client_name: string;
    summary: string;
    tags: string[];
    image_url: string | null;
    is_published: boolean;
    created_at: string;
}

export default async function SuccessStoriesPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const supabase = createAdminClient();

    const { data: cases, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-white pt-24">
            {/* Internal Header */}
            <section className="bg-gray-50 py-20 lg:py-32 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl lg:text-7xl font-bold text-corporate-grey font-heading mb-6 animate-fade-in">
                            Success Stories
                        </h1>
                        <p className="text-xl text-corporate-grey/60 leading-relaxed max-w-2xl">
                            Discover how we help leading companies scale their tech teams and transform their digital presence with cutting-edge solutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    {error || !cases || cases.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed">
                            <p className="text-corporate-grey/40 text-lg">No case studies found yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                            {cases.map((caseStudy: CaseStudy) => (
                                <div
                                    key={caseStudy.id}
                                    className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={caseStudy.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}
                                            alt={caseStudy.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    <div className="p-8 lg:p-10 flex-1 flex flex-col">
                                        <span className="text-[#D83484] font-bold tracking-widest uppercase text-xs mb-3">
                                            {caseStudy.client_name}
                                        </span>
                                        <h3 className="text-2xl font-bold text-corporate-grey mb-4 group-hover:text-primary transition-colors leading-tight">
                                            {caseStudy.title}
                                        </h3>
                                        <p className="text-corporate-grey/60 leading-relaxed mb-8 flex-1">
                                            {caseStudy.summary}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50">
                                            {caseStudy.tags && caseStudy.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-1.5 bg-gray-50 text-corporate-grey/70 text-xs font-semibold rounded-full border border-gray-100"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <div className="bg-corporate-grey rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to be our next success story?</h2>
                            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">Let's build something amazing together. Contact us today to discuss your project.</p>
                            <button className="px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                                Start Your Project
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

import React from 'react';
import { Metadata } from 'next';
import { supabase } from "@/lib/supabase";
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import JoinOurTeam from "@/components/staff-augmentation/JoinOurTeam";

export async function generateMetadata(props: { params: Promise<{ lang: "en" | "es" }> }): Promise<Metadata> {
    const params = await props.params;
    const isEn = params.lang === 'en';

    return {
        title: isEn ? 'Careers | Join the Dibrand Team' : 'Carreras | Únete al equipo de Dibrand',
        description: isEn
            ? 'Explore career opportunities at Dibrand. Join a world-class team of engineers, designers, and product managers.'
            : 'Explora oportunidades de carrera en Dibrand. Únete a un equipo de clase mundial de ingenieros, diseñadores y product managers.',
    };
}

export default async function CareersPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);

    // Fetch active job openings with bilingual support - STRICT WHITELIST FOR PUBLIC VIEW
    let jobs: any[] | null = null;
    try {
        const { data, error } = await supabase
            .from('job_openings')
            .select(`
                id, slug,
                title, title_es, title_en,
                location, location_es, location_en,
                industry, 
                seniority, 
                modality,
                employment_type
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        jobs = data;
    } catch (e) {
        console.warn('Job query failed:', e);
        jobs = [];
    }

    return (
        <div className="flex min-h-screen flex-col bg-white pt-20">
            {/* Join Our Team Section as the Main Content */}
            <JoinOurTeam
                jobs={jobs || []}
                lang={params.lang}
                dict={dict.joinOurTeam}
            />

            {/* Extra Section: Why Dibrand? (Compact & Flat) */}
            <section className="bg-slate-50 py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold text-zinc-900 mb-4 font-outfit">Remote First</h3>
                            <p className="text-zinc-500 font-outfit font-light leading-relaxed">
                                Work from anywhere in the world with a flexible schedule that respects your life.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold text-zinc-900 mb-4 font-outfit">Cutting-edge Tech</h3>
                            <p className="text-zinc-500 font-outfit font-light leading-relaxed">
                                Modern stacks, AI-driven workflows, and innovative projects that push boundaries.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold text-zinc-900 mb-4 font-outfit">Growth Culture</h3>
                            <p className="text-zinc-500 font-outfit font-light leading-relaxed">
                                Mentorship, challenging roadmaps, and a team that values your personal development.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer dict={dict} lang={params.lang} />
        </div>
    );
}

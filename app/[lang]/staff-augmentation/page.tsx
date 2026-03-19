import React from 'react';
import Image from 'next/image';
import {
    Clock,
    UserCheck,
    Heart,
    Shield,
    Zap,
    Users,
    Target,
} from 'lucide-react';
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import FinalQuote from "@/components/ui/FinalQuote";
import ScheduleButton from "@/components/ui/ScheduleButton";
import TrustedBySection from "@/components/home/TrustedBySection";
import { supabase } from "@/lib/supabase";

import { Metadata } from 'next';
import StaffingServices from "@/components/staff-augmentation/StaffingServices";
import StaffAugHero from "@/components/staff-augmentation/StaffAugHero";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isEs = lang === 'es';
    
    return {
        title: isEs ? "Senior Staff Augmentation | Dibrand" : "Senior Staff Augmentation | Dibrand",
        description: isEs 
            ? "Escala tu equipo con talento senior pre-validado y bilingüe. Nuestra solución de Staff Augmentation integra ingenieros expertos en tu equipo en semanas."
            : "Scale your team with pre-vetted, bilingual senior talent. Our Staff Augmentation solution integrates expert engineers into your team in weeks.",
        openGraph: {
            title: "Senior Staff Augmentation | Dibrand",
            description: isEs 
                ? "Integración de talento técnico senior y nativo en IA para acelerar tu roadmap."
                : "Integration of senior, AI-native technical talent to accelerate your roadmap.",
        }
    };
}

export default async function StaffAugmentationPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const content = dict.staffAugmentation;

    // Fetch brands for social proof
    const { data: rawBrands } = await supabase
        .from('brands')
        .select('id, name, logo_url')
        .eq('is_visible', true);

    const brands = (rawBrands || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        logo_url: b.logo_url
    }));


    const wayIcons = [Clock, UserCheck, Heart];
    const pillarIcons = [Shield, Users, Zap, Target];
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": content.hero.title,
        "provider": {
            "@type": "Organization",
            "name": "Dibrand",
            "url": "https://dibrand.co"
        },
        "description": `${content.hero.subtitle1} ${content.hero.subtitle2}`,
        "areaServed": "Global",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Staff Augmentation Services",
            "itemListElement": content.pillars.items.map((b: any) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": b.title,
                    "description": b.desc
                }
            }))
        }
    };

    return (
        <div className="bg-white overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero Section - Elevated with Background Image */}
            <StaffAugHero dict={content} lang={params.lang} />

            {/* Detailed Section (The "What is") - Compact & Unified */}
            <section className="bg-white pt-12 pb-2">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 font-outfit tracking-tight">
                            {content.whatIs.title}
                        </h2>
                        <p className="text-lg md:text-xl text-zinc-500 font-outfit font-light leading-relaxed">
                            {content.whatIs.content}
                        </p>
                    </div>
                </div>
            </section>

            {/* New Staffing Services Section */}
            <StaffingServices dict={content.services} />

            {/* Client Trust Section */}
            <TrustedBySection brands={brands} dict={dict} />

            {/* The Dibrand Way - Confidence Block - Compact */}
            <section className="py-16 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(216,52,132,0.15),transparent_70%)]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-outfit tracking-tight">
                            {content.theDibrandWay.title}
                        </h2>
                        <p className="text-xl text-slate-400 font-outfit font-light">
                            Por qué nuestro staffing marca la diferencia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {content.theDibrandWay.items.map((item, idx) => {
                            const Icon = wayIcons[idx] || Heart;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-brand group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand group-hover:text-white">
                                        <Icon size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-6 font-outfit">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-400 font-outfit font-light leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4 Pillars Grid - Pure Seniority, Tech Alignment, Speed to Value, Boutique Quality */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content.pillars.items.map((pillar: any, idx: number) => {
                            const Icon = pillarIcons[idx] || Shield;
                            return (
                                <div key={idx} className="flex flex-col p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand transition-colors duration-500">
                                        <Icon size={28} className="text-brand group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 mb-4 font-outfit uppercase tracking-tight">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-zinc-500 font-outfit font-light leading-relaxed text-sm">
                                        {pillar.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* High Impact Closing Phrase */}
            <FinalQuote text={content.pillars.lema} />

            <Footer dict={dict} lang={params.lang} />
        </div>
    );
}


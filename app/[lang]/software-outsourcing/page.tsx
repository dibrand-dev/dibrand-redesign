import React from 'react';
import {
    Shield,
    Users,
    Zap,
    Target,
} from 'lucide-react';
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import SoftwareOutsourcingHero from "@/components/software-outsourcing/SoftwareOutsourcingHero";
import TrustedBySection from "@/components/home/TrustedBySection";
import { supabase } from "@/lib/supabase";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isEs = lang === 'es';
    
    return {
        title: isEs ? "Software Outsourcing | Dibrand" : "Software Outsourcing | Dibrand",
        description: isEs 
            ? "Construimos tu producto de punta a punta. Ingeniería autónoma con entrega garantizada para que puedas enfocarte en escalar."
            : "We build your product from end to end. Autonomous engineering with guaranteed delivery so you can focus on scaling.",
        openGraph: {
            title: "Software Outsourcing | Dibrand",
            description: isEs 
                ? "Delegá el desarrollo, tomá el resultado. Equipos de ingeniería de clase mundial."
                : "Delegate the development, own the results. World-class engineering teams.",
        }
    };
}

export default async function SoftwareOutsourcingPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const content = dict.softwareOutsourcing;

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
        "description": content.hero.subtitle,
        "areaServed": "Global",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Software Outsourcing Services",
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
            {/* Hero Section */}
            <SoftwareOutsourcingHero dict={content} lang={params.lang} />

            {/* Social Proof Section */}
            <TrustedBySection brands={brands} />

            {/* 4 Pillars Grid */}
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

                    {/* High Impact Closing Phrase */}
                    <div className="mt-24 text-center max-w-4xl mx-auto pb-8">
                        <div className="inline-block h-px w-24 bg-gradient-to-r from-transparent via-brand to-transparent mb-12 opacity-30" />
                        <p className="text-2xl md:text-3xl text-zinc-900 font-outfit font-medium italic leading-tight tracking-tight px-4">
                            &ldquo;{content.pillars.lema}&rdquo;
                        </p>
                        <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-brand to-transparent mx-auto opacity-30" />
                    </div>
                </div>
            </section>

            <Footer dict={dict} lang={params.lang} />
        </div>
    );
}

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
            <TrustedBySection brands={brands} dict={dict} />

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

            {/* Nuestra Metodología (How we work) */}
            <section className="py-20 bg-[#F9FAFB] relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 font-outfit uppercase tracking-tight">
                            {content.process.title}
                        </h2>
                        <p className="text-zinc-500 font-outfit font-light max-w-2xl mx-auto">
                            {content.process.subtitle}
                        </p>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
                        {/* Desktop Connector Lines */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-brand/20 via-brand/40 to-brand/20 z-0" />

                        {content.process.steps.map((step, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-full bg-white border border-brand/10 shadow-lg shadow-brand/5 flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500">
                                    <span className="text-3xl font-black font-outfit text-brand">
                                        0{idx + 1}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-4 font-outfit">
                                    {step.title}
                                </h3>
                                <p className="text-zinc-500 font-outfit font-light leading-relaxed text-sm md:text-base px-4">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nuestras Especialidades (Technical Specialties) */}
            <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4 font-outfit uppercase tracking-tight">
                            {content.specialties.title}
                        </h2>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                        {content.specialties.items.map((item: string, idx: number) => (
                            <div key={idx} className="px-6 py-3 rounded-full bg-slate-50 border border-slate-200 text-xs md:text-sm font-bold text-zinc-600 tracking-widest hover:bg-white hover:shadow-lg hover:shadow-brand/5 hover:border-brand/30 hover:text-brand transition-all duration-300 transform hover:-translate-y-1">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* High Impact Closing Phrase */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 flex flex-col items-center">
                    <div className="inline-block h-px w-24 bg-gradient-to-r from-transparent via-brand to-transparent mb-12 opacity-30" />
                    <p className="text-2xl md:text-3xl text-zinc-900 font-outfit font-medium italic leading-tight tracking-tight px-4 text-center">
                        &ldquo;{content.pillars.lema}&rdquo;
                    </p>
                    <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-brand to-transparent mx-auto opacity-30" />
                </div>
            </section>

            <Footer dict={dict} lang={params.lang} />
        </div>
    );
}

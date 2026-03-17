import React from 'react';
import { getDictionary } from "@/lib/dictionaries";
import { Metadata } from 'next';
import Footer from "@/components/layout/Footer";
import SoftwareDevHero from "@/components/software-development/SoftwareDevHero";
import SoftwareDevServices from "@/components/software-development/SoftwareDevServices";
import SoftwareDevAdvantage from "@/components/software-development/SoftwareDevAdvantage";
import SoftwareDevCta from "@/components/software-development/SoftwareDevCta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isEs = lang === 'es';
    
    return {
        title: isEs ? "Ingeniería de Software de Clase Mundial | Dibrand" : "World-Class Software Engineering | Dibrand",
        description: isEs 
            ? "Desarrollo de software de alto impacto impulsado por IA. Talento senior del top 3% en LATAM para soluciones escalables."
            : "High-impact software development powered by AI. Senior top 3% LATAM talent for scalable solutions.",
    };
}

export default async function SoftwareDevelopmentPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const content = dict.softwareDevelopment;

    return (
        <main className="bg-white overflow-x-hidden">
            {/* 1. Hero Section */}
            <SoftwareDevHero dict={content.hero} />

            {/* 2. Core Services Grid */}
            <SoftwareDevServices dict={content.services} />

            {/* 3. The Dibrand Advantage */}
            <SoftwareDevAdvantage dict={content.advantage} />

            {/* 4. Final CTA */}
            <SoftwareDevCta dict={content.finalCta} />

            {/* Footer */}
            <Footer dict={dict} lang={params.lang} />
        </main>
    );
}

import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import EliteTalent from '@/components/about/EliteTalent';
import AiNativeCulture from '@/components/about/AiNativeCulture';
import MinimalStats from '@/components/about/MinimalStats';

interface Props {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'es' ? 'Sobre Dibrand | Propósito y Valor' : 'About Dibrand | Purpose & Value',
        description: lang === 'es' 
            ? 'Conoce la visión de Dibrand, la boutique de ingeniería de software de élite impulsada por IA.'
            : 'Discover the vision of Dibrand, the elite AI-driven software engineering boutique.',
        openGraph: {
            title: lang === 'es' ? 'Sobre Dibrand | Propósito y Valor' : 'About Dibrand | Purpose & Value',
            images: ['/images/about-hero.png']
        }
    };
}

export default async function AboutPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.about;

    return (
        <div className="bg-white min-h-screen">
            <main>
                {/* 1. Impact Hero */}
                <AboutHero 
                    dict={content.hero} 
                    imagePath="/images/about-hero.png" 
                />

                {/* 2. Trust Stats - Minimalist Design */}
                <MinimalStats dict={dict.home.stats} />

                {/* 3. The Elite 3% Selection Process */}
                <EliteTalent 
                    dict={content.eliteTalent} 
                    imagePath="/images/elite-talent.png" 
                />

                {/* 4. AI-Native Culture Section */}
                <AiNativeCulture 
                    dict={content.aiNative} 
                    imagePath="/images/ai-culture.png" 
                />

                {/* Closing CTA Section (Brief) */}
                <section className="py-24 bg-white text-center">
                    <div className="container mx-auto px-6 max-w-2xl">
                        <div className="h-px w-24 bg-brand mx-auto mb-10" />
                        <h3 className="text-2xl md:text-3xl font-outfit font-medium text-zinc-900 leading-tight mb-8 italic">
                            {lang === 'es' 
                                ? '"No construimos software para el hoy, diseñamos arquitecturas para el impacto del mañana."'
                                : '"We don\'t build software for today, we design architectures for tomorrow\'s impact."'}
                        </h3>
                        <div className="h-px w-24 bg-brand mx-auto" />
                    </div>
                </section>
            </main>
            
            <Footer dict={dict} lang={lang} />
        </div>
    );
}

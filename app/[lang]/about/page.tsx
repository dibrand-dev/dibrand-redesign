import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import EliteTalent from '@/components/about/EliteTalent';
import AiNativeCulture from '@/components/about/AiNativeCulture';
import MinimalStats from '@/components/about/MinimalStats';
import BrandValues from '@/components/about/BrandValues';
import FinalQuote from '@/components/ui/FinalQuote';

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
                    imagePath="/images/talent.png" 
                />

                {/* 4. AI-Native DNA Section */}
                <AiNativeCulture 
                    dict={content.aiNative} 
                    imagePath="/images/ai-culture.png" 
                />

                {/* 5. Values in Action (Impact Pillars) */}
                <BrandValues dict={content.values} />

                {/* Closing Phrase (Refined) */}
                <FinalQuote 
                    text={content.lemaLine1} 
                    text2={content.lemaLine2} 
                    variant="about" 
                />
            </main>
            
            <Footer dict={dict} lang={lang} />
        </div>
    );
}

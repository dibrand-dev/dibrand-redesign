import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from "@/lib/dictionaries";
import SolutionsHero from "@/components/solutions/SolutionsHero";
import SolutionsByCategory from "@/components/solutions/SolutionsByCategory";
import Footer from "@/components/layout/Footer";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isEs = lang === 'es';
    
    return {
        title: isEs ? "Nuestras Soluciones | Dibrand engineering" : "Our Solutions | Dibrand engineering",
        description: isEs 
            ? "Explora nuestras capacidades en desarrollo de software, QA, Cloud e IA para escalar tu producto digital."
            : "Explore our software development, QA, Cloud, and AI capabilities to scale your digital product.",
    };
}

export default async function SolutionsPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const content = dict.solutions;

    return (
        <main className="bg-white overflow-x-hidden">
            {/* 1. Hero Section */}
            <SolutionsHero dict={content.hero} />

            {/* 2. Solutions by Category */}
            <SolutionsByCategory categories={content.categories} />

            {/* Footer */}
            <Footer dict={dict} lang={params.lang} />
        </main>
    );
}

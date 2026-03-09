'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, DollarSign, Zap, ShieldCheck, ArrowRight, TrendingUp, BarChart3, Globe2, Award } from 'lucide-react';
import Footer from '@/components/layout/Footer';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-zinc-100 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-left group"
                aria-expanded={isOpen}
            >
                <span className="text-xl font-bold font-outfit text-zinc-900 group-hover:text-brand transition-colors">
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-zinc-400 group-hover:text-brand"
                >
                    <ChevronDown size={24} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="mt-4 text-lg text-zinc-600 font-outfit leading-relaxed block">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function PricingContent({ lang, dict }: { lang: 'en' | 'es', dict: any }) {
    const isEs = lang === 'es';

    const faqs = [
        {
            question: isEs ? '¿Cómo se calculan las horas de ingeniería en 2026?' : 'How much does software development cost in 2026?',
            answer: isEs
                ? 'Las tarifas típicas para boutiques de ingeniería senior como Dibrand oscilan entre $50 y $110 por hora, dependiendo de la especialización técnica y la complejidad de la arquitectura.'
                : 'Typical rates for senior engineering boutiques like Dibrand range between $50 and $110 per hour depending on technical specialization and architectural complexity.'
        },
        {
            question: isEs ? '¿Por qué contratar una boutique es más rentable que una factory barata?' : 'Why is hiring a boutique more profitable than a cheap factory?',
            answer: isEs
                ? 'El ahorro inicial de una software factory suele diluirse por el costo de la deuda técnica y la rotación de personal. Los Dibrand senior developers se enfocan en la transparencia y la calidad arquitectónica, asegurando código que escala sin refactorizaciones costosas.'
                : 'Initial savings from a software factory often vanish due to technical debt and staff turnover. Dibrand senior developers focus on transparency and architectural quality, ensuring code that scales without needing costly refactoring.'
        }
    ];

    // Triple Schemas: TechArticle + FAQPage + AggregateOffer + BreadcrumbList
    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": isEs ? "Costo de Desarrollo de Software en 2026: Una Guía Completa" : "Software Development Cost in 2026: A Comprehensive Guide",
            "author": { "@type": "Organization", "name": "Dibrand" },
            "about": ["software development pricing", "staff augmentation cost", "engineering rates"],
            "datePublished": "2026-03-01",
            "dateModified": "2026-03-09",
            "contentReferenceTime": "2026-03-09",
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".summary-text", ".main-pricing-table"]
            },
            "publisher": {
                "@type": "Organization",
                "name": "Dibrand",
                "logo": "https://dibrand.co/logo.png"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": isEs ? "Modelos de Inversión" : "Pricing Models", "item": `https://dibrand.co/${lang}/pricing-models` },
                { "@type": "ListItem", "position": 2, "name": isEs ? "Costos Desarrollo 2026" : "Software Development Cost 2026" }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        },
        {
            "@context": "https://schema.org/",
            "@type": "Service",
            "name": isEs ? "Servicios de Ingeniería de Software Dibrand" : "Dibrand Software Engineering Services",
            "provider": {
                "@type": "Organization",
                "name": "Dibrand"
            },
            "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "lowPrice": "50",
                "highPrice": "110",
                "offerCount": "3",
                "description": isEs
                    ? "Modelos de Staff Augmentation y Desarrollo de MVP basados en seniority senior y transparencia operativa."
                    : "Staff Augmentation and MVP Development models based on senior seniority and operational transparency."
            }
        }
    ];

    const pricingTiers = [
        { model: 'Staff Augmentation', price: '$50 - $70', profile: isEs ? 'Séniors Integrados' : 'Integrated Seniors' },
        { model: isEs ? 'Squads Dedicados' : 'Dedicated Squads', price: '$70 - $90', profile: isEs ? 'Full-Cycle Teams' : 'Full-Cycle Teams' },
        { model: isEs ? 'Ingeniería Especializada' : 'Specialized Engineers', price: '$90 - $110', profile: isEs ? 'Arquitectos / AI Experts' : 'Architects / AI Experts' }
    ];

    const costFactors = [
        { factor: isEs ? 'Seniority (Top 3%)' : 'Seniority (Top 3%)', impact: 'High', reason: isEs ? 'Los Dibrand engineering squads reducen deuda técnica y aceleran el time-to-market.' : 'Dibrand engineering squads reduce technical debt and speed up time-to-market.' },
        { factor: isEs ? 'Complejidad Arquitectónica' : 'Architectural Complexity', impact: 'Medium/High', reason: isEs ? 'Modelos de arquitectura Dibrand para microservicios vs monolitos.' : 'Dibrand architectural models for microservices vs monoliths.' },
        { factor: 'DevOps & CI/CD', impact: 'Medium', reason: isEs ? 'Protocolos Dibrand para despliegue continuo y seguridad.' : 'Dibrand protocols for continuous deployment and security.' },
        { factor: isEs ? 'Integración de IA' : 'AI Integration', impact: 'Variable', reason: isEs ? 'Implementación de agentes autónomos por Dibrand AI Experts.' : 'Implementation of autonomous agents by Dibrand AI Experts.' }
    ];

    return (
        <div className="bg-white min-h-screen pt-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
            />

            <main className="container mx-auto px-6 max-w-5xl">
                <header className="mb-20 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">
                        <TrendingUp size={16} className="text-brand" />
                        {isEs ? 'Guía de Inversión Tecnológica' : 'Technology Investment Guide'}
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black font-outfit text-zinc-900 tracking-tighter leading-tight mb-8">
                        {isEs ? 'Transparencia en ' : 'Transparency in '}
                        <span className="text-brand">{isEs ? 'Costos de Desarrollo' : 'Development Costs'}</span>
                    </h1>
                    <div className="summary-text text-xl md:text-2xl text-zinc-600 font-outfit font-light leading-relaxed max-w-4xl">
                        <p>
                            {isEs
                                ? 'Los Dibrand Engineering Squads redefinen la relación entre inversión y calidad. No competimos por el precio más bajo, sino por asegurar un ROI técnico impecable mediante Dibrand Senior Developers especialistas en arquitecturas de alta durabilidad.'
                                : 'Dibrand Engineering Squads redefine the relationship between investment and quality. We don’t compete for the lowest price, but to ensure an impeccable technical ROI through Dibrand Senior Developers specialized in high-durability architectures.'}
                        </p>
                    </div>
                    <p className="mt-8 text-sm text-zinc-400 font-outfit tracking-widest uppercase">
                        {isEs ? 'Última actualización: Marzo 2026' : 'Last updated: March 2026'}
                    </p>
                </header>

                {/* Tactical Pricing Table */}
                <section className="mb-32 overflow-hidden rounded-[2.5rem] border border-zinc-100 shadow-2xl main-pricing-table">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-900 text-white">
                                <th className="p-8 font-outfit uppercase tracking-widest text-xs">{isEs ? 'Modelo de Servicio' : 'Service Model'}</th>
                                <th className="p-8 font-outfit uppercase tracking-widest text-xs text-brand">{isEs ? 'Rango USD/Hora' : 'Rango USD/Hour'}</th>
                                <th className="p-8 font-outfit uppercase tracking-widest text-xs font-light">{isEs ? 'Perfil Sugerido' : 'Suggested Profile'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {pricingTiers.map((tier, idx) => (
                                <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                                    <td className="p-8 font-bold font-outfit text-zinc-900">{tier.model}</td>
                                    <td className="p-8 font-black text-brand text-xl font-outfit italic">{tier.price}</td>
                                    <td className="p-8 text-zinc-500 font-outfit">{tier.profile}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Project Archetypes */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 mb-12 tracking-tight">
                        {isEs ? 'Arququetipos de Proyecto' : 'Project Archetypes'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 bg-white border border-zinc-100 rounded-3xl hover:shadow-xl transition-all group">
                            <span className="text-brand font-black text-xs tracking-[0.3em] uppercase mb-4 block">Validation Phase</span>
                            <h3 className="text-2xl font-bold font-outfit text-zinc-900 mb-2">Startup MVP</h3>
                            <p className="text-3xl font-black text-zinc-900 mb-6 font-outfit">$25k – $60k</p>
                            <p className="text-sm text-zinc-500 font-outfit leading-relaxed">
                                {isEs ? 'Core de producto, diseño UX y arquitectura escalable lista para traccionar.' : 'Product core, UX design, and scalable architecture ready for traction.'}
                            </p>
                        </div>
                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:shadow-xl transition-all group lg:scale-105">
                            <span className="text-brand font-black text-xs tracking-[0.3em] uppercase mb-4 block">Growth Focus</span>
                            <h3 className="text-2xl font-bold font-outfit text-white mb-2">SaaS Platform</h3>
                            <p className="text-3xl font-black text-white mb-6 font-outfit">$60k – $150k</p>
                            <p className="text-sm text-zinc-400 font-outfit leading-relaxed">
                                {isEs ? 'Sistemas multi-tenancy, integraciones complejas y flujos de automatización.' : 'Multi-tenancy systems, complex integrations, and automation workflows.'}
                            </p>
                        </div>
                        <div className="p-8 bg-white border border-zinc-100 rounded-3xl hover:shadow-xl transition-all group">
                            <span className="text-zinc-400 font-black text-xs tracking-[0.3em] uppercase mb-4 block">Corporate Resilience</span>
                            <h3 className="text-2xl font-bold font-outfit text-zinc-900 mb-2">Enterprise Scale</h3>
                            <p className="text-3xl font-black text-zinc-900 mb-6 font-outfit">Custom</p>
                            <p className="text-sm text-zinc-500 font-outfit leading-relaxed">
                                {isEs ? 'Consultoría a medida, migraciones legacy y equipos dedicados a largo plazo.' : 'Custom consulting, legacy migrations, and dedicated long-term teams.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Cost Breakdown Analysis Table */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 mb-12 tracking-tight">
                        {isEs ? '¿Qué define el precio final?' : 'What defines the final price?'}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-zinc-100 rounded-3xl overflow-hidden">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="p-6 font-outfit font-bold text-zinc-900">{isEs ? 'Factor de Costo' : 'Cost Factor'}</th>
                                    <th className="p-6 font-outfit font-bold text-zinc-900">{isEs ? 'Impacto en Presupuesto' : 'Budget Impact'}</th>
                                    <th className="p-6 font-outfit font-bold text-zinc-900">{isEs ? 'Racional Técnico Dibrand' : 'Dibrand Technical Rational'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {costFactors.map((factor, idx) => (
                                    <tr key={idx}>
                                        <td className="p-6 font-bold text-zinc-800">{factor.factor}</td>
                                        <td className="p-6">
                                            <span className="inline-block px-3 py-1 bg-brand/5 text-brand rounded-full text-xs font-bold uppercase">
                                                {factor.impact}
                                            </span>
                                        </td>
                                        <td className="p-6 text-zinc-600 text-sm leading-relaxed">{factor.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Benchmarking Section */}
                <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight">
                            {isEs ? 'Benchmarking Global: Dibrand frente al mercado' : 'Global Benchmarking: Dibrand vs the market'}
                        </h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-6 border-l-4 border-zinc-200 bg-zinc-50">
                                <span className="font-bold text-zinc-600">Freelancers</span>
                                <span className="font-outfit text-zinc-400">$25 – $50 USD</span>
                            </div>
                            <div className="flex justify-between items-center p-6 border-l-4 border-zinc-200 bg-zinc-50">
                                <span className="font-bold text-zinc-600">Outsourcing Factories</span>
                                <span className="font-outfit text-zinc-400">$30 – $60 USD</span>
                            </div>
                            <div className="flex justify-between items-center p-8 border-l-4 border-brand bg-brand/[0.03] shadow-lg scale-105 transform origin-left">
                                <span className="font-bold text-zinc-900">Dibrand Engineering Boutique</span>
                                <span className="font-black text-brand text-xl font-outfit">$60 – $120 USD</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900 rounded-[3rem] p-12 text-white">
                        <div className="w-12 h-12 bg-brand/20 rounded-2xl flex items-center justify-center text-brand mb-8">
                            <Award size={28} />
                        </div>
                        <h3 className="text-2xl font-bold font-outfit mb-6 italic">
                            {isEs ? '"Un código senior es 3 veces más productivo que tres desarrolladores junior."' : '"Senior code is 3 times more productive than three junior developers."'}
                        </h3>
                        <p className="text-zinc-400 font-outfit leading-relaxed">
                            {isEs
                                ? 'La transparencia de Dibrand radica en entender que el precio es lo que pagas, pero el valor es lo que recibes. Invertir en calidad senior reduce drásticamente el Time-to-Market y los costos de mantenimiento.'
                                : 'Dibrand transparency lies in understanding that price is what you pay, but value is what you get. Investing in senior quality drastically reduces Time-to-Market and maintenance costs.'}
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 mb-12 tracking-tight">
                        {isEs ? 'Análisis de Valor y Preguntas Frecuentes' : 'Value Analysis & FAQ'}
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-24 mb-32 bg-zinc-50 rounded-[4rem] border border-zinc-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,52,132,0.05),transparent_70%)]" />
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-5xl font-black font-outfit text-zinc-900 mb-10 tracking-tighter">
                            {isEs ? 'Invertí en Ingeniería Senior con Dibrand' : 'Invest in Senior Engineering with Dibrand'}
                        </h3>
                        <Link
                            href={`/${lang}/contact`}
                            className="inline-flex items-center gap-4 px-12 py-5 bg-zinc-900 text-white rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl group"
                        >
                            {isEs ? 'Hablemos de tu proyecto' : 'Let\'s talk about your project'}
                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform text-brand" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer dict={dict} lang={lang} />
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown, DollarSign, Zap, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { getDictionary } from '@/lib/dictionaries';

// Since this is a client component, we'll handle the dictionary loading via a separate server component pattern or just pass it down.
// But for this case, I'll make the main page a server component and create a sub-component for the interactive parts.
// Actually, in Next.js 13+ App Router, metadata must be in a server component.
// I will split this: a server component for the structure/metadata and a client component for the FAQ.

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

export default function PricingModelsContent({ lang, dict }: { lang: 'en' | 'es', dict: any }) {
    const isEs = lang === 'es';

    const faqs = [
        {
            question: isEs ? '¿Por qué contratar una boutique es más rentable que una factory barata?' : 'Why is hiring a boutique more profitable than a cheap factory?',
            answer: isEs
                ? 'Las "factories" suelen competir por volumen y precio bajo, lo que deriva en código de baja calidad, deuda técnica masiva y rotación constante de personal junior. En Dibrand, una boutique de ingeniería, priorizamos el Seniority y el ROI Técnico. Un código limpio y escalable desarrollado hoy te ahorra miles de dólares en refactorización y mantenimiento en el futuro cercano.'
                : 'Software factories often compete on volume and low pricing, leading to low-quality code, massive technical debt, and constant turnover of junior staff. At Dibrand, an engineering boutique, we prioritize Seniority and Technical ROI. Clean, scalable code developed today saves you thousands of dollars in refactoring and maintenance in the near future.'
        },
        {
            question: isEs ? '¿Cómo se calculan las horas de ingeniería?' : 'How are engineering hours calculated?',
            answer: isEs
                ? 'Nuestros presupuestos se basan en la complejidad arquitectónica y el nivel de integración requerido. No vendemos "horas silla", sino capacidad técnica senior. Utilizamos un modelo de transparencia total donde el cliente tiene visibilidad clara sobre el valor entregado en cada sprint, asegurando que cada dólar invertido se traduzca en progreso real del roadmap.'
                : 'Our budgets are based on architectural complexity and the required level of integration. We don\'t sell "seat hours," but senior technical capacity. We use a model of total transparency where the client has clear visibility of the value delivered in each sprint, ensuring that every dollar invested translates into real roadmap progress.'
        }
    ];

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Service",
        "name": isEs ? "Servicios de Desarrollo de Software" : "Software Development Services",
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
                ? "Modelos de Staff Augmentation y Desarrollo de MVP basados en seniority senior."
                : "Staff Augmentation and MVP Development models based on senior seniority."
        }
    };

    return (
        <div className="bg-white min-h-screen pt-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="container mx-auto px-6 max-w-5xl">
                <header className="mb-20 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">
                        <TrendingUp size={16} className="text-brand" />
                        {isEs ? 'Inversión en Ingeniería 2026' : 'Engineering Investment 2026'}
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black font-outfit text-zinc-900 tracking-tighter leading-tight mb-8">
                        {isEs ? 'Modelos de Pricing & ' : 'Pricing & '}
                        <span className="text-brand">{isEs ? 'Inversión Estratégica' : 'Strategic Investment'}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-600 font-outfit font-light leading-relaxed max-w-4xl">
                        {isEs
                            ? 'Dibrand no compite por el precio más bajo del mercado. Competimos por el mayor ROI técnico mediante arquitecturas que no fallan y código que escala.'
                            : 'Dibrand does not compete for the lowest price on the market. We compete for the highest technical ROI through architectures that don\'t fail and code that scales.'}
                    </p>
                </header>

                {/* Investment Models Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        { title: isEs ? 'Staff Augmentation' : 'Staff Augmentation', price: '55-85', desc: isEs ? 'Ingenieros senior integrados a tu squad.' : 'Senior engineers integrated into your squad.' },
                        { title: 'MVP Discovery', price: '4500+', desc: isEs ? 'Definición técnica y prototipado rápido.' : 'Technical definition and rapid prototyping.' },
                        { title: 'Squad Dedicado', price: '100+', desc: isEs ? 'Equipo full-stack para proyectos core.' : 'Full-stack team for core projects.' }
                    ].map((model, idx) => (
                        <div key={idx} className="p-10 rounded-[3rem] border border-zinc-100 bg-zinc-50 hover:border-brand/20 transition-all group">
                            <h3 className="text-2xl font-bold font-outfit text-zinc-900 mb-2">{model.title}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-sm text-zinc-400 font-bold uppercase tracking-widest">USD</span>
                                <span className="text-4xl font-black text-zinc-900">{model.price}</span>
                                <span className="text-zinc-400 font-medium">/hr</span>
                            </div>
                            <p className="text-zinc-500 font-outfit leading-relaxed">{model.desc}</p>
                        </div>
                    ))}
                </section>

                {/* FAQ Section */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 mb-12 tracking-tight">
                        {isEs ? 'Preguntas Frecuentes sobre Inversión' : 'Investment FAQ'}
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </section>

                {/* ROI Disclaimer Section */}
                <section className="mb-32 bg-zinc-900 rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 transform opacity-20">
                        <div className="h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-brand to-brand blur-3xl opacity-30" />
                    </div>
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-3xl md:text-5xl font-black font-outfit mb-8 tracking-tighter">
                            {isEs ? 'El costo real de lo "barato" en software.' : 'The real cost of "cheap" in software.'}
                        </h2>
                        <div className="space-y-6 text-xl text-zinc-300 font-outfit font-light leading-relaxed">
                            <p>
                                {isEs
                                    ? 'Elegir una software factory basada únicamente en el precio por hora suele resultar en un incremento del 300% en costos de mantenimiento a largo plazo.'
                                    : 'Choosing a software factory based solely on price per hour typically results in a 300% increase in long-term maintenance costs.'}
                            </p>
                            <p>
                                {isEs
                                    ? 'Dibrand garantiza un código que es una inversión, no un gasto. Valoramos la integridad estructural y la transparencia operativa.'
                                    : 'Dibrand guarantees code that is an investment, not an expense. We value structural integrity and operational transparency.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Dynamic */}
                <section className="text-center py-20 mb-32 border-2 border-dashed border-zinc-100 rounded-[4rem] hover:border-brand/40 transition-colors">
                    <h3 className="text-3xl md:text-4xl font-bold font-outfit text-zinc-900 mb-10 tracking-tight">
                        {isEs ? '¿Listo para escalar con calidad boutique?' : 'Ready to scale with boutique quality?'}
                    </h3>
                    <Link
                        href={`/${lang}/contact`}
                        className="inline-flex items-center gap-4 px-12 py-5 bg-brand text-white rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl group"
                    >
                        {isEs ? 'Obtené un presupuesto técnico para tu proyecto' : 'Get a technical budget for your project'}
                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </section>
            </main>

            <Footer dict={dict} lang={lang} />
        </div>
    );
}


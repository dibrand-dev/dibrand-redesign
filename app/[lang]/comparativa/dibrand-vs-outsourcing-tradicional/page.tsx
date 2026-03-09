import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import Footer from '@/components/layout/Footer';
import { Check, X, ArrowRight } from 'lucide-react';
import ScheduleButton from '@/components/ui/ScheduleButton';

interface Props {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'es'
            ? 'Dibrand vs Outsourcing Tradicional | Comparativa Técnica'
            : 'Dibrand vs Traditional Outsourcing | Technical Comparison',
        description: lang === 'es'
            ? 'Comparativa detallada entre el modelo de boutique de ingeniería de Dibrand y el outsourcing tradicional de software.'
            : 'Detailed comparison between Dibrand\'s engineering boutique model and traditional software outsourcing.',
    };
}

export default async function ComparisonPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": lang === 'es' ? "Comparativa Dibrand vs. Outsourcing Tradicional" : "Dibrand vs. Traditional Outsourcing Comparison",
        "mainEntity": {
            "@type": "ItemList",
            "name": "Key Differences in Software Development Models",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Senior Talent over Junior Factories"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Direct Engineering Communication"
                }
            ]
        }
    };

    const comparisonData = [
        {
            feature: lang === 'es' ? 'Talento Senior' : 'Senior Talent',
            dibrand: true,
            outsourcing: lang === 'es' ? 'Modelos dominados por Juniors' : 'Junior-heavy models',
        },
        {
            feature: lang === 'es' ? 'Comunicación' : 'Communication',
            dibrand: lang === 'es' ? 'Directa con Ingenieros' : 'Direct with Engineers',
            outsourcing: 'Account Managers / Proxy layers',
        },
        {
            feature: lang === 'es' ? 'Propiedad Intelectual' : 'IP Ownership',
            dibrand: lang === 'es' ? 'Transferencia Legal Total' : 'Full Legal Transfer',
            outsourcing: 'Cláusulas ambiguas / Retención',
        },
        {
            feature: lang === 'es' ? 'Integración' : 'Integration',
            dibrand: lang === 'es' ? 'Cultura de Producto & Ownership' : 'Product Culture & Ownership',
            outsourcing: 'Ejecución por ticket (Ticket-based)',
        },
        {
            feature: lang === 'es' ? 'Tecnologías' : 'Tech Stack',
            dibrand: 'Next.js, Node.js, AI Agents, Web3',
            outsourcing: 'Stacks heredados (Legacy stacks)',
        }
    ];

    return (
        <div className="bg-white min-h-screen pt-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="container mx-auto px-6 max-w-5xl">
                <article>
                    <header className="mb-20 text-center md:text-left max-w-4xl">
                        <h1 className="text-4xl md:text-7xl font-black font-outfit text-zinc-900 tracking-tighter leading-tight mb-8">
                            Dibrand vs. Outsourcing <span className="text-zinc-400">Tradicional</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-600 font-outfit font-light leading-relaxed">
                            {lang === 'es'
                                ? 'Por qué los modelos de "fábrica de software" ya no son viables para startups tecnológicas que buscan velocidad y calidad real.'
                                : 'Why "software factory" models are no longer viable for tech startups seeking real speed and quality.'}
                        </p>
                    </header>

                    <section className="mb-24 overflow-x-auto">
                        <table className="w-full border-collapse rounded-3xl overflow-hidden shadow-xl border border-zinc-100">
                            <thead>
                                <tr className="bg-zinc-900 text-white text-left">
                                    <th className="p-8 font-outfit uppercase tracking-widest text-xs">{lang === 'es' ? 'Característica' : 'Feature'}</th>
                                    <th className="p-8 font-outfit uppercase tracking-widest text-xs text-brand">Dibrand</th>
                                    <th className="p-8 font-outfit uppercase tracking-widest text-xs text-zinc-400 font-light">{lang === 'es' ? 'Outsourcing Convencional' : 'Traditional Outsourcing'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {comparisonData.map((row, i) => (
                                    <tr key={i} className="hover:bg-zinc-50 transition-colors">
                                        <td className="p-8 font-outfit font-bold text-zinc-900 border-r border-zinc-100">
                                            {row.feature}
                                        </td>
                                        <td className="p-8 bg-brand/[0.02]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                                <span className="text-zinc-800 font-medium">
                                                    {typeof row.dibrand === 'boolean' ? (lang === 'es' ? 'Séniors Validados' : 'Validated Seniors') : row.dibrand}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-zinc-400 font-light italic">
                                            <div className="flex items-center gap-3">
                                                <X size={18} className="text-zinc-300" />
                                                <span>{row.outsourcing}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">
                        <div>
                            <h2 className="text-3xl font-bold font-outfit text-zinc-900 mb-6 tracking-tight">
                                {lang === 'es' ? 'La diferencia está en el Ownership' : 'The difference is in Ownership'}
                            </h2>
                            <p className="text-lg text-zinc-600 font-outfit leading-relaxed mb-8">
                                {lang === 'es'
                                    ? 'En Dibrand, no somos una caja negra que recibe requerimientos y devuelve código. Trabajamos como tu brazo de ingeniería, alineados con tus objetivos de negocio y acelerando el roadmap mediante soluciones específicas de '
                                    : 'At Dibrand, we are not a black box that receives requirements and returns code. We work as your engineering arm, aligned with your business goals and accelerating the roadmap through specific solutions such as '}
                                <Link href={`/${lang}/servicios/it-staff-augmentation-ingenieria`} className="text-brand font-bold hover:underline">
                                    {lang === 'es' ? 'Staff Augmentation' : 'Staff Augmentation'}
                                </Link>
                                {lang === 'es' ? ' y ' : ' and '}
                                <Link href={`/${lang}/servicios/desarrollo-mvp-startups-escalables`} className="text-brand font-bold hover:underline">
                                    {lang === 'es' ? 'Desarrollo de MVPs' : 'MVP Development'}
                                </Link>.
                            </p>
                        </div>
                        <div className="p-12 bg-zinc-50 rounded-[3rem] border border-zinc-100 italic font-outfit text-zinc-500 text-xl leading-relaxed">
                            "{lang === 'es'
                                ? 'El outsourcing tradicional busca maximizar el billable; Dibrand busca maximizar el impacto.'
                                : 'Traditional outsourcing seeks to maximize billables; Dibrand seeks to maximize impact.'}"
                        </div>
                    </section>

                    {/* CTA Banner */}
                    <section className="py-20 bg-brand rounded-[3.5rem] text-center px-10 relative overflow-hidden group mb-32">
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
                        <h3 className="text-3xl md:text-5xl font-black font-outfit text-white mb-10 tracking-tighter">
                            {lang === 'es'
                                ? '¿Buscás un partner que hable tu mismo lenguaje técnico?'
                                : 'Looking for a partner who speaks your technical language?'}
                        </h3>
                        <div className="flex justify-center flex-col items-center gap-6">
                            <Link
                                href={`/${lang}/contact`}
                                className="bg-white text-brand px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl flex items-center gap-3"
                            >
                                {lang === 'es' ? 'Hablemos' : 'Let\'s talk'}
                                <ArrowRight size={24} />
                            </Link>
                        </div>
                    </section>
                </article>
            </main>

            <Footer dict={dict} lang={lang} />
        </div>
    );
}

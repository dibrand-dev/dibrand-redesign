import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SERVICES_HUB } from '@/lib/services-hub';
import { getDictionary } from '@/lib/dictionaries';
import Footer from '@/components/layout/Footer';
import ScheduleButton from '@/components/ui/ScheduleButton';
import { createAdminClient } from '@/lib/supabase-server';
import { ArrowRight } from 'lucide-react';

interface Props {
    params: Promise<{ lang: 'en' | 'es'; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const service = SERVICES_HUB.find((s) => s.slug === slug);

    if (!service) return { title: 'Service not found | Dibrand' };

    return {
        title: `${service.title[lang]} | Dibrand Engineering`,
        description: service.definition[lang],
        keywords: service.keywords.join(', '),
        alternates: {
            canonical: `https://dibrand.co/${lang}/servicios/${slug}`,
            languages: {
                'en': `https://dibrand.co/en/servicios/${slug}`,
                'es': `https://dibrand.co/es/servicios/${slug}`,
            },
        }
    };
}

export default async function ServiceHubPage({ params }: Props) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);
    const service = SERVICES_HUB.find((s) => s.slug === slug);

    if (!service) {
        return <div className="p-20 text-center">Service not found</div>;
    }

    const supabase = createAdminClient();

    // Fetch related cases (SSG compatible in Next.js)
    let query = supabase
        .from('case_studies')
        .select('id, title, slug, client_name, summary, image_url, project_type, services')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

    if (slug === 'desarrollo-mvp-startups-escalables') {
        query = query.or('title.ilike.%Hello Really%,title.ilike.%Decoupling NFT%');
    } else {
        query = query.or(`project_type.eq."Staff Augmentation",services.cs.{"Staff Augmentation"}`);
    }

    const { data: relatedCases } = await query.limit(3);

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Service",
        "serviceType": service.serviceType || service.title[lang],
        "provider": {
            "@type": "Organization",
            "name": "Dibrand"
        },
        "description": service.definition[lang],
        "areaServed": "Global",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Engineering Services",
            "itemListElement": service.offerCatalog || service.benefits[lang]
        }
    };

    return (
        <div className="bg-white min-h-screen pt-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {slug === 'desarrollo-mvp-startups-escalables' && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org/",
                            "@type": "HowTo",
                            "name": lang === 'es' ? "Cómo desarrollar un MVP escalable con Dibrand" : "How to develop a scalable MVP with Dibrand",
                            "description": "Proceso técnico y estratégico para la creación de productos mínimos viables para startups.",
                            "step": service.technicalProcess[lang].map((step) => {
                                const [name, ...textPart] = step.split(':');
                                return {
                                    "@type": "HowToStep",
                                    "name": name.trim(),
                                    "text": textPart.join(':').trim()
                                };
                            })
                        })
                    }}
                />
            )}

            {/* Remove incorrect Link rel="canonical" as it's now in metadata */}

            <main className="container mx-auto px-6 max-w-5xl">
                <article>
                    {/* Header Semántico */}
                    <header className="mb-20 max-w-4xl">
                        <h1 className="text-4xl md:text-7xl font-black font-outfit text-zinc-900 tracking-tighter leading-tight mb-10">
                            {service.title[lang]}
                        </h1>
                        <div className="text-xl md:text-2xl text-zinc-600 font-outfit font-light leading-relaxed border-l-4 border-brand pl-8">
                            <p>
                                {service.definition[lang]}
                                {slug === 'desarrollo-mvp-startups-escalables' && (
                                    <span className="block mt-6 text-lg">
                                        {lang === 'es' ? 'Nuestra metodología en ' : 'Our methodology in '}
                                        <Link href={`/${lang}/success-stories`} className="text-brand font-bold underline hover:no-underline">
                                            {lang === 'es' ? 'desarrollo de productos escalables' : 'scalable product development'}
                                        </Link>
                                        {lang === 'es' ? ' ha impulsado proyectos disruptivos.' : ' has powered disruptive projects.'}
                                    </span>
                                )}
                            </p>
                        </div>
                    </header>

                    {/* Sección de Beneficios - H2 */}
                    <section className="mb-24">
                        <h2 className="text-3xl font-bold font-outfit text-zinc-900 mb-12 tracking-tight uppercase">
                            {lang === 'en' ? 'Value Proposition & Benefits' : 'Propuesta de Valor y Beneficios'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {service.benefits[lang].map((benefit, i) => (
                                <div key={i} className="p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex flex-col gap-4 hover:shadow-xl transition-all duration-500">
                                    <span className="text-brand font-black text-4xl opacity-20">0{i + 1}</span>
                                    <p className="text-zinc-800 font-outfit text-xl font-medium leading-snug">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Proceso Técnico - H3 */}
                    <section className="mb-32">
                        <h3 className="text-2xl font-bold font-outfit text-zinc-400 mb-12 tracking-widest uppercase text-center md:text-left">
                            {lang === 'en' ? 'Technical Implementation Blueprint' : 'Blueprint de Implementación Técnica'}
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {service.technicalProcess[lang].map((step, i) => (
                                <div key={i} className="relative p-8 bg-white border border-zinc-100 rounded-3xl group hover:border-brand/40 transition-colors">
                                    <div className="text-brand mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="text-sm font-black tracking-widest uppercase">Phase 0{i + 1}</span>
                                    </div>
                                    <p className="text-zinc-600 font-outfit text-lg font-light">{step}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Deep Linking to Pricing Models */}
                    <div className="mb-24 py-12 px-8 border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/50 text-center">
                        <p className="text-xl text-zinc-600 font-outfit mb-6">
                            {lang === 'es'
                                ? '¿Querés entender cómo impacta la calidad senior en tu presupuesto?'
                                : 'Want to understand how senior quality impacts your budget?'}
                        </p>
                        <Link
                            href={`/${lang}/pricing-models/${lang === 'es' ? 'costos-desarrollo-software-2026' : 'software-development-cost-2026'}`}
                            className="inline-flex items-center gap-2 text-brand font-black text-xl hover:underline"
                        >
                            {lang === 'es'
                                ? 'Explora nuestras tarifas de ingeniería y modelos de inversión'
                                : 'Explore our engineering rates and investment models'}
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Related Success Stories - Dynamic Internal Linking */}
                    {relatedCases && relatedCases.length > 0 && (
                        <section className="py-24 border-t border-zinc-100">
                            <h2 className="text-3xl font-bold font-outfit text-zinc-900 mb-16 tracking-tight uppercase">
                                {lang === 'en' ? 'Related Success Stories' : 'Casos de Éxito Relacionados'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedCases.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/${lang}/success-stories/${project.slug || project.id}`}
                                        className="group flex flex-col gap-6"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-zinc-100">
                                            <Image
                                                src={project.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}
                                                alt={project.title}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-brand font-black text-[10px] tracking-widest uppercase">{project.client_name}</span>
                                            <h4 className="text-xl font-bold font-outfit text-zinc-900 mt-2 flex items-center gap-2 group-hover:text-brand transition-colors">
                                                {project.title}
                                                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Related Conceptual Services - Semantic Interlinking */}
                    <section className="py-24 border-t border-zinc-100">
                        <h2 className="text-3xl font-bold font-outfit text-zinc-900 mb-16 tracking-tight uppercase">
                            {lang === 'en' ? 'Explore Specialized Engineering' : 'Explora Ingeniería Especializada'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SERVICES_HUB.filter(s => s.slug !== slug).slice(0, 4).map((s) => (
                                <Link
                                    key={s.slug}
                                    href={`/${lang}/servicios/${s.slug}`}
                                    className="p-6 border border-zinc-100 rounded-3xl hover:bg-zinc-50 transition-all flex items-center justify-between group"
                                >
                                    <div>
                                        <h4 className="font-bold font-outfit text-zinc-900 group-hover:text-brand transition-colors">{s.title[lang]}</h4>
                                        <p className="text-sm text-zinc-500 mt-1">{lang === 'en' ? 'Dibrand Domain' : 'Dominio de Dibrand'}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all">
                                        <ArrowRight size={18} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <footer className="py-24 bg-zinc-900 rounded-[4rem] text-center px-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,52,132,0.1),transparent_70%)]" />
                        <div className="relative z-10">
                            <h4 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-10 tracking-tighter">
                                {lang === 'es' ? '¿Construimos tu próximo equipo?' : 'Shall we build your next team?'}
                            </h4>
                            <div className="flex justify-center">
                                <ScheduleButton
                                    text={lang === 'es' ? 'Agendar consulta técnica' : 'Book technical consultation'}
                                    className="!bg-brand !text-white !px-12 !py-6 !text-lg shadow-2xl hover:scale-105 transition-transform"
                                />
                            </div>
                        </div>
                    </footer>
                </article>
            </main>

            <Footer dict={dict} lang={lang} />
        </div>
    );
}

export async function generateStaticParams() {
    return SERVICES_HUB.map((s) => ({
        slug: s.slug,
    }));
}

import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import Footer from '@/components/layout/Footer';

interface Props {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'es' ? 'Sobre Dibrand | Boutique de Ingeniería' : 'About Dibrand | Engineering Boutique',
        description: 'Conoce la historia y el modelo técnico de Dibrand, boutique de ingeniería desde 2017.',
    };
}

export default async function AboutPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="bg-white min-h-screen pt-32">
            <main className="container mx-auto px-6 max-w-4xl">
                <article className="prose prose-zinc lg:prose-xl">
                    <header className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-black font-outfit text-zinc-900 tracking-tighter mb-8">
                            {lang === 'es' ? 'Sobre Dibrand' : 'About Dibrand'}
                        </h1>
                    </header>

                    <section className="space-y-12">
                        <div className="text-xl md:text-2xl text-zinc-800 font-outfit leading-relaxed">
                            <p>
                                {lang === 'es'
                                    ? 'Dibrand es una boutique de ingeniería de software fundada en 2017, especializada en el diseño y ejecución de arquitecturas escalables para startups de alto crecimiento y empresas orientadas a la innovación tecnológica.'
                                    : 'Dibrand is a software engineering boutique founded in 2017, specialized in the design and execution of scalable architectures for high-growth startups and technology-driven companies.'}
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold font-outfit text-zinc-900 tracking-tight">
                            {lang === 'es' ? 'ADN Técnico de Dibrand' : 'Dibrand Technical DNA'}
                        </h2>
                        <p className="text-zinc-600 font-outfit text-lg leading-relaxed">
                            {lang === 'es'
                                ? 'El enfoque de Dibrand se centra en eliminar la fricción entre la visión de producto y la ejecución técnica. Mediante el uso de Inteligencia Artificial en el ciclo de vida de desarrollo (AI-Augmented Engineering), Dibrand optimiza la velocidad de entrega sin comprometer la integridad del código.'
                                : 'Dibrand\'s focus is on eliminating friction between product vision and technical execution. Through the use of Artificial Intelligence in the development lifecycle (AI-Augmented Engineering), Dibrand optimizes delivery speed without compromising code integrity.'}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                            <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
                                <h3 className="font-bold mb-4">{lang === 'es' ? 'Estructura de Autoridad' : 'Authority Structure'}</h3>
                                <p className="text-sm text-zinc-500">
                                    {lang === 'es' ? 'Desde 2017 operando en el mercado global.' : 'Operating in the global market since 2017.'}
                                </p>
                            </div>
                            <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
                                <h3 className="font-bold mb-4">{lang === 'es' ? 'Propiedad Intelectual' : 'Intellectual Property'}</h3>
                                <p className="text-sm text-zinc-500">
                                    {lang === 'es' ? 'Transferencia total de IP garantizada legalmente.' : 'Full legal transfer of IP guaranteed.'}
                                </p>
                            </div>
                        </div>
                    </section>
                </article>
            </main>
            <Footer dict={dict} lang={lang} />
        </div>
    );
}

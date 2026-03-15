import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { getDictionary } from '@/lib/dictionaries';

interface Props {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const isEs = lang === 'es';
    return {
        title: isEs ? 'Política de Privacidad | Dibrand' : 'Privacy Policy | Dibrand',
        description: isEs
            ? 'Lea la Política de Privacidad de Dibrand LLC.'
            : 'Read the Privacy Policy for Dibrand LLC.',
    };
}

const contentEN = {
    title: 'Privacy Policy',
    updated: 'Last Updated: March 15, 2026',
    intro: 'At Dibrand LLC, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website dibrand.co or engage with our services.',
    sections: [
        {
            heading: '1. Information We Collect',
            body: null,
            subsections: [
                {
                    title: 'Personal Data',
                    content: 'We collect information that you voluntarily provide through our contact forms, job application forms (Join Us), or appointment scheduling. This includes your name, email address, company name, and LinkedIn profile.'
                },
                {
                    title: 'Usage Data',
                    content: 'Our servers automatically collect information such as your IP address, browser type, and pages visited via Google Tag Manager and Google Analytics.'
                }
            ]
        },
        {
            heading: '2. How We Use Your Information',
            body: 'We use the collected data to:',
            bullets: [
                'Provide and maintain our services.',
                'Schedule and manage appointments.',
                'Process job applications.',
                'Analyze website performance and improve user experience.',
                'Send occasional marketing communications (you can opt-out at any time).',
            ],
        },
        {
            heading: '3. Third-Party Sharing',
            body: 'We do not sell your data. We only share information with trusted service providers to operate our business, such as Google (Analytics/GTM), LinkedIn (Insight Tag), and scheduling tools, all of whom comply with high security standards.',
        },
        {
            heading: '4. Data Retention & Security',
            body: 'We implement industry-standard security measures to protect your data. We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or to comply with legal obligations.',
        },
        {
            heading: '5. Your Rights',
            body: 'You have the right to access, correct, or request the deletion of your personal data. To exercise these rights, please contact us at hello@dibrand.co.',
        },
        {
            heading: '6. Contact Us',
            body: null,
            contact: {
                company: 'Dibrand LLC',
                address: '1309 Coffeen Ave STE 1200',
                city: 'Sheridan, WY 82801',
                email: 'hello@dibrand.co',
            },
        },
    ],
};

const contentES = {
    title: 'Política de Privacidad',
    updated: 'Última actualización: 15 de marzo de 2026',
    intro: 'En Dibrand LLC, estamos comprometidos con la protección de su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos su información al visitar nuestro sitio web dibrand.co o al contratar nuestros servicios.',
    sections: [
        {
            heading: '1. Información que recopilamos',
            body: null,
            subsections: [
                {
                    title: 'Datos Personales',
                    content: 'Recopilamos información que usted nos proporciona voluntariamente a través de nuestros formularios de contacto, formularios de solicitud de empleo (Trabaja con nosotros) o al agendar citas. Esto incluye su nombre, dirección de correo electrónico, nombre de la empresa y perfil de LinkedIn.'
                },
                {
                    title: 'Datos de Uso',
                    content: 'Nuestros servidores recopilan automáticamente información como su dirección IP, tipo de navegador y páginas visitadas a través de Google Tag Manager y Google Analytics.'
                }
            ]
        },
        {
            heading: '2. Cómo utilizamos su información',
            body: 'Utilizamos los datos recopilados para:',
            bullets: [
                'Prestar y mantener nuestros servicios.',
                'Programar y gestionar citas.',
                'Procesar solicitudes de empleo.',
                'Analizar el rendimiento del sitio web y mejorar la experiencia del usuario.',
                'Enviar comunicaciones de marketing ocasionales (puede darse de baja en cualquier momento).',
            ],
        },
        {
            heading: '3. Compartir con terceros',
            body: 'No vendemos sus datos. Solo compartimos información con proveedores de servicios de confianza para operar nuestro negocio, como Google (Analytics/GTM), LinkedIn (Insight Tag) y herramientas de agenda, los cuales cumplen con altos estándares de seguridad.',
        },
        {
            heading: '4. Retención y seguridad de datos',
            body: 'Implementamos medidas de seguridad estándar en la industria para proteger sus datos. Conservamos su información personal solo durante el tiempo necesario para cumplir con los fines descritos en esta política o para cumplir con obligaciones legales.',
        },
        {
            heading: '5. Sus derechos',
            body: 'Usted tiene derecho a acceder, corregir o solicitar la eliminación de sus datos personales. Para ejercer estos derechos, póngase en contacto con nosotros en hello@dibrand.co.',
        },
        {
            heading: '6. Contacto',
            body: null,
            contact: {
                company: 'Dibrand LLC',
                address: '1309 Coffeen Ave STE 1200',
                city: 'Sheridan, WY 82801',
                email: 'hello@dibrand.co',
            },
        },
    ],
};

export default async function PrivacyPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = lang === 'es' ? contentES : contentEN;

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <main className="flex-grow pt-32 pb-24">
                <div className="mx-auto px-6 max-w-3xl">
                    {/* Back link */}
                    <Link
                        href={`/${lang}`}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-brand transition-colors mb-12"
                    >
                        ← {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
                    </Link>

                    {/* Header */}
                    <div className="mb-12 pb-8 border-b border-zinc-100">
                        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-4">Legal</p>
                        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 font-outfit tracking-tighter mb-4">
                            {content.title}
                        </h1>
                        <p className="text-sm text-zinc-400">{content.updated}</p>
                    </div>

                    {/* Intro */}
                    <p className="text-zinc-600 leading-relaxed text-base mb-12">{content.intro}</p>

                    {/* Sections */}
                    <div className="space-y-10">
                        {content.sections.map((section, i) => (
                            <div key={i}>
                                <h2 className="text-base font-black text-zinc-900 font-outfit uppercase tracking-wide mb-3">
                                    {section.heading}
                                </h2>
                                {section.body && (
                                    <p className="text-zinc-600 leading-relaxed text-base mb-3">
                                        {section.body}
                                    </p>
                                )}
                                {section.subsections && (
                                    <div className="space-y-4 mb-3">
                                        {section.subsections.map((sub, k) => (
                                            <div key={k}>
                                                <p className="text-zinc-900 font-bold text-sm mb-1">{sub.title}:</p>
                                                <p className="text-zinc-600 leading-relaxed text-base">{sub.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {section.bullets && (
                                    <ul className="list-disc list-inside space-y-2 text-zinc-600 text-base pl-2">
                                        {section.bullets.map((b, j) => (
                                            <li key={j}>{b}</li>
                                        ))}
                                    </ul>
                                )}
                                {section.contact && (
                                    <address className="not-italic text-zinc-600 leading-loose text-base">
                                        <span className="font-semibold text-zinc-900">{section.contact.company}</span><br />
                                        {section.contact.address}<br />
                                        {section.contact.city}<br />
                                        <a href={`mailto:${section.contact.email}`} className="text-brand hover:underline">
                                            {section.contact.email}
                                        </a>
                                    </address>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer dict={dict} lang={lang} />
        </div>
    );
}

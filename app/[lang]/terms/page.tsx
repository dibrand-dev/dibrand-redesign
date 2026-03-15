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
        title: isEs ? 'Términos del Servicio | Dibrand' : 'Terms of Service | Dibrand',
        description: isEs
            ? 'Lea los Términos del Servicio de Dibrand LLC.'
            : 'Read the Terms of Service for Dibrand LLC.',
    };
}

const contentEN = {
    title: 'Terms of Service',
    updated: 'Last Updated: March 15, 2026',
    intro: 'Welcome to Dibrand. These Terms of Service ("Terms") govern your use of the website located at dibrand.co and the professional services provided by Dibrand LLC ("Company", "we", "us", or "our"). By accessing our website or engaging our services, you agree to be bound by these Terms.',
    sections: [
        {
            heading: '1. Services',
            body: 'Dibrand LLC provides professional software engineering services, including but not limited to:',
            bullets: [
                'Software Development & Consulting: Custom end-to-end product development.',
                'Staff Augmentation: Providing specialized engineering talent to integrate with client teams.',
            ],
        },
        {
            heading: '2. Intellectual Property',
            body: 'Unless otherwise agreed in a specific Statement of Work (SOW), all rights, titles, and interests in the deliverables created specifically for the Client shall be transferred to the Client upon full payment of the applicable fees. Dibrand LLC retains ownership of any pre-existing tools, libraries, or methodologies used during the service.',
        },
        {
            heading: '3. Confidentiality',
            body: 'Both parties agree to protect and keep confidential any proprietary information shared during the business relationship. This includes code, business strategies, and trade secrets.',
        },
        {
            heading: '4. Limitation of Liability',
            body: 'To the maximum extent permitted by law, Dibrand LLC shall not be liable for any indirect, incidental, or consequential damages (including loss of profits or data) arising out of the use of our services. Our total liability for any claim shall not exceed the amount paid by the Client for the specific service during the three (3) months preceding the claim.',
        },
        {
            heading: '5. Governing Law',
            body: 'These Terms shall be governed by and construed in accordance with the laws of the State of Wyoming, USA, without regard to its conflict of law principles. Any legal action shall be brought exclusively in the courts located in Sheridan, Wyoming.',
        },
        {
            heading: '6. Contact Information',
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
    title: 'Términos del Servicio',
    updated: 'Última actualización: 15 de marzo de 2026',
    intro: 'Bienvenido a Dibrand. Estos Términos del Servicio ("Términos") rigen el uso del sitio web dibrand.co y los servicios profesionales prestados por Dibrand LLC ("Empresa", "nosotros" o "nuestro"). Al acceder a nuestro sitio o contratar nuestros servicios, usted acepta cumplir con estos Términos.',
    sections: [
        {
            heading: '1. Servicios',
            body: 'Dibrand LLC presta servicios profesionales de ingeniería de software, que incluyen, entre otros:',
            bullets: [
                'Consultoría y Desarrollo de Software: Desarrollo integral de productos a medida.',
                'Staff Augmentation: Provisión de talento técnico especializado para integrarse en los equipos del cliente.',
            ],
        },
        {
            heading: '2. Propiedad Intelectual',
            body: 'A menos que se acuerde lo contrario en una Declaración de Trabajo (SOW) específica, todos los derechos, títulos e intereses sobre los entregables creados específicamente para el Cliente se transferirán al Cliente tras el pago total de los honorarios correspondientes. Dibrand LLC conserva la propiedad de cualquier herramienta, librería o metodología preexistente utilizada durante la prestación del servicio.',
        },
        {
            heading: '3. Confidencialidad',
            body: 'Ambas partes acuerdan proteger y mantener confidencial cualquier información propietaria compartida durante la relación comercial. Esto incluye código, estrategias de negocio y secretos comerciales.',
        },
        {
            heading: '4. Limitación de Responsabilidad',
            body: 'En la medida máxima permitida por la ley, Dibrand LLC no será responsable de ningún daño indirecto, incidental o consecuente (incluyendo la pérdida de beneficios o datos) derivado del uso de nuestros servicios. Nuestra responsabilidad total por cualquier reclamación no superará el importe pagado por el Cliente por el servicio específico durante los tres (3) meses anteriores a la reclamación.',
        },
        {
            heading: '5. Ley Aplicable',
            body: 'Estos Términos se regirán e interpretarán de acuerdo con las leyes del Estado de Wyoming, EE. UU., sin tener en cuenta sus principios de conflicto de leyes. Cualquier acción legal se presentará exclusivamente en los tribunales situados en Sheridan, Wyoming.',
        },
        {
            heading: '6. Información de Contacto',
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

export default async function TermsPage({ params }: Props) {
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

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
        title: isEs
            ? 'Términos y Condiciones | Dibrand'
            : 'Terms of Service | Dibrand',
        description: isEs
            ? 'Lea los Términos y Condiciones de uso de los servicios de Dibrand.'
            : 'Read the Terms of Service for Dibrand engineering services.',
    };
}

const contentEN = {
    title: 'Terms of Service',
    updated: 'Last updated: March 15, 2025',
    sections: [
        {
            heading: '1. Acceptance of Terms',
            body: `By accessing or using Dibrand's website (dibrand.co) or any of our engineering services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.`,
        },
        {
            heading: '2. Services Description',
            body: `Dibrand is an engineering boutique that provides Staff Augmentation, Software Outsourcing, AI & Custom Workflow development, and Strategic Architecture consulting services. The specific scope of work, deliverables, timelines, and fees for any engagement are governed by a separate Statement of Work (SOW) or Service Agreement executed between Dibrand and the client.`,
        },
        {
            heading: '3. Intellectual Property',
            body: `Upon full payment of all fees, the client shall own all deliverables produced specifically for the client under a project engagement, unless otherwise stated in the applicable SOW. Dibrand retains ownership of all pre-existing tools, frameworks, libraries, methodologies, and know-how used in performing the services. Dibrand's name, logo, and branding elements are the exclusive property of Dibrand and may not be used without prior written consent.`,
        },
        {
            heading: '4. Confidentiality',
            body: `Both parties agree to maintain the confidentiality of proprietary information shared during the course of an engagement. This obligation survives the termination of any agreement. Dibrand will not disclose any client data, business logic, or technical specifications to third parties without explicit written consent.`,
        },
        {
            heading: '5. Payment Terms',
            body: `Payment terms are defined in individual service agreements. In general, invoices are due within 15 business days of issuance. Dibrand reserves the right to suspend services for overdue accounts. All fees are exclusive of applicable taxes unless otherwise stated.`,
        },
        {
            heading: '6. Limitation of Liability',
            body: `To the maximum extent permitted by applicable law, Dibrand shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of our services or this website, even if Dibrand has been advised of the possibility of such damages. Our total liability under any engagement shall not exceed the total fees paid by the client in the three (3) months preceding the claim.`,
        },
        {
            heading: '7. Warranty Disclaimer',
            body: `Our website and services are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.`,
        },
        {
            heading: '8. Termination',
            body: `Either party may terminate a service agreement upon written notice if the other party materially breaches the agreement and fails to remedy such breach within 30 days of receiving written notice. Dibrand may suspend or terminate access to its website or any service immediately upon reasonable belief of misuse.`,
        },
        {
            heading: '9. Governing Law',
            body: `These Terms are governed by the laws of the State of Wyoming, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Wyoming.`,
        },
        {
            heading: '10. Changes to Terms',
            body: `Dibrand reserves the right to update these Terms of Service at any time. We will notify users of material changes by updating the "Last updated" date at the top of this page. Continued use of the website or services after changes constitutes acceptance of the new Terms.`,
        },
        {
            heading: '11. Contact',
            body: `For any questions about these Terms of Service, please contact us at hello@dibrand.co or through the contact form on our website.`,
        },
    ],
};

const contentES = {
    title: 'Términos y Condiciones',
    updated: 'Última actualización: 15 de marzo de 2025',
    sections: [
        {
            heading: '1. Aceptación de los Términos',
            body: `Al acceder o utilizar el sitio web de Dibrand (dibrand.co) o cualquiera de nuestros servicios de ingeniería, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás utilizar nuestros servicios.`,
        },
        {
            heading: '2. Descripción de los Servicios',
            body: `Dibrand es una boutique de ingeniería que ofrece servicios de Staff Augmentation, Software Outsourcing, desarrollo de flujos de trabajo con IA a medida y consultoría de Arquitectura Estratégica. El alcance específico, los entregables, los plazos y los honorarios de cada contratación se rigen por un Statement of Work (SOW) o Acuerdo de Servicio firmado entre Dibrand y el cliente.`,
        },
        {
            heading: '3. Propiedad Intelectual',
            body: `Una vez abonados la totalidad de los honorarios, el cliente será propietario de todos los entregables producidos específicamente para él en el marco de un proyecto, salvo que se indique lo contrario en el SOW correspondiente. Dibrand conserva la propiedad de todas las herramientas, frameworks, librerías, metodologías y know-how preexistentes utilizados en la prestación de los servicios. El nombre, el logotipo y los elementos de marca de Dibrand son propiedad exclusiva de Dibrand y no pueden utilizarse sin consentimiento previo por escrito.`,
        },
        {
            heading: '4. Confidencialidad',
            body: `Ambas partes se comprometen a mantener la confidencialidad de la información propietaria compartida durante la prestación del servicio. Esta obligación subsiste tras la finalización de cualquier acuerdo. Dibrand no divulgará datos del cliente, lógica de negocio ni especificaciones técnicas a terceros sin consentimiento escrito y explícito.`,
        },
        {
            heading: '5. Condiciones de Pago',
            body: `Las condiciones de pago se definen en los acuerdos de servicio individuales. Por regla general, las facturas deben abonarse en un plazo de 15 días hábiles desde su emisión. Dibrand se reserva el derecho de suspender los servicios ante cuentas vencidas. Todos los honorarios no incluyen los impuestos aplicables salvo que se indique lo contrario.`,
        },
        {
            heading: '6. Limitación de Responsabilidad',
            body: `En la máxima medida permitida por la legislación aplicable, Dibrand no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluidos, entre otros, la pérdida de beneficios, datos u oportunidades de negocio, derivados del uso de nuestros servicios o de este sitio web, incluso si Dibrand ha sido advertida de la posibilidad de dichos daños. Nuestra responsabilidad total en el marco de cualquier contratación no superará el importe total de los honorarios abonados por el cliente en los tres (3) meses anteriores a la reclamación.`,
        },
        {
            heading: '7. Exclusión de Garantías',
            body: `Nuestro sitio web y servicios se prestan "tal cual" y "según disponibilidad", sin garantías de ningún tipo, ya sean expresas o implícitas, incluidas, entre otras, las garantías implícitas de comerciabilidad, idoneidad para un fin determinado o no infracción.`,
        },
        {
            heading: '8. Resolución del Contrato',
            body: `Cualquiera de las partes podrá resolver un acuerdo de servicio mediante notificación por escrito si la otra parte incumple materialmente el acuerdo y no subsana dicho incumplimiento en el plazo de 30 días desde la recepción de la notificación escrita. Dibrand podrá suspender o cancelar el acceso a su sitio web o a cualquier servicio de forma inmediata ante una presunción razonable de uso indebido.`,
        },
        {
            heading: '9. Legislación Aplicable',
            body: `Estos Términos se rigen por las leyes del Estado de Wyoming, Estados Unidos, con independencia de sus disposiciones sobre conflictos de leyes. Cualquier controversia derivada de estos Términos estará sometida a la jurisdicción exclusiva de los tribunales de Wyoming.`,
        },
        {
            heading: '10. Modificaciones de los Términos',
            body: `Dibrand se reserva el derecho de actualizar estos Términos y Condiciones en cualquier momento. Notificaremos a los usuarios los cambios sustanciales actualizando la fecha de "Última actualización" que figura en la parte superior de esta página. El uso continuado del sitio web o de los servicios tras dichos cambios implica la aceptación de los nuevos Términos.`,
        },
        {
            heading: '11. Contacto',
            body: `Si tienes alguna pregunta sobre estos Términos y Condiciones, puedes contactarnos en hello@dibrand.co o a través del formulario de contacto de nuestro sitio web.`,
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

                    {/* Sections */}
                    <div className="space-y-10">
                        {content.sections.map((section, i) => (
                            <div key={i}>
                                <h2 className="text-lg font-bold text-zinc-900 font-outfit mb-3">
                                    {section.heading}
                                </h2>
                                <p className="text-zinc-600 leading-relaxed text-base">
                                    {section.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer note */}
                    <div className="mt-16 pt-8 border-t border-zinc-100 text-center">
                        <p className="text-sm text-zinc-400">
                            {lang === 'es'
                                ? '¿Preguntas? Escríbenos a '
                                : 'Questions? Reach us at '}
                            <a href="mailto:hello@dibrand.co" className="text-brand hover:underline">
                                hello@dibrand.co
                            </a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer dict={dict} lang={lang} />
        </div>
    );
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import PricingContent from './PricingContent';

interface Props {
    params: Promise<{ lang: 'en' | 'es', slug: string }>;
}

const VALID_SLUGS = {
    es: 'costos-desarrollo-software-2026',
    en: 'software-development-cost-2026'
};

export async function generateStaticParams() {
    return [
        { lang: 'es', slug: 'costos-desarrollo-software-2026' },
        { lang: 'en', slug: 'software-development-cost-2026' }
    ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;

    // Verify if slug matches the language
    if (slug !== VALID_SLUGS[lang]) {
        // We could potentially redirect here, but for now let's just use the correct metadata if we want to allow it
        // or return 404 if it's strictly enforced.
    }

    const isEs = lang === 'es';

    return {
        title: isEs ? 'Costos de Desarrollo de Software 2026 | Pricing Dibrand' : 'Software Development Costs 2026 | Dibrand Pricing',
        description: isEs
            ? 'Guía completa sobre costos de desarrollo de software en 2026. Tarifas de staff augmentation, modelos de inversión en MVPs y ROI técnico.'
            : 'Comprehensive guide on software development costs in 2026. Staff augmentation rates, MVP investment models, and technical ROI.',
        alternates: {
            canonical: `https://dibrand.co/${lang}/pricing-models/${slug}`,
            languages: {
                'es': 'https://dibrand.co/es/pricing-models/costos-desarrollo-software-2026',
                'en': 'https://dibrand.co/en/pricing-models/software-development-cost-2026',
            },
        },
    };
}

export default async function PricingPage({ params }: Props) {
    const { lang, slug } = await params;

    // Validation: if the slug doesn't match the localized expected slug, we could 404 or redirect.
    // Given the specific requirement to have both paths, we check them.
    if (slug !== VALID_SLUGS.es && slug !== VALID_SLUGS.en) {
        notFound();
    }

    const dict = await getDictionary(lang);

    return <PricingContent lang={lang} dict={dict} />;
}

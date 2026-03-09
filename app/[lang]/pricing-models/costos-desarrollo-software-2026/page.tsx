import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import PricingContent from './PricingContent';

interface Props {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'es' ? 'Costos de Desarrollo de Software 2026 | Pricing Dibrand' : 'Software Development Costs 2026 | Dibrand Pricing',
        description: lang === 'es'
            ? 'Descubre los modelos de inversión de Dibrand: ROI técnico, staff augmentation senior y presupuestos para MVPs escalables.'
            : 'Discover Dibrand investment models: technical ROI, senior staff augmentation, and budgets for scalable MVPs.',
    };
}

export default async function PricingPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <PricingContent lang={lang} dict={dict} />;
}

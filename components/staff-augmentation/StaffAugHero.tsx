import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CONTACT_CALENDAR_URL } from '@/lib/constants';

interface StaffAugHeroProps {
    dict: {
        hero: {
            title: string;
            subtitle: string;
            cta: string;
        };
    };
    lang: string;
}

export default function StaffAugHero({ dict, lang }: StaffAugHeroProps) {
    return (
        <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex flex-col">
            {/* Capa 1: Imagen de Fondo */}
            <Image
                src="/images/hero-staff-aug.png"
                alt="Dibrand Staff Augmentation - World Class Engineering"
                fill
                priority
                className="object-cover z-0"
            />

            {/* Capa 2: Overlay de Marca - Darker on mobile for readability */}
            <div className="absolute inset-0 z-10 bg-zinc-950/80 md:bg-zinc-950/60" />

            {/* Capa 3: Contenido de Texto */}
            <div className="relative z-20 container mx-auto px-6 flex-grow flex flex-col items-center justify-center text-center pt-32 pb-16">
                <h1 className="font-outfit text-[32px] sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05] md:leading-[1.1] max-w-5xl uppercase">
                    {dict.hero.title}
                </h1>

                <p className="mt-4 md:mt-6 text-base md:text-xl leading-relaxed text-zinc-100 max-w-2xl font-outfit font-light">
                    {dict.hero.subtitle}
                </p>

                <div className="mt-10 flex flex-col items-center w-full max-w-4xl">
                    <a
                        href={CONTACT_CALENDAR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-brand text-white font-bold rounded-full hover:bg-brand/90 hover:scale-[1.02] transition-all group font-outfit"
                    >
                        {dict.hero.cta}
                        <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
}

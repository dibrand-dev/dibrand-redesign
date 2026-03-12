import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

import StatCounter from './StatCounter';
import ScheduleButton from '../ui/ScheduleButton';

interface HeroSectionProps {
    dict: {
        hero: {
            title: string;
            subtitle: string;
            cta: string;
        };
        stats: {
            trustLabel: string;
            items: { label: string; value: string }[];
        };
    };
}

export default function HeroSection({ dict }: HeroSectionProps) {
    return (
        <section className="relative min-h-[750px] md:h-[800px] lg:h-[900px] w-full overflow-hidden flex items-center py-24 md:py-0">
            {/* Capa 1: Imagen de Fondo */}
            <Image
                src="/oficina-dibrand.png"
                alt="Equipo de Dibrand trabajando en oficinas modernas"
                fill
                priority
                className="object-cover z-0"
            />

            {/* Capa 2: Overlay de Marca - Darker on mobile for readability */}
            <div className="absolute inset-0 z-10 bg-zinc-950/80 md:bg-zinc-950/60" />

            {/* Capa 3: Contenido de Texto */}
            <div className="relative z-20 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
                <h1 className="font-outfit text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] max-w-5xl uppercase">
                    {dict.hero.title}
                </h1>

                <p
                    className="mt-10 text-lg md:text-2xl leading-relaxed text-zinc-100 max-w-3xl font-outfit font-light"
                    dangerouslySetInnerHTML={{ __html: dict.hero.subtitle }}
                />

                <div className="mt-16 md:mt-24 flex flex-col items-center gap-12 md:gap-20">
                    <ScheduleButton text={dict.hero.cta} />

                    {/* Stats - Improved spacing for mobile accessibility */}
                    <div className="flex flex-wrap justify-center gap-10 md:gap-24 items-center pt-8 border-t border-white/10 w-full max-w-4xl">
                        {dict.stats.items.map((stat, index) => (
                            <StatCounter key={index} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

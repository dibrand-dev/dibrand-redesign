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
        <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col">
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
            <div className="relative z-20 container mx-auto px-6 flex-grow flex flex-col items-center justify-center text-center pt-32 pb-16">
                <h1 className="font-outfit text-[32px] sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05] md:leading-[1.1] max-w-5xl uppercase">
                    {dict.hero.title}
                </h1>

                <p
                    className="mt-4 md:mt-6 text-base md:text-xl leading-relaxed text-zinc-100 max-w-2xl font-outfit font-light"
                    dangerouslySetInnerHTML={{ __html: dict.hero.subtitle }}
                />

                <div className="mt-8 md:mt-10 flex flex-col items-center w-full max-w-4xl">
                    <ScheduleButton text={dict.hero.cta} />

                    {/* Stats - Compact Row */}
                    <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 md:gap-16 items-center pt-8 border-t border-white/10 w-full">
                        {dict.stats.items.map((stat, index) => (
                            <StatCounter key={index} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

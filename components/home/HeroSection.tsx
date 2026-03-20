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
        <section className="relative w-full h-[70vh] min-h-[600px] overflow-hidden flex flex-col">
            {/* Capa 1: Imagen de Fondo */}
            <Image
                src="/oficina-dibrand.png"
                alt="Equipo de Dibrand trabajando en oficinas modernas"
                fill
                priority
                className="object-cover object-center z-0"
            />

            {/* Capa 2: Overlay de Marca - flat color for readability and consistency */}
            <div className="absolute inset-0 z-10 bg-zinc-950/75" />

            {/* Capa 3: Contenido de Texto */}
            <div className="relative z-20 container mx-auto px-6 flex-grow flex flex-col items-center justify-center text-center pt-28 pb-48 md:pb-64">
                <h1 className="font-outfit text-3xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.1] max-w-4xl">
                    {dict.hero.title}
                </h1>

                <p
                    className="mt-4 md:mt-6 text-base md:text-xl leading-relaxed text-zinc-100 max-w-2xl font-outfit font-light"
                    dangerouslySetInnerHTML={{ __html: dict.hero.subtitle }}
                />

                <div className="mt-8 md:mt-10 flex flex-col items-center w-full max-w-4xl">
                    <ScheduleButton text={dict.hero.cta} />

                    {/* Stats - Compact Row — lifted with increased padding */}
                    <div className="mt-14 md:mt-20 flex flex-wrap justify-center gap-8 md:gap-20 items-end pt-8 border-t border-white/15 w-full pb-16">
                        {dict.stats.items.map((stat, index) => (
                            <StatCounter key={index} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

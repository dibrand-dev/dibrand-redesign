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
        <section className="relative h-[600px] w-full overflow-hidden">
            {/* Capa 1: Imagen de Fondo */}
            <Image
                src="/oficina-dibrand.png"
                alt="Equipo de Dibrand trabajando en oficinas modernas"
                fill
                priority
                className="object-cover z-0"
            />

            {/* Capa 2: Overlay de Marca */}
            <div className="absolute inset-0 z-10 bg-gray-900/70" />

            {/* Capa 3: Contenido de Texto */}
            <div className="relative z-20 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
                <h1 className="font-outfit text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] max-w-4xl">
                    {dict.hero.title}
                </h1>

                <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl font-outfit">
                    {dict.hero.subtitle}
                </p>

                <div className="mt-12 flex flex-col items-center gap-10">
                    <ScheduleButton text={dict.hero.cta} />

                    {/* Stats - Centered at the bottom of the hero content area */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
                        {dict.stats.items.map((stat, index) => (
                            <StatCounter key={index} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

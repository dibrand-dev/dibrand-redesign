import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

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
                <h1 className="font-montserrat text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] max-w-4xl">
                    {dict.hero.title}
                </h1>

                <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">
                    {dict.hero.subtitle}
                </p>

                <div className="mt-12 flex flex-col items-center gap-10">
                    <Link
                        href="#contact"
                        className={clsx(
                            "group flex items-center gap-2 rounded-full px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-2xl shadow-black/20",
                            "bg-gradient-to-r from-[#D83484] to-[#A3369D]"
                        )}
                    >
                        {dict.hero.cta}
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>

                    {/* Stats - Centered at the bottom of the hero content area */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
                        {dict.stats.items.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <span className="text-2xl md:text-3xl font-black text-white">{stat.value}</span>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/70">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import ScheduleButton from '../ui/ScheduleButton';

interface SoftwareDevHeroProps {
    dict: {
        title: string;
        subtitle: string;
        cta: string;
    };
}

export default function SoftwareDevHero({ dict }: SoftwareDevHeroProps) {
    return (
        <section className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-950">
            {/* Background image without blur - sharp and clean */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/software-dev-hero.png" // This matches 'imagen_16.png' description
                    alt="INGENIERÍA DE SOFTWARE DE CLASE MUNDIAL"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Subtle radial dark overlay centered on text for legibility */}
                <div className="absolute inset-0 bg-zinc-950/60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.8)_100%)] opacity-40" />
            </div>

            {/* Content centered stacked */}
            <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <h1 className="font-outfit text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.1] capitalize">
                        {dict.title}
                    </h1>
                    
                    <p className="mt-4 md:mt-6 text-base md:text-xl leading-relaxed text-zinc-50 max-w-2xl mx-auto font-outfit font-light">
                        {dict.subtitle}
                    </p>

                    <div className="pt-8 flex justify-center">
                        <ScheduleButton 
                            text={dict.cta} 
                            className="bg-brand hover:bg-white hover:text-brand transition-all scale-110 !px-10 !py-5"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom fade line - subtle transition */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
        </section>
    );
}

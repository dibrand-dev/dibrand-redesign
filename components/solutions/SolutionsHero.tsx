import React from 'react';
import Image from 'next/image';
import ScheduleButton from '../ui/ScheduleButton';

interface SolutionsHeroProps {
    dict: {
        title: string;
        subtitle: string;
        cta: string;
    };
}

export default function SolutionsHero({ dict }: SolutionsHeroProps) {
    return (
        <section className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-950">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/software-dev-hero.png" // Reuse for consistency or placeholder
                    alt="Our Solutions - Dibrand Engineering"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-zinc-950/40" />
            </div>

            {/* Content centered stacked */}
            <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <h1 className="font-outfit text-4xl md:text-5xl lg:text-[64px] font-black tracking-tight text-white leading-[1.1]">
                        {dict.title}
                    </h1>
                    
                    <p className="mt-4 md:mt-6 text-base md:text-xl leading-relaxed text-zinc-100 max-w-2xl mx-auto font-outfit font-light">
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

            <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
        </section>
    );
}

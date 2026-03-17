import React from 'react';
import Image from 'next/image';
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
        <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Content 70% */}
                    <div className="w-full lg:w-[70%]">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-zinc-900 font-outfit leading-[1.1] mb-8 uppercase tracking-tight">
                            {dict.title}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-500 font-outfit font-light leading-relaxed max-w-2xl mb-12">
                            {dict.subtitle}
                        </p>
                        <ScheduleButton text={dict.cta} />
                    </div>

                    {/* Image 30% */}
                    <div className="w-full lg:w-[30%] relative aspect-[4/5] lg:aspect-auto lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
                        <Image
                            src="/images/software-dev.png"
                            alt="Dibrand Engineering Excellence"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}

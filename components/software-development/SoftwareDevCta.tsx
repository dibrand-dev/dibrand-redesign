import React from 'react';
import ScheduleButton from '../ui/ScheduleButton';

interface SoftwareDevCtaProps {
    dict: {
        title: string;
        cta: string;
    };
}

export default function SoftwareDevCta({ dict }: SoftwareDevCtaProps) {
    return (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 transform opacity-20">
                <div className="h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-purple-600 to-purple-800 blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-outfit mb-12 max-w-4xl mx-auto leading-tight">
                    {dict.title}
                </h2>
                <div className="flex flex-col items-center">
                    <ScheduleButton text={dict.cta} className="!bg-white !text-zinc-950 hover:!bg-zinc-100 scale-110" />
                </div>
            </div>
        </section>
    );
}

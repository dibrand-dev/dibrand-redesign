import { Terminal, Users } from 'lucide-react';
import Link from 'next/link';

interface EngineeringExcellenceProps {
    dict: any;
    lang: string;
}

export default function EngineeringExcellence({ dict, lang }: EngineeringExcellenceProps) {
    return (
        <section className="bg-white py-24 md:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-24">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 not-italic tracking-tight leading-[1.2]">
                        {dict.engineeringExcellence.title}
                    </h2>
                    <div className="mt-8 h-1 w-24 bg-brand mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Column A: Full-Cycle Product Development */}
                    <div className="flex flex-col group p-8 lg:p-12 rounded-3xl border border-zinc-100 bg-white hover:border-brand/20 transition-all duration-300">
                        <div className="w-14 h-14 bg-brand/5 rounded-2xl flex items-center justify-center text-brand mb-8 group-hover:scale-110 transition-transform">
                            <Terminal size={28} strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-bold font-outfit text-zinc-900 not-italic mb-4">
                            {dict.engineeringExcellence.fullCycle.title}
                        </h3>
                        <p className="text-lg text-zinc-500 font-outfit leading-relaxed flex-grow">
                            {dict.engineeringExcellence.fullCycle.desc}
                        </p>
                    </div>

                    {/* Column B: Strategic Staff Augmentation */}
                    <div className="flex flex-col group p-8 lg:p-12 rounded-3xl border border-zinc-100 bg-white hover:border-brand/20 transition-all duration-300">
                        <div className="w-14 h-14 bg-brand/5 rounded-2xl flex items-center justify-center text-brand mb-8 group-hover:scale-110 transition-transform">
                            <Users size={28} strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-bold font-outfit text-zinc-900 not-italic mb-4">
                            {dict.engineeringExcellence.staffAug.title}
                        </h3>
                        <p className="text-lg text-zinc-500 font-outfit leading-relaxed flex-grow">
                            {dict.engineeringExcellence.staffAug.desc}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

interface StaffAugmentationTeaserProps {
    dict: {
        staffAugmentationTeaser: {
            title: string;
            subtitle: string;
            pillars: {
                title: string;
                desc: string;
            }[];
            cta: string;
        };
    };
}

const teamRoles = [
    {
        name: "Product",
        image: "/images/staff/Product.png"
    },
    {
        name: "UX/UI Design",
        image: "/images/staff/UXUI.png"
    },
    {
        name: "Engineering & AI",
        image: "/images/staff/Developer.png"
    }
];

export default function StaffAugmentationTeaser({ dict }: StaffAugmentationTeaserProps) {
    const { title, subtitle, pillars, cta } = dict.staffAugmentationTeaser;

    return (
        <section className="relative w-full py-32 bg-white overflow-hidden" id="staff-augmentation">
            <div className="container mx-auto px-6 relative z-10">
                {/* 1. Header and Subtitle */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-8 font-outfit tracking-tight">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-500 font-outfit font-light leading-relaxed max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* 2. Benefits Grid (2 columns - Ref: 13.35.59.png) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 max-w-5xl mx-auto mb-28 border-y border-zinc-100 py-16">
                    {pillars.map((pillar, index) => (
                        <div key={index} className="flex items-start gap-6 group">
                            {/* Fucsia Checkbox - Dibrand Flavor */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#D83484] flex items-center justify-center text-white shadow-lg shadow-[#D83484]/20 mt-1 transform group-hover:scale-110 transition-transform duration-300">
                                <Check size={18} strokeWidth={4} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold text-zinc-900 font-outfit tracking-tight mb-2">
                                    {pillar.title}
                                </h3>
                                <p className="text-base text-zinc-500 font-outfit leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Talent Gallery (3 Justified Circles) */}
                <div className="mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 max-w-6xl mx-auto px-4">
                        {teamRoles.map((role, index) => (
                            <div key={index} className="flex flex-col items-center group">
                                {/* Photo Avatar - Perfect Circle */}
                                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white shadow-2xl overflow-hidden mb-10 transition-all duration-500 group-hover:scale-105 group-hover:shadow-zinc-200">
                                    <Image
                                        src={role.image}
                                        alt={role.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 192px, 256px"
                                        priority={index === 0}
                                    />
                                    {/* Subtle Overlay */}
                                    <div className="absolute inset-0 bg-zinc-900/5 group-hover:bg-transparent transition-colors duration-300" />
                                </div>

                                <span className="text-sm font-black text-zinc-800 font-outfit tracking-[0.25em] uppercase text-center opacity-70 group-hover:opacity-100 transition-all duration-300">
                                    {role.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Call to Action (CTA) */}
                <div className="flex justify-center mt-12">
                    <Link
                        href="/staff-augmentation"
                        className="inline-flex items-center gap-4 px-12 py-6 bg-zinc-900 text-white font-bold text-lg rounded-full hover:bg-black hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
                    >
                        <span>{cta}</span>
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

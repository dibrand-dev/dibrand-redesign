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
    lang: string;
}

const teamRoles = [
    {
        name: "Senior Product Strategy",
        image: "/images/staff/Product.png"
    },
    {
        name: "Senior UX/UI Design",
        image: "/images/staff/UXUI.png"
    },
    {
        name: "Senior Engineering & AI",
        image: "/images/staff/Developer.png"
    }
];

export default function StaffAugmentationTeaser({ dict, lang }: StaffAugmentationTeaserProps) {
    const { title, subtitle, pillars, cta } = dict.staffAugmentationTeaser;

    return (
        <section className="relative w-full py-24 md:py-32 bg-white overflow-hidden" id="staff-augmentation">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* 1. Header and Subtitle - Standardized */}
                <div className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight">
                        {title}
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-brand mb-6" />
                    <p className="text-base md:text-lg text-zinc-500 font-outfit font-light leading-relaxed max-w-2xl">
                        {subtitle}
                    </p>
                </div>

                {/* 2. Benefits Grid (3 columns) - Minimal & Flat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 max-w-6xl mx-auto mb-16">
                    {pillars.map((pillar, index) => (
                        <div key={index} className="flex items-start gap-4 group">
                            {/* Fucsia Checkbox - Flat Design */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white mt-1 transform group-hover:rotate-12 transition-transform duration-300">
                                <Check size={18} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl md:text-2xl font-bold font-outfit text-zinc-900 tracking-tight mb-2 leading-snug">
                                    {pillar.title}
                                </h3>
                                <p className="text-sm text-zinc-500 font-outfit leading-relaxed font-light">
                                    {pillar.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Talent Gallery (3 Justified Circles) - Photorealistic Style */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto px-4">
                        {teamRoles.map((role, index) => (
                            <div key={index} className="flex flex-col items-center group">
                                {/* Photo Avatar - Perfect Circle - High Quality Restoration */}
                                <div className="relative w-36 h-36 md:w-52 md:h-52 rounded-full border border-zinc-100 overflow-hidden mb-6 transition-all duration-500 group-hover:scale-105 group-hover:border-brand/40">
                                    <Image
                                        src={role.image}
                                        alt={role.name}
                                        fill
                                        className="object-cover transition-all duration-700"
                                        sizes="(max-width: 768px) 144px, 208px"
                                        priority={index === 0}
                                    />
                                    {/* Subtle Overlay only for depth */}
                                    <div className="absolute inset-0 bg-zinc-950/5 group-hover:bg-transparent transition-colors duration-300" />
                                </div>

                                <span className="text-[9px] md:text-[10px] font-black text-zinc-800 font-outfit tracking-[0.3em] uppercase text-center group-hover:text-brand transition-all duration-500">
                                    {role.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Call to Action (CTA) - Closer to gallery */}
                <div className="flex justify-center">
                    <Link
                        href={`/${lang}/staff-augmentation`}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-zinc-900 text-white font-bold text-base rounded-full hover:bg-black hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
                    >
                        <span>{cta}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

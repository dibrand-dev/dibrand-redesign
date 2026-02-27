import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCheck, Heart, Zap, Users, ArrowRight } from 'lucide-react';

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

const icons = [UserCheck, Heart, Zap, Users];

const teamRoles = [
    {
        name: "Software Developers",
        color: "bg-[#D83484]",
        shape: "rounded-full",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        name: "QA Engineers",
        color: "bg-[#3B82F6]",
        shape: "rounded-lg rotate-12",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
        name: "UX/UI Designers",
        color: "bg-[#F59E0B]",
        shape: "rounded-2xl -rotate-12",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    },
    {
        name: "Project Managers",
        color: "bg-[#D83484]",
        shape: "rounded-[30%]",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    }
];

export default function StaffAugmentationTeaser({ dict }: StaffAugmentationTeaserProps) {
    const { title, subtitle, pillars, cta } = dict.staffAugmentationTeaser;

    return (
        <section className="relative w-full py-28 bg-slate-50 overflow-hidden" id="staff-augmentation">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* 1. Encabezado y Texto - Light Style */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-outfit tracking-tight">
                        {title}
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-500 font-outfit font-light leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* 2. Grid de 4 Pilares (Clean White Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-28">
                    {pillars.map((pillar, index) => {
                        const Icon = icons[index];
                        return (
                            <div key={index}
                                className="flex gap-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                            >
                                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#D83484]/10 flex items-center justify-center text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all duration-300">
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-outfit">{pillar.title}</h3>
                                    <p className="text-slate-500 font-outfit leading-relaxed">{pillar.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 3. Galería de Roles (Visual Team Showcase - Reference Style) */}
                <div className="mb-28">
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                        {teamRoles.map((role, index) => (
                            <div key={index} className="group relative flex flex-col items-center">
                                {/* Geometric shape behind - Reference Style */}
                                <div className={`absolute -inset-4 ${role.color} opacity-20 ${role.shape} group-hover:scale-110 group-hover:opacity-30 transition-all duration-500`} />

                                {/* Photo Avatar */}
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden z-10">
                                    <Image
                                        src={role.image}
                                        alt={role.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className="mt-8 text-sm md:text-base font-bold text-slate-800 font-outfit tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity text-center px-4">
                                    {role.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Call to Action (CTA) - Solid Modern Style */}
                <div className="flex justify-center">
                    <Link
                        href="/staff-augmentation"
                        className="relative overflow-hidden inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white font-black text-lg rounded-full hover:bg-[#D83484] hover:shadow-2xl hover:shadow-[#D83484]/40 hover:-translate-y-1 active:scale-95 group transition-all duration-300"
                    >
                        <span className="relative z-10">{cta}</span>
                        <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}





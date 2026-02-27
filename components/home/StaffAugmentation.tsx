import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCheck, Heart, Zap, Users, ArrowRight } from 'lucide-react';

const pillars = [
    {
        icon: UserCheck,
        title: "El Talento Correcto",
        description: "Ingenieros Senior con seniority técnico y pensamiento crítico comprobado."
    },
    {
        icon: Heart,
        title: "La Cultura Correcta",
        description: "Fit cultural total. Comunicación fluida en inglés y alineación con tus rituales."
    },
    {
        icon: Zap,
        title: "El Tiempo Correcto",
        description: "Onboarding en tiempo récord. Escalamiento de equipo en menos de 3 semanas."
    },
    {
        icon: Users,
        title: "El Equipo Correcto",
        description: "Desde desarrolladores individuales hasta escuadrones multidisciplinarios."
    }
];

const teamRoles = [
    { name: "Software Developers", color: "bg-[#D83484]", shape: "rounded-full" },
    { name: "QA Engineers", color: "bg-[#3B82F6]", shape: "rounded-lg rotate-12" },
    { name: "UX/UI Designers", color: "bg-[#F59E0B]", shape: "rounded-2xl -rotate-12" },
    { name: "Project Managers", color: "bg-[#D83484]", shape: "rounded-[30%]" }
];

export default function StaffAugmentation() {
    return (
        <section className="relative w-full py-24 bg-[#0A0A0A] overflow-hidden" id="staff-augmentation">
            {/* Background geometric 'life' elements */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#D83484]/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#3B82F6]/10 blur-[120px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                {/* 1. Encabezado y Texto */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-outfit tracking-tight">
                        Talento que potencia tu visión.
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 font-outfit font-light">
                        No sumamos gente, sumamos valor. Construimos el equipo ideal para tus desafíos más complejos.
                    </p>
                </div>

                {/* 2. Grid de 4 Pilares */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
                    {pillars.map((pillar, index) => (
                        <div key={index} className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#D83484]/50 transition-colors group">
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#D83484]/10 flex items-center justify-center text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all duration-300">
                                <pillar.icon size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 font-outfit">{pillar.title}</h3>
                                <p className="text-gray-400 font-outfit leading-relaxed">{pillar.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Galería de Roles (Visual Team Showcase) */}
                <div className="mb-24">
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                        {teamRoles.map((role, index) => (
                            <div key={index} className="group relative flex flex-col items-center">
                                {/* Geometric shape behind */}
                                <div className={`absolute -inset-4 ${role.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity ${role.shape}`} />
                                <div className={`absolute -inset-1 ${role.color} opacity-30 ${role.shape} scale-90 group-hover:scale-100 transition-transform duration-500`} />

                                {/* Avatar placeholder */}
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-800 border-4 border-zinc-700 overflow-hidden z-10 shadow-2xl">
                                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                        <Users size={48} />
                                    </div>
                                    {/* Abstract pattern to make it look less generic */}
                                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-tr from-white to-transparent`} />
                                </div>
                                <span className="mt-6 text-sm md:text-base font-bold text-white font-outfit tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity text-center px-4">
                                    {role.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Call to Action (CTA) */}
                <div className="flex justify-center">
                    <Link
                        href="/staff-augmentation"
                        className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black text-lg rounded-full hover:bg-[#D83484] hover:text-white transition-all duration-300 shadow-2xl hover:shadow-[#D83484]/30 active:scale-95 group"
                    >
                        Explorar Staff Augmentation
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}


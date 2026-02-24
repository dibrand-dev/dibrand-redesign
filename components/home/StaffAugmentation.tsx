import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Zap, Clock, Search, UserCheck, ArrowUpRight } from 'lucide-react';

export default function StaffAugmentation() {
    return (
        <section className="relative min-h-[800px] w-full flex items-center py-24 overflow-hidden" id="staff-augmentation">
            {/* Background Image with grayscale and overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/staff-aug.png"
                    alt="Elite IT Talent"
                    fill
                    className="object-cover grayscale"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 via-gray-900/80 to-gray-900" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mb-20">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 font-outfit leading-tight tracking-tight">
                        Tu equipo, potenciado.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D83484] to-[#A3369D]">
                            Talento IT de élite
                        </span> integrado a tus procesos.
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300 font-outfit leading-relaxed max-w-3xl">
                        Escala tu capacidad tecnológica con ingenieros Senior de LATAM que se integran a tu cultura, rituales y zonas horarias. Sin fricciones de reclutamiento.
                    </p>
                </div>

                {/* Concept Block */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 mb-20 max-w-5xl">
                    <h3 className="text-2xl font-bold text-white mb-6 font-outfit">¿Qué es Staff Augmentation en Dibrand?</h3>
                    <p className="text-lg text-gray-300 font-outfit leading-relaxed">
                        Es una estrategia de contratación flexible que permite cubrir brechas de habilidades y acelerar roadmaps sin los costos ni compromisos de una contratación tradicional a largo plazo. Te proporcionamos expertos que trabajan bajo tu gestión, alineados al 100% con tus objetivos.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all duration-300">
                            <ShieldCheck size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-4 font-outfit">Selección Rigurosa (Top 3%)</h4>
                        <p className="text-gray-400 font-outfit leading-relaxed">
                            Evaluamos habilidades técnicas, pensamiento crítico y fit cultural. Solo te presentamos perfiles que ya han superado nuestras pruebas de Live Coding.
                        </p>
                    </div>

                    <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all duration-300">
                            <Zap size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-4 font-outfit">Onboarding en tiempo récord</h4>
                        <p className="text-gray-400 font-outfit leading-relaxed">
                            No esperes meses. Integramos especialistas en tu equipo en un plazo de 2 a 4 semanas, listos para entregar valor desde el primer sprint.
                        </p>
                    </div>

                    <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all duration-300">
                            <Clock size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-4 font-outfit">Alineación Total</h4>
                        <p className="text-gray-400 font-outfit leading-relaxed">
                            Colaboración en tiempo real. Nuestros desarrolladores trabajan en tu franja horaria, dominan el inglés y se suman a tus dailies como un miembro más de la casa.
                        </p>
                    </div>
                </div>

                {/* Process Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Horizontal Line for Desktop */}
                    <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-white/10 z-0" />

                    <div className="relative z-10 pt-16">
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-zinc-800 border-4 border-gray-900 flex items-center justify-center text-white font-bold text-xl">
                            <Search size={24} className="text-[#D83484]" />
                        </div>
                        <h5 className="text-[#D83484] font-bold text-sm uppercase tracking-widest mb-2">Paso 1</h5>
                        <h6 className="text-xl font-bold text-white mb-3 font-outfit">Descubrimiento</h6>
                        <p className="text-gray-400 text-sm font-outfit">Entendemos tus necesidades técnicas y cultura de equipo.</p>
                    </div>

                    <div className="relative z-10 pt-16">
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-zinc-800 border-4 border-gray-900 flex items-center justify-center text-white font-bold text-xl">
                            <UserCheck size={24} className="text-[#D83484]" />
                        </div>
                        <h5 className="text-[#D83484] font-bold text-sm uppercase tracking-widest mb-2">Paso 2</h5>
                        <h6 className="text-xl font-bold text-white mb-3 font-outfit">Match Técnico</h6>
                        <p className="text-gray-400 text-sm font-outfit">Seleccionamos a los mejores candidatos de nuestro pool pre-validado.</p>
                    </div>

                    <div className="relative z-10 pt-16">
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-zinc-800 border-4 border-gray-900 flex items-center justify-center text-white font-bold text-xl">
                            <Zap size={24} className="text-[#D83484]" />
                        </div>
                        <h5 className="text-[#D83484] font-bold text-sm uppercase tracking-widest mb-2">Paso 3</h5>
                        <h6 className="text-xl font-bold text-white mb-3 font-outfit">Integración</h6>
                        <p className="text-gray-400 text-sm font-outfit">Onboarding guiado y escalamiento continuo según la demanda del proyecto.</p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-24">
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white font-bold rounded-full hover:scale-105 transition-all shadow-xl shadow-[#D83484]/20 group"
                    >
                        Escalar mi equipo ahora
                        <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
}

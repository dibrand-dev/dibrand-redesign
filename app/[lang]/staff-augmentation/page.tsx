import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Zap, Search, UserCheck, ArrowUpRight } from 'lucide-react';
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import ScheduleButton from "@/components/ui/ScheduleButton";

export default async function StaffAugmentationPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const content = dict.staffAugmentation;

    return (
        <div className="flex min-h-screen flex-col bg-black">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] w-full flex items-center py-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/staff-aug-hero.png"
                        alt="Elite IT Talent"
                        fill
                        className="object-cover grayscale brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 font-sans leading-tight tracking-tight">
                            {content.hero.title.split('.').map((part, i, arr) => (
                                <React.Fragment key={i}>
                                    {part}{i < arr.length - 1 ? '.' : ''}
                                    {i === 0 && <br />}
                                </React.Fragment>
                            ))}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 font-sans leading-relaxed max-w-3xl mb-12">
                            {content.hero.subtitle}
                        </p>
                        <ScheduleButton text={content.hero.cta} />
                    </div>
                </div>
            </section>

            {/* Detailed Section (The "What is") */}
            <section className="bg-zinc-900 py-24 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 font-sans">
                            {content.whatIs.title}
                        </h2>
                        <p className="text-xl text-gray-400 font-sans leading-relaxed">
                            {content.whatIs.content}
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-black">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {content.benefits.items.map((benefit, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#D83484]/50 transition-all duration-300">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all duration-300">
                                    {idx === 0 && <ShieldCheck size={32} />}
                                    {idx === 1 && <Zap size={32} />}
                                    {idx === 2 && <UserCheck size={32} />}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6 font-sans">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-400 font-sans leading-relaxed">
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-zinc-900 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-20 text-center font-sans">Nuestro Proceso</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Horizontal Line for Desktop */}
                        <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-white/10 z-0" />

                        {content.process.steps.map((step, idx) => (
                            <div key={idx} className="relative z-10 pt-16 group">
                                <div className="absolute top-0 left-0 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full bg-zinc-800 border-4 border-gray-900 flex items-center justify-center text-white font-bold text-xl group-hover:border-[#D83484] transition-colors">
                                    {idx === 0 && <Search size={24} className="text-[#D83484]" />}
                                    {idx === 1 && <UserCheck size={24} className="text-[#D83484]" />}
                                    {idx === 2 && <Zap size={24} className="text-[#D83484]" />}
                                </div>
                                <div className="md:text-center">
                                    <h4 className="text-[#D83484] font-bold text-sm uppercase tracking-widest mb-4">Paso {idx + 1}</h4>
                                    <h5 className="text-2xl font-bold text-white mb-4 font-sans">{step.title}</h5>
                                    <p className="text-gray-400 font-sans leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex justify-center scale-110 md:scale-125">
                        <ScheduleButton text={content.process.cta} />
                    </div>
                </div>
            </section>

            {/* Footer / Contact Section */}
            <Footer dict={dict} />
        </div>
    );
}

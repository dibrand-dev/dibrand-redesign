import React from 'react';
import Image from 'next/image';
import {
    Clock,
    UserCheck,
    Heart,
} from 'lucide-react';
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import ScheduleButton from "@/components/ui/ScheduleButton";
import TrustedBySection from "@/components/home/TrustedBySection";
import { supabase } from "@/lib/supabase";

import StaffingServices from "@/components/staff-augmentation/StaffingServices";

export default async function StaffAugmentationPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const content = dict.staffAugmentation;

    // Fetch brands for social proof
    const { data: rawBrands } = await supabase
        .from('brands')
        .select('id, name, logo_url')
        .eq('is_visible', true);

    const brands = (rawBrands || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        logo_url: b.logo_url
    }));


    const wayIcons = [Clock, UserCheck, Heart];

    return (
        <div className="bg-white overflow-x-hidden">
            {/* Hero Section - Compact & Consistent */}
            <section className="relative min-h-[50vh] w-full flex items-center py-16 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center lg:text-left">
                    <div className="max-w-4xl mx-auto lg:mx-0">
                        <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 font-outfit tracking-tight leading-tight">
                            {content.hero.title}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-500 font-outfit font-light leading-relaxed max-w-2xl mb-8 lg:mx-0 mx-auto">
                            {content.hero.subtitle}
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <ScheduleButton text={content.hero.cta} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Section (The "What is") - Compact & Unified */}
            <section className="bg-white pt-12 pb-2">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 font-outfit tracking-tight">
                            {content.whatIs.title}
                        </h2>
                        <p className="text-lg md:text-xl text-zinc-500 font-outfit font-light leading-relaxed">
                            {content.whatIs.content}
                        </p>
                    </div>
                </div>
            </section>

            {/* New Staffing Services Section */}
            <StaffingServices dict={content.services} />

            {/* Social Proof Section - More Compact & No Borders */}
            <TrustedBySection brands={brands} />

            {/* The Dibrand Way - Confidence Block - Compact */}
            <section className="py-16 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(216,52,132,0.15),transparent_70%)]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-outfit tracking-tight">
                            {content.theDibrandWay.title}
                        </h2>
                        <p className="text-xl text-slate-400 font-outfit font-light">
                            Por qué nuestro staffing marca la diferencia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {content.theDibrandWay.items.map((item, idx) => {
                            const Icon = wayIcons[idx] || Heart;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-brand group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand group-hover:text-white">
                                        <Icon size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-6 font-outfit">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-400 font-outfit font-light leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section - Selection Top 3% - Flat & Clean */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {content.benefits.items.map((benefit, idx) => (
                            <div key={idx} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all duration-300">
                                <span className="inline-block text-brand font-black text-6xl opacity-10 mb-4 font-outfit">0{idx + 1}</span>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-6 font-outfit">
                                    {benefit.title}
                                </h3>
                                <p className="text-zinc-500 font-outfit font-light leading-relaxed">
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer dict={dict} lang={params.lang} />
        </div>
    );
}


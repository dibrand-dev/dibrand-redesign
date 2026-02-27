import React from 'react';
import Image from 'next/image';
import {
    Code2,
    Smartphone,
    Cloud,
    ShieldCheck,
    Database,
    Clock,
    UserCheck,
    Heart,
    ArrowRight
} from 'lucide-react';
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import ScheduleButton from "@/components/ui/ScheduleButton";
import TrustedBySection from "@/components/home/TrustedBySection";
import { supabase } from "@/lib/supabase";

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

    const roleIcons = [Code2, Smartphone, Cloud, ShieldCheck, Database];
    const wayIcons = [Clock, UserCheck, Heart];

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* Hero Section - Light & Elegant */}
            <section className="relative min-h-[70vh] w-full flex items-center py-32 bg-slate-50 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D83484]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-6 relative z-10 text-center lg:text-left">
                    <div className="max-w-4xl mx-auto lg:mx-0">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 font-outfit leading-[1.1] tracking-tight">
                            {content.hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-outfit font-light leading-relaxed max-w-2xl mb-12 lg:mx-0 mx-auto">
                            {content.hero.subtitle}
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <ScheduleButton text={content.hero.cta} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Section (The "What is") - Clean Concept */}
            <section className="bg-white py-28 border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-10 font-outfit tracking-tight">
                            {content.whatIs.title}
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-500 font-outfit font-light leading-relaxed">
                            {content.whatIs.content}
                        </p>
                    </div>
                </div>
            </section>

            {/* Roles Section - Profiles we provide */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-outfit tracking-tight">
                            {content.roles.title}
                        </h2>
                        <div className="h-1.5 w-24 bg-[#D83484] mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {content.roles.items.map((role, idx) => {
                            const Icon = roleIcons[idx] || Code2;
                            return (
                                <div key={idx} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-[#D83484]/30 hover:-translate-y-2 transition-all duration-500">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all duration-300">
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 font-outfit">
                                        {role.title}
                                    </h3>
                                    <p className="text-slate-500 font-outfit font-light leading-relaxed text-sm">
                                        {role.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* The Dibrand Way - Confidence Block */}
            <section className="py-28 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(216,52,132,0.15),transparent_70%)]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
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
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-[#D83484] group-hover:scale-110 transition-transform duration-500 group-hover:bg-[#D83484] group-hover:text-white">
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

            {/* Social Proof Section */}
            <TrustedBySection brands={brands} />

            {/* Benefits Section - Selection Top 3% */}
            <section className="py-28 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {content.benefits.items.map((benefit, idx) => (
                            <div key={idx} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300">
                                <span className="inline-block text-[#D83484] font-black text-6xl opacity-10 mb-4 font-outfit">0{idx + 1}</span>
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-outfit">
                                    {benefit.title}
                                </h3>
                                <p className="text-slate-500 font-outfit font-light leading-relaxed">
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / Contact Section */}
            <Footer dict={dict} />
        </div>
    );
}


'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CaseStudy {
    id: string;
    slug: string;
    title: string;
    summary: string;
    main_image_url: string;
    client_name?: string;
}

interface SelectedWorkProps {
    dict: any;
    lang: string;
    cases: CaseStudy[];
}

export default function SelectedWork({ dict, lang, cases }: SelectedWorkProps) {
    if (!cases || cases.length === 0) return null;

    return (
        <section className="bg-white py-24 md:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit text-zinc-900 tracking-tighter leading-none not-italic">
                            {dict.selectedWork.title}
                        </h2>
                        <div className="mt-6 h-1 w-24 bg-[#a04c97]" />
                    </div>

                    <Link
                        href={`/${lang}/success-stories`}
                        className="inline-flex items-center gap-2 text-[#a04c97] font-black font-outfit uppercase tracking-widest text-[10px] hover:opacity-80 transition-all border border-[#a04c97]/20 px-6 py-3 rounded-full hover:bg-[#a04c97]/5"
                    >
                        {dict.selectedWork.cta}
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>

                {/* Dynamic Grid with Fade-in */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {cases.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group cursor-pointer h-full"
                        >
                            <Link href={`/${lang}/success-stories/${project.slug}`} className="block h-full">
                                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-xl hover:shadow-[#a04c97]/5 transition-all duration-500">
                                    <div className="p-8 pb-4">
                                        <div className="flex flex-col gap-1 mb-6">
                                            <span className="text-[10px] font-black text-[#a04c97]/60 uppercase tracking-[0.2em] font-outfit">
                                                {project.client_name}
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-black font-outfit text-zinc-900 not-italic tracking-tighter leading-tight group-hover:text-[#a04c97] transition-colors">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Image Container */}
                                    <div className="relative aspect-[16/10] w-full overflow-hidden mt-auto">
                                        {project.main_image_url ? (
                                            <Image
                                                src={project.main_image_url}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-[#a04c97]/10 flex items-center justify-center">
                                                <span className="text-[10px] font-black text-[#a04c97] uppercase tracking-widest">Dibrand Case Study</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-zinc-950/5 group-hover:bg-zinc-950/0 transition-colors duration-700" />

                                        {/* Learn More Overlay / Button */}
                                        <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="bg-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2">
                                                <span className="text-[10px] font-black font-outfit uppercase tracking-widest text-zinc-900">
                                                    {dict.selectedWork.viewCase}
                                                </span>
                                                <ArrowRight size={12} className="text-[#a04c97]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

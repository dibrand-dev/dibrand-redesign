'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
        <section className="bg-white py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
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

                {/* Carousel Container */}
                <div className="relative group/carousel [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:bg-zinc-200 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:bg-[#a04c97] [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet]:rounded-full">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1.2}
                        loop={true}
                        centeredSlides={false}
                        grabCursor={true}
                        pagination={{
                            clickable: true,
                            el: '.custom-swiper-pagination',
                        }}
                        navigation={{
                            prevEl: '.custom-swiper-button-prev',
                            nextEl: '.custom-swiper-button-next',
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="!overflow-visible"
                    >
                        {cases.map((project) => (
                            <SwiperSlide key={project.id} className="h-auto">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="group cursor-pointer h-full pb-4"
                                >
                                    <Link href={`/${lang}/success-stories/${project.slug}`} className="block h-full">
                                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-xl hover:shadow-[#a04c97]/5 transition-all duration-500">
                                            <div className="p-6 pb-4">
                                                <div className="flex flex-col gap-1 mb-4">
                                                    <span className="text-[10px] font-black text-[#a04c97]/60 uppercase tracking-[0.2em] font-outfit">
                                                        {project.client_name}
                                                    </span>
                                                    <h3 className="text-xl md:text-2xl font-black font-outfit text-zinc-900 not-italic tracking-tighter leading-tight group-hover:text-[#a04c97] transition-colors line-clamp-2 min-h-[3rem]">
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
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Minimalist Navigation */}
                    <div className="flex items-center justify-between mt-12 px-4">
                        {/* Pagination Dots */}
                        <div className="custom-swiper-pagination flex gap-2 !static !w-auto"></div>

                        {/* Navigation Arrows */}
                        <div className="flex gap-4">
                            <button className="custom-swiper-button-prev p-3 rounded-full border border-zinc-200 text-zinc-400 hover:border-[#a04c97] hover:text-[#a04c97] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="custom-swiper-button-next p-3 rounded-full border border-zinc-200 text-zinc-400 hover:border-[#a04c97] hover:text-[#a04c97] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


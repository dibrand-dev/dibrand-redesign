'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

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
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!cases || cases.length === 0) return null;

    // To robustly prevent hydration mismatch, we render a consistent base structure 
    // on the server that matches the client's first-pass render.
    if (!isMounted) {
        return (
            <section className="bg-white py-24 md:py-32">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div className="h-16 w-64 bg-zinc-100 rounded animate-pulse" />
                        <div className="h-10 w-32 bg-zinc-100 rounded-full animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-2xl h-[400px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

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
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight">
                            {dict.selectedWork.title}
                        </h2>
                        <div className="mt-6 h-1 w-24 bg-[#a04c97]" />
                    </div>

                    <Link
                        href={`/${lang}/success-stories`}
                        className="inline-flex items-center gap-2 text-[#a04c97] font-bold font-outfit uppercase tracking-widest text-[10px] hover:opacity-80 transition-all border border-[#a04c97]/20 px-6 py-3 rounded-full hover:bg-[#a04c97]/5 mb-1"
                    >
                        {dict.selectedWork.cta}
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative group/carousel [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:bg-zinc-200 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:bg-[#a04c97] [&_.swiper-pagination-bullet-active]:w-8 [&_.swiper-pagination-bullet]:rounded-full min-h-[400px]">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1.1}
                        loop={true}
                        centeredSlides={false}
                        grabCursor={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        pagination={{
                            clickable: true,
                            el: '.custom-swiper-pagination',
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
                                    className="group cursor-pointer h-full pb-4 px-1"
                                >
                                    <Link href={`/${lang}/success-stories/${project.slug}`} className="block h-full">
                                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-xl hover:shadow-[#a04c97]/5 transition-all duration-500">
                                            <div className="p-6 pb-4">
                                                <div className="flex flex-col gap-1 mb-4">
                                                    <span className="text-[10px] font-black text-[#a04c97]/60 uppercase tracking-[0.2em] font-outfit">
                                                        {project.client_name}
                                                    </span>
                                                    <h3 className="text-xl md:text-2xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight group-hover:text-[#a04c97] transition-colors line-clamp-2 min-h-[3.5rem]">
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

                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Minimalist Navigation - Centered Dots */}
                    <div className="flex items-center justify-center mt-12 px-4">
                        <div className="custom-swiper-pagination flex gap-3 !static !w-auto"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}


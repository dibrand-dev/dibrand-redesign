'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

interface Testimonial {
    id: string;
    name: string;
    role_es: string;
    role_en: string | null;
    company: string;
    content_es: string;
    content_en: string | null;
    avatar_url?: string;
}

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
    dict: {
        testimonials: {
            title: string;
            subtitle: string;
        };
    };
    lang: string;
}

export default function TestimonialsSection({ testimonials, dict, lang }: TestimonialsSectionProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!testimonials || testimonials.length === 0) return null;
    if (!mounted) return null;

    return (
        <section className="bg-[#000000] py-24 md:py-32 relative w-full" id="testimonials">

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white tracking-tight leading-tight">
                        {dict.testimonials.title}
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-brand mb-6" />
                    <p className="text-base md:text-lg text-gray-300 font-outfit font-light leading-relaxed max-w-2xl">
                        {dict.testimonials.subtitle}
                    </p>
                </div>

                <div className="relative">

                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={32}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="testimonials-swiper"
                    >
                        {testimonials.map((t) => (
                            <SwiperSlide key={t.id} className="h-auto">
                                <div
                                    className="bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col h-full hover:border-brand/30 transition-all duration-300 group"
                                >
                                    <Quote className="h-8 w-8 text-brand opacity-40 mb-6 group-hover:scale-110 transition-transform" />

                                    <p className="text-white text-lg md:text-xl leading-relaxed mb-10 font-outfit font-semibold italic">
                                        "{lang === 'en' ? (t.content_en || t.content_es) : t.content_es}"
                                    </p>

                                    <div className="mt-auto flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full ring-2 ring-white/10 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                                            {t.avatar_url ? (
                                                <Image
                                                    src={t.avatar_url}
                                                    alt={t.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">
                                                    {t.name ? t.name.substring(0, 2).toUpperCase() : '??'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold font-outfit leading-none mb-1">
                                                {t.name}
                                            </div>
                                            <div className="text-gray-300 text-sm font-outfit">
                                                {lang === 'en' ? (t.role_en || t.role_es) : t.role_es}, <span className="text-brand/80">{t.company}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

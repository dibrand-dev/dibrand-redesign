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
        <section className="bg-zinc-800 py-24 lg:py-32 relative overflow-hidden" id="testimonials">
            {/* Background elements refined for zinc-800 */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 transform opacity-10">
                <div className="h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-[#D83484] to-[#A3369D] blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4 font-outfit">
                        {dict.testimonials.title}
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-[#D83484] to-[#A3369D] mb-8" />
                    <p className="text-gray-400 max-w-4xl text-lg font-outfit">
                        {dict.testimonials.subtitle}
                    </p>
                </div>

                <div className="relative">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-800 to-transparent z-10 pointer-events-none hidden md:block" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-800 to-transparent z-10 pointer-events-none hidden md:block" />

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
                                    className="bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col h-full hover:border-[#D83484]/30 transition-all duration-300 group"
                                >
                                    <Quote className="h-8 w-8 text-[#D83484] opacity-40 mb-6 group-hover:scale-110 transition-transform" />

                                    <p className="text-gray-300 text-lg leading-relaxed mb-10 font-outfit italic">
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
                                            <div className="text-gray-500 text-sm font-outfit">
                                                {lang === 'en' ? (t.role_en || t.role_es) : t.role_es}, <span className="text-[#D83484]/80">{t.company}</span>
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

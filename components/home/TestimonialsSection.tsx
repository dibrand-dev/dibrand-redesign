'use client';

import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
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
}

export default function TestimonialsSection({ testimonials, dict }: TestimonialsSectionProps) {
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="bg-gray-900 py-24 lg:py-32 relative overflow-hidden" id="testimonials">
            {/* Background elements */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col h-full hover:border-[#D83484]/30 transition-all duration-300 group"
                        >
                            <Quote className="h-8 w-8 text-[#D83484] opacity-40 mb-6 group-hover:scale-110 transition-transform" />

                            <p className="text-gray-300 text-lg leading-relaxed mb-10 font-outfit italic">
                                "{t.content}"
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
                                        {t.role}, <span className="text-[#D83484]/80">{t.company}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

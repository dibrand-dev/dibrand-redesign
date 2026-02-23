'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
    id: string;
    client_name: string;
    client_logo_url: string;
    quote: string;
    author_name: string;
    author_role: string;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
    dict: {
        testimonials: {
            title: string;
            subtitle: string;
        };
    };
}

export default function Testimonials({ testimonials, dict }: TestimonialsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, [testimonials.length]);

    useEffect(() => {
        if (isPaused || testimonials.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, nextSlide, testimonials.length]);

    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section
            className="bg-white py-24"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        {dict.testimonials.title}
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        {dict.testimonials.subtitle}
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={testimonials[currentIndex].id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 flex flex-col h-full shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="h-12 w-40 relative">
                                    <Image
                                        src={testimonials[currentIndex].client_logo_url}
                                        alt={testimonials[currentIndex].client_name}
                                        fill
                                        className="object-contain object-left filter grayscale opacity-70"
                                    />
                                </div>
                                <Quote className="h-10 w-10 text-[#D83484]/20" />
                            </div>

                            <blockquote className="text-gray-800 text-xl md:text-2xl leading-relaxed mb-10 italic font-medium">
                                "{testimonials[currentIndex].quote}"
                            </blockquote>

                            <div className="mt-auto pt-8 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].author_name}</div>
                                    <div className="text-gray-500">{testimonials[currentIndex].author_role}</div>
                                </div>

                                {/* Client Name Tag */}
                                <div className="text-sm font-bold uppercase tracking-widest text-[#D83484] bg-[#D83484]/5 px-4 py-2 rounded-full">
                                    {testimonials[currentIndex].client_name}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-center items-center gap-6 mt-12">
                    <button
                        onClick={prevSlide}
                        className="p-3 rounded-full border border-gray-200 bg-white text-gray-700 transition-all hover:bg-[#D83484] hover:text-white hover:border-[#D83484] hover:shadow-lg focus:outline-none group"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Dots indicator */}
                    <div className="flex gap-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? 'bg-[#D83484] w-6' : 'bg-gray-300'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="p-3 rounded-full border border-gray-200 bg-white text-gray-700 transition-all hover:bg-[#D83484] hover:text-white hover:border-[#D83484] hover:shadow-lg focus:outline-none group"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}

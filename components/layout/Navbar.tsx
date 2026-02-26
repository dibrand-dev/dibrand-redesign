'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { CONTACT_CALENDAR_URL } from '@/lib/constants';

interface NavbarProps {
    dict: {
        navigation: {
            home: string;
            services: string;
            successCases: string;
            softwareDevelopment: string;
            staffAugmentation: string;
            portfolio: string;
            aboutUs: string;
            careers: string;
            contact: string;
            scheduleCall: string;
            conversionHook: string;
            conversionCta: string;
        };
    };
    lang: string;
}

export default function Navbar({ dict, lang }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // A11y & UX: Control body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinks = [
        { name: dict.navigation.softwareDevelopment, href: `/${lang}#services` },
        { name: dict.navigation.staffAugmentation, href: `/${lang}/staff-augmentation` },
        { name: dict.navigation.portfolio, href: `/${lang}/success-stories` },
        { name: dict.navigation.aboutUs, href: `/${lang}#about` },
    ];

    return (
        <>
            {/* Header top bar */}
            <nav className={clsx(
                "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 w-full h-20 flex items-center justify-between px-6 lg:px-8 pb-3",
                scrolled && !isOpen ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
            )}>
                {/* Contenedor del Logo - Sin márgenes verticales */}
                <div className="flex-shrink-0">
                    <Link href={`/${lang}`} className="flex items-center transition-opacity hover:opacity-90" onClick={() => setIsOpen(false)}>
                        <Image
                            src="/logo_dibrand.png"
                            alt="Dibrand Logo"
                            width={150}
                            height={21}
                            className={clsx("object-contain transition-all duration-300", isOpen ? "brightness-0 invert" : "")}
                            priority
                        />
                    </Link>
                </div>

                {/* Botón del Menú Hamburguesa - Sin márgenes verticales */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] focus:outline-none z-[60]"
                    aria-label="Toggle Menu"
                >
                    <span
                        className={clsx(
                            "block w-8 h-[2px] rounded-full transition-all duration-300 ease-in-out",
                            isOpen ? "bg-white translate-y-[7px] rotate-45" : "bg-gray-900"
                        )}
                    />
                    <span
                        className={clsx(
                            "block w-8 h-[2px] rounded-full transition-all duration-300 ease-in-out",
                            isOpen ? "opacity-0 translate-x-3" : "bg-gray-900"
                        )}
                    />
                    <span
                        className={clsx(
                            "block w-8 h-[2px] rounded-full transition-all duration-300 ease-in-out",
                            isOpen ? "bg-white -translate-y-[7px] -rotate-45" : "bg-gray-900"
                        )}
                    />
                </button>
            </nav>

            {/* Fullscreen Overlay Menu */}
            <div
                className={clsx(
                    "fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-all duration-500 overflow-y-auto",
                    isOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
                )}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center pt-24 pb-12">
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                        {/* Left Column: Navigation Main Links */}
                        <div className="flex flex-col space-y-6 lg:space-y-8">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-4xl lg:text-5xl font-bold text-white hover:text-gray-300 transition-colors w-fit"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Column: B2B Conversion Panel */}
                        <div className="bg-white/5 border border-white/10 p-8 lg:p-10 rounded-3xl backdrop-blur-sm lg:max-w-md ml-auto w-full shadow-2xl">
                            <h3 className="text-2xl font-semibold text-white mb-8 leading-snug">
                                {dict.navigation.conversionHook}
                            </h3>

                            <a
                                href={CONTACT_CALENDAR_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-white text-black px-6 py-4 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all mb-8 hover:scale-[1.02]"
                            >
                                {dict.navigation.conversionCta}
                            </a>

                            <div className="space-y-6 pt-6 border-t border-white/10">
                                <div>
                                    <a href="mailto:hello@dibrand.co" className="text-gray-300 hover:text-white transition-colors text-lg">
                                        hello@dibrand.co
                                    </a>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm mt-4 tracking-widest uppercase font-medium">
                                        REACT · NODE.JS · AWS · WORDPRESS · BUBBLE
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

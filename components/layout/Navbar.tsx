'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';
import { CONTACT_CALENDAR_URL } from '@/lib/constants';
import { trackAppointmentClick } from '@/lib/gtm';

interface NavbarProps {
    dict: {
        navigation: {
            home: string;
            services: string;
            successCases: string;
            staffAugmentation: string;
            softwareOutsourcing: string;
            portfolio: string;
            aboutUs: string;
            careers: string;
            contact: string;
            aiWorkflows: string;
            strategicArchitecture: string;
            softwareDevelopment: string;
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
    const pathname = usePathname();
    const router = useRouter();

    const switchLanguage = (newLang: 'en' | 'es') => {
        // 1. Set cookie for persistence
        document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000;SameSite=Lax`;

        // 2. Redirect to the same path but with new language
        const pathSegments = pathname.split('/');
        pathSegments[1] = newLang;
        const newPath = pathSegments.join('/') || `/${newLang}`;

        router.push(newPath);
        setIsOpen(false);
    };

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
        { name: dict.navigation.softwareDevelopment, href: `/${lang}/servicios/desarrollo-software-ia` },
        { name: dict.navigation.softwareOutsourcing, href: `/${lang}/software-outsourcing` },
        { name: dict.navigation.staffAugmentation, href: `/${lang}/staff-augmentation` },
        { name: dict.navigation.portfolio, href: `/${lang}/success-stories` },
        { name: dict.navigation.careers, href: `/${lang}/join-us` },
        { name: dict.navigation.aboutUs, href: `/${lang}/about` },
    ];

    return (
        <>
            {/* Header top bar */}
            <nav className={clsx(
                "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 w-full h-20 flex items-center justify-between px-6 lg:px-8",
                isOpen ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md shadow-sm border-b border-zinc-100/50'
            )}>
                {/* Contenedor del Logo - Sin márgenes verticales */}
                <div className="flex-shrink-0">
                    <Link href={`/${lang}`} className="flex items-center transition-opacity hover:opacity-90" onClick={() => setIsOpen(false)}>
                        <Image
                            src="/logo_dibrand.svg"
                            alt="Dibrand Logo"
                            width={150}
                            height={21}
                            className={clsx("object-contain transition-all duration-300", isOpen ? "brightness-0 invert" : "")}
                            priority
                        />
                    </Link>
                </div>

                {/* Desktop Navigation - Visible from XL (1280px) for safer tablet coverage */}
                <div className="hidden xl:flex items-center gap-x-8 px-4">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.href}
                            className={clsx(
                                "text-[11px] font-bold font-outfit uppercase tracking-[0.12em] transition-all duration-300 hover:text-brand whitespace-nowrap",
                                pathname === link.href ? "text-brand" : "text-zinc-900"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-12 h-12 flex flex-col items-center justify-center gap-[6px] focus:outline-none z-[70] xl:hidden group"
                    aria-label="Toggle Menu"
                >
                    <span
                        className={clsx(
                            "block w-8 h-[3px] rounded-full transition-all duration-300 ease-in-out",
                            isOpen ? "bg-white translate-y-[9px] rotate-45" : "bg-gray-900 group-hover:bg-brand"
                        )}
                    />
                    <span
                        className={clsx(
                            "block w-8 h-[3px] rounded-full transition-all duration-300 ease-in-out",
                            isOpen ? "opacity-0 translate-x-3" : "bg-gray-900 group-hover:bg-brand"
                        )}
                    />
                    <span
                        className={clsx(
                            "block w-8 h-[3px] rounded-full transition-all duration-300 ease-in-out",
                            isOpen ? "bg-white -translate-y-[9px] -rotate-45" : "bg-gray-900 group-hover:bg-brand"
                        )}
                    />
                </button>
            </nav>

            {/* Fullscreen Overlay Menu - Premium Glassmorphism */}
            <div
                className={clsx(
                    "fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-2xl transition-all duration-500 overflow-y-auto",
                    isOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
                )}
            >
                <div className="container mx-auto px-6 lg:px-12 min-h-screen flex items-center justify-center pt-28 pb-12">
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Left Column: Navigation Main Links */}
                        <div className="flex flex-col space-y-6 lg:space-y-8">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-3xl lg:text-5xl font-bold text-white hover:text-brand transition-all duration-300 w-fit font-outfit tracking-tight group flex items-center gap-4"
                                >
                                    <span className="text-brand opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all font-light text-2xl">•</span>
                                    {link.name}
                                </Link>
                            ))}

                            {/* Language Switcher */}
                            <div className="flex gap-6 pt-12 border-t border-white/10 mt-6 md:mt-10">
                                <button
                                    onClick={() => switchLanguage('en')}
                                    className={clsx(
                                        "text-2xl font-bold transition-all",
                                        lang === 'en' ? "text-brand" : "text-white/40 hover:text-white"
                                    )}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => switchLanguage('es')}
                                    className={clsx(
                                        "text-2xl font-bold transition-all",
                                        lang === 'es' ? "text-brand" : "text-white/40 hover:text-white"
                                    )}
                                >
                                    Español
                                </button>
                            </div>
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
                                onClick={() => trackAppointmentClick(dict.navigation.conversionCta)}
                                className="block w-full text-center bg-white text-black px-6 py-4 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all hover:scale-[1.02]"
                            >
                                {dict.navigation.conversionCta}
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

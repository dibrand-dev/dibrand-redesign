'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';
import { CONTACT_CALENDAR_URL } from '@/lib/constants';

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
            scheduleCall: string;
            conversionHook: string;
            conversionCta: string;
        };
    };
    lang: string;
}

export default function Navbar({ dict, lang }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
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

    type NavLinkType = {
        name: string;
        href?: string;
        isDropdown?: boolean;
        subLinks?: { name: string; href: string }[];
    };
    
    const navLinks: NavLinkType[] = [
        { 
            name: dict.navigation.services, 
            isDropdown: true, 
            subLinks: [
                { name: dict.navigation.softwareOutsourcing, href: `/${lang}/software-outsourcing` },
                { name: dict.navigation.staffAugmentation, href: `/${lang}/staff-augmentation` },
                { name: dict.navigation.aiWorkflows, href: `/${lang}/ai-workflows` },
                { name: dict.navigation.strategicArchitecture, href: `/${lang}/strategic-architecture` },
            ] 
        },
        { name: dict.navigation.portfolio, href: `/${lang}/success-stories` },
        { name: dict.navigation.careers, href: `/${lang}/join-us` },
        { name: dict.navigation.aboutUs, href: `/${lang}/about` },
    ];

    return (
        <>
            {/* Header top bar */}
            <nav className={clsx(
                "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 w-full h-20 flex items-center justify-between px-6 lg:px-8 pb-3",
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
                                link.isDropdown ? (
                                    <div key={idx} className="flex flex-col">
                                        <button 
                                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                                            className="text-3xl lg:text-4xl font-bold text-white hover:text-gray-300 transition-colors w-fit text-left flex items-center justify-between gap-4"
                                        >
                                            {link.name}
                                            <span className={clsx("transition-transform duration-300", isServicesOpen ? "rotate-180" : "rotate-0")}>
                                                <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                            </span>
                                        </button>
                                        <div className={clsx(
                                            "flex flex-col space-y-4 overflow-hidden transition-all duration-300 ease-in-out pl-4 lg:pl-6",
                                            isServicesOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
                                        )}>
                                            {link.subLinks?.map((subLink, subIdx) => (
                                                <Link
                                                    key={subIdx}
                                                    href={subLink.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-xl lg:text-2xl font-semibold text-gray-400 hover:text-brand transition-colors w-fit"
                                                >
                                                    {subLink.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={idx}
                                        href={link.href!}
                                        onClick={() => setIsOpen(false)}
                                        className="text-3xl lg:text-4xl font-bold text-white hover:text-gray-300 transition-colors w-fit"
                                    >
                                        {link.name}
                                    </Link>
                                )
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

import React from 'react';
import { FaLinkedin, FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import ContactForm from "@/components/ContactForm";

import { Dictionary } from '@/lib/types';

interface FooterProps {
    dict: Dictionary;
    lang: string;
}

export default function Footer({ dict, lang }: FooterProps) {
    return (
        <section id="contact" className="bg-black py-20 lg:py-28 relative overflow-hidden border-t border-white/10 w-full">
            {/* Abstract Background for Contact */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 transform opacity-20">
                <div className="h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-brand to-brand blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Columna Izquierda (Información de Contacto) */}
                <div className="flex flex-col">
                    <h2 className="mb-2">
                        <span
                            className="block text-5xl lg:text-6xl font-black text-gray-900 tracking-wide mb-2 leading-none"
                            style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' }}
                        >
                            {dict.footer.title1}
                        </span>
                        <span className="block text-4xl lg:text-5xl font-black text-white leading-tight mb-8">
                            {dict.footer.title2}
                        </span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-8">
                        {dict.footer.subtitle}
                    </p>

                    <p className="text-gray-300 mb-8">
                        PHONES: <a href="tel:+5491124522696" className="hover:text-white transition-colors">+54 9 11 2452 2696</a> &nbsp;{" "}&nbsp; <a href="tel:+5491165939115" className="hover:text-white transition-colors">+54 9 11 6593 9115</a>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold text-white">USA</h4>
                            <p className="text-gray-400">Sheridan, Wyoming</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Argentina</h4>
                            <p className="text-gray-400">Escobar, Buenos Aires</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-12">
                        <div className="flex flex-col gap-2">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Expertise</span>
                            <a href={`/${lang}/software-development`} className="text-gray-400 hover:text-brand transition-colors text-sm">
                                {dict.navigation.softwareDevelopment}
                            </a>
                            <a href={`/${lang}/software-outsourcing`} className="text-gray-400 hover:text-brand transition-colors text-sm">
                                {dict.navigation.softwareOutsourcing}
                            </a>
                            <a href={`/${lang}/staff-augmentation`} className="text-gray-400 hover:text-brand transition-colors text-sm">
                                {dict.navigation.staffAugmentation}
                            </a>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Company</span>
                            <a href={`/${lang}/about`} className="text-gray-400 hover:text-brand transition-colors text-sm">
                                {dict.navigation.aboutUs}
                            </a>
                            <a href={`/${lang}/join-us`} className="text-gray-400 hover:text-brand transition-colors text-sm">
                                {dict.navigation.careers}
                            </a>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Work</span>
                            <a href={`/${lang}/success-stories`} className="text-gray-400 hover:text-brand transition-colors text-sm">
                                {dict.navigation.portfolio}
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-white font-medium">Follow us</span>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="https://www.linkedin.com/company/dibrand/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaLinkedin size={28} />
                            </a>
                            <a href="https://www.facebook.com/dibrand.ok" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook size={28} />
                            </a>
                            <a href="https://www.instagram.com/dibrand.ok/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram size={28} />
                            </a>
                            <a href="https://x.com/Dibrand_ok" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaXTwitter size={28} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha (Formulario) */}
                <div className="col-span-1 w-full">
                    <ContactForm dict={dict} isDark={true} />
                </div>
            </div>

            {/* Copyright & Legal Links */}
            <div className="max-w-7xl mx-auto px-6 relative z-10 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                <p>© {new Date().getFullYear()} Dibrand. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
                <div className="flex items-center gap-6">
                    <a href={lang === 'es' ? '/es/terminos-del-servicio' : '/terms-of-service'} className="hover:text-white transition-colors">
                        {lang === 'es' ? 'Términos y Condiciones' : 'Terms of Service'}
                    </a>
                    <a href={lang === 'es' ? '/es/politica-de-privacidad' : '/privacy-policy'} className="hover:text-white transition-colors">
                        {lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                    </a>
                </div>
            </div>
        </section>
    );
}

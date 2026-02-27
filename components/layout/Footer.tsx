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
                <div className="h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-[#D83484] to-[#A3369D] blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Columna Izquierda (Información de Contacto) */}
                <div className="flex flex-col">
                    <h2 className="mb-2">
                        <span
                            className="block text-5xl lg:text-6xl font-black text-gray-900 tracking-wide mb-2 leading-none"
                            style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' }}
                        >
                            LET&apos;S TALK
                        </span>
                        <span className="block text-4xl lg:text-5xl font-black text-white leading-tight mb-8">
                            about your next project.
                        </span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-8">
                        Tell us how we can help you.
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

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-white font-medium">Join Us</span>
                            <a href={`/${lang}/join-us`} className="text-gray-400 hover:text-[#D83484] transition-colors text-lg">
                                {dict.navigation.careers}
                            </a>
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
                </div>

                {/* Columna Derecha (Formulario) */}
                <div className="col-span-1 w-full">
                    <ContactForm dict={dict} />
                </div>
            </div>
        </section>
    );
}

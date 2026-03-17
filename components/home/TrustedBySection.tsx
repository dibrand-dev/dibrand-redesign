import React from 'react';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

interface Brand {
    id: string;
    name: string;
    logo_url: string;
}

interface TrustedBySectionProps {
    brands: Brand[];
    dict?: any;
}

export default function TrustedBySection({ brands, dict }: TrustedBySectionProps) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="bg-white py-24 md:py-32 overflow-hidden" id="clients">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight">
                        {dict?.trustedByTitle || dict?.home?.trustedByTitle || "Some companies that trust us"}
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-brand" />
                </div>
            </div>

            <div className="relative">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />

                <Marquee
                    gradient={false}
                    speed={40}
                    pauseOnHover={true}
                    className="flex items-center"
                >
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="mx-12 md:mx-20 flex items-center justify-center group"
                        >
                            <div className="relative h-20 md:h-24 w-auto min-w-[150px] flex items-center justify-center">
                                <img
                                    src={brand.logo_url}
                                    alt={brand.name}
                                    className="h-full w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                                />
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}

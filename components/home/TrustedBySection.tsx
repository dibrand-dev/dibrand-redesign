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
    dict?: {
        trustedByTitle: string;
    }
}

export default function TrustedBySection({ brands, dict }: TrustedBySectionProps) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="bg-white py-24 overflow-hidden">
            <div className="container mx-auto px-6 mb-16">
                <div className="flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center font-outfit uppercase">
                        {dict?.trustedByTitle || "SOME COMPANIES THAT TRUST US"}
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-[#D83484] to-[#A3369D] mb-8" />
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

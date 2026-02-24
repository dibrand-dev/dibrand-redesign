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
}

export default function TrustedBySection({ brands }: TrustedBySectionProps) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="bg-white py-12 overflow-hidden">
            <div className="container mx-auto px-6 mb-10">
                <h3 className="text-center text-gray-500 font-outfit text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
                    SOME COMPANIES THAT TRUST US
                </h3>
            </div>

            <Marquee
                gradient={false}
                speed={40}
                pauseOnHover={true}
                className="flex items-center"
            >
                {brands.concat(brands).map((brand, index) => (
                    <div
                        key={`${brand.id}-${index}`}
                        className="mx-8 md:mx-12 flex items-center justify-center group"
                    >
                        <div className="relative h-8 md:h-10 w-auto min-w-[100px] flex items-center justify-center">
                            <img
                                src={brand.logo_url}
                                alt={brand.name}
                                className="h-full w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                            />
                        </div>
                    </div>
                ))}
            </Marquee>
        </section>
    );
}

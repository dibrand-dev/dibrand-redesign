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
        <section className="bg-white py-12 md:py-16 overflow-hidden" id="clients">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-8 md:mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight">
                        {dict?.trustedByTitle || dict?.home?.trustedByTitle || "Some companies that trust us"}
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-brand" />
                </div>
            </div>

            <div 
                className="relative"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                }}
            >
                <Marquee
                    gradient={false}
                    speed={80}
                    pauseOnHover={true}
                    className="flex items-center"
                >
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="mx-10 flex items-center justify-center group"
                        >
                            <div className="relative h-[90px] flex items-center justify-center py-2">
                                <img
                                    src={brand.logo_url}
                                    alt={brand.name}
                                    className="h-[90px] w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                />
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}

import React from 'react';
import { Check } from 'lucide-react';

interface StaffingServicesProps {
    dict: {
        intro: string;
        categories: {
            title: string;
            roles: {
                name: string;
                desc: string;
            }[];
        }[];
    };
}

export default function StaffingServices({ dict }: StaffingServicesProps) {
    const { intro, categories } = dict;

    return (
        <section className="bg-white pt-4 pb-16">
            <div className="container mx-auto px-6">
                {/* Header Section - Compact */}
                <div className="max-w-4xl mb-12">
                    <p className="text-xl md:text-2xl text-zinc-900 font-outfit font-light leading-relaxed">
                        {intro}
                    </p>
                </div>

                {/* 3-Column Grid - Compact & Flat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-16">
                    {categories.map((category, idx) => (
                        <div key={idx} className="flex flex-col">
                            <h3 className="text-xl font-bold text-brand mb-8 font-outfit tracking-tight uppercase">
                                {category.title}
                            </h3>
                            <div className="space-y-8">
                                {category.roles.map((role, roleIdx) => (
                                    <div key={roleIdx} className="flex items-start gap-3 group">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-md bg-brand flex items-center justify-center text-white mt-1 group-hover:scale-110 transition-transform">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-lg font-bold text-zinc-900 font-outfit leading-snug mb-1">
                                                {role.name}
                                            </h4>
                                            <p className="text-sm text-zinc-500 font-outfit font-light leading-relaxed">
                                                {role.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

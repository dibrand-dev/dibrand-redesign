import React from 'react';
import { Check } from 'lucide-react';

export default function StaffingServices() {
    const services = [
        {
            title: "Product & Innovation",
            roles: [
                {
                    name: "Product Managers",
                    desc: "Drive backlog prioritization and roadmap planning."
                },
                {
                    name: "Product Owners & Analysts",
                    desc: "Bridge the gap between business needs and delivery."
                },
                {
                    name: "Innovation Consultants",
                    desc: "Lead discovery sprints and build investment-ready cases."
                }
            ]
        },
        {
            title: "UX/UI Design",
            roles: [
                {
                    name: "UX Designers",
                    desc: "User research, customer journeys, and intuitive flows."
                },
                {
                    name: "UI Designers",
                    desc: "Polished interfaces and scalable design systems."
                },
                {
                    name: "Interaction Designers",
                    desc: "Prototypes and motion that drive user delight."
                }
            ]
        },
        {
            title: "Engineering & AI",
            roles: [
                {
                    name: "FE/BE Developers",
                    desc: "Experts in React, Node.js, Python, and Java."
                },
                {
                    name: "AI & LLM Engineers",
                    desc: "Intelligent systems and agentic applications (LLMs)."
                },
                {
                    name: "Mobile, QA & DevOps",
                    desc: "Native apps, CI/CD, and high-availability systems."
                }
            ]
        }
    ];

    return (
        <section className="bg-white pt-4 pb-16">
            <div className="container mx-auto px-6">
                {/* Header Section - Compact */}
                <div className="max-w-4xl mb-8">
                    <p className="text-base md:text-lg text-zinc-500 font-outfit font-light leading-relaxed">
                        At Dibrand, we help you scale your product, engineering, and innovation capabilities by embedding vetted professionals directly into your organization—minus the complexity.
                    </p>
                </div>

                {/* 3-Column Grid - Compact & Flat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-16">
                    {services.map((service, idx) => (
                        <div key={idx} className="flex flex-col">
                            <h3 className="text-xl font-bold text-[#D83484] mb-8 font-outfit tracking-tight">
                                {service.title}
                            </h3>
                            <div className="space-y-6">
                                {service.roles.map((role, roleIdx) => (
                                    <div key={roleIdx} className="flex items-start gap-3 group">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-md bg-[#D83484] flex items-center justify-center text-white mt-1">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-base font-bold text-zinc-900 font-outfit leading-snug">
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

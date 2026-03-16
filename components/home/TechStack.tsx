import React from 'react';

interface TechStackProps {
    dict: {
        techStack: {
            title: string;
            subtitle: string;
        };
    };
}

const row1 = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'
];

const row2 = [
    '.NET', 'Java', 'Go', 'Swift', 'Kotlin', 'Angular', 'Vue.js', 'PostgreSQL', 'MongoDB'
];

export default function TechStack({ dict }: TechStackProps) {
    return (
        <section className="bg-gray-50 py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4 mb-16 text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                    {dict.techStack.title}
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    {dict.techStack.subtitle}
                </p>
            </div>

            <div className="relative flex flex-col gap-12">
                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

                {/* First Row: Right to Left */}
                <div className="flex overflow-hidden group">
                    <div className="flex animate-scroll whitespace-nowrap gap-16 md:gap-24 items-center px-4">
                        {[...row1, ...row1].map((tech, index) => (
                            <span
                                key={index}
                                className="text-4xl md:text-6xl font-black text-gray-200 hover:text-gray-400 transition-colors cursor-default select-none uppercase tracking-tighter"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Second Row: Left to Right */}
                <div className="flex overflow-hidden group">
                    <div className="flex animate-scroll-reverse whitespace-nowrap gap-16 md:gap-24 items-center px-4">
                        {[...row2, ...row2].map((tech, index) => (
                            <span
                                key={index}
                                className="text-4xl md:text-6xl font-black text-gray-200 hover:text-gray-400 transition-colors cursor-default select-none uppercase tracking-tighter"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

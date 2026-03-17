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
    'OpenAI', 'LangChain', 'Python', 'Anthropic', 'Pinecone', 'Hugging Face', 'PyTorch', 'Next.js', 'TypeScript'
];

const row2 = [
    'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Go', 'Swift', 'Kotlin'
];

export default function TechStack({ dict }: TechStackProps) {
    return (
        <section className="bg-gray-50 py-24 md:py-32 overflow-hidden" id="tech-stack">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight">
                        {dict.techStack.title}
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-brand mb-6" />
                    <p className="text-base md:text-lg text-zinc-500 font-outfit font-light leading-relaxed max-w-2xl">
                        {dict.techStack.subtitle}
                    </p>
                </div>
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

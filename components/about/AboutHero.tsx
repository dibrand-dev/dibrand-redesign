import Image from 'next/image';

interface AboutHeroProps {
    dict: {
        title: string;
        subtitle: string;
    };
    imagePath: string;
}

export default function AboutHero({ dict, imagePath }: AboutHeroProps) {
    return (
        <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
            {/* Background Image */}
            <Image
                src={imagePath}
                alt="Dibrand Office Innovation"
                fill
                priority
                className="object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
            />
            
            {/* Content Over */}
            <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl pt-32 pb-20">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-outfit text-white tracking-tighter leading-[1.1] uppercase mb-8">
                    {dict.title}
                </h1>
                <p className="text-lg md:text-2xl text-zinc-300 font-outfit font-light leading-relaxed max-w-2xl mx-auto">
                    {dict.subtitle}
                </p>
                <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
            </div>
        </section>
    );
}

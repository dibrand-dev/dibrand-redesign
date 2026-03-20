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
        <section className="relative w-full h-[70vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
            {/* Background Image */}
            <Image
                src={imagePath}
                alt="Dibrand Office Innovation"
                fill
                priority
                className="object-cover z-0"
            />
            {/* Readability Overlays */}
            <div className="absolute inset-0 z-10 bg-zinc-950/40" />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.8)_100%)] opacity-70" />
            
            {/* Content Over */}
            <div className="relative z-20 container mx-auto px-6 text-center max-w-4xl pt-32 pb-20">
                <h1 className="text-3xl md:text-5xl lg:text-[54px] font-bold font-outfit text-white tracking-tight leading-[1.1] mb-8">
                    {dict.title}
                </h1>
                <p className="mt-4 md:mt-6 text-base md:text-xl leading-relaxed text-zinc-100 max-w-2xl mx-auto font-outfit font-light">
                    {dict.subtitle}
                </p>
                <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
            </div>
        </section>
    );
}

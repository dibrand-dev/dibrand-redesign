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
                className="object-cover opacity-60"
            />
            
            {/* Content Over */}
            <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl pt-32 pb-20">
                <h1 className="text-3xl md:text-5xl lg:text-[54px] font-bold font-outfit text-white tracking-tight leading-[1.1] uppercase mb-8">
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

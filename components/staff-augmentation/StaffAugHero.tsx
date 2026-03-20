import Image from 'next/image';
import ScheduleButton from '../ui/ScheduleButton';


interface StaffAugHeroProps {
    dict: {
        hero: {
            title: string;
            subtitle1: string;
            subtitle2: string;
            cta: string;
        };
    };
    lang: string;
}

export default function StaffAugHero({ dict, lang }: StaffAugHeroProps) {
    return (
        <section className="relative h-[75vh] min-h-[605px] w-full overflow-hidden flex flex-col bg-zinc-950">
            {/* Background Image - Office vibe with purple acents */}
            <Image
                src="/images/Dibrand-Staff-Augmentation.png"
                alt="Dibrand Staff Augmentation - Elite Latin American Talent"
                fill
                priority
                className="object-cover object-top z-0"
            />

            {/* Enhanced Readability Overlays */}
            <div className="absolute inset-0 z-10 bg-zinc-950/40" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-zinc-950/30 to-zinc-100/10 opacity-30" />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.8)_100%)] opacity-70" />

            {/* Content Centered Stacked */}
            <div className="relative z-20 container mx-auto px-6 flex-grow flex flex-col items-center justify-center text-center pt-32 pb-16">
                <h1 className="font-outfit text-3xl md:text-5xl lg:text-[58px] font-bold tracking-tight text-white leading-[1.1] max-w-5xl">
                    {dict.hero.title}
                </h1>

                <div className="mt-8 md:mt-10 max-w-4xl">
                    <p className="text-xl md:text-3xl font-semibold text-white mb-4 font-outfit">
                        {dict.hero.subtitle1}
                    </p>
                    <p className="text-base md:text-xl leading-relaxed text-white font-outfit font-light max-w-2xl mx-auto opacity-90">
                        {dict.hero.subtitle2}
                    </p>
                </div>

                <div className="mt-10 flex flex-col items-center w-full max-w-4xl">
                    <ScheduleButton text={dict.hero.cta} />
                </div>
            </div>
        </section>
    );
}

import Image from 'next/image';
import ScheduleButton from '../ui/ScheduleButton';


interface StrategicArchitectureHeroProps {
    dict: {
        hero: {
            title: string;
            subtitle: string;
            cta: string;
        };
    };
    lang: string;
}

export default function StrategicArchitectureHero({ dict, lang }: StrategicArchitectureHeroProps) {
    return (
        <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex flex-col">
            <Image
                src="/images/strategic-architecture-hero.png"
                alt="Dibrand Strategic Software Architecture"
                fill
                priority
                className="object-cover z-0"
            />
            <div className="absolute inset-0 z-10 bg-zinc-950/80 md:bg-zinc-950/60" />
            <div className="relative z-20 container mx-auto px-6 flex-grow flex flex-col items-center justify-center text-center pt-32 pb-16">
                <h1 className="font-outfit text-[32px] sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05] md:leading-[1.1] max-w-5xl uppercase">
                    {dict.hero.title}
                </h1>
                <p className="mt-4 md:mt-6 text-base md:text-xl leading-relaxed text-zinc-100 max-w-2xl font-outfit font-light">
                    {dict.hero.subtitle}
                </p>
                <div className="mt-10 flex flex-col items-center w-full max-w-4xl">
                    <ScheduleButton text={dict.hero.cta} />
                </div>
            </div>
        </section>
    );
}

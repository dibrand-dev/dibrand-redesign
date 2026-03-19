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
        <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden flex flex-col">
            {/* Capa 1: Imagen de Fondo */}
            <Image
                src="/images/hero-staff-aug.png"
                alt="Dibrand Staff Augmentation - World Class Engineering"
                fill
                priority
                className="object-cover z-0"
            />

            {/* Capa 2: Overlay de Marca - Darker on mobile for readability */}
            <div className="absolute inset-0 z-10 bg-zinc-950/80 md:bg-zinc-950/60" />

            {/* Capa 3: Contenido de Texto */}
            <div className="relative z-20 container mx-auto px-6 flex-grow flex flex-col items-center justify-center text-center pt-32 pb-16">
                <h1 className="font-outfit text-3xl md:text-5xl lg:text-[64px] font-bold tracking-tight text-white leading-[1.1] max-w-4xl capitalize">
                    {dict.hero.title}
                </h1>

                <div className="mt-8 md:mt-10 max-w-3xl">
                    <p className="text-xl md:text-3xl font-semibold text-white mb-4 font-outfit">
                        {dict.hero.subtitle1}
                    </p>
                    <p className="text-base md:text-xl leading-relaxed text-zinc-100 font-outfit font-light max-w-2xl mx-auto">
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

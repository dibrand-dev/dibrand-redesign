interface WhatWeDoProps {
    dict: {
        whatWeDo: {
            title: string;
            subtitle: string;
            description: string;
            tagline: string;
        };
    };
}

export default function WhatWeDo({ dict }: WhatWeDoProps) {
    return (
        <section className="bg-white py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl text-left">
                    <h2 className="uppercase tracking-widest text-sm font-bold text-[#D83484] mb-4">
                        {dict.whatWeDo.title}
                    </h2>
                    <h3 className="font-montserrat text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                        {dict.whatWeDo.subtitle}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
                        {dict.whatWeDo.description}
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                        {dict.whatWeDo.tagline}
                    </p>
                </div>
            </div>
        </section>
    );
}

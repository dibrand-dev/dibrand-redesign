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
        <section className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl text-left mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl mb-4">
                        {dict.whatWeDo.title}
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-brand to-brand mb-8" />
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 leading-tight">
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

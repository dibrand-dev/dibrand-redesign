
import React from 'react';
import { getDictionary } from "@/lib/dictionaries";
import Footer from "@/components/layout/Footer";
import SpontaneousApplicationForm from "@/components/jobs/SpontaneousApplicationForm";
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function SpontaneousPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const isEn = params.lang === 'en';

    const title = dict.joinOurTeam?.spontaneousTitle || (isEn ? 'Spontaneous Application' : 'Postulación Espontánea');
    const subtitle = dict.joinOurTeam?.spontaneousSubtitle || (isEn 
        ? "Join our Talent Pool and we'll contact you when a match opens up."
        : "Súmate a nuestro Talent Pool y te contactaremos cuando surja una oportunidad.");

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* Header / Navigation Bar */}
            <div className="pt-24 pb-12 border-b border-slate-100 bg-slate-50/50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link 
                        href={`/${params.lang}/join-us`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand transition-colors mb-8 uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} />
                        {isEn ? 'Back to Careers' : 'Volver a Carreras'}
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-[#101828] rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Sparkles size={24} className="text-brand" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 font-inter uppercase tracking-tight italic">
                                    {title}
                                </h1>
                            </div>
                            <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-2xl">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Application Form Content */}
            <main className="flex-1 py-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-slate-200/50">
                        <SpontaneousApplicationForm 
                            lang={params.lang} 
                            dict={dict.joinOurTeam} 
                        />
                    </div>
                </div>
            </main>

            <Footer dict={dict} lang={params.lang} />
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ApplicationFormProps {
    lang: string;
    dict: {
        applyNow: string;
        fullName: string;
        email: string;
        linkedin: string;
        sendApplication: string;
        sending: string;
        success: string;
    };
}

export default function ApplicationForm({ lang, dict }: ApplicationFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Aquí iría la lógica de envío a Supabase o API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-3 font-outfit">{dict.success}</h3>
                <p className="text-zinc-600 font-outfit">We have received your application and will review it shortly. Good luck!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-zinc-900 font-outfit">{dict.applyNow}</h3>
                <p className="text-zinc-500 font-outfit">Please fill in the details below to complete your application.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider font-outfit">{dict.fullName}</label>
                    <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-white border border-zinc-300 rounded-xl focus:ring-4 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider font-outfit">{dict.email}</label>
                    <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-white border border-zinc-300 rounded-xl focus:ring-4 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider font-outfit">{dict.linkedin}</label>
                <input
                    required
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-5 py-4 bg-white border border-zinc-300 rounded-xl focus:ring-4 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900"
                />
            </div>

            <button
                disabled={submitting}
                type="submit"
                className="w-full py-5 bg-[#D83484] text-white font-bold rounded-xl hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group text-lg"
            >
                {submitting ? (
                    <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span>{dict.sendApplication}</span>
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}

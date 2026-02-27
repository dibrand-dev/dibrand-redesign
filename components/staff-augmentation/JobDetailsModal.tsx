'use client';

import React, { useState } from 'react';
import { X, MapPin, Briefcase, Building2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'framer-motion';

interface Job {
    id: string;
    title: string;
    industry: string;
    location: string;
    employment_type: string;
    description: string;
    requirements: string;
    seniority: string;
}

interface JobDetailsModalProps {
    job: Job;
    onClose: () => void;
    texts: {
        applyNow: string;
        fullName: string;
        email: string;
        linkedin: string;
        sendApplication: string;
        sending: string;
        success: string;
    };
}

export default function JobDetailsModal({ job, onClose, texts }: JobDetailsModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-zinc-900/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-zinc-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 font-outfit">{job.title}</h2>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-zinc-500 font-outfit">
                            <div className="flex items-center gap-1.5">
                                <Building2 size={14} className="text-zinc-400" />
                                {job.industry}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Briefcase size={14} className="text-zinc-400" />
                                {job.seniority}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-zinc-400" />
                                {job.location}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    {/* Content */}
                    <div className="prose prose-zinc max-w-none 
                        prose-headings:font-outfit prose-headings:font-bold prose-headings:text-zinc-900
                        prose-p:text-zinc-600 prose-p:leading-relaxed
                        prose-strong:text-zinc-900
                        prose-li:marker:text-zinc-400 prose-li:text-zinc-600
                    ">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {job.description}
                        </ReactMarkdown>

                        {job.requirements && (
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                {job.requirements}
                            </ReactMarkdown>
                        )}
                    </div>

                    <hr className="border-zinc-100" />

                    {/* Application Form */}
                    <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-2">{texts.success}</h3>
                                <p className="text-zinc-600">We'll get back to you soon!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-xl font-bold text-zinc-900 font-outfit mb-6">{texts.applyNow}</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700">{texts.fullName}</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[#D83484]/20 focus:border-[#D83484] outline-none transition-all font-outfit"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700">{texts.email}</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[#D83484]/20 focus:border-[#D83484] outline-none transition-all font-outfit"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700">{texts.linkedin}</label>
                                    <input
                                        required
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[#D83484]/20 focus:border-[#D83484] outline-none transition-all font-outfit"
                                    />
                                </div>

                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full py-4 bg-[#D83484] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {submitting ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {texts.sendApplication}
                                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

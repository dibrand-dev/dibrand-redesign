
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import { createCaseStudy } from '@/app/actions/cases';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function NewCasePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        client_name: '',
        industry: '',
        summary: '',
        description: '',
        challenge: '',
        solution: '',
        outcome_impact: '',
        testimonial_text: '',
        testimonial_author: '',
        image_url: '',
        is_published: true,
        tags: '',
    });
    const [metrics, setMetrics] = useState<Array<{ label: string, value: string }>>([
        { label: 'ROI', value: '' },
        { label: 'Velocity', value: '' }
    ]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleMetricChange = (index: number, field: 'label' | 'value', value: string) => {
        const newMetrics = [...metrics];
        newMetrics[index][field] = value;
        setMetrics(newMetrics);
    };

    const addMetric = () => setMetrics([...metrics, { label: '', value: '' }]);
    const removeMetric = (index: number) => setMetrics(metrics.filter((_, i) => i !== index));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = formData.image_url;

            if (imageFile) {
                setUploading(true);
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('portfolio')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
                setUploading(false);
            }

            const dataToInsert = {
                ...formData,
                results_metrics: metrics.filter(m => m.label && m.value),
                image_url: finalImageUrl,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            await createCaseStudy(dataToInsert);
            router.push('/admin/cases');
            router.refresh();
        } catch (error: any) {
            console.error('Error:', error);
            alert('Error creating case study: ' + (error.message || 'Unknown error'));
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Link href="/admin/cases" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 shadow-sm border border-transparent hover:border-gray-200">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey">New Semantic Case Study</h2>
                    <p className="text-gray-500">Structured data improves SEO and help IAs understand the value.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Basic Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4">1. Core Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Project Title</label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. AI-Powered Healthcare Platform"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">URL Slug (e.g. my-project-name)</label>
                            <input
                                required
                                type="text"
                                name="slug"
                                value={formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                                onChange={handleChange}
                                placeholder="e.g. healthcare-ai-platform"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Client Name</label>
                            <input
                                required
                                type="text"
                                name="client_name"
                                value={formData.client_name}
                                onChange={handleChange}
                                placeholder="e.g. HealthTech Global"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Industry</label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder="e.g. Fintech, Healthcare"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Tags (comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g. React, Next.js, AI"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Card Summary (SEO)</label>
                        <textarea
                            required
                            name="summary"
                            rows={2}
                            value={formData.summary}
                            onChange={handleChange}
                            placeholder="A brief 1-2 sentence overview for listings..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm resize-none"
                        />
                    </div>
                </div>

                {/* 2. Semantic Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4">2. Semantic Narrative</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Challenge (Problem)</label>
                        <textarea
                            name="challenge"
                            rows={4}
                            value={formData.challenge}
                            onChange={handleChange}
                            placeholder="What was the specific business problem?"
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Solution (AI-Augmented)</label>
                        <textarea
                            name="solution"
                            rows={6}
                            value={formData.solution}
                            onChange={handleChange}
                            placeholder="How did you solve it? Mention AI agents and tech stack..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Outcome Impact (Qualitative)</label>
                        <textarea
                            name="outcome_impact"
                            rows={3}
                            value={formData.outcome_impact}
                            onChange={handleChange}
                            placeholder="Summary of the business impact..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* 3. Metrics */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-lg font-bold text-gray-900">3. Key Metrics (Prominent)</h3>
                        <button
                            type="button"
                            onClick={addMetric}
                            className="text-sm font-bold text-brand hover:underline"
                        >
                            + Add Metric
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {metrics.map((metric, index) => (
                            <div key={index} className="flex gap-2 items-start bg-gray-50 p-4 rounded-xl relative group">
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Label (e.g. ROI)"
                                        value={metric.label}
                                        onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none bg-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g. 3.5x)"
                                        value={metric.value}
                                        onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                                        className="w-full px-3 py-1.5 text-lg font-black border border-gray-200 rounded-lg outline-none bg-white font-outfit"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeMetric(index)}
                                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Testimonial */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4">4. Client Testimonial</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Testimonial Text</label>
                        <textarea
                            name="testimonial_text"
                            rows={3}
                            value={formData.testimonial_text}
                            onChange={handleChange}
                            placeholder="What did the client say about the project?"
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Author Name & Position</label>
                        <input
                            type="text"
                            name="testimonial_author"
                            value={formData.testimonial_author}
                            onChange={handleChange}
                            placeholder="e.g. John Doe, CTO at HealthTech"
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* 5. Media & Visibility */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4">4. Media & Metadata</h3>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700 block">Project Image</label>

                        {imagePreview && (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-brand transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="mb-2 text-sm text-gray-500 font-medium">Click to upload brand asset</p>
                                    <p className="text-xs text-gray-400">16:9 Aspect ratio recommended</p>
                                </div>
                            </label>
                        </div>
                        {uploading && <p className="text-sm text-brand font-bold animate-pulse">Uploading...</p>}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_published"
                            name="is_published"
                            checked={formData.is_published}
                            onChange={handleChange}
                            className="w-5 h-5 text-brand border-gray-200 rounded focus:ring-brand"
                        />
                        <label htmlFor="is_published" className="text-sm font-bold text-gray-700 select-none">
                            Publish immediately to global portfolio
                        </label>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-6">
                    <Link href="/admin/cases" className="px-8 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all font-outfit uppercase text-xs tracking-widest">
                        Cancel
                    </Link>
                    <button
                        disabled={loading}
                        type="submit"
                        className="inline-flex items-center gap-2 px-12 py-3 bg-brand text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-brand/20 transform active:scale-95 font-outfit uppercase text-xs tracking-widest"
                    >
                        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        <span>{loading ? 'Saving...' : 'Deploy Case Study'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}


'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getCaseStudy, updateCaseStudy, deleteCaseStudy } from '@/app/actions/cases';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
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
        project_type: '',
    });
    const [services, setServices] = useState<string[]>([]);

    const AVAILABLE_SERVICES = [
        "Product Discovery & Strategy",
        "UI/UX Design",
        "Web Development",
        "Mobile Development",
        "Backend Engineering",
        "Cloud & DevOps",
        "QA & Testing",
        "AI & Machine Learning Integration",
        "Staff Augmentation",
        "Outsourcing"
    ];

    const PROJECT_TYPES = [
        "Web App",
        "Mobile App",
        "Full-Stack Platform",
        "MVP",
        "AI Solution"
    ];
    const [metrics, setMetrics] = useState<Array<{ label: string, value: string }>>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCase();
    }, [id]);

    async function fetchCase() {
        try {
            const data = await getCaseStudy(id);
            if (data) {
                setFormData({
                    title: data.title || '',
                    client_name: data.client_name || '',
                    industry: data.industry || '',
                    summary: data.summary || '',
                    description: data.description || '',
                    challenge: data.challenge || '',
                    solution: data.solution || '',
                    outcome_impact: data.outcome_impact || '',
                    testimonial_text: data.testimonial_text || '',
                    testimonial_author: data.testimonial_author || '',
                    image_url: data.image_url || '',
                    is_published: data.is_published,
                    tags: (data.tags || []).join(', '),
                    project_type: data.project_type || '',
                });
                setServices(data.services || []);
                setMetrics(data.results_metrics || [
                    { label: 'ROI', value: '' },
                    { label: 'Velocity', value: '' }
                ]);
            }
        } catch (error: any) {
            alert('Error fetching case study: ' + (error.message || 'Unknown error'));
            router.push('/admin/cases');
        }
        setLoading(false);
    }

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

    const toggleService = (service: string) => {
        setServices(prev =>
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
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
        setSaving(true);

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

            const dataToUpdate = {
                ...formData,
                services,
                results_metrics: metrics.filter(m => m.label && m.value),
                image_url: finalImageUrl,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            await updateCaseStudy(id, dataToUpdate);
            router.push('/admin/cases');
            router.refresh();
        } catch (error: any) {
            console.error('Error:', error);
            alert('Error updating case study: ' + (error.message || 'Unknown error'));
            setSaving(false);
            setUploading(false);
        }
    };

    const handleDeleteCase = async () => {
        if (!confirm('Are you sure you want to delete this case study?')) return;

        setSaving(true);
        try {
            await deleteCaseStudy(id);
            router.push('/admin/cases');
            router.refresh();
        } catch (error: any) {
            alert('Error deleting case study: ' + (error.message || 'Unknown error'));
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading case study...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cases" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 shadow-sm border border-transparent hover:border-gray-200">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-corporate-grey">Edit Case Study</h2>
                        <p className="text-gray-500">Update the details of your project.</p>
                    </div>
                </div>
                <button
                    onClick={handleDeleteCase}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 flex items-center gap-2"
                >
                    <Trash2 size={18} />
                    <span className="font-semibold text-sm">Delete Case</span>
                </button>
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
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Client Name</label>
                            <input
                                required
                                type="text"
                                name="client_name"
                                value={formData.client_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Industry</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange as any}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm bg-white"
                            >
                                <option value="">Select an industry...</option>
                                <option value="Media & Entertainment">Media & Entertainment</option>
                                <option value="Fintech">Fintech</option>
                                <option value="E-commerce & Retail">E-commerce & Retail</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="EdTech">EdTech</option>
                                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="SaaS / Enterprise Software">SaaS / Enterprise Software</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Project Type</label>
                            <select
                                name="project_type"
                                value={formData.project_type}
                                onChange={handleChange as any}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm bg-white"
                            >
                                <option value="">Select a project type...</option>
                                {PROJECT_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Tech Stack (comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g. React, Node.js, Python, AWS"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Services Provided</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_SERVICES.map(service => {
                                const isSelected = services.includes(service);
                                return (
                                    <button
                                        type="button"
                                        key={service}
                                        onClick={() => toggleService(service)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-outfit uppercase tracking-wider transition-all shadow-sm border ${isSelected ? 'bg-brand border-brand text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-brand/40 hover:bg-gray-50'}`}
                                    >
                                        {service}
                                    </button>
                                );
                            })}
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
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4">5. Media & Metadata</h3>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700 block">Project Image</label>

                        {(imagePreview || formData.image_url) && (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                                <Image
                                    src={imagePreview || formData.image_url}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-brand transition-all group"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="mb-2 text-sm text-gray-500 font-medium">Click to upload brand asset</p>
                                    <p className="text-xs text-gray-400">16:9 Aspect ratio recommended</p>
                                </div>
                            </label>
                        </div>
                        {uploading && (
                            <p className="text-sm text-brand font-bold animate-pulse">Uploading image...</p>
                        )}
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
                            Published to global portfolio
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href="/admin/cases"
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={saving}
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-brand to-brand text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-md transform active:scale-95"
                    >
                        {saving ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{saving ? 'Updating...' : 'Update Case Study'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

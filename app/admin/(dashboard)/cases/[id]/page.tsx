
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
        summary: '',
        description: '',
        image_url: '',
        is_published: true,
        tags: '',
    });
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
                    title: data.title,
                    client_name: data.client_name,
                    summary: data.summary,
                    description: data.description,
                    image_url: data.image_url || '',
                    is_published: data.is_published,
                    tags: (data.tags || []).join(', '),
                });
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Project Title</label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Short Summary</label>
                        <textarea
                            required
                            name="summary"
                            rows={2}
                            value={formData.summary}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
                        <textarea
                            required
                            name="description"
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700 block">Project Image</label>

                        {(imagePreview || formData.image_url) && (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200">
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
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X size={16} />
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
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-primary transition-all group"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 group-hover:text-primary transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-400">PNG, JPG or WebP (MAX. 800x400px)</p>
                                </div>
                            </label>
                        </div>
                        {uploading && (
                            <p className="text-sm text-primary font-medium animate-pulse">Uploading image...</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_published"
                            name="is_published"
                            checked={formData.is_published}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="is_published" className="text-sm font-medium text-gray-700 select-none">
                            Published
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
                        className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-md transform active:scale-95"
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

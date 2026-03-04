
'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getCaseStudies() {
    const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getCaseStudy(id: string) {
    const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createCaseStudy(formData: any) {
    // Slug generation fallback
    if (!formData.slug && formData.title) {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const { error } = await supabase
        .from('case_studies')
        .insert([formData]);

    if (error) throw error;

    // Revalidate admin and public routes
    revalidatePath('/admin/cases');
    revalidatePath('/[lang]/success-stories', 'layout');
    revalidatePath('/[lang]/success-stories/[slug]', 'layout');

    return { success: true };
}

export async function updateCaseStudy(id: string, formData: any) {
    // Slug generation fallback
    if (!formData.slug && formData.title) {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const { error } = await supabase
        .from('case_studies')
        .update(formData)
        .eq('id', id);

    if (error) throw error;

    // Revalidate admin and public routes
    revalidatePath('/admin/cases');
    revalidatePath(`/admin/cases/${id}`);
    revalidatePath('/[lang]/success-stories', 'layout');
    revalidatePath(`/[lang]/success-stories/[slug]`, 'layout');
    if (formData.slug) {
        revalidatePath(`/[lang]/success-stories/${formData.slug}`, 'layout');
    }

    return { success: true };
}

export async function toggleCaseStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase
        .from('case_studies')
        .update({ is_published: !currentStatus })
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/cases');
    return { success: true };
}

export async function deleteCaseStudy(id: string) {
    const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/cases');
    return { success: true };
}

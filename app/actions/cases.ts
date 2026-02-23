
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
    const { error } = await supabase
        .from('case_studies')
        .insert([formData]);

    if (error) throw error;
    revalidatePath('/admin/cases');
    return { success: true };
}

export async function updateCaseStudy(id: string, formData: any) {
    const { error } = await supabase
        .from('case_studies')
        .update(formData)
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/cases');
    revalidatePath(`/admin/cases/${id}`);
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

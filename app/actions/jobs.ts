
'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from '@/lib/logging';

export async function getJobs() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getJob(id: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createJob(formData: any) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('job_openings')
        .insert([{
            title: formData.title,
            title_es: formData.title_es,
            title_en: formData.title_en,
            industry: formData.industry,
            location: formData.location,
            location_es: formData.location_es,
            location_en: formData.location_en,
            employment_type: formData.employment_type,
            description: formData.description,
            description_es: formData.description_es,
            description_en: formData.description_en,
            requirements: formData.requirements,
            requirements_es: formData.requirements_es,
            requirements_en: formData.requirements_en,
            seniority: formData.seniority,
            modality: formData.modality,
            salary_range: formData.salary_range,
            is_active: formData.is_active,
        }]);

    if (error) throw error;

    await logAdminAction('publicó búsqueda', 'job_opening', formData.title_es || formData.title);

    revalidatePath('/admin/jobs');
    revalidatePath('/en/join-us');
    revalidatePath('/es/join-us');
    return { success: true };
}

export async function updateJob(id: string, formData: any) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('job_openings')
        .update({
            title: formData.title,
            title_es: formData.title_es,
            title_en: formData.title_en,
            industry: formData.industry,
            location: formData.location,
            location_es: formData.location_es,
            location_en: formData.location_en,
            employment_type: formData.employment_type,
            description: formData.description,
            description_es: formData.description_es,
            description_en: formData.description_en,
            requirements: formData.requirements,
            requirements_es: formData.requirements_es,
            requirements_en: formData.requirements_en,
            seniority: formData.seniority,
            modality: formData.modality,
            salary_range: formData.salary_range,
            is_active: formData.is_active,
        })
        .eq('id', id);

    if (error) throw error;

    await logAdminAction('actualizó búsqueda', 'job_opening', formData.title_es || formData.title);

    revalidatePath('/admin/jobs');
    revalidatePath(`/en/join-us/${id}`);
    revalidatePath(`/es/join-us/${id}`);
    revalidatePath('/en/join-us');
    revalidatePath('/es/join-us');
    return { success: true };
}

export async function toggleJobStatus(id: string, currentStatus: boolean) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('job_openings')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) throw error;

    await logAdminAction(currentStatus ? 'pausó búsqueda' : 'activó búsqueda', 'job_opening', id);

    revalidatePath('/admin/jobs');
    return { success: true };
}

export async function deleteJob(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('job_openings')
        .delete()
        .eq('id', id);

    if (error) throw error;

    await logAdminAction('eliminó búsqueda', 'job_opening', id);

    revalidatePath('/admin/jobs');
    return { success: true };
}

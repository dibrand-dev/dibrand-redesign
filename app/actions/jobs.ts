
'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

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
        .insert([formData]);

    if (error) throw error;
    revalidatePath('/admin/jobs');
    return { success: true };
}

export async function updateJob(id: string, formData: any) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('job_openings')
        .update(formData)
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/jobs');
    revalidatePath(`/admin/jobs/${id}`);
    return { success: true };
}

export async function toggleJobStatus(id: string, currentStatus: boolean) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('job_openings')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) throw error;
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
    revalidatePath('/admin/jobs');
    return { success: true };
}

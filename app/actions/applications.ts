'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function submitApplication(formData: any) {
    const dataToInsert = {
        ...formData,
        status: 'New',
        source: 'Website'
    };

    const { error } = await supabase
        .from('job_applications')
        .insert([dataToInsert]);

    if (error) {
        console.error('Database Error:', error);
        // Throw a more descriptive error that includes the Postgres message
        throw new Error(error.message + (error.details ? ': ' + error.details : ''));
    }

    revalidatePath('/admin/candidates');
    return { success: true };
}

export async function uploadResume(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, buffer, {
            contentType: 'application/pdf',
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

    return publicUrl;
}

export async function getTechStacks() {
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('id, name')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

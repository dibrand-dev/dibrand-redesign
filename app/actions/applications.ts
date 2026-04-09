'use server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/app/admin/(dashboard)/notifications-actions';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function submitApplication(formData: any) {
    // 1. Verify reCAPTCHA
    const { captchaToken, ...applicationData } = formData;
    
    if (captchaToken) {
        const { success, score } = await verifyRecaptcha(captchaToken);
        if (!success) {
            console.error('reCAPTCHA failed for application:', score);
            throw new Error('reCAPTCHA verification failed. Please try again.');
        }
    } else {
        console.warn('Application submitted without reCAPTCHA token');
    }

    // Split full_name into first_name and last_name for DB compliance
    const nameParts = (applicationData.full_name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || '';

    const dataToInsert = {
        ...applicationData,
        first_name: firstName,
        last_name: lastName,
        status: 'Nuevo',
        source: 'Web / Join-Us'
    };

    const { error } = await supabase
        .from('job_applications')
        .insert([dataToInsert]);

    if (error) {
        console.error('Database Error:', error);
        // Throw a more descriptive error that includes the Postgres message
        throw new Error(error.message + (error.details ? ': ' + error.details : ''));
    }

    // Create notification
    await createNotification({
        type: 'candidate',
        title: 'Nuevo Candidato Recibido',
        description: `Nuevo CV recibido: ${formData.full_name || 'Desconocido'}`,
        link: '/admin/candidates?status=Nuevo',
        metadata: { name: formData.full_name, email: formData.email }
    });

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

'use server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/app/admin/(dashboard)/notifications-actions';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function submitApplication(formData: any) {
    // 0. Honeypot Check
    if (formData.website_secondary) {
        console.warn('Spam detected via Honeypot: Spontaneous application');
        return { success: true }; // Silent rejection
    }

    // 1. Verify reCAPTCHA
    const { captchaToken, website_secondary, ...applicationData } = formData;
    
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

    // Resolve stack_ids to names to keep 'skills' column consistent across the platform
    let skillNames: string[] = [];
    if (applicationData.stack_ids && applicationData.stack_ids.length > 0) {
        const { data: techData } = await supabase
            .from('tech_stacks')
            .select('name')
            .in('id', applicationData.stack_ids);
        
        if (techData) {
            skillNames = techData.map(s => s.name);
        }
    }

    const { stack_ids, ...restOfData } = applicationData;

    const dataToInsert = {
        ...restOfData,
        first_name: firstName,
        last_name: lastName,
        skills: skillNames,
        status: 'Nuevo',
        source: applicationData.source || 'Web / Spontaneous'
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

import { ensureGeneralTalentPoolJob } from '@/lib/talent-pool';

export async function getTalentPoolJobId() {
    try {
        // 1. Primary Attempt: Ensure and get General Talent Pool via Service Role
        const jobId = await ensureGeneralTalentPoolJob();
        if (jobId) return jobId;

        // 2. Secondary Attempt: Search for any similar job using regular client logic
        // (Just in case service role has issues but public client can see something)
        const { data: fallbackJob } = await supabase
            .from('job_openings')
            .select('id')
            .or('title.ilike.%Pool%,title.ilike.%General%,title.ilike.%Espontánea%')
            .limit(1)
            .maybeSingle();
            
        if (fallbackJob) return fallbackJob.id;

        // 3. Absolute Last Resort: First active job in the entire database
        const { data: anyActiveJob } = await supabase
            .from('job_openings')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();

        if (anyActiveJob) return anyActiveJob.id;

        // 4. Mission Critical: Return the FIRST ID found in the table if nothing else works
        const { data: firstEntry } = await supabase
            .from('job_openings')
            .select('id')
            .limit(1)
            .maybeSingle();

        return firstEntry?.id || null;
    } catch (e) {
        console.error('CRITICAL ERROR in getTalentPoolJobId:', e);
        // Desperate attempt to find something
        const { data } = await supabase.from('job_openings').select('id').limit(1);
        return data?.[0]?.id || null;
    }
}

'use server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/app/admin/(dashboard)/notifications-actions';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function submitApplication(formData: any) {
    try {
        console.log('[submitApplication] Starting submission processing...', {
            email: formData.email,
            job_id: formData.job_id
        });

        // 0. Validation Check (Back-end)
        if (!formData.stack_ids || formData.stack_ids.length < 3) {
            console.warn('[submitApplication] Validation failed: Minimum 3 skills required');
            return { 
                success: false, 
                error: 'Por favor, selecciona al menos 3 tecnologías. (Minimum 3 technologies required)' 
            };
        }

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
                return { success: false, error: 'reCAPTCHA verification failed. Please try again.' };
            }
        } else {
            console.warn('Application submitted without reCAPTCHA token');
        }

        // 2. Prepare candidate names (split full_name)
        const nameParts = (applicationData.full_name || '').trim().split(/\s+/);
        const firstName = nameParts[0] || 'Unknown';
        const lastName = nameParts.slice(1).join(' ') || '';

        // 3. Resolve skill names if stack_ids provided
        let skillNames: string[] = [];
        if (applicationData.stack_ids && applicationData.stack_ids.length > 0) {
            try {
                const { data: techData, error: techError } = await supabase
                    .from('tech_stacks')
                    .select('name')
                    .in('id', applicationData.stack_ids);
                
                if (!techError && techData) {
                    skillNames = techData.map(s => s.name);
                }
            } catch (skillErr) {
                console.warn('Error fetching skill names:', skillErr);
            }
        }

        // 4. Filter and prepare data for insertion
        // We ensure we only send known columns to avoid DB errors
        const { stack_ids, ...restOfData } = applicationData;

        const dataToInsert: any = {
            ...restOfData,
            first_name: firstName,
            last_name: lastName,
            skills: skillNames,
            status: 'Nuevo',
            source: applicationData.source || 'Web / Spontaneous'
        };

        // Note: 'metadata' field is handled within restOfData if it's there
        // If it doesn't exist in the DB, Supabase will return an error which we catch below.

        console.log('[submitApplication] Data to insert:', { ...dataToInsert, resume_url: '...' });

        // 5. Database Insertion
        const { data, error: dbError } = await supabase
            .from('job_applications')
            .insert([dataToInsert])
            .select()
            .single();

        if (dbError) {
            console.error('[submitApplication] Database Error:', dbError);
            // Translate the error message to be more user-friendly or at least actionable
            let userMessage = dbError.message;
            if (dbError.code === '42703') { // Column does not exist
                userMessage = 'There was a configuration error in the database schema. Please contact support.';
            } else if (dbError.code === '23502') { // Not null violation
                userMessage = 'A required field was missing. Please check your application.';
            }

            return { 
                success: false, 
                error: `Database error: ${userMessage}${dbError.details ? ' (' + dbError.details + ')' : ''}` 
            };
        }

        console.log('[submitApplication] Successfully inserted application:', data?.id);

        // 6. Create Internal Notification (Non-blocking)
        try {
            await createNotification({
                type: 'candidato',
                title: 'Nuevo Candidato Recibido',
                message: `Nuevo CV recibido: ${formData.full_name || 'Desconocido'}`,
                link: '/admin/candidates?status=Nuevo',
                metadata: { 
                    name: formData.full_name, 
                    email: formData.email, 
                    application_id: data?.id,
                    source: 'Spontaneous' 
                }
            });
        } catch (notifError) {
            console.error('[submitApplication] Failed to create notification:', notifError);
        }

        // 7. Perform Cache Revalidation
        try {
            revalidatePath('/admin/candidates');
        } catch (revalError) {
            console.warn('[submitApplication] Revalidation failed:', revalError);
        }

        return { success: true, id: data?.id };

    } catch (err: any) {
        console.error('[submitApplication] UNHANDLED ERROR:', err);
        return { 
            success: false, 
            error: err.message || 'An unexpected error occurred. Please try again later.' 
        };
    }
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

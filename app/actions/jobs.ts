import { createAdminClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from '@/lib/logging';
import { generateSlug } from '@/lib/utils';

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

async function ensureUniqueSlug(supabase: any, baseSlug: string, currentId?: string) {
    let slug = baseSlug;
    let isUnique = false;
    let counter = 0;

    while (!isUnique) {
        let query = supabase
            .from('job_openings')
            .select('id')
            .eq('slug', slug);
        
        if (currentId) {
            query = query.neq('id', currentId);
        }

        const { data } = await query.maybeSingle();
        
        if (!data) {
            isUnique = true;
        } else {
            counter++;
            const randomSuffix = Math.random().toString(36).substring(2, 6);
            slug = `${baseSlug}-${randomSuffix}`;
            
            if (counter > 5) {
                slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
                break;
            }
        }
    }
    return slug;
}

export async function createJob(formData: any) {
    const supabase = createAdminClient();
    
    // Generate base slug from title (Spanish preferred, fallback to title)
    const baseSlug = generateSlug(formData.title_es || formData.title);
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug);

    const { error } = await supabase
        .from('job_openings')
        .insert([{
            title: formData.title,
            title_es: formData.title_es,
            title_en: formData.title_en,
            slug: uniqueSlug,
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
            questionnaire: formData.questionnaire,
            required_language: formData.required_language,
            years_of_experience: formData.years_of_experience,
            positions_count: formData.positions_count
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
    
    // Check if we need to regenerate slug (if title changed or slug is missing)
    const { data: currentJob } = await supabase.from('job_openings').select('title, title_es, slug').eq('id', id).maybeSingle();
    
    let updatedSlug = currentJob?.slug;
    const newTitle = formData.title_es || formData.title;
    const oldTitle = currentJob?.title_es || currentJob?.title;

    if (!updatedSlug || newTitle !== oldTitle) {
        const baseSlug = generateSlug(newTitle);
        updatedSlug = await ensureUniqueSlug(supabase, baseSlug, id);
    }

    const { error } = await supabase
        .from('job_openings')
        .update({
            title: formData.title,
            title_es: formData.title_es,
            title_en: formData.title_en,
            slug: updatedSlug,
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
            questionnaire: formData.questionnaire,
            required_language: formData.required_language,
            years_of_experience: formData.years_of_experience,
            positions_count: formData.positions_count
        })
        .eq('id', id);

    if (error) throw error;

    await logAdminAction('actualizó búsqueda', 'job_opening', formData.title_es || formData.title);

    revalidatePath('/admin/jobs');
    revalidatePath(`/en/join-us/${updatedSlug}`);
    revalidatePath(`/es/join-us/${updatedSlug}`);
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

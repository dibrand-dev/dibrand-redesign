'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getSuccessStories() {
    const { data, error } = await supabase
        .from('success_stories')
        .select('id, title, client_company, industry, project_type, created_at')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getSuccessStory(id: string) {
    const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// ─── Helper: resolve tech stack IDs to names ────────────────────────────────
async function resolveStackNames(stackIds: string[]): Promise<string[]> {
    if (!stackIds || stackIds.length === 0) return [];
    const { data } = await supabase
        .from('tech_stacks')
        .select('name')
        .in('id', stackIds);
    return data?.map(s => s.name) || [];
}

// ─── Helper: sync data to case_studies (frontend table) ─────────────────────
async function syncToCaseStudies(payload: {
    title: string;
    client_company: string;
    executive_summary: string;
    hero_image_url: string;
    industry: string;
    project_type?: string;
    services?: string[];
    stack_ids: string[];
    problem_text: string;
    solution_text: string;
    result_text: string;
}) {
    const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tags = await resolveStackNames(payload.stack_ids);

    const caseData: any = {
        title: payload.title,
        client_name: payload.client_company,
        summary: payload.executive_summary,
        image_url: payload.hero_image_url,
        industry: payload.industry,
        slug,
        challenge: payload.problem_text,
        solution: payload.solution_text,
        outcome_impact: payload.result_text,
        tags,
        is_published: true,
        // Almacenar metadata extra en el formato que espera el frontend
        results_metrics: [
            {
                label: '__METADATA__', value: JSON.stringify({
                    project_type: payload.project_type,
                    services: payload.services
                })
            }
        ]
    };

    // Try to upsert: update if slug exists, insert otherwise
    const { data: existing } = await supabase
        .from('case_studies')
        .select('id')
        .ilike('slug', slug)
        .single();

    if (existing) {
        await supabase
            .from('case_studies')
            .update(caseData)
            .eq('id', existing.id);
    } else {
        await supabase
            .from('case_studies')
            .insert([caseData]);
    }

    // Revalidate frontend routes
    revalidatePath('/[lang]/success-stories', 'layout');
    revalidatePath(`/[lang]/success-stories/${slug}`, 'layout');
}

export async function createSuccessStory(payload: {
    title: string;
    client_company: string;
    executive_summary: string;
    hero_image_url: string;
    project_type: string;
    industry: string;
    services: string[];
    stack_ids: string[];
    problem_text: string;
    solution_text: string;
    result_text: string;
}) {
    const { error } = await supabase.from('success_stories').insert([payload]);
    if (error) throw new Error(error.message);

    // Sync to case_studies for frontend
    await syncToCaseStudies(payload);

    revalidatePath('/admin/success-stories');
    redirect('/admin/success-stories');
}

export async function updateSuccessStory(id: string, payload: Partial<{
    title: string;
    client_company: string;
    executive_summary: string;
    hero_image_url: string;
    project_type: string;
    industry: string;
    services: string[];
    stack_ids: string[];
    problem_text: string;
    solution_text: string;
    result_text: string;
}>) {
    const { error } = await supabase
        .from('success_stories')
        .update(payload)
        .eq('id', id);
    if (error) throw new Error(error.message);

    // Fetch full row to sync to case_studies
    const { data: fullRow } = await supabase
        .from('success_stories')
        .select('*')
        .eq('id', id)
        .single();

    if (fullRow) {
        await syncToCaseStudies({
            title: fullRow.title,
            client_company: fullRow.client_company,
            executive_summary: fullRow.executive_summary,
            hero_image_url: fullRow.hero_image_url,
            industry: fullRow.industry,
            project_type: fullRow.project_type,
            services: fullRow.services || [],
            stack_ids: fullRow.stack_ids || [],
            problem_text: fullRow.problem_text,
            solution_text: fullRow.solution_text,
            result_text: fullRow.result_text,
        });
    }

    revalidatePath('/admin/success-stories');
    revalidatePath(`/admin/success-stories/${id}`);
    redirect('/admin/success-stories');
}


export async function deleteSuccessStory(id: string) {
    const { error } = await supabase
        .from('success_stories')
        .delete()
        .eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/success-stories');
}

export async function getTechStacks() {
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('id, name')
        .order('name');
    if (error) throw error;
    return data || [];
}

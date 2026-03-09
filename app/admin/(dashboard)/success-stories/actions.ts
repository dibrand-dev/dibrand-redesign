'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getSuccessStories() {
    const { data, error } = await supabase
        .from('success_stories')
        .select('id, title, client_company, industry, project_type, created_at, sort_order')
        .order('sort_order', { ascending: true });

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
    sort_order?: number;
}) {
    const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tags = await resolveStackNames(payload.stack_ids);

    const metadata = JSON.stringify({
        project_type: payload.project_type,
        services: payload.services
    });

    // Construimos el objeto base que siempre existe
    const baseData = {
        title: payload.title,
        client_name: payload.client_company,
        summary: payload.executive_summary,
        image_url: payload.hero_image_url,
        industry: payload.industry,
        slug,
        challenge: payload.problem_text,
        solution: payload.solution_text,
        outcome_impact: payload.result_text,
        tags: tags,
        is_published: true,
        sort_order: payload.sort_order || 0,
        results_metrics: [{ label: '__METADATA__', value: metadata }]
    };

    // Buscamos si ya existe el registro (por slug o por cliente para evitar duplicados)
    let { data: existing } = await supabase
        .from('case_studies')
        .select('id')
        .ilike('slug', slug)
        .maybeSingle();

    if (!existing) {
        const { data: byClient } = await supabase
            .from('case_studies')
            .select('id')
            .eq('client_name', payload.client_company)
            .maybeSingle();
        existing = byClient;
    }

    try {
        // Intento 1: Con las columnas nuevas (project_type, services)
        const fullData = { ...baseData, project_type: payload.project_type, services: payload.services };
        if (existing) {
            const { error } = await supabase.from('case_studies').update(fullData).eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('case_studies').insert([fullData]);
            if (error) throw error;
        }
    } catch (err: any) {
        // Fallback: Si falló (probablemente por columnas faltantes), intentamos solo con el baseData
        // que guarda la info en results_metrics
        if (existing) {
            await supabase.from('case_studies').update(baseData).eq('id', existing.id);
        } else {
            await supabase.from('case_studies').insert([baseData]);
        }
        console.warn('Sync fallback used: new columns might be missing in DB.');
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
    const { data: newRow } = await supabase.from('success_stories').select('sort_order').eq('title', payload.title).single();
    await syncToCaseStudies({ ...payload, sort_order: newRow?.sort_order || 0 });

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
            sort_order: fullRow.sort_order
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
    noStore();
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('id, name')
        .order('name');
    if (error) throw error;
    return data || [];
}

export async function updateSuccessStoriesOrder(orders: { id: string; sort_order: number }[]) {
    // 1. Update success_stories
    for (const item of orders) {
        const { error: ssError } = await supabase
            .from('success_stories')
            .update({ sort_order: item.sort_order })
            .eq('id', item.id);

        if (ssError) {
            console.error(`Error updating success_story ${item.id}:`, ssError);
            continue;
        }

        // 2. Sync sort_order to case_studies
        // We sync by finding the case study with the same client_name or similar match
        const { data: story } = await supabase
            .from('success_stories')
            .select('client_company, title')
            .eq('id', item.id)
            .single();

        if (story) {
            const slug = story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            await supabase
                .from('case_studies')
                .update({ sort_order: item.sort_order })
                .or(`slug.ilike.${slug},client_name.eq."${story.client_company}"`);
        }
    }

    revalidatePath('/admin/success-stories');
    revalidatePath('/[lang]/success-stories', 'layout');
}


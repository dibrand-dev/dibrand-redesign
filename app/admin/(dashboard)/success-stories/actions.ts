'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getSuccessStories() {
    try {
        noStore();
        // Intentamos obtener con sort_order y las nuevas columnas
        let result: any = await supabase
            .from('success_stories')
            .select('id, title, title_es, client_company, industry, project_type, created_at, sort_order, is_published')
            .order('sort_order', { ascending: true });

        // Si falla por columnas inexistentes, probamos solo con las columnas base
        if (result.error && result.error.message.includes('title_es')) {
            console.warn('title_es missing, falling back to base columns');
            result = await supabase
                .from('success_stories')
                .select('id, title, client_company, industry, project_type, created_at, sort_order, is_published')
                .order('sort_order', { ascending: true });
        }

        const { data, error } = result;

        // Si hay error (ej: columnas faltantes), intentamos fallback sin sort_order ni title_es
        if (error) {
            console.warn('Sort order or title_es error, falling back:', error.message);
            const { data: fallback, error: err2 } = await supabase
                .from('success_stories')
                .select('id, title, client_company, industry, project_type, created_at, is_published')
                .order('created_at', { ascending: false });

            if (err2 || !fallback) {
                // Si también falla success_stories, probamos case_studies por si hubo una migración
                const { data: csFallback, error: err3 } = await supabase
                    .from('case_studies')
                    .select('id, title, title_es, client_name, industry, created_at, sort_order, is_published')
                    .order('sort_order', { ascending: true });

                if (err3 || !csFallback) return [];

                return csFallback.map(item => ({
                    id: item.id,
                    title: item.title_es || item.title || 'Untitled',
                    client_company: item.client_name || 'Generic Client',
                    industry: item.industry || 'otro',
                    project_type: 'plataforma',
                    created_at: item.created_at,
                    sort_order: item.sort_order || 0,
                    is_published: item.is_published !== false
                }));
            }

            return fallback.map(item => ({
                ...item,
                title: item.title || 'Untitled',
                sort_order: 0,
                is_published: item.is_published !== false
            }));
        }

        return (data || []).map(item => ({
            ...item,
            title: item.title_es || item.title || 'Untitled',
            sort_order: item.sort_order || 0,
            is_published: item.is_published !== false
        }));

    } catch (error) {
        console.error('Error fetching stories:', error);
        return [];
    }
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
    title_es: string;
    title_en: string;
    client_company: string;
    summary_es: string;
    summary_en: string;
    hero_image_url: string;
    industry: string;
    project_type?: string;
    services?: string[];
    stack_ids: string[];
    problem_es: string;
    problem_en: string;
    solution_es: string;
    solution_en: string;
    result_es: string;
    result_en: string;
    sort_order?: number;
}) {
    // Note: We still use title_en or title_es for the slug. Let's prefer title_en for the slug if available.
    const titleForSlug = payload.title_en || payload.title_es;
    const slug = titleForSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tags = await resolveStackNames(payload.stack_ids);

    const metadata = JSON.stringify({
        project_type: payload.project_type,
        services: payload.services
    });

    // Construimos el objeto base que siempre existe
    const baseData = {
        title: payload.title_es, // Fallback for old code
        title_es: payload.title_es,
        title_en: payload.title_en,
        client_name: payload.client_company,
        summary: payload.summary_es, // Fallback
        summary_es: payload.summary_es,
        summary_en: payload.summary_en,
        image_url: payload.hero_image_url,
        industry: payload.industry,
        slug,
        challenge: payload.problem_es, // Fallback
        challenge_es: payload.problem_es,
        challenge_en: payload.problem_en,
        solution: payload.solution_es, // Fallback
        solution_es: payload.solution_es,
        solution_en: payload.solution_en,
        outcome_impact: payload.result_es, // Fallback
        outcome_impact_es: payload.result_es,
        outcome_impact_en: payload.result_en,
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
    title_es: string;
    title_en: string;
    client_company: string;
    summary_es: string;
    summary_en: string;
    hero_image_url: string;
    project_type: string;
    industry: string;
    services: string[];
    stack_ids: string[];
    problem_es: string;
    problem_en: string;
    solution_es: string;
    solution_en: string;
    result_es: string;
    result_en: string;
}) {
    // Add legacy fields for compatibility
    const fullPayload = {
        ...payload,
        title: payload.title_es,
        executive_summary: payload.summary_es,
        problem_text: payload.problem_es,
        solution_text: payload.solution_es,
        result_text: payload.result_es
    };

    const { error } = await supabase.from('success_stories').insert([fullPayload]);
    if (error) throw new Error(error.message);

    // Sync to case_studies for frontend
    const { data: newRow } = await supabase.from('success_stories').select('sort_order').eq('title_es', payload.title_es).single();
    await syncToCaseStudies({ ...payload, sort_order: newRow?.sort_order || 0 });

    revalidatePath('/admin/success-stories');
    redirect('/admin/success-stories');
}

export async function updateSuccessStory(id: string, payload: Partial<{
    title_es: string;
    title_en: string;
    client_company: string;
    summary_es: string;
    summary_en: string;
    hero_image_url: string;
    project_type: string;
    industry: string;
    services: string[];
    stack_ids: string[];
    problem_es: string;
    problem_en: string;
    solution_es: string;
    solution_en: string;
    result_es: string;
    result_en: string;
}>) {
    // Add legacy fields updates for compatibility
    const updatePayload = {
        ...payload,
        ...(payload.title_es && { title: payload.title_es }),
        ...(payload.summary_es && { executive_summary: payload.summary_es }),
        ...(payload.problem_es && { problem_text: payload.problem_es }),
        ...(payload.solution_es && { solution_text: payload.solution_es }),
        ...(payload.result_es && { result_text: payload.result_es })
    };

    const { error } = await supabase
        .from('success_stories')
        .update(updatePayload)
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
            title_es: fullRow.title_es || fullRow.title,
            title_en: fullRow.title_en || fullRow.title,
            client_company: fullRow.client_company,
            summary_es: fullRow.summary_es || fullRow.executive_summary,
            summary_en: fullRow.summary_en || fullRow.executive_summary,
            hero_image_url: fullRow.hero_image_url,
            industry: fullRow.industry,
            project_type: fullRow.project_type,
            services: fullRow.services || [],
            stack_ids: fullRow.stack_ids || [],
            problem_es: fullRow.problem_es || fullRow.problem_text,
            problem_en: fullRow.problem_en || fullRow.problem_text,
            solution_es: fullRow.solution_es || fullRow.solution_text,
            solution_en: fullRow.solution_en || fullRow.solution_text,
            result_es: fullRow.result_es || fullRow.result_text,
            result_en: fullRow.result_en || fullRow.result_text,
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
        const { data: story } = await supabase
            .from('success_stories')
            .select('client_company, title')
            .eq('id', item.id)
            .single();

        if (story) {
            const slug = story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // Use a safer search for the case study
            const { data: existing } = await supabase
                .from('case_studies')
                .select('id')
                .or(`slug.eq.${slug},client_name.eq."${story.client_company.replace(/"/g, '\"')}"`)
                .maybeSingle();

            if (existing) {
                await supabase
                    .from('case_studies')
                    .update({ sort_order: item.sort_order })
                    .eq('id', existing.id);
            }
        }
    }

    revalidatePath('/admin/success-stories');
    revalidatePath('/es/success-stories');
    revalidatePath('/en/success-stories');
}


export async function fixAllDataConsistency() {
    try {
        // 1. Fetch all from success_stories
        const { data: ss } = await supabase.from('success_stories').select('*');
        if (!ss) return;

        for (let i = 0; i < ss.length; i++) {
            const item = ss[i];
            const updates: any = {};

            if (item.sort_order === null) updates.sort_order = i;
            if (!item.title_es && item.title) updates.title_es = item.title;
            if (!item.title_en && item.title) updates.title_en = item.title;
            if (item.is_published === null) updates.is_published = true;

            if (Object.keys(updates).length > 0) {
                await supabase.from('success_stories').update(updates).eq('id', item.id);
            }

            // Sync to case_studies
            await syncToCaseStudies({
                title_es: updates.title_es || item.title_es || item.title,
                title_en: updates.title_en || item.title_en || item.title,
                client_company: item.client_company,
                summary_es: item.summary_es || item.executive_summary,
                summary_en: item.summary_en || item.executive_summary,
                hero_image_url: item.hero_image_url,
                industry: item.industry,
                project_type: item.project_type,
                services: item.services || [],
                stack_ids: item.stack_ids || [],
                problem_es: item.problem_es || item.problem_text,
                problem_en: item.problem_en || item.problem_text,
                solution_es: item.solution_es || item.solution_text,
                solution_en: item.solution_en || item.solution_text,
                result_es: item.result_es || item.result_text,
                result_en: item.result_en || item.result_text,
                sort_order: updates.sort_order !== undefined ? updates.sort_order : item.sort_order
            });
        }
        revalidatePath('/admin/success-stories');
        return { success: true };
    } catch (e) {
        console.error('Repair failed:', e);
        return { success: false };
    }
}

'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getSuccessStories() {
    try {
        noStore();

        // --- Intento 1: Todo el nuevo esquema ---
        let result: any = await supabase
            .from('success_stories')
            .select('id, title, title_es, client_company, industry, project_type, created_at, sort_order, is_published')
            .order('sort_order', { ascending: true });

        // --- Intento 2: Sin title_es ---
        if (result.error) {
            result = await supabase
                .from('success_stories')
                .select('id, title, client_company, industry, project_type, created_at, sort_order, is_published')
                .order('sort_order', { ascending: true });
        }

        // --- Intento 3: Sin is_published ---
        if (result.error) {
            result = await supabase
                .from('success_stories')
                .select('id, title, client_company, industry, project_type, created_at, sort_order')
                .order('sort_order', { ascending: true });
        }

        // --- Intento 4: Sin sort_order ---
        if (result.error) {
            result = await supabase
                .from('success_stories')
                .select('id, title, client_company, industry, project_type, created_at')
                .order('created_at', { ascending: false });
        }

        const { data, error } = result;

        // Si falló todo success_stories (ej: tabla renombrada), probamos case_studies
        if (error) {
            console.warn('success_stories completely failed, trying case_studies fallback');
            const { data: csFallback, error: err3 } = await supabase
                .from('case_studies')
                .select('id, title, client_name, industry, created_at, sort_order, is_published')
                .order('sort_order', { ascending: true });

            if (err3 || !csFallback) return [];

            return csFallback.map((item: any) => ({
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

        return (data || []).map((item: any) => ({
            ...item,
            title: item.title_es || item.title || 'Untitled',
            sort_order: item.sort_order || 0,
            is_published: item.is_published !== false // Default true if missing
        }));

    } catch (error) {
        console.error('Final catching error fetching stories:', error);
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

    // Construimos el objeto base con solo las columnas que sabemos que existen
    const baseData: any = {
        title: payload.title_es,
        client_name: payload.client_company,
        summary: payload.summary_es,
        image_url: payload.hero_image_url,
        industry: payload.industry,
        slug,
        challenge: payload.problem_es,
        solution: payload.solution_es,
        outcome_impact: payload.result_es,
        tags: tags,
        is_published: true,
        sort_order: payload.sort_order || 0,
        results_metrics: [{ label: '__METADATA__', value: metadata }]
    };

    // Intentamos añadir columnas nuevas opcionalmente
    const extraData: any = {
        title_es: payload.title_es,
        title_en: payload.title_en,
        summary_es: payload.summary_es,
        summary_en: payload.summary_en,
        challenge_es: payload.problem_es,
        challenge_en: payload.problem_en,
        solution_es: payload.solution_es,
        solution_en: payload.solution_en,
        outcome_impact_es: payload.result_es,
        outcome_impact_en: payload.result_en,
        project_type: payload.project_type,
        services: payload.services
    };

    // Buscamos si ya existe
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

    const performWrite = async (dataToWrite: any) => {
        if (existing) {
            return await supabase.from('case_studies').update(dataToWrite).eq('id', existing.id);
        } else {
            return await supabase.from('case_studies').insert([dataToWrite]);
        }
    };

    // Intento 1: Todo
    let writeResult = await performWrite({ ...baseData, ...extraData });

    // Intento 2: Si falla, solo baseData (que tiene las columnas legacy garantizadas)
    if (writeResult.error) {
        console.warn('Sync attempt 1 failed, trying base columns only:', writeResult.error.message);
        writeResult = await performWrite(baseData);
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
        noStore();
        // 1. Fetch from success_stories (only base columns to be safe)
        let { data: ss } = await supabase.from('success_stories').select('id, title, client_company, industry, project_type, is_published, sort_order');

        // 2. Fetch from case_studies
        let { data: cs } = await supabase.from('case_studies').select('id, title, client_name, industry, is_published, sort_order, slug');

        console.log(`Repairing: SS count: ${ss?.length || 0}, CS count: ${cs?.length || 0}`);

        // Case A: success_stories has data
        if (ss && ss.length > 0) {
            for (let i = 0; i < ss.length; i++) {
                const item = ss[i];
                const updates: any = {};
                if (item.sort_order === null) updates.sort_order = i;
                if (item.is_published === null) updates.is_published = true;

                // Try to set title_es/en if they exist (will ignore if fail)
                try {
                    await supabase.from('success_stories').update({
                        ...updates,
                        title_es: item.title,
                        title_en: item.title
                    }).eq('id', item.id);
                } catch (e) {
                    await supabase.from('success_stories').update(updates).eq('id', item.id);
                }

                // Sync to case_studies
                // We fetch the full row again to be sure we have everything for sync
                const { data: full } = await supabase.from('success_stories').select('*').eq('id', item.id).single();
                if (full) {
                    await syncToCaseStudies({
                        title_es: (full as any).title_es || full.title,
                        title_en: (full as any).title_en || full.title,
                        client_company: full.client_company,
                        summary_es: (full as any).summary_es || full.executive_summary,
                        summary_en: (full as any).summary_en || full.executive_summary,
                        hero_image_url: full.hero_image_url,
                        industry: full.industry,
                        project_type: full.project_type,
                        services: full.services || [],
                        stack_ids: full.stack_ids || [],
                        problem_es: (full as any).problem_es || full.problem_text,
                        problem_en: (full as any).problem_en || full.problem_text,
                        solution_es: (full as any).solution_es || full.solution_text,
                        solution_en: (full as any).solution_en || full.solution_text,
                        result_es: (full as any).result_es || full.result_text,
                        result_en: (full as any).result_en || full.result_text,
                        sort_order: full.sort_order || 0
                    });
                }
            }
        }
        // Case B: success_stories is empty but case_studies has data
        else if (cs && cs.length > 0) {
            for (const item of cs) {
                // Try to recreate in success_stories
                const { data: fullCS } = await supabase.from('case_studies').select('*').eq('id', item.id).single();
                if (fullCS) {
                    // Intento 1: Todo
                    const payload: any = {
                        title: fullCS.title,
                        title_es: fullCS.title_es || fullCS.title,
                        title_en: fullCS.title_en || fullCS.title,
                        client_company: fullCS.client_name,
                        industry: fullCS.industry,
                        is_published: fullCS.is_published !== false,
                        sort_order: fullCS.sort_order || 0
                    };

                    let res = await supabase.from('success_stories').insert([payload]);

                    // Intento 2: Si falló, quitamos columnas problemáticas detectadas
                    if (res.error) {
                        const safePayload = {
                            title: fullCS.title,
                            client_company: fullCS.client_name,
                            industry: fullCS.industry,
                            sort_order: fullCS.sort_order || 0
                        };
                        await supabase.from('success_stories').insert([safePayload]);
                    }
                }
            }
        }

        revalidatePath('/admin/success-stories');
        revalidatePath('/es/success-stories');
        revalidatePath('/en/success-stories');
        return { success: true };
    } catch (e) {
        console.error('Repair failed:', e);
        return { success: false };
    }
}

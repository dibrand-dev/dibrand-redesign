'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { logAdminAction } from '@/lib/logging';

export async function getSuccessStories() {
    try {
        noStore();

        // --- Intento 1: Nuevo esquema estandarizado ---
        let result: any = await supabase
            .from('success_stories')
            .select('id, title, title_es, client_name, industry, project_type, created_at, sort_order, description_es, challenge_es, is_published')
            .order('sort_order', { ascending: true });

        // Fallback robusto para el listado si fallan columnas nuevas
        if (result.error) {
            console.warn('New schema fetch failed, using legacy fallback', result.error.message);
            result = await supabase
                .from('success_stories')
                .select('id, title, client_company, industry, project_type, created_at, sort_order, is_published')
                .order('sort_order', { ascending: true });
        }

        const { data, error } = result;

        if (error) {
            console.warn('success_stories completely failed, trying case_studies fallback');
            const { data: csFallback, error: err3 } = await supabase
                .from('case_studies')
                .select('id, title, title_es, client_name, industry, created_at, sort_order')
                .order('sort_order', { ascending: true });

            if (err3 || !csFallback) return [];

            return csFallback.map((item: any) => ({
                id: item.id,
                title: item.title_es || item.title || 'Untitled',
                client_name: item.client_name || 'Generic Client',
                client_company: item.client_name || 'Generic Client',
                industry: item.industry || 'otro',
                project_type: 'plataforma',
                created_at: item.created_at,
                sort_order: item.sort_order || 0,
                is_published: true
            }));
        }

        return (data || []).map((item: any) => ({
            ...item,
            title: item.title_es || item.title || 'Untitled',
            client_company: item.client_name || item.client_company,
            sort_order: item.sort_order || 0,
            is_published: item.is_published ?? true
        }));

    } catch (error) {
        console.error('Final catching error fetching stories:', error);
        return [];
    }
}

export async function getSuccessStory(id: string) {
    try {
        noStore();
        
        // 1. Fetch EVERYTHING available using * to avoid schema mismatch errors
        const [{ data: ss }, { data: cs }] = await Promise.all([
            supabase.from('success_stories').select('*').eq('id', id).maybeSingle(),
            supabase.from('case_studies').select('*').eq('id', id).maybeSingle()
        ]);

        if (ss) console.log(`[DEBUG] Found in success_stories. Columns:`, Object.keys(ss));
        if (cs) console.log(`[DEBUG] Found in case_studies. Columns:`, Object.keys(cs));

        if (!ss && !cs) return { id, title: 'No encontrado' };

        // Start with success_stories if available, fallback to case_studies
        let story = ss || cs;
        
        // 2. Normalize and "Heal" bilingual fields from ALL possible legacy names
        // Spanish Fallbacks
        story.title_es = story.title_es || story.title;
        story.description_es = story.description_es || story.summary_es || story.executive_summary || story.summary || story.description;
        story.challenge_es = story.challenge_es || story.problem_es || story.problem_text || story.challenge;
        story.solution_es = story.solution_es || story.solution_text || story.solution;
        story.impact_es = story.impact_es || story.result_es || story.result_text || story.impact || story.outcome_impact;

        // English Fallbacks (The most likely culprit for "not saving")
        story.title_en = story.title_en || (cs?.title_en) || story.title;
        story.description_en = story.description_en || story.summary_en || (cs?.description_en) || (cs?.summary_en) || story.executive_summary || story.summary;
        story.challenge_en = story.challenge_en || story.problem_en || (cs?.challenge_en) || (cs?.problem_en) || story.problem_text;
        story.solution_en = story.solution_en || story.solution_text || (cs?.solution_en) || (cs?.solution_text);
        story.impact_en = story.impact_en || story.result_en || (cs?.impact_en) || (cs?.result_en) || story.result_text;

        // Metadata Recovery
        story.hero_image_url = story.hero_image_url || story.image_url || cs?.image_url;
        
        let rawStacks = (story.stack_ids && story.stack_ids.length > 0) ? story.stack_ids : (story.tags || cs?.tags || []);
        story.stack_ids = await resolveStackIds(rawStacks);
        
        story.services = (story.services && story.services.length > 0) ? story.services : (cs?.services || []);

        return story;
    } catch (e: any) {
        console.error('Fatal crash in getSuccessStory:', e);
        return { id, title: 'Error de carga' };
    }
}

// ─── Helper: resolve tech stack Names to IDs ────────────────────────────────
async function resolveStackIds(names: string[]): Promise<string[]> {
    if (!names || names.length === 0) return [];
    
    // Some might already be UUIDs, filter them out to only resolve real names
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const existingIds = names.filter(n => uuidRegex.test(n));
    const realNames = names.filter(n => !uuidRegex.test(n));
    
    if (realNames.length === 0) return existingIds;

    const { data } = await supabase
        .from('tech_stacks')
        .select('id')
        .in('name', realNames);
    
    const resolvedIds = data?.map(s => s.id) || [];
    return [...new Set([...existingIds, ...resolvedIds])];
}

// ─── Helper: resolve tech stack IDs to names ────────────────────────────────
async function resolveStackNames(stackIds: string[]): Promise<string[]> {
    if (!stackIds || stackIds.length === 0) return [];
    
    // Filter to only valid UUIDs to prevent Postgres crashes
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validIds = stackIds.filter(id => uuidRegex.test(id));
    
    if (validIds.length === 0) return [];

    const { data } = await supabase
        .from('tech_stacks')
        .select('name')
        .in('id', validIds);
    return data?.map(s => s.name) || [];
}

// ─── Helper: sync data to case_studies (frontend table) ─────────────────────
async function syncToCaseStudies(payload: {
    title_es: string;
    title_en: string;
    client_name: string;
    description_es: string;
    description_en: string;
    hero_image_url: string;
    industry: string;
    project_type?: string;
    services?: string[];
    stack_ids: string[];
    challenge_es: string;
    challenge_en: string;
    solution_es: string;
    solution_en: string;
    impact_es: string;
    impact_en: string;
    sort_order?: number;
}) {
    const titleForSlug = payload.title_en || payload.title_es;
    const slug = titleForSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    console.log(`[SYNC] Starting sync for ${payload.client_name} (slug: ${slug})`);
    const tags = await resolveStackNames(payload.stack_ids);

    const metadata = JSON.stringify({
        project_type: payload.project_type,
        services: payload.services
    });

    // Probe case_studies columns for safe writing
    const { data: csSample } = await supabase.from('case_studies').select('*').limit(1);
    const existingCsCols = (csSample && csSample.length > 0) ? Object.keys(csSample[0]) : [
        'id', 'title', 'client_name', 'summary', 'image_url', 'industry', 'slug', 'challenge', 'solution', 'outcome_impact', 'tags', 'is_published', 'sort_order', 'results_metrics'
    ];

    // Triple Fallback Logic for Sync
    const baseData: any = {
        title: payload.title_es || payload.title_en,
        client_name: payload.client_name,
        summary: payload.description_es || payload.description_en || "", 
        description: payload.description_es || payload.description_en || "", 
        image_url: payload.hero_image_url,
        industry: payload.industry,
        slug,
        challenge: payload.challenge_es || payload.challenge_en || "", 
        solution: payload.solution_es || payload.solution_en || "", 
        outcome_impact: payload.impact_es || payload.impact_en || "", 
        tags: tags,
        is_published: true,
        sort_order: payload.sort_order || 0,
        results_metrics: [{ label: '__METADATA__', value: metadata }]
    };

    // Add bilingual fields to baseData if they exist in schema
    ['title_es', 'title_en', 'description_es', 'description_en', 'challenge_es', 'challenge_en', 'solution_es', 'solution_en', 'impact_es', 'impact_en'].forEach(col => {
        if (existingCsCols.includes(col)) {
            const val = (payload as any)[col];
            if (val) baseData[col] = val;
        }
    });

    const extraData: any = {};
    const extraMap: Record<string, string> = {
        summary_es: payload.description_es,
        summary_en: payload.description_en,
        problem_es: payload.challenge_es,
        problem_en: payload.challenge_en,
        result_es: payload.impact_es,
        result_en: payload.impact_en,
        project_type: payload.project_type || "",
        stack_ids: JSON.stringify(payload.stack_ids || []) // Ensure array storage if col is not uuid[]
    };

    // Add stack_ids correctly if it's a real column
    if (existingCsCols.includes('stack_ids')) {
        extraData['stack_ids'] = payload.stack_ids;
    }
    if (existingCsCols.includes('services')) {
        extraData['services'] = payload.services;
    }

    Object.entries(extraMap).forEach(([col, val]) => {
        // Do NOT overwrite stack_ids if it's already set as a real array
        if (col === 'stack_ids' && extraData['stack_ids']) return;
        if (existingCsCols.includes(col)) extraData[col] = val;
    });

    let { data: existing } = await supabase
        .from('case_studies')
        .select('id')
        .ilike('slug', slug)
        .maybeSingle();

    if (!existing) {
        const { data: byClient } = await supabase
            .from('case_studies')
            .select('id')
            .eq('client_name', payload.client_name)
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

    let writeResult = await performWrite({ ...baseData, ...extraData });

    if (writeResult.error) {
        console.warn('Sync attempt 1 failed, trying base columns only:', writeResult.error.message);
        writeResult = await performWrite(baseData);
    }

    if (writeResult.error) {
        console.error('[SYNC] FATAL: Sync to case_studies failed completely:', writeResult.error.message);
    } else {
        console.log(`[SYNC] Success for ${payload.client_name}`);
    }

    try {
        revalidatePath('/[lang]/success-stories', 'layout');
        revalidatePath(`/[lang]/success-stories/${slug}`, 'layout');
    } catch (e) {
        console.log('[SYNC] Cache revalidation skipped (non-web context)');
    }
}

export async function createSuccessStory(payload: any) {
    // 1. Sanitize stack_ids
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const cleanStackIds = (payload.stack_ids || []).filter((id: string) => uuidRegex.test(id));
    const tags = await resolveStackNames(cleanStackIds);

    // 2. Probe Columns
    const { data: sample } = await supabase.from('success_stories').select('*').limit(1);
    const existingCols = (sample && sample.length > 0) ? Object.keys(sample[0]) : [
        'id', 'title', 'title_es', 'title_en', 
        'client_name', 'client_company',
        'description_es', 'description_en', 'summary_es', 'summary_en', 'executive_summary',
        'challenge_es', 'challenge_en', 'problem_es', 'problem_en', 'problem_text',
        'solution_es', 'solution_en', 'solution_text',
        'impact_es', 'impact_en', 'result_es', 'result_en', 'result_text',
        'hero_image_url', 'image_url',
        'project_type', 'industry', 'services', 'stack_ids', 'tags',
        'sort_order', 'is_published'
    ];
    
    console.log('[CREATE] Probe found columns:', existingCols.length);

    // 3. Construct Payload
    const insertPayload: any = {};
    const map = {
        title_es: ['title_es', 'title'],
        title_en: ['title_en'],
        description_es: ['description_es', 'summary_es', 'executive_summary', 'summary', 'description'],
        description_en: ['description_en', 'summary_en'],
        challenge_es: ['challenge_es', 'problem_es', 'problem_text', 'challenge'],
        challenge_en: ['challenge_en', 'problem_en'],
        solution_es: ['solution_es', 'solution_text', 'solution'],
        solution_en: ['solution_en', 'solution_text'],
        impact_es: ['impact_es', 'result_es', 'result_text', 'impact', 'outcome_impact'],
        impact_en: ['impact_en', 'result_en'],
        client_name: ['client_name', 'client_company'],
        hero_image_url: ['hero_image_url', 'image_url'],
        project_type: ['project_type'],
        industry: ['industry'],
        services: ['services']
    };

    Object.entries(map).forEach(([payloadKey, targetCols]) => {
        const val = (payload as any)[payloadKey];
        if (val !== undefined) {
            targetCols.forEach(col => {
                if (existingCols.includes(col)) insertPayload[col] = val;
            });
        }
    });

    if (existingCols.includes('stack_ids')) insertPayload['stack_ids'] = cleanStackIds;
    if (existingCols.includes('tags')) insertPayload['tags'] = tags;

    const { error } = await supabase.from('success_stories').insert([insertPayload]);
    if (error) throw new Error(error.message);

    const { data: newRow } = await supabase.from('success_stories').select('sort_order').eq('title_es', payload.title_es).single();
    await syncToCaseStudies({ ...payload, sort_order: newRow?.sort_order || 0 });

    await logAdminAction('creó el caso', 'case_study', payload.client_name);

    revalidatePath('/admin/success-stories');
    redirect('/admin/success-stories');
}

export async function updateSuccessStory(id: string, payload: any) {
    // 1. Sanitize stack_ids: Ensure only valid UUIDs are sent to the DB
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const cleanStackIds = (payload.stack_ids || []).filter((id: string) => uuidRegex.test(id));
    const tags = await resolveStackNames(cleanStackIds);

    // 2. Dynamic Column Probe: Find out what's actually in the DB right now
    const { data: sample, error: probeError } = await supabase.from('success_stories').select('*').limit(1);
    
    // If table is empty, we use a comprehensive list of all columns we might expect
    let existingCols: string[] = [];
    if (sample && sample.length > 0) {
        existingCols = Object.keys(sample[0]);
    } else {
        existingCols = [
            'id', 'title', 'title_es', 'title_en', 
            'client_name', 'client_company',
            'description_es', 'description_en', 'summary_es', 'summary_en', 'executive_summary',
            'challenge_es', 'challenge_en', 'problem_es', 'problem_en', 'problem_text',
            'solution_es', 'solution_en', 'solution_text',
            'impact_es', 'impact_en', 'result_es', 'result_en', 'result_text',
            'hero_image_url', 'image_url',
            'project_type', 'industry', 'services', 'stack_ids', 'tags',
            'sort_order'
        ];
    }
    
    console.log('[SAVING] Stacks Received:', payload.stack_ids);
    console.log('[SAVING] Valid UUIDs:', cleanStackIds);
    console.log('[SAVING] Resolved Tags:', tags);
    console.log('[SAVING] DB Columns found:', existingCols);

    // 3. Construct intelligent payload based on ACTUAL columns
    const updatePayload: any = {};
    const map = {
        title_es: ['title_es', 'title'],
        title_en: ['title_en'],
        description_es: ['description_es', 'summary_es', 'executive_summary', 'summary', 'description'],
        description_en: ['description_en', 'summary_en'],
        challenge_es: ['challenge_es', 'problem_es', 'problem_text', 'challenge'],
        challenge_en: ['challenge_en', 'problem_en'],
        solution_es: ['solution_es', 'solution_text', 'solution'],
        solution_en: ['solution_en', 'solution_text'],
        impact_es: ['impact_es', 'result_es', 'result_text', 'impact', 'outcome_impact'],
        impact_en: ['impact_en', 'result_en'],
        client_name: ['client_name', 'client_company'],
        hero_image_url: ['hero_image_url', 'image_url'],
        project_type: ['project_type'],
        industry: ['industry'],
        services: ['services']
    };

    // Map content fields
    Object.entries(map).forEach(([payloadKey, targetCols]) => {
        const val = (payload as any)[payloadKey];
        if (val !== undefined) {
            targetCols.forEach(col => {
                if (existingCols.includes(col)) updatePayload[col] = val;
            });
        }
    });

    // Map Tech Stacks specifically (UUIDs vs Names)
    if (existingCols.includes('stack_ids')) {
        updatePayload['stack_ids'] = cleanStackIds;
    }
    if (existingCols.includes('tags')) {
        updatePayload['tags'] = tags;
    }

    try {
        const { error } = await supabase.from('success_stories').update(updatePayload).eq('id', id);
        if (error) {
            console.error('[SAVING] DB Error:', error.message);
            throw new Error(error.message);
        }

        // 4. Sync to frontend table
        const { data: fullRow } = await supabase.from('success_stories').select('*').eq('id', id).single();
        if (fullRow) {
            await syncToCaseStudies({
                ...payload,
                stack_ids: cleanStackIds,
                sort_order: fullRow.sort_order
            });
        }

        await logAdminAction('actualizó el caso', 'case_study', payload.client_name);

        revalidatePath('/admin/success-stories');
        revalidatePath(`/[lang]/success-stories/${id}`);
    } catch (e: any) {
        console.error('[SAVING] FATAL EXCEPTION:', e.message);
        throw e;
    }

    redirect('/admin/success-stories');
}

export async function toggleSuccessStoryStatus(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    
    // 1. Update success_stories
    const { error } = await supabase
        .from('success_stories')
        .update({ is_published: newStatus })
        .eq('id', id);
        
    if (error) throw new Error(error.message);

    // 2. Sync to case_studies
    const { data: story } = await supabase.from('success_stories').select('client_name, client_company, title_es, title').eq('id', id).single();
    if (story) {
        const client = story.client_name || story.client_company;
        const titleForSlug = story.title_es || story.title;
        const slug = titleForSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Find existing in case_studies to sync status
        const { data: existing } = await supabase.from('case_studies').select('id').or(`slug.eq."${slug}",client_name.eq."${client.replace(/"/g, '\"')}"`).maybeSingle();
        if (existing) {
            await supabase.from('case_studies').update({ is_published: newStatus }).eq('id', existing.id);
        }
    }

    await logAdminAction(newStatus ? 'activó publicación' : 'pausó publicación', 'case_study', id);
    
    revalidatePath('/admin/success-stories');
    revalidatePath('/es/success-stories');
    revalidatePath('/en/success-stories');
}

export async function deleteSuccessStory(id: string) {
    const { error } = await supabase
        .from('success_stories')
        .delete()
        .eq('id', id);
    if (error) throw new Error(error.message);

    await logAdminAction('eliminó el caso', 'case_study', id);

    revalidatePath('/admin/success-stories');
}

export async function getTechStacks() {
    try {
        noStore();
        const { data, error } = await supabase
            .from('tech_stacks')
            .select('id, name')
            .order('name');
        if (error) {
            console.error('Error fetching tech stacks:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Fatal crash in getTechStacks:', e);
        return [];
    }
}

export async function updateSuccessStoriesOrder(orders: { id: string; sort_order: number }[]) {
    for (const item of orders) {
        await supabase.from('success_stories').update({ sort_order: item.sort_order }).eq('id', item.id);
        const { data: story } = await supabase.from('success_stories').select('client_name, client_company, title, title_es').eq('id', item.id).single();
        if (story) {
            const titleForSlug = story.title_es || story.title;
            const slug = titleForSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const client = story.client_name || story.client_company;
            const { data: existing } = await supabase.from('case_studies').select('id').or(`slug.eq.${slug},client_name.eq."${client.replace(/"/g, '\"')}"`).maybeSingle();
            if (existing) await supabase.from('case_studies').update({ sort_order: item.sort_order }).eq('id', existing.id);
        }
    }
    revalidatePath('/admin/success-stories');
    revalidatePath('/es/success-stories');
    revalidatePath('/en/success-stories');
}

export async function fixAllDataConsistency() {
    try {
        noStore();
        const [{ data: ss }, { data: allStacks }] = await Promise.all([
            supabase.from('success_stories').select('*'),
            supabase.from('tech_stacks').select('id, name')
        ]);

        if (ss && ss.length > 0) {
            for (let i = 0; i < ss.length; i++) {
                const full = ss[i];
                
                // Recover stack_ids from tags if missing
                let finalStackIds = full.stack_ids || [];
                if ((!finalStackIds || finalStackIds.length === 0) && full.tags && Array.isArray(full.tags)) {
                    finalStackIds = full.tags
                        .map((tagName: string) => allStacks?.find(s => s.name === tagName)?.id)
                        .filter(Boolean);
                }

                await syncToCaseStudies({
                    title_es: full.title_es || full.title,
                    title_en: full.title_en || full.title,
                    client_name: full.client_name || full.client_company,
                    description_es: full.description_es || full.executive_summary,
                    description_en: full.description_en || full.executive_summary,
                    hero_image_url: full.hero_image_url || full.image_url,
                    industry: full.industry,
                    project_type: full.project_type,
                    services: full.services || [],
                    stack_ids: finalStackIds,
                    challenge_es: full.challenge_es || full.problem_text || full.challenge,
                    challenge_en: full.challenge_en || full.problem_text || full.challenge,
                    solution_es: full.solution_es || full.solution_text,
                    solution_en: full.solution_en || full.solution_text,
                    impact_es: full.impact_es || full.result_text || full.outcome_impact,
                    impact_en: full.impact_en || full.result_text || full.outcome_impact,
                    sort_order: full.sort_order || i
                });
            }
        }
        try {
            revalidatePath('/admin/success-stories');
        } catch (e) {
            console.log('[REPAIR] Cache revalidation skipped (non-web context)');
        }
        return { success: true };
    } catch (e) {
        console.error('Repair failed:', e);
        return { success: false };
    }
}

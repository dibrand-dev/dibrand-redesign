import { supabaseAdmin as supabase } from './supabase-admin';

// Static ID for the General Talent Pool to avoid duplicates and ensure consistency
export const GENERAL_TALENT_POOL_ID = '99999999-9999-4999-b999-999999999999';

/**
 * Ensures that the "General Talent Pool" job exists in the database.
 * If not, it creates it with a fixed ID.
 */
export async function ensureGeneralTalentPoolJob() {
    try {
        console.log('[TalentPool] Checking for General Talent Pool...');

        // 1. Try to find it by fixed ID first
        const { data: byId, error: errorById } = await supabase
            .from('job_openings')
            .select('id')
            .eq('id', GENERAL_TALENT_POOL_ID)
            .limit(1)
            .maybeSingle();

        if (byId) {
            console.log('[TalentPool] Found by ID:', byId.id);
            return byId.id;
        }

        // 2. If not found by ID, try to find it by name
        const { data: byName, error: errorByName } = await supabase
            .from('job_openings')
            .select('id')
            .ilike('title', 'General Talent Pool')
            .limit(1)
            .maybeSingle();

        if (byName) {
            console.log('[TalentPool] Found by name:', byName.id);
            return byName.id;
        }

        // 3. Last fallback: Try to find ANY job that looks like a Talent Pool
        const { data: anyPool, error: poolError } = await supabase
            .from('job_openings')
            .select('id')
            .or('title.ilike.%Talent Pool%,title.ilike.%Bolsa de%,title.ilike.%Espontánea%')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        
        if (anyPool) {
            console.log('[TalentPool] Found fallback by name match:', anyPool.id);
            return anyPool.id;
        }

        // 4. Try to find ID 00000000-0000-0000-0000-000000000001 (old ID I might have created)
        const { data: oldId } = await supabase
            .from('job_openings')
            .select('id')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .limit(1)
            .maybeSingle();
        
        if (oldId) return oldId.id;

        // 5. If still not found, create it with the fixed ID
        console.log('[TalentPool] Creating new General Talent Pool opening...');
        
        const { data: created, error: createError } = await supabase
            .from('job_openings')
            .insert({
                id: GENERAL_TALENT_POOL_ID,
                title: 'General Talent Pool',
                title_es: 'Bolsa de Trabajo General',
                title_en: 'General Talent Pool',
                location: 'Remote',
                industry: 'Software / IT',
                is_active: true,
                description: 'Postulación espontánea para futuras vacantes.',
                description_es: 'Postulación espontánea para futuras vacantes.',
                description_en: 'Spontaneous application for future vacancies.',
                employment_type: 'Full-time',
                seniority: 'Seniors / SSR / JR',
                modality: 'Remote',
                requirements: 'No specific requirements for general pool.',
                salary_range: 'Not specified',
                target_hires: 99
            })
            .select('id')
            .single();

        if (createError) {
            console.error('[TalentPool] Insert Error:', createError.message);
            
            // SUPER FALLBACK: ANY ACTIVE JOB
            const { data: absoluteLastResort } = await supabase
                .from('job_openings')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (absoluteLastResort) {
                console.warn('[TalentPool] Using absolute last resort job:', absoluteLastResort.id);
                return absoluteLastResort.id;
            }

            return null;
        }

        return created.id;
    } catch (error) {
        console.error('[TalentPool] Fatal error in ensureGeneralTalentPoolJob:', error);
        return null;
    }
}

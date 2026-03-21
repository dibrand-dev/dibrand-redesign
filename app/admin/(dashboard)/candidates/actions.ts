'use server'

import { cookies } from 'next/headers';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server-client';
import { revalidatePath } from 'next/cache';

export async function getCandidates(filters?: { search?: string, status?: string }) {
    let query = supabase
        .from('job_applications')
        .select(`
      *,
      job:job_openings(title)
    `)
        .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Manual join for tech_stacks since they are likely in an array stack_ids
    // Fetch all stacks to map them
    const { data: stacks } = await supabase.from('tech_stacks').select('id, name');
    const stackMap = Object.fromEntries(stacks?.map(s => [s.id, s.name]) || []);

    const candidates = data?.map(candidate => ({
        ...candidate,
        stack_names: candidate.stack_ids?.map((id: string) => stackMap[id]).filter(Boolean) || []
    }));

    return candidates || [];
}

export async function getCandidateById(id: string) {
    const { data, error } = await supabase
        .from('job_applications')
        .select(`
            *,
            job:job_openings(title),
            notes:application_notes(*)
        `)
        .eq('id', id)
        .order('created_at', { foreignTable: 'application_notes', ascending: false })
        .single();

    if (error) throw error;

    const { data: stacks } = await supabase.from('tech_stacks').select('id, name');
    const stackMap = Object.fromEntries(stacks?.map(s => [s.id, s.name]) || []);

    return {
        ...data,
        stack_names: data.stack_ids?.map((id: string) => stackMap[id]).filter(Boolean) || []
    };
}

export async function updateCandidateStatus(id: string, status: string) {
    const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/candidates');
    revalidatePath(`/admin/candidates/${id}`);
}

export async function updateCandidateSummary(id: string, summary: string) {
    const { error } = await supabase
        .from('job_applications')
        .update({ candidate_summary: summary })
        .eq('id', id);

    if (error) throw error;
    revalidatePath(`/admin/candidates/${id}`);
}

export async function addApplicationNote(applicationId: string, noteText: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    // Extrae el nombre buscando en las variables más comunes de metadatos
    const meta = user?.user_metadata || {};
    const fullName = meta.full_name || meta.name || (meta.first_name ? `${meta.first_name} ${meta.last_name || ''}`.trim() : null) || user?.email || 'Admin User';

    const avatarUrl = user?.user_metadata?.avatar_url || null;

    // Use admin client for the insert to bypass RLS if necessary
    const { error } = await supabase
        .from('application_notes')
        .insert([{
            application_id: applicationId,
            author_name: fullName,
            author_avatar_url: avatarUrl,
            note_text: noteText
        }]);

    if (error) throw error;
    revalidatePath(`/admin/candidates/${applicationId}`);
}

export async function deleteNote(noteId: string, applicationId: string) {
    const { error } = await supabase
        .from('application_notes')
        .delete()
        .eq('id', noteId);

    if (error) throw error;
    revalidatePath(`/admin/candidates/${applicationId}`);
}

export async function updateNote(noteId: string, newText: string, applicationId: string) {
    const { error } = await supabase
        .from('application_notes')
        .update({ note_text: newText })
        .eq('id', noteId);

    if (error) throw error;
    revalidatePath(`/admin/candidates/${applicationId}`);
}
export async function deleteCandidate(id: string) {
    // Delete associated notes first to avoid FKEY constraints if any
    const { error: notesError } = await supabase
        .from('application_notes')
        .delete()
        .eq('application_id', id);

    if (notesError) throw notesError;

    const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/candidates');
    revalidatePath(`/admin/candidates/${id}`);
}

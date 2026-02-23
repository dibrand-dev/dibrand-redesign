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

export async function createSuccessStory(payload: {
    title: string;
    client_company: string;
    executive_summary: string;
    hero_image_url: string;
    project_type: string;
    industry: string;
    stack_ids: string[];
    problem_text: string;
    solution_text: string;
    result_text: string;
}) {
    const { error } = await supabase.from('success_stories').insert([payload]);
    if (error) throw new Error(error.message);
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

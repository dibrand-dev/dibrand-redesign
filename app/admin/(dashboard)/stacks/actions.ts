'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getStacks() {
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function createStack(formData: FormData) {
    const name = formData.get('name') as string;
    const icon_url = formData.get('icon_url') as string;

    const { error } = await supabase
        .from('tech_stacks')
        .insert([{ name, icon_url }]);

    if (error) throw error;
    revalidatePath('/admin/stacks');
}

export async function deleteStack(id: string) {
    const { error } = await supabase
        .from('tech_stacks')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/stacks');
}

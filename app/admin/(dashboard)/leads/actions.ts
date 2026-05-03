'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function getLeads() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching leads:', error);
        return [];
    }

    return data;
}

export async function deleteLead(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting lead:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/leads');
    return { success: true };
}

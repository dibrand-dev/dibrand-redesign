'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export async function getStacks() {
    noStore();
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function createStack(formData: FormData) {
    const name = formData.get('name') as string;
    const rawIconUrl = formData.get('icon_url') as string;

    if (!name) throw new Error('El nombre es obligatorio');

    try {
        const insertData: any = { name: name.trim() };
        if (rawIconUrl?.trim()) {
            insertData.icon_url = rawIconUrl.trim();
        }

        const { error } = await supabase
            .from('tech_stacks')
            .insert([insertData]);

        if (error) {
            console.error('Database error creating stack:', error);
            // Handle unique constraint violation
            if (error.code === '23505') {
                throw new Error('Esta tecnología ya existe');
            }
            throw new Error(`Error de base de datos: ${error.message}`);
        }
    } catch (err: any) {
        console.error('Server action error creating stack:', err);
        throw err;
    }

    revalidatePath('/admin', 'layout');
}

export async function deleteStack(id: string) {
    const { error } = await supabase
        .from('tech_stacks')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin', 'layout');
}

export async function updateStack(id: string, name: string, iconUrl?: string) {
    if (!name) throw new Error('El nombre es obligatorio');
    
    const updateData: any = { 
        name: name.trim(),
        icon_url: iconUrl?.trim() || null 
    };

    const { error } = await supabase
        .from('tech_stacks')
        .update(updateData)
        .eq('id', id);

    if (error) {
        if (error.code === '23505') throw new Error('Esta tecnología ya existe');
        throw error;
    }
    
    revalidatePath('/admin', 'layout');
}

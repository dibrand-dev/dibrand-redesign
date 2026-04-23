'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export async function getStacks() {
    noStore();
    try {
        const { data, error } = await supabase
            .from('tech_stacks')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        // Ensure we return a plain array
        return (data || []).map(stack => ({
            id: stack.id,
            name: stack.name,
            icon_url: stack.icon_url
        }));
    } catch (error) {
        console.error('Error fetching stacks:', error);
        return [];
    }
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
            if (error.code === '23505') throw new Error('Esta tecnología ya existe');
            throw new Error(`Error de base de datos: ${error.message}`);
        }

        revalidatePath('/admin', 'layout');
        return { success: true };
    } catch (err: any) {
        console.error('Server action error creating stack:', err);
        return { success: false, error: err.message };
    }
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
    
    try {
        const updateData: any = { 
            name: name.trim(),
            icon_url: iconUrl?.trim() || null 
        };

        const { error } = await supabase
            .from('tech_stacks')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Database error in updateStack:', error);
            if (error.code === '23505') throw new Error('Esta tecnología ya existe');
            throw new Error(error.message || 'Error desconocido al actualizar');
        }
        
        revalidatePath('/admin/stacks');
        revalidatePath('/admin', 'layout');
        return { success: true };
    } catch (err: any) {
        console.error('Server action error updating stack:', err);
        return { success: false, error: err.message };
    }
}

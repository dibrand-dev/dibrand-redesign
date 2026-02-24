'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getBrands() {
    const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function saveBrand(brand: any) {
    const { id, name, logo_url, is_visible } = brand;

    const dbData = {
        name,
        logo_url,
        is_visible: is_visible ?? true
    };

    if (id) {
        const { error } = await supabase
            .from('brands')
            .update(dbData)
            .eq('id', id);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('brands')
            .insert([dbData]);
        if (error) throw error;
    }

    revalidatePath('/admin/brands');
    revalidatePath('/');
}

export async function deleteBrand(id: string) {
    const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/brands');
    revalidatePath('/');
}

export async function uploadBrandLogo(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('brand-logos')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('brand-logos')
        .getPublicUrl(filePath);

    return publicUrl;
}

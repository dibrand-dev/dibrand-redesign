'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function saveTestimonial(testimonial: any) {
    const { id, ...data } = testimonial;

    if (id) {
        const { error } = await supabase
            .from('testimonials')
            .update(data)
            .eq('id', id);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('testimonials')
            .insert([data]);
        if (error) throw error;
    }

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
}

export async function deleteTestimonial(id: string) {
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
}

export async function uploadTestimonialAvatar(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('testimonials-avatars')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('testimonials-avatars')
        .getPublicUrl(filePath);

    return publicUrl;
}

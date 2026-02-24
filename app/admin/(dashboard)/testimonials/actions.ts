'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((t: any) => ({
        id: t.id,
        name: t.author_name,
        role: t.author_role,
        company: t.client_name,
        content: t.quote,
        avatar_url: t.client_logo_url,
        is_visible: true // Defaulting to true as the column is missing
    }));
}

export async function saveTestimonial(testimonial: any) {
    const { id, name, role, company, content, avatar_url } = testimonial;

    const dbData = {
        author_name: name,
        author_role: role,
        client_name: company,
        quote: content,
        client_logo_url: avatar_url
    };

    if (id) {
        const { error } = await supabase
            .from('testimonials')
            .update(dbData)
            .eq('id', id);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('testimonials')
            .insert([dbData]);
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

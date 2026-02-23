'use server'

import { createClient } from '@/lib/supabase-server-client';
import { revalidatePath } from 'next/cache';

export async function updateUserProfileImage(publicUrl: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
    });

    if (error) throw new Error(error.message);

    // Refresh every page that might display the avatar
    revalidatePath('/admin/settings');
    revalidatePath('/admin', 'layout');
}

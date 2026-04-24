'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    return users;
}

export async function getUser(id: string) {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(id);
    if (error) throw error;
    return user;
}

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { firstName, lastName },
        email_confirm: true
    });

    if (error) throw error;

    revalidatePath('/admin/users');
    return data;
}

export async function updateUser(id: string, formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const password = formData.get('password') as string;

    const updateData: any = {
        user_metadata: { firstName, lastName }
    };

    if (password && password.trim() !== '') {
        updateData.password = password;
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);

    if (error) throw error;

    revalidatePath('/admin/users');
    return data;
}

export async function deleteUser(id: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;

    revalidatePath('/admin/users');
}
export async function inviteRecruiter(formData: FormData) {
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: 'https://www.dibrand.co/ats/set-password',
        data: { 
            firstName,
            lastName,
            full_name: `${firstName} ${lastName}`,
            role: 'recruiter' 
        }
    });

    if (error) {
        console.error('Invite Error:', error);
        return { error: error.message };
    }
    
    revalidatePath('/admin/users');
    return { success: true, data };
}

export async function forceVerifyUser(id: string) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
        email_confirm: true
    });

    if (error) throw error;

    revalidatePath('/admin/users');
    return { success: true, data };
}

export async function resendVerification(email: string) {
    const { error } = await supabaseAdmin.auth.resend({
        type: 'signup',
        email: email,
        options: {
            emailRedirectTo: 'https://www.dibrand.co/ats/set-password'
        }
    });

    if (error) {
        // Fallback to invite if signup resend fails (e.g., if the user was invited, not self-signed-up)
        const fallback = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
             redirectTo: 'https://www.dibrand.co/ats/set-password'
        });
        if (fallback.error) throw new Error(fallback.error.message);
        return { success: true };
    }
    
    return { success: true };
}

export async function getRecruiters() {
    const { data, error } = await supabaseAdmin
        .from('recruiters')
        .select('id, full_name, email')
        .eq('is_active', true)
        .order('full_name');
    
    if (error) throw error;
    return data;
}

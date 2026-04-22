'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function getCompanies() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('companies')
        .select(`
            *,
            job_openings(id)
        `)
        .order('company_name', { ascending: true });

    if (error) throw error;
    return data;
}

export async function getCompany(id: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('companies')
        .select('*, job_openings(*)')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createCompany(formData: any) {
    const supabase = createAdminClient();
    
    // Generate a unique company code like DB-XXX
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const companyCode = `DB-${randomSuffix}`;

    const { error } = await supabase
        .from('companies')
        .insert([{
            company_code: companyCode,
            company_name: formData.company_name,
            contact_name: formData.contact_name,
            email: formData.email,
            phone: formData.phone,
            mobile: formData.mobile
        }]);

    if (error) throw error;

    revalidatePath('/admin/companies');
    revalidatePath('/admin/jobs');
    return { success: true };
}

export async function updateCompany(id: string, formData: any) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('companies')
        .update({
            company_name: formData.company_name,
            contact_name: formData.contact_name,
            email: formData.email,
            phone: formData.phone,
            mobile: formData.mobile
        })
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/companies');
    revalidatePath(`/admin/companies/${id}`);
    revalidatePath('/admin/jobs');
    return { success: true };
}

export async function deleteCompany(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/companies');
    revalidatePath('/admin/jobs');
    return { success: true };
}

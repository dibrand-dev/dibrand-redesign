'use server'
import { verifyRecaptcha } from '@/lib/recaptcha';
import { createAdminClient } from '@/lib/supabase-server';
import { createNotification } from '@/app/admin/(dashboard)/notifications-actions';

interface ZohoFormData {
    xnQsjsdp: string;
    xmIwtLD: string;
    actionType: string;
    'Lead Source': string;
    'First Name': string;
    'Last Name': string;
    Email: string;
    Company: string;
    Description?: string;
    captchaToken?: string;
}

export async function submitToZoho(formData: FormData) {
    const captchaToken = formData.get('captchaToken')?.toString();
    const isDev = process.env.NODE_ENV === 'development';

    // 1. Data Mapping
    const data: Record<string, string> = {
        xnQsjsdp: '6d71a7c1bbe8886135bf97dd9c30c91eca761aa888ff3e6fe19132dcf97ac9e0',
        xmIwtLD: '57f43a5dfe4852abfc956f4323ee14f3493e60c1312a16601d422007c6fb2ead4e4328ed58fe4ac23ca079d0470be156',
        actionType: 'TGVhZHM=',
        'Lead Source': 'Landing Ecommerce Escobar',
    };

    const userFields = ['First Name', 'Last Name', 'Email', 'Company', 'Description'];
    for (const field of userFields) {
        const value = formData.get(field);
        if (value) data[field] = value.toString();
    }

    let supabaseSaved = false;

    // 2. PRIMARY ACTION: Save to Supabase (OUR Source of truth)
    try {
        console.log(`[ContactForm] Saving lead to Supabase backup...`);
        const supabase = createAdminClient();
        const { error: dbError } = await supabase.from('leads').insert({
            name: `${data['First Name']} ${data['Last Name']}`,
            email: data['Email'],
            company: data['Company'],
            message: data['Description'],
            service_interest: 'Landing Ecommerce'
        });

        if (dbError) throw dbError;
        supabaseSaved = true;
        console.log('[ContactForm] Supabase backup SUCCESS');

        await createNotification({
            type: 'lead',
            title: 'Nuevo Lead (E-commerce)',
            description: `Consulta de ${data['First Name']} - ${data['Company'] || data['Email']}`,
            link: '/admin/dashboard',
            metadata: { company: data['Company'], email: data['Email'] }
        });
    } catch (saveError) {
        console.error('[ContactForm] CRITICAL: Failed to save lead to Supabase:', saveError);
    }

    // 3. SECONDARY ACTION: Sync with Zoho CRM
    try {
        console.log(`[ContactForm] Syncing lead with Zoho: ${data['Email']}...`);
        const body = new URLSearchParams(data);
        const response = await fetch('https://crm.zoho.com/crm/WebToLeadForm', {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (response.ok || response.status === 302) {
            console.log('[ContactForm] Zoho Sync SUCCESS');
        } else {
            const errorBody = await response.text();
            console.error(`[ContactForm] Zoho Rejection | Status: ${response.status} | Body: ${errorBody.substring(0, 500)}`);
        }
    } catch (syncError) {
        console.error('[ContactForm] Zoho Sync Network Error:', syncError);
    }

    // ALWAYS RETURN SUCCESS to the client to keep the conversion funnel open.
    // We will monitor failures through server logs [ContactForm].
    return { success: true };
}

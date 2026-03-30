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

    // 1. reCAPTCHA Validation
    if (captchaToken) {
        try {
            const { success, score } = await verifyRecaptcha(captchaToken);
            if (!success) {
                console.error(`[ContactForm] reCAPTCHA failed. Score: ${score}. Token might be invalid for this domain.`);
                return { success: false, error: 'reCAPTCHA failed' };
            }
        } catch (error) {
            console.error('[ContactForm] Error verifying reCAPTCHA:', error);
            // In dev, we might want to continue, but for now we follow the security rule
            if (!isDev) return { success: false, error: 'reCAPTCHA verification error' };
        }
    } else if (!isDev) {
        console.warn('[ContactForm] No reCAPTCHA token provided in production!');
        return { success: false, error: 'reCAPTCHA required' };
    }

    // 2. Zoho CRM Data Mapping
    const data: Record<string, string> = {
        xnQsjsdp: '6d71a7c1bbe8886135bf97dd9c30c91eca761aa888ff3e6fe19132dcf97ac9e0',
        xmIwtLD: '57f43a5dfe4852abfc956f4323ee14f3493e60c1312a16601d422007c6fb2ead4e4328ed58fe4ac23ca079d0470be156',
        actionType: 'TGVhZHM=',
        'Lead Source': 'Sitio Dibrand',
    };

    const userFields = ['First Name', 'Last Name', 'Email', 'Company', 'Description'];
    for (const field of userFields) {
        const value = formData.get(field);
        if (value) data[field] = value.toString();
    }

    const body = new URLSearchParams(data);

    try {
        console.log(`[ContactForm] Submitting lead to Zoho: ${data['Email']}...`);
        const response = await fetch('https://crm.zoho.com/crm/WebToLeadForm', {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // 3. Evaluate Zoho Response
        // Note: Zoho WebToLead often returns a 302 redirect on success.
        if (response.ok || response.status === 302) {
            console.log('[ContactForm] Zoho Submission SUCCESS');

            // 4. Secondary tasks (Supabase & Notifications) - Non-blocking
            try {
                const supabase = createAdminClient();
                const { error: dbError } = await supabase.from('leads').insert({
                    name: `${data['First Name']} ${data['Last Name']}`,
                    email: data['Email'],
                    company: data['Company'],
                    message: data['Description'],
                    service_interest: 'Contact Form'
                });

                if (dbError) throw dbError;

                await createNotification({
                    type: 'lead',
                    title: 'Nuevo Lead Recibido',
                    description: `Nueva consulta de contacto de ${data['First Name']} (${data['Company'] || 'Empresa no especificada'})`,
                    link: '/admin/dashboard',
                    metadata: { company: data['Company'], email: data['Email'] }
                });
            } catch (secondaryError) {
                console.error('[ContactForm] Secondary tasks failed (Supabase/Notif), but Zoho was OK:', secondaryError);
            }

            return { success: true };
        } else {
            const errorText = await response.text();
            console.error(`[ContactForm] Zoho API Error: ${response.status} - ${errorText.substring(0, 200)}`);
            return { success: false, error: 'Zoho server error' };
        }

    } catch (error) {
        console.error('[ContactForm] Critical Submission Error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

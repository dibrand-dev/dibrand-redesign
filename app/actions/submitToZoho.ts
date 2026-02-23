'use server'

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
}

export async function submitToZoho(formData: FormData) {
    const data: Record<string, string> = {
        xnQsjsdp: '6d71a7c1bbe8886135bf97dd9c30c91eca761aa888ff3e6fe19132dcf97ac9e0',
        xmIwtLD: '57f43a5dfe4852abfc956f4323ee14f3493e60c1312a16601d422007c6fb2ead4e4328ed58fe4ac23ca079d0470be156',
        actionType: 'TGVhZHM=',
        'Lead Source': 'Sitio Dibrand',
    };

    // Add user fields
    const userFields = ['First Name', 'Last Name', 'Email', 'Company', 'Description'];
    for (const field of userFields) {
        const value = formData.get(field);
        if (value) {
            data[field] = value.toString();
        }
    }

    // Convert to URLSearchParams for x-www-form-urlencoded
    const body = new URLSearchParams(data);

    try {
        const response = await fetch('https://crm.zoho.com/crm/WebToLeadForm', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Zoho returns a redirect or 200 on success. 
        // Since we're making a server-side fetch, we might check response.ok or response.status
        // Zoho WebToLead often behaves weirdly (redirecting), but fetch might follow it.

        if (response.ok) {
            return { success: true };
        } else {
            console.error('Zoho Error:', response.status, response.statusText);
            return { success: false, error: 'Failed to submit to Zoho' };
        }

    } catch (error) {
        console.error('Submission Error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}


import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    let key = rawServiceKey || anonKey;
    try {
        const parts = rawServiceKey.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            if (payload.ref && !supabaseUrl.includes(payload.ref)) {
                key = anonKey;
            }
        }
    } catch {
        key = anonKey;
    }

    if (!supabaseUrl || !key) {
        throw new Error('Supabase environment variables are missing (URL or Service Role Key)');
    }

    return createClient(supabaseUrl, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

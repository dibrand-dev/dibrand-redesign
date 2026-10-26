import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Valida si la clave de servicio corresponde al proyecto activo para evitar errores 401 por claves heredadas
function resolveServiceKey(): string {
    if (!rawServiceKey) return anonKey;
    try {
        const parts = rawServiceKey.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            if (payload.ref && !supabaseUrl.includes(payload.ref)) {
                return anonKey;
            }
        }
    } catch {
        return anonKey;
    }
    return rawServiceKey;
}

export const supabaseAdmin = createClient(supabaseUrl, resolveServiceKey(), {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

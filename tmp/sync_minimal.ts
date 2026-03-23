import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdvyvqphumrciekgjlfb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdnl2cXBodW1yY2lla2dqbGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM4NzMyNiwiZXhwIjoyMDg0OTYzMzI2fQ.vltBeD-JnfsrDtqgQrLGz-rRj3-H0X0PjQq4srDN_Z4';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncMinimal() {
    const { data: { users } } = await supabase.auth.admin.listUsers();
    for (const user of users) {
        const meta = user.user_metadata || {};
        const recruiterData = {
            id: user.id,
            email: user.email,
            full_name: meta.full_name || user.email
        };
        const { error } = await supabase.from('recruiters').upsert(recruiterData, { onConflict: 'id' });
        if (error) console.error(`Error for ${user.email}:`, error.message);
        else console.log(`✅ ${user.email}`);
    }
}
syncMinimal().catch(console.error);

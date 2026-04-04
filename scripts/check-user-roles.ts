
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function checkUsers() {
    console.log("Checking norberto@dibrand.co and eugenia@dibrand.co roles...");
    
    // Check specific user by email using listUsers
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
        console.error("Error listing users:", error);
        return;
    }

    const targets = ['norberto@dibrand.co', 'eugenia@dibrand.co'];
    const found = users.filter(u => targets.includes(u.email || ''));

    found.forEach(u => {
        console.log(`User: ${u.email}`);
        console.log(`Role in metadata: ${u.user_metadata?.role}`);
        console.log(`User metadata: ${JSON.stringify(u.user_metadata, null, 2)}`);
        console.log("--------------------");
    });
    
    if (found.length === 0) {
        console.log("Users not found in auth list.");
    }
}

checkUsers();

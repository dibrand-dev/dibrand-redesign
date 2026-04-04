
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function checkUsers() {
    console.log("Checking norberto@dibrand.co and eugenia@dibrand.co roles...");
    
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
        console.error("Error listing users:", error);
        return;
    }

    const targets = ['norberto@dibrand.co', 'eugenia@dibrand.co', 'nriccitelli@dibrand.co'];
    const found = users.filter(u => targets.includes(u.email?.toLowerCase() || ''));

    if (found.length === 0) {
        console.log("No matching users found in auth.users.");
        // Try searching for their emails anywhere in the list
        const allEmails = users.map(u => u.email);
        console.log("Existing emails in auth:", allEmails);
        return;
    }

    found.forEach(u => {
        console.log(`User: ${u.email}`);
        console.log(`Role in metadata: ${u.user_metadata?.role}`);
        console.log(`Full Metadata: ${JSON.stringify(u.user_metadata, null, 2)}`);
        console.log("--------------------");
    });
}

checkUsers();

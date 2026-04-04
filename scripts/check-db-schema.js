
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if(!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing credentials, skipping.");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
    console.log("Checking if is_active exists by doing a select limit 1...");
    const { data, error } = await supabaseAdmin.from('job_openings').select('*').limit(1);
    
    if (error) {
        console.error("Error:", error);
    } else {
        if (data && data.length > 0) {
            console.log("Columns:", Object.keys(data[0]));
        } else {
            console.log("No data found.");
        }
    }
}

checkSchema();

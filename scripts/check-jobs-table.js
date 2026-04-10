
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
    console.log("Checking if table jobs exists...");
    const { data, error } = await supabaseAdmin.from('jobs').select('*').limit(1);
    
    if (error) {
        console.error("Error for 'jobs':", error);
    } else {
        console.log("Table 'jobs' exists. Columns:", data && data.length > 0 ? Object.keys(data[0]) : "No data but table exists.");
    }
}

checkTables();

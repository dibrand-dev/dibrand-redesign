import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDetailedColumns() {
    try {
        // 1. Fetch one record to see keys
        const { data: records, error: fetchError } = await supabase.from('testimonials').select().limit(1);

        if (fetchError) {
            console.error('Error fetching testimonials:', fetchError);
        } else {
            console.log('--- TESTIMONIAL RECORD KEYS ---');
            console.log(records && records.length > 0 ? Object.keys(records[0]) : 'Table is empty');
        }

        // 2. Query information_schema for exact column definitions (if permissions allow via RPC or similar)
        // Since we usually don't have direct access to info schema via anon/service key in standard client, 
        // we'll try a common trick: requesting a non-existent column to see the error message which often lists columns

        const { error: probeError } = await supabase.from('testimonials').select('non_existent_column_probe').limit(1);
        if (probeError) {
            console.log('\n--- PROBE ERROR (MAY CONTAIN COLUMN LIST) ---');
            console.log(probeError.message);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkDetailedColumns();

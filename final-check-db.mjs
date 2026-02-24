import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkColumns() {
    try {
        const { data: records, error: fetchError } = await supabase.from('testimonials').select().limit(1);

        if (fetchError) {
            console.error('Error fetching testimonials:', fetchError);
        } else {
            console.log('--- TESTIMONIAL RECORD KEYS ---');
            console.log(records && records.length > 0 ? Object.keys(records[0]) : 'Table is empty');

            if (records && records.length === 0) {
                // If empty, try to get column names via select * on empty table
                const { data, error } = await supabase.from('testimonials').select('*');
                console.log('Empty table record keys:', data && data.length > 0 ? Object.keys(data[0]) : 'Still empty');
            }
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkColumns();

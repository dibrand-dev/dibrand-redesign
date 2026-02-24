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
        const { data, error } = await supabase.from('testimonials').select().limit(1);
        if (error) {
            console.error('Error fetching testimonials:', error);
        } else {
            console.log('Columns in testimonials table:', data && data.length > 0 ? Object.keys(data[0]) : 'Table is empty');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkColumns();

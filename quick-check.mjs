import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    const { data, error } = await supabase.from('testimonials').select().limit(1);
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Columns:', data.length > 0 ? Object.keys(data[0]) : 'Empty');
    }
}
check();

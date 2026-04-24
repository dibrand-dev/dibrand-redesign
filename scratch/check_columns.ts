import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTechStacksColumns() {
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error fetching tech_stacks:', error);
        return;
    }
    
    if (data && data.length > 0) {
        console.log('Columns in tech_stacks:', Object.keys(data[0]));
    } else {
        // If no data, try to fetch from information_schema
        const { data: schemaData, error: schemaError } = await supabase
            .rpc('get_table_columns', { table_name: 'tech_stacks' });
            
        if (schemaError) {
            console.log('No data and RPC failed. Trying direct select again...');
             const { data: data2 } = await supabase.from('tech_stacks').select().limit(0);
             console.log('Columns likely available.');
        } else {
            console.log('Columns in tech_stacks (via RPC):', schemaData);
        }
    }
}

checkTechStacksColumns();

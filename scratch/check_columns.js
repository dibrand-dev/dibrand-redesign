const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

let supabaseUrl, supabaseKey;

try {
    const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
    const lines = envFile.split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = trimmed.split('=')[1].replace(/['"]/g, '').trim();
        if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) supabaseKey = trimmed.split('=')[1].replace(/['"]/g, '').trim();
    });
} catch (e) {
    console.error('Could not read .env.local');
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTechStacksColumns() {
    console.log('Checking tech_stacks table...');
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error fetching tech_stacks:', error);
        // Try selecting without * to see if it even works
        const { error: error2 } = await supabase.from('tech_stacks').select('id').limit(1);
        console.log('Select ID only error:', error2);
        return;
    }
    
    if (data && data.length > 0) {
        console.log('Columns in tech_stacks:', Object.keys(data[0]));
    } else {
        console.log('No data in tech_stacks. Trying to insert a dummy row to see columns...');
        const { data: inserted, error: insertError } = await supabase
            .from('tech_stacks')
            .insert({ name: 'temp_check_' + Date.now() })
            .select('*');
        
        if (insertError) {
            console.error('Insert failed:', insertError);
        } else {
            console.log('Columns in tech_stacks (after insert):', Object.keys(inserted[0]));
            // Clean up
            await supabase.from('tech_stacks').delete().eq('id', inserted[0].id);
        }
    }
}

checkTechStacksColumns();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdvyvqphumrciekgjlfb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdnl2cXBodW1yY2lla2dqbGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM4NzMyNiwiZXhwIjoyMDg0OTYzMzI2fQ.vltBeD-JnfsrDtqgQrLGz-rRj3-H0X0PjQq4srDN_Z4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listColumns() {
    console.log('Listing all columns in job_applications...');
    try {
        // We can query one row and see the keys in the data
        const { data, error } = await supabase
            .from('job_applications')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error fetching columns:', error.message);
            return;
        }

        if (data && data.length > 0) {
            console.log('Table exists. Columns are:', Object.keys(data[0]));
        } else {
            console.log('No data in table. Checking schema via query...');
            // Fallback: try to select specific columns to see if they fail
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

listColumns();

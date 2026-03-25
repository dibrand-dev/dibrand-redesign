
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdvyvqphumrciekgjlfb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdnl2cXBodW1yY2lla2dqbGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM4NzMyNiwiZXhwIjoyMDg0OTYzMzI2fQ.vltBeD-JnfsrDtqgQrLGz-rRj3-H0X0PjQq4srDN_Z4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testQuery() {
    console.log('Testing query on job_applications for status only...');
    try {
        const { data, error } = await supabase
            .from('job_applications')
            .select('status')
            .limit(1);

        if (error) {
            console.error('Error in query:', JSON.stringify(error, null, 2));
        } else {
            console.log('Query successful, found:', data?.length, 'rows');
            console.log('Sample Data row:', data[0]);
        }
    } catch (e) {
        console.error('Exception in query:', e);
    }
}

testQuery();


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdvyvqphumrciekgjlfb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdnl2cXBodW1yY2lla2dqbGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM4NzMyNiwiZXhwIjoyMDg0OTYzMzI2fQ.vltBeD-JnfsrDtqgQrLGz-rRj3-H0X0PjQq4srDN_Z4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testQuery() {
    console.log('Checking all application columns (without is_deleted)...');
    try {
        const { data, error } = await supabase
            .from('job_applications')
            .select(`
                id, email, status, recruiter_id, 
                recruiter_notes, linkedin_url, 
                expected_salary, cv_filename, position,
                updated_at, created_at
            `)
            .limit(1);

        if (error) {
            console.warn('Columns check failed:', error.message);
        } else {
            console.log('All these columns exist in job_applications');
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

testQuery();

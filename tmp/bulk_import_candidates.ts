import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

const supabaseUrl = 'https://mdvyvqphumrciekgjlfb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdnl2cXBodW1yY2lla2dqbGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM4NzMyNiwiZXhwIjoyMDg0OTYzMzI2fQ.vltBeD-JnfsrDtqgQrLGz-rRj3-H0X0PjQq4srDN_Z4';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CSV_PATH = path.join(process.cwd(), 'data/importar_candidatos_final.csv');

async function importCandidates() {
    console.log('Reading CSV...');
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });

    console.log(`Processing ${records.length} records...`);

    // Fetch all users to map emails
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const userMap = new Map<string, string>();
    users.forEach(u => {
        if (u.email) userMap.set(u.email.toLowerCase(), u.id);
    });

    // Mapping for status
    const statusMap: Record<string, string> = {
        'No Califica': 'Rejected',
        'Sourced': 'New',
        'Contacted': 'Screening'
    };

    for (const record of records as any[]) {
        const recruiterId = userMap.get(record.recruiter_email.toLowerCase()) || userMap.get('norberto@dibrand.co');
        
        // Split name basic logic
        const names = record.full_name_raw.split(' ');
        const first_name = names[0];
        const last_name = names.slice(1).join(' ');

        const candidateData = {
            first_name,
            last_name,
            full_name: record.full_name_raw,
            email: record.email,
            phone: record.phone,
            linkedin_url: record.linkedin_url || '',
            position: record.job_position,
            status: statusMap[record.status] || 'New',
            expected_salary: record.salary_expectation || '',
            recruiter_notes: record.notes || '',
            recruiter_id: recruiterId,
            cv_filename: record.cv_filename || '',
            resume_url: record.cv_filename || '',
            country: 'N/A',
            state_province: 'N/A',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        console.log(`Importing: ${record.full_name_raw} (${record.email})`);
        
        const { error } = await supabase
            .from('job_applications')
            .upsert(candidateData, { onConflict: 'email' });

        if (error) {
            console.error(`Error importing ${record.email}:`, error.message);
        } else {
            console.log(`✅ Success: ${record.email}`);
        }
    }

    console.log('--- Import Complete ---');
}

importCandidates().catch(console.error);

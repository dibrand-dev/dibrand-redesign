import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

const supabaseUrl = 'https://mdvyvqphumrciekgjlfb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdnl2cXBodW1yY2lla2dqbGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM4NzMyNiwiZXhwIjoyMDg0OTYzMzI2fQ.vltBeD-JnfsrDtqgQrLGz-rRj3-H0X0PjQq4srDN_Z4';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CSV_PATH = path.join(process.cwd(), 'data/importar_candidatos_final.csv');

async function finalImport() {
    console.log('--- Final Import Procedure Started ---');
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });

    // 1. Fetch available recruiters to ensure mapping works
    console.log('Mapping recruiters...');
    const { data: recruiters } = await supabase.from('recruiters').select('id, email');
    const recruiterMap = new Map();
    recruiters?.forEach(r => recruiterMap.set(r.email.toLowerCase(), r.id));

    // Mapping for status
    const statusMap: Record<string, string> = {
        'No Califica': 'Rejected',
        'Rejected': 'Rejected',
        'Sourced': 'New',
        'Pre Screening': 'Screening',
        'Screening': 'Screening',
        'Contacted': 'Screening',
        'Client interview': 'Interview'
    };

    console.log(`Processing ${records.length} candidates...`);

    for (const record of records) {
        const recruiterId = recruiterMap.get(record.recruiter_email.toLowerCase()) || recruiterMap.get('norberto@dibrand.co');
        
        // Split name (SQL split_part logic equivalent)
        const nameParts = record.full_name_raw.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const candidateData = {
            full_name: record.full_name_raw,
            first_name: firstName,
            last_name: lastName,
            email: record.email,
            phone: record.phone,
            linkedin_url: record.linkedin_url || '',
            position: record.job_position,
            status: statusMap[record.status] || 'New',
            expected_salary: record.salary_expectation || '',
            recruiter_notes: record.notes || '',
            candidate_summary: record.notes || '',
            cv_filename: record.cv_filename || '',
            resume_url: record.cv_filename || '', // Placeholder
            recruiter_id: recruiterId,
            source: 'Importación Legacy CSV',
            country: 'N/A', // Required field
            state_province: 'N/A', // Required field
            updated_at: new Date().toISOString()
        };

        console.log(`Upserting: ${record.full_name_raw} (${record.email})`);
        const { error } = await supabase
            .from('job_applications')
            .upsert(candidateData, { onConflict: 'email' });

        if (error) {
            console.error(`Error for ${record.email}:`, error.message);
        } else {
            console.log(`✅ ${record.email} (Recruiter: ${record.recruiter_email})`);
        }
    }
    console.log('--- Final Import Complete ---');
}

finalImport().catch(console.error);

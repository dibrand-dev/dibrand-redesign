import { supabaseAdmin as supabase } from './lib/supabase-admin';

async function checkTables() {
    console.log('Checking job_application_logs...');
    const { error: errorLog } = await supabase.from('job_application_logs').select('id').limit(1);
    if (errorLog) {
        console.error('Error querying job_application_logs:', errorLog.message, errorLog.code);
    } else {
        console.log('job_application_logs table exists!');
    }

    console.log('\nChecking application_notes...');
    const { error: errorNotes } = await supabase.from('application_notes').select('id').limit(1);
    if (errorNotes) {
        console.error('Error querying application_notes:', errorNotes.message, errorNotes.code);
    } else {
        console.log('application_notes table exists!');
    }
}

checkTables();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('job_openings')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error fetching job_openings:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Columns in job_openings:', Object.keys(data[0]));
  } else {
    console.log('No data in job_openings to inspect columns.');
  }
}

checkSchema();

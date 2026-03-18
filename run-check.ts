import { createAdminClient } from '@/lib/supabase-server';

async function main() {
  const supabase = createAdminClient();
  const { error } = await supabase.from('job_applications').select('id').limit(1);
  console.log('job_applications check:', error ? error.message : 'OK');
  
  const { error: error2 } = await supabase.from('leads').select('id').limit(1);
  console.log('leads check:', error2 ? error2.message : 'OK');
}

main();

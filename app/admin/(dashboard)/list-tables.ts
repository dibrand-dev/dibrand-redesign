import { createAdminClient } from '@/lib/supabase-server';

export async function listTables() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('get_tables'); // Or just a direct query if rpc doesn't exist
  if (error) {
     // Try direct query if rpc fails
     const { data: tables, error: err2 } = await supabase.from('pg_catalog.pg_tables').select('tablename').eq('schemaname', 'public');
     return { tables, err2 };
  }
  return { data };
}

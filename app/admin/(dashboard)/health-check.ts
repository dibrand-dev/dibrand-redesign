import { createAdminClient } from '@/lib/supabase-server';

export async function checkTable() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('analytics_events').select('*').limit(1);
  return { data, error };
}

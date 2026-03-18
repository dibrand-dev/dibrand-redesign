import { createAdminClient } from '@/lib/supabase-server';

export async function checkLeads() {
  const supabase = createAdminClient();
  const { data, count, error } = await supabase.from('leads').select('*', { count: 'exact' });
  return { data, count, error };
}

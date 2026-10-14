import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log("Buckets:", data?.map(b => b.name));
  
  if (data?.find(b => b.name === 'portfolio')) {
      const { data: files } = await supabase.storage.from('portfolio').list();
      console.log("Files in portfolio:", files?.map(f => f.name).slice(0, 5));
  }
}
run();

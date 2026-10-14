import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase.storage.from('portfolio').download('aiqsivg1eud-1772836899578.png');
  console.log("Download result:", error ? error.message : "Success, size: " + data.size);
  
  const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl('aiqsivg1eud-1772836899578.png');
  console.log("Public URL SDK:", urlData.publicUrl);
}
run();

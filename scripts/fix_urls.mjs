import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const oldDomain = 'mdvyvqphumrciekgjlfb.supabase.co';
  const newDomain = 'fduftfijlyqyzfbvbtmo.supabase.co';

  // Fix case_studies
  const { data: cases } = await supabase.from('case_studies').select('id, image_url');
  for (const c of cases || []) {
    if (c.image_url && c.image_url.includes(oldDomain)) {
      const newUrl = c.image_url.replace(oldDomain, newDomain);
      await supabase.from('case_studies').update({ image_url: newUrl }).eq('id', c.id);
      console.log(`Updated case study ${c.id}`);
    }
  }

  // Fix brands
  const { data: brands } = await supabase.from('brands').select('id, logo_url');
  for (const b of brands || []) {
    if (b.logo_url && b.logo_url.includes(oldDomain)) {
      const newUrl = b.logo_url.replace(oldDomain, newDomain);
      await supabase.from('brands').update({ logo_url: newUrl }).eq('id', b.id);
      console.log(`Updated brand ${b.id}`);
    }
  }

  // Fix testimonials
  const { data: testimonials } = await supabase.from('testimonials').select('id, avatar_url');
  for (const t of testimonials || []) {
    if (t.avatar_url && t.avatar_url.includes(oldDomain)) {
      const newUrl = t.avatar_url.replace(oldDomain, newDomain);
      await supabase.from('testimonials').update({ avatar_url: newUrl }).eq('id', t.id);
      console.log(`Updated testimonial ${t.id}`);
    }
  }

  // Fix recruiters
  const { data: recruiters } = await supabase.from('recruiters').select('id, avatar_url');
  for (const r of recruiters || []) {
    if (r.avatar_url && r.avatar_url.includes(oldDomain)) {
      const newUrl = r.avatar_url.replace(oldDomain, newDomain);
      await supabase.from('recruiters').update({ avatar_url: newUrl }).eq('id', r.id);
      console.log(`Updated recruiter ${r.id}`);
    }
  }

  // Fix job_openings (if any image/avatar)
  // Fix tech_stacks
  const { data: stacks } = await supabase.from('tech_stacks').select('id, icon_url');
  for (const s of stacks || []) {
      if (s.icon_url && s.icon_url.includes(oldDomain)) {
          const newUrl = s.icon_url.replace(oldDomain, newDomain);
          await supabase.from('tech_stacks').update({ icon_url: newUrl }).eq('id', s.id);
          console.log(`Updated tech_stack ${s.id}`);
      }
  }

  console.log('Done!');
}

run();


import { createClient } from '@supabase/supabase-js'

// We avoid 'dotenv' as it is not installed in the project dependencies.
// Ensure to run this script with environment variables set or from a shell that has them.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function checkJobs() {
  const { data, error } = await supabase.from('job_openings').select('id, title').limit(1)
  if (error) {
    console.error('Error fetching jobs:', error)
  } else {
    console.log('Active jobs found:', data)
  }
}

checkJobs()

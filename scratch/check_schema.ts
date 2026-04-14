
import { createClient } from '@supabase/supabase-js'

// We avoid 'dotenv' as it is not installed in the project dependencies.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function checkColumns() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'recruiters' })
  if (error) {
    // try direct query if rpc doesn't exist
    const { data: cols, error: err2 } = await supabase
      .from('recruiters')
      .select('*')
      .limit(1)
    
    if (err2) {
      console.error('Error fetching columns:', err2)
      return
    }
    console.log('Columns in recruiters:', Object.keys(cols[0] || {}))
  } else {
    console.log('Columns from RPC (recruiters):', data)
  }
}

checkColumns()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eoerklhtcijvtqyiybjz.supabase.co';
const supabaseKey = 'sb_publishable_o2tM8qckWK7gVbKF704GEA_KndRoqaf';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching schema info via a select...");
  const { data, error } = await supabase.from('contributions').select('*').limit(1);
  if (error) {
    console.error("Select Error:", JSON.stringify(error, null, 2));
  } else {
    console.log("Select Data:", data);
  }
}

test();

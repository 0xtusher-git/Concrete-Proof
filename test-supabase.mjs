import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eoerklhtcijvtqyiybjz.supabase.co';
const supabaseKey = 'sb_publishable_o2tM8qckWK7gVbKF704GEA_KndRoqaf';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing DB connection...");
  const { data, error } = await supabase.from('contributions').select('*').limit(1);
  if (error) {
    console.error("DB Error:", error);
  } else {
    console.log("DB Data:", data);
  }

  console.log("Testing Storage connection...");
  const { data: storageData, error: storageError } = await supabase.storage.from('proof-uploads').list();
  if (storageError) {
    console.error("Storage Error:", storageError);
  } else {
    console.log("Storage Data:", storageData);
  }
}

test();

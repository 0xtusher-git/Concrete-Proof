import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eoerklhtcijvtqyiybjz.supabase.co';
const supabaseKey = 'sb_publishable_o2tM8qckWK7gVbKF704GEA_KndRoqaf';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing Insert...");
  const { data, error } = await supabase.from('contributions').insert({
    discord_name: "test",
    discord_username: "test",
    x_handle: "test",
    contribution_type: "Art",
    description: "test",
    media_urls: ["https://example.com/test.png"],
    likes: 0
  });

  if (error) {
    console.error("Insert Error:", JSON.stringify(error, null, 2));
  } else {
    console.log("Insert Success:", data);
  }
}

test();

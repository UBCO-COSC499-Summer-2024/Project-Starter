import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_time_tracking', async () => {
    const { data, error } = await supabase.from("v_benchmark").select();
    expect(data).not.toBeNull()
 
  });
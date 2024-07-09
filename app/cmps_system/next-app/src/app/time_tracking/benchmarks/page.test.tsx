import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_time_tracking', async () => {
    const res = await supabase.from("v_benchmark").select();
    expect(res.data).not.toBeNull()
    expect(res.error).toBeNull()
 
    const res2= await supabase.from("v_benchmark_non_exists_table").select();
    expect(res2.error).not.toBeNull()

  });
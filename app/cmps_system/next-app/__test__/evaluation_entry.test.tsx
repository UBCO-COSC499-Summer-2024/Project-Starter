import { createClient } from '@supabase/supabase-js'
 
const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_evaluation_entry', async () => {
    const { data, error } = await supabase.from("evaluation_entry").select();
    expect(data).not.toBeNull()
    expect(error).toBeNull()
 
  })
  test('read_from_no_exsist_supabase_evaluation_entry', async () => {
    const { data, error } = await supabase.from("no_exsist_evaluation_entry").select();
    expect(error).not.toBeNull()
    expect(data).toBeNull()
 
  })
  test('read_from_supabase_delete_and_add_evaluation_entry', async () => {
    const res = await supabase.from("evaluation_entry").select();
    console.log(res.data)
    expect(res.error).toBeNull()
  })

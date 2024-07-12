import { createClient } from '@supabase/supabase-js'
 
const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_time_tracking', async () => {
    const { data, error } = await supabase.from("v_timetracking").select();
    expect(data).not.toBeNull()
    expect(error).toBeNull()
 
  })
  test('read_from_no_exsist_supabase_time_tracking', async () => {
    const { data, error } = await supabase.from("no_exsist_v_timetracking").select();
    expect(error).not.toBeNull()
    expect(data).toBeNull()
 
  })
  test('read_from_no_exsist_supabase_time_tracking', async () => {
    const { data, error } = await supabase.from("no_exsist_v_timetracking").select();
    expect(error).not.toBeNull()
    expect(data).toBeNull()
 
  })
  test('read_from_supabase_delete_and_add_benchmark', async () => {
    const res = await supabase.from("v_timetracking").select();
    console.log(res.data)
    expect(res.error).toBeNull()
  })
  test('read_from_supabase_delete_and_add_benchmark', async () => {
    const res = await supabase.from("service_hours_benchmark").select();
    console.log(res.data)
    expect(res.error).toBeNull()
  
  
    const response = await supabase
      .from('service_hours_benchmark')
      .delete()
      .eq('benchmark_id', res.data[0].benchmark_id)
    const res2 = await supabase.from("service_hours_benchmark").select();
    expect(res2.error).toBeNull()
    expect(res2.data.length - res.data.length).toBe(-1)
  
    const { error } = await supabase
      .from('service_hours_benchmark')
      .insert(res.data[0])
    expect(error).toBeNull()
  
    const res3 = await supabase.from("service_hours_benchmark").select();
  
    expect(res3.data.length - res.data.length).toBe(0)
    console.log(res3.data)
    expect(res3.data.map((x)=>{return x.benchmark_id})).toContain(res.data[0].benchmark_id)
  
})
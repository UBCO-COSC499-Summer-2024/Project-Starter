import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_course', async () => {
  const { data, error } = await supabase.from("course").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_course', async () => {
  const { data, error } = await supabase.from("no_exsist_course").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('read_from_supabase_delete_and_add_course', async () => {
  const res = await supabase.from("course").select();
  expect(res.error).toBeNull()
  const response = await supabase
    .from('course')
    .delete()
    .eq('course_id', res.data[3].course_id)
    
  const res2 = await supabase.from("course").select();
  expect(res2.error).toBeNull()
  expect(res2.data.length - res.data.length).toBe(-1)

  const { error } = await supabase
    .from('course')
    .insert(res.data[3])
  expect(error).toBeNull()

  const res3 = await supabase.from("course").select();

  expect(res3.data.length - res.data.length).toBe(0)
  expect(res3.data.map((x) => { return x.course_id })).toContain(res.data[3].course_id)

})

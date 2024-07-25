import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_course_assign', async () => {
  const { data, error } = await supabase.from("course_assign").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_course_assign', async () => {
  const { data, error } = await supabase.from("no_exsist_course_assign").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})



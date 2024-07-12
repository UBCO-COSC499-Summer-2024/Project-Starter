import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);

test('read_from_supabase_instructor', async () => {
  const { data, error } = await supabase.from("instructor").select();
  expect(data).not.toBeNull();
  expect(error).toBeNull();
});

test('read_from_no_exist_supabase_instructor', async () => {
  const { data, error } = await supabase.from("no_exist_instructor").select();
  expect(error).not.toBeNull();
  expect(data).toBeNull();
});

test('read_from_supabase_instructor_delete_and_add', async () => {
  const res = await supabase.from("instructor").select();
  expect(res.error).toBeNull();
  console.log(res.data);

  const response = await supabase
    .from('instructor')
    .delete()
    .eq('instructor_id', res.data[0].instructor_id);
  expect(response.error).toBeNull();

  const res2 = await supabase.from("instructor").select();
  expect(res2.error).toBeNull();
  expect(res2.data.length).toBe(res.data.length - 1);

  const { error } = await supabase
    .from('instructor')
    .insert(res.data[0]);
  expect(error).toBeNull();

  const res3 = await supabase.from("instructor").select();
  expect(res3.error).toBeNull();
  expect(res3.data.length).toBe(res.data.length);
  expect(res3.data.map((x) => x.instructor_id)).toContain(res.data[0].instructor_id);
  console.log(res3.data);
});

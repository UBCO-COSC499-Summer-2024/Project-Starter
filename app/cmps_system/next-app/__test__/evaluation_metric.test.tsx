import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);
test('read_from_supabase_evaluation_metric', async () => {
  const { data, error } = await supabase.from("evaluation_metric").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_evaluation_metric', async () => {
  const { data, error } = await supabase.from("no_exsist_evaluation_metric").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})


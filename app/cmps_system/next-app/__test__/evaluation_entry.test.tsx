import { createClient } from '@supabase/supabase-js'
const testData = {
  evaluation_entry_id: 201, 
  evaluation_type_id: 3, 
  metric_num: 2,
  course_id: 2,
  instructor_id: 1,
  service_role_id: null,
  evaluation_date: null,
  answer: null
};


const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_evaluation_entry', async () => {
  const { data, error } = await supabase.from("evaluation_entry").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_table', async () => {
  const { data, error } = await supabase.from("no_exsist_evaluation_entry").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("evaluation_entry").select();

  const { error } = await supabase
    .from('evaluation_entry')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("evaluation_entry").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.evaluation_entry_id })).toContain(testData.evaluation_entry_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("evaluation_entry").select();
  const { error } = await supabase
    .from('evaluation_entry')
    .delete()
    .eq('evaluation_entry_id', testData.evaluation_entry_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("evaluation_entry").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.evaluation_entry_id })).not.toContain(testData.evaluation_entry_id) //to see if the data is really deleted
})



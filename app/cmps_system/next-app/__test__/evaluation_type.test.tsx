import { createClient } from '@supabase/supabase-js'
const testData = {
  evaluation_type_id: 401,
  evaluation_type_name: 'Course Feedback',
  description: 'Collects feedback from students about the course content, structure, and delivery.',
  requires_course: true,
  requires_instructor: true,
  requires_service_role: false
};


const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);
test('read_from_supabase_evaluation_type', async () => {
  const { data, error } = await supabase.from("evaluation_type").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_evaluation_type', async () => {
  const { data, error } = await supabase.from("no_exsist_evaluation_type").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("evaluation_type").select();

  const { error } = await supabase
    .from('evaluation_type')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("evaluation_type").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.evaluation_type_id })).toContain(testData.evaluation_type_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("evaluation_type").select();
  const { error } = await supabase
    .from('evaluation_type')
    .delete()
    .eq('evaluation_type_id', testData.evaluation_type_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("evaluation_type").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.evaluation_type_id })).not.toContain(testData.evaluation_type_id) //to see if the data is really deleted
})



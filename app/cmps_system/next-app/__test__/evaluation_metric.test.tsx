import { createClient } from '@supabase/supabase-js'
const testData = {
  evaluation_type_id: 3,
  metric_num: 10000,
  metric_description: 'Overall satisfaction with the course',
  min_value: null,
  max_value: null
};



const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_evaluation_metric', async () => {
  const { data, error } = await supabase.from("evaluation_metric").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_table', async () => {
  const { data, error } = await supabase.from("no_exsist_evaluation_metric").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("evaluation_metric").select();

  const { error } = await supabase
    .from('evaluation_metric')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("evaluation_metric").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.evaluation_type_id })).toContain(testData.evaluation_type_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("evaluation_metric").select();
  const { error } = await supabase
    .from('evaluation_metric')
    .delete()
    .eq('evaluation_type_id', testData.evaluation_type_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("evaluation_metric").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.evaluation_type_id })).not.toContain(testData.evaluation_type_id) //to see if the data is really deleted
})



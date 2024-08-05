import { createClient } from '@supabase/supabase-js'
const testData = {
    benchmark_id: 1003,  // Predefined course_id
    instructor_id: 1,
    year:22222,
    hours: 100
};

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);

test('read_from_supabase_service_hours_benchmark', async () => {
  const { data, error } = await supabase.from("service_hours_benchmark").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_service_hours_benchmark', async () => {
  const { data, error } = await supabase.from("no_exsist_service_hours_benchmark").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("service_hours_benchmark").select();

  const { error } = await supabase
    .from('service_hours_benchmark')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("service_hours_benchmark").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.benchmark_id })).toContain(testData.benchmark_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("service_hours_benchmark").select();
  const { error } = await supabase
    .from('service_hours_benchmark')
    .delete()
    .eq('benchmark_id', testData.benchmark_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("service_hours_benchmark").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.benchmark_id })).not.toContain(testData.benchmark_id) //to see if the data is really deleted
})



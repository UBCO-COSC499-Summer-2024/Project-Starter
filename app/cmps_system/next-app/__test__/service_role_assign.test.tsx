import { createClient } from '@supabase/supabase-js'
const testData = {
    service_role_assign_id: 1003,  
    instructor_id: 1,
    service_role_id: 3,
    start_date: '2024-09-01',
    end_date: '2024-09-01',
    expected_hours: 120
};

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);

test('read_from_supabase_service_role_assign', async () => {
  const { data, error } = await supabase.from("service_role_assign").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_service_role_assign', async () => {
  const { data, error } = await supabase.from("no_exsist_service_role_assign").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("service_role_assign").select();

  const { error } = await supabase
    .from('service_role_assign')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("service_role_assign").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.service_role_assign_id })).toContain(testData.service_role_assign_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("service_role_assign").select();
  const { error } = await supabase
    .from('service_role_assign')
    .delete()
    .eq('service_role_assign_id', testData.service_role_assign_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("service_role_assign").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.service_role_assign_id })).not.toContain(testData.service_role_assign_id) //to see if the data is really deleted
})



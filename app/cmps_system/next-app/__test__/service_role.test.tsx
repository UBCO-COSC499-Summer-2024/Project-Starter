import { createClient } from '@supabase/supabase-js'
const testData = {
  service_role_id: 301,  // This value would typically be auto-generated by the database if set as SERIAL
  title: 'Lab Assistant',
  description: 'Assists in setting up and managing lab equipment, helps students during lab sessions.',
  default_expected_hours: 10,
  building: null,
  room_num: null
};




const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);
test('read_from_supabase_service_role', async () => {
  const { data, error } = await supabase.from("service_role").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_table', async () => {
  const { data, error } = await supabase.from("no_exsist_service_role").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("service_role").select();

  const { error } = await supabase
    .from('service_role')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("service_role").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.service_role_id })).toContain(testData.service_role_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("service_role").select();
  const { error } = await supabase
    .from('service_role')
    .delete()
    .eq('service_role_id', testData.service_role_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("service_role").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.service_role_id })).not.toContain(testData.service_role_id) //to see if the data is really deleted
})



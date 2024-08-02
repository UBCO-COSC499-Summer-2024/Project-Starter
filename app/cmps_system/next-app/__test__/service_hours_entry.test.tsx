import { createClient } from '@supabase/supabase-js'
const testData = {
    service_hours_entry_id: 1003, 
    instructor_id: 1,
    service_role_id:1,
    year: 22024,
    month: 1,
    hours: 999999

};

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);

test('read_from_supabase_service_hours_entry', async () => {
  const { data, error } = await supabase.from("service_hours_entry").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_service_hours_entry', async () => {
  const { data, error } = await supabase.from("no_exsist_service_hours_entry").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("service_hours_entry").select();

  const { error } = await supabase
    .from('service_hours_entry')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("service_hours_entry").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.service_hours_entry_id })).toContain(testData.service_hours_entry_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("service_hours_entry").select();
  const { error } = await supabase
    .from('service_hours_entry')
    .delete()
    .eq('service_hours_entry_id', testData.service_hours_entry_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("service_hours_entry").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.service_hours_entry_id })).not.toContain(testData.service_hours_entry_id) //to see if the data is really deleted
})



import { createClient } from '@supabase/supabase-js'
const testData = {
    event_id: 1,  // Example event ID
    instructor_id: 1,  // Example instructor ID
    attendance_duration: '02:00:00'  // Time duration in HH:MM:SS format
  };

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);

test('read_from_supabase_event_attendance', async () => {
  const { data, error } = await supabase.from("event_attendance").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_event_attendance', async () => {
  const { data, error } = await supabase.from("no_exsist_event_attendance").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("event_attendance").select();

  const { error } = await supabase
    .from('event_attendance')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("event_attendance").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.event_id })).toContain(testData.event_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("event_attendance").select();
  const { error } = await supabase
    .from('event_attendance')
    .delete()
    .eq('event_id', testData.event_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("event_attendance").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.event_id })).not.toContain(testData.event_id) //to see if the data is really deleted
})



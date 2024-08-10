import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);
test('read_from_supabase_event', async () => {
  const { data, error } = await supabase.from("event").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_event', async () => {
  const { data, error } = await supabase.from("no_exsist_event").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})
test('read_from_no_exsist_supabase_event', async () => {
  const { data, error } = await supabase.from("no_exsist_event").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})
test('read_from_supabase_delete_and_add_event', async () => {
  const res = await supabase.from("event").select();
  expect(res.error).toBeNull()
})
test('read_from_supabase_delete_and_add_event', async () => {
  const res = await supabase.from("event").select();
  expect(res.error).toBeNull()


  const response = await supabase
    .from('event')
    .delete()
    .eq('event_id', res.data[0].event_id)
  const res2 = await supabase.from("event").select();
  expect(res2.error).toBeNull()
  expect(res2.data.length - res.data.length).toBe(-1)

  const { error } = await supabase
    .from('event')
    .insert(res.data[0])
  expect(error).toBeNull()

  const res3 = await supabase.from("event").select();

  expect(res3.data.length - res.data.length).toBe(0)
  expect(res3.data.map((x) => { return x.event_id })).toContain(res.data[0].event_id)

})

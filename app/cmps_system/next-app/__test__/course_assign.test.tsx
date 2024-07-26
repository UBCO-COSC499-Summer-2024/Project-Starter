import { createClient } from '@supabase/supabase-js'
const testData = {
  assignment_id: 101,  
  instructor_id: 1, //must exist in the instructor table
  course_id: 2, //must exist in the course table
  position: 'TA',
  start_date: '2024-01-05',
  end_date: '2024-05-15'
};


const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);
test('read_from_supabase_course_assign', async () => {
  const { data, error } = await supabase.from("course_assign").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()
  console.log(data)

})
test('read_from_no_exsist_supabase_table', async () => {
  const { data, error } = await supabase.from("no_exsist_table").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("course_assign").select();

  const { error } = await supabase
    .from('course_assign')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("course_assign").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.assignment_id })).toContain(testData.assignment_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("course_assign").select();
  const { error } = await supabase
    .from('course_assign')
    .delete()
    .eq('assignment_id', testData.assignment_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("course_assign").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.assignment_id })).not.toContain(testData.assignment_id) //to see if the data is really deleted
})



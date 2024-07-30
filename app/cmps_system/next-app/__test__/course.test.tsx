import { createClient } from '@supabase/supabase-js'
const testData = {
  course_id: 1003,  // Predefined course_id
  academic_year: 2024,
  session: 'Winter',
  term: 'Term 1',
  subject_code: 'MATH',
  course_num: '101',
  section_num: '001',
  course_title: 'Introduction to Algebra',
  mode_of_delivery: 'Online',
  req_in_person_attendance: false,
  building: null,
  room_num: null,
  section_comments: null,
  activity: null,
  days: null,
  start_time: null,
  end_time: null,
  num_students: null,
  num_tas: null,
  average_grade: null,
  credits: null,
  year_level: null,
  registration_status: null,
  status: null
};

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.SERVICE_ROLE_KEY);
test('read_from_supabase_course', async () => {
  const { data, error } = await supabase.from("course").select();
  expect(data).not.toBeNull()
  expect(error).toBeNull()

})
test('read_from_no_exsist_supabase_course', async () => {
  const { data, error } = await supabase.from("no_exsist_course").select();
  expect(error).not.toBeNull()
  expect(data).toBeNull()

})

test('add a row', async () => {
  const res = await supabase.from("course").select();

  const { error } = await supabase
    .from('course')
    .insert(testData)
  expect(error).toBeNull()
  const res2 = await supabase.from("course").select();
  expect(res2.data.length - res.data.length).toBe(1) //check if a row really got added
  expect(res2.data.map((x) => { return x.course_id })).toContain(testData.course_id) //to see if the data is really there
})
test('delete a row', async () => {
  const res = await supabase.from("course").select();
  const { error } = await supabase
    .from('course')
    .delete()
    .eq('course_id', testData.course_id)
  expect(error).toBeNull()
  const res2 = await supabase.from("course").select();
  expect(res2.data.length - res.data.length).toBe(-1) //check if a row really got deleted
  expect(res2.data.map((x) => { return x.course_id })).not.toContain(testData.course_id) //to see if the data is really deleted
})



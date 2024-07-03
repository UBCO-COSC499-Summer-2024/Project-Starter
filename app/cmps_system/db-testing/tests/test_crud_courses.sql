-- Plan for the number of tests
BEGIN;

-- Plan the number of tests
SELECT plan(5);

-- Create Test
-- Insert a new course and verify that it was created correctly
INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num, course_title, mode_of_delivery, req_in_person_attendance, building, room_num, section_comments, activity, days, start_time, end_time, num_students, num_tas, average_grade, credits, year_level, registration_status, status)
VALUES (2023, 'Winter', 'Term 1', 'MATH', 101, 1, 'Calculus I', 'In-Person', TRUE, 'Math Building', '101', 'No comments', 'Lecture', 'MWF', '09:00:00', '10:00:00', 30, 2, 85.5, 3, 1, 'Registered', 'Active');

-- Verify that the course was created
SELECT is(
    (SELECT COUNT(*) FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101),
    1::bigint,
    'Created course with academic_year 2023, session Winter, term Term 1, subject_code MATH, course_num 101'
);

-- Update Test
-- Update the course and verify that the update was successful
UPDATE course SET course_title = 'Advanced Calculus I', num_students = 35 WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101;

-- Verify that the course was updated
SELECT is(
    (SELECT course_title FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101),
    'Advanced Calculus I',
    'Updated course title to Advanced Calculus I'
);
SELECT is(
    (SELECT num_students FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101),
    35,
    'Updated number of students to 35'
);

-- Delete Test
-- Delete the course and verify that the deletion was successful
DELETE FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101;

-- Verify that the course was deleted
SELECT is(
    (SELECT COUNT(*) FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101),
    0::bigint,
    'Deleted course with academic_year 2023, session Winter, term Term 1, subject_code MATH, course_num 101'
);

-- Test other fields with boundary conditions and constraints

-- Test inserting with invalid session
-- Expected to fail due to CHECK constraint
SELECT throws_ok(
    INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num)
    VALUES (2023, 'Fall', 'Term 1', 'MATH', 101, 1););


-- -- Test inserting with invalid term
-- -- Expected to fail due to CHECK constraint
-- BEGIN;
-- INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num) 
-- VALUES (2023, 'Winter', 'Term 3', 'MATH', 101, 1);
-- ROLLBACK;
-- SELECT is(
--     (SELECT COUNT(*) FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 3' AND subject_code = 'MATH' AND course_num = 101),
--     0::bigint,
--     'Failed to insert course with invalid term Term 3'
-- );

-- -- Test inserting with invalid mode_of_delivery
-- -- Expected to fail due to CHECK constraint
-- BEGIN;
-- INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num, mode_of_delivery) 
-- VALUES (2023, 'Winter', 'Term 1', 'MATH', 101, 1, 'Remote');
-- ROLLBACK;
-- SELECT is(
--     (SELECT COUNT(*) FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101),
--     0::bigint,
--     'Failed to insert course with invalid mode_of_delivery Remote'
-- );

-- End tests
SELECT * FROM finish();
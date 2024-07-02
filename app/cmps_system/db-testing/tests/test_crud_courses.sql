BEGIN;

SELECT plan(1); --adjust this number to be the number of tests to run

-- Create
-- near-minimal fields test
INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num, num_students)
VALUES (2024, 'winter', '1', 'COSC', 499, 001, 69);
SELECT is(
    (SELECT num_students FROM course WHERE academic_year = 2024 AND session = 'winter' AND term = '1' AND subject_code = 'COSC' AND course_num = 499 AND section_num = 001),
    69,
    'Should be 69 students in course COSC 499 section 001 in winter 2024 term 1'
);

-- Read (not necessary because the other tests already use SELECT statements)

-- Update

-- Delete

SELECT finish();

ROLLBACK;

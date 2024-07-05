-- Plan the number of tests
SELECT
    plan (6);

-- Create
-- Insert a new course and verify that it was created correctly
INSERT INTO
    course (
        academic_year,
        session,
        term,
        subject_code,
        course_num,
        section_num,
        course_title,
        mode_of_delivery,
        req_in_person_attendance,
        building,
        room_num,
        section_comments,
        activity,
        days,
        start_time,
        end_time,
        num_students,
        num_tas,
        average_grade,
        credits,
        year_level,
        registration_status,
        status
    )
VALUES
    (
        2023,
        'Winter',
        'Term 1',
        'MATH',
        '101',
        '001',
        'Calculus I',
        'In-Person',
        TRUE,
        'Math Building',
        '101',
        'No comments',
        'Lecture',
        'MWF',
        '09:00:00',
        '10:00:00',
        30,
        2,
        85.5,
        3,
        1,
        'Registered',
        'Active'
    );

-- Verify that the course was created
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                course
            WHERE
                academic_year = 2023
                AND session = 'Winter'
                AND term = 'Term 1'
                AND subject_code = 'MATH'
                AND course_num = '101'
                AND section_num = '001'
        ),
        1::bigint,
        'Created course with academic_year 2023, session Winter, term Term 1, subject_code MATH, course_num 101'
    );

-- Update
-- Update the course and verify that the update was successful
UPDATE course
SET
    course_title = 'Advanced Calculus I',
    num_students = 35
WHERE
    academic_year = 2023
    AND session = 'Winter'
    AND term = 'Term 1'
    AND subject_code = 'MATH'
    AND course_num = '101';

-- Verify that the course was updated
SELECT
    is (
        (
            SELECT
                course_title
            FROM
                course
            WHERE
                academic_year = 2023
                AND session = 'Winter'
                AND term = 'Term 1'
                AND subject_code = 'MATH'
                AND course_num = '101'
        ),
        'Advanced Calculus I',
        'Updated course title to Advanced Calculus I'
    );

SELECT
    is (
        (
            SELECT
                num_students
            FROM
                course
            WHERE
                academic_year = 2023
                AND session = 'Winter'
                AND term = 'Term 1'
                AND subject_code = 'MATH'
                AND course_num = '101'
        ),
        35,
        'Updated number of students to 35'
    );

-- Test boundary conditions and constraints
-- Inserting with invalid session
-- Expected to fail due to CHECK constraint
SELECT
    throws_ok (
        'INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num) VALUES (2023, ''Fall'', ''Term 1'', ''MATH'', ''101'', ''001'');'
    );

-- Inserting with invalid term
-- Expected to fail due to CHECK constraint
SELECT
    throws_ok (
        'INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num) VALUES (2023, ''Winter'', ''Term 3'', ''MATH'', ''101'', ''001'');'
    );

-- Inserting with invalid mode_of_delivery
-- Expected to fail due to CHECK constraint
SELECT
    throws_ok (
        'INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num, mode_of_delivery) VALUES (2023, ''Winter'', ''Term 1'', ''MATH'', ''101'', ''001'', ''Remote'');'
    );

-- End tests
SELECT
    *
FROM
    finish ();
-- Plan the number of tests
SELECT
    plan (2);

-- Create
-- Insert a new course_assign and verify that it was created correctly
INSERT INTO
    course_assign (
        instructor_id,
        course_id,
        position,
        start_date,
        end_date
    )
VALUES
    (
        (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789),
        (SELECT course_id FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101 AND section_num = 001),
        'Instructor',
        '2020-09-01',
        '2020-12-31'
    );

-- Verify that the course_assign was created
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                course_assign
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
                AND course_id = (SELECT course_id FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101 AND section_num = 001)
        ),
        1::bigint,
        'Created course_assign with instructor_id 123456789, course_id 2023 Winter Term 1 MATH 101 001, position Instructor, start_date 2020-09-01, end_date 2020-12-31'
    );

-- Update
-- Update the course_assign and verify that the update was successful
UPDATE course_assign
SET
    position = 'Teaching Assistant'
WHERE
    instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
    AND course_id = (SELECT course_id FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101 AND section_num = 001);

-- Verify that the service_role was updated
SELECT
    is (
        (
            SELECT
                position
            FROM
                course_assign
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
                AND course_id = (SELECT course_id FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101 AND section_num = 001)
        ),
        'Teaching Assistant',
        'Updated course_assign position to Teaching Assistant'
    );

-- End tests
SELECT
    *
FROM
    finish ();
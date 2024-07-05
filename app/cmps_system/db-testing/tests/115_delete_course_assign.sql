-- Plan the number of tests
SELECT
    plan (1);

-- Delete
-- Delete the service role and verify that the deletion was successful
DELETE FROM course_assign
WHERE
    instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 749174591)
    AND course_id = (SELECT course_id FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101 AND section_num = 001);

-- Verify that the service role was deleted
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                course_assign
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 749174591)
                AND course_id = (SELECT course_id FROM course WHERE academic_year = 2023 AND session = 'Winter' AND term = 'Term 1' AND subject_code = 'MATH' AND course_num = 101 AND section_num = 001)
        ),
        0::bigint,
        'Deleted course_assign with instructor_id 749174591, course_id 2023 Winter Term 1 MATH 101 001'
    );

-- End tests
SELECT
    *
FROM
    finish ();
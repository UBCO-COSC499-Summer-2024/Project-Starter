-- Plan the number of tests
SELECT
    plan (1);

-- Delete
-- Delete the course and verify that the deletion was successful
DELETE FROM course
WHERE
    academic_year = 2023
    AND session = 'Winter'
    AND term = 'Term 1'
    AND subject_code = 'MATH'
    AND course_num = 101;

-- Verify that the course was deleted
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
                AND course_num = 101
        ),
        0::bigint,
        'Deleted course with academic_year 2023, session Winter, term Term 1, subject_code MATH, course_num 101'
    );

-- End tests
SELECT
    *
FROM
    finish ();
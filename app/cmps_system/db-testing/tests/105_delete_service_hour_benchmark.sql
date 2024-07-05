-- Plan the number of tests
SELECT
    plan (1);

-- Delete
-- Delete the service_hours_benchmark and verify that the deletion was successful
DELETE FROM service_hours_benchmark
WHERE
    instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
    AND year = 2020;

-- Verify that the service_hours_benchmark was deleted
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                service_hours_benchmark
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
                AND year = 2020
        ),
        0::bigint,
        'Deleted service_hours_benchmark with instructor_id 123456789 and year 2020'
    );

-- End tests
SELECT
    *
FROM
    finish ();
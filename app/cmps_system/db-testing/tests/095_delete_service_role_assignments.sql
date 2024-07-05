-- Plan the number of tests
SELECT
    plan (1);

-- Delete
-- Delete the service role and verify that the deletion was successful
DELETE FROM service_role_assign
WHERE
    instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
    AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
    AND start_date = '2020-01-01'
    AND end_date = '2020-12-31';

-- Verify that the service role was deleted
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                service_role_assign
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
                AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
                AND start_date = '2020-01-01'
                AND end_date = '2020-12-31'
        ),
        0::bigint,
        'Deleted service_role_assign with instructor_id 123456789, service_role_id Pizza Party Coordinator, start_date 2020-01-01, end_date 2020-12-31'
    );

-- End tests
SELECT
    *
FROM
    finish ();
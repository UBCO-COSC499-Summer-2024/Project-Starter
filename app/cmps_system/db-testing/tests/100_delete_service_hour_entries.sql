-- Plan the number of tests
SELECT
    plan (1);

-- Delete
-- Delete the service_hours_entry and verify that the deletion was successful
DELETE FROM service_hours_entry
WHERE
    instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 749174591)
    AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
    AND year = 2020
    AND month = 1;

-- Verify that the service_hours_entry was deleted
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                service_hours_entry
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 749174591)
                AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
                AND year = 2020
                AND month = 1
        ),
        0::bigint,
        'Deleted service_hours_entry with instructor_id 749174591, service_role_id Pizza Party Coordinator, year 2020, month 1'
    );

-- End tests
SELECT
    *
FROM
    finish ();
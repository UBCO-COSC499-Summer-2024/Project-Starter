-- Plan the number of tests
SELECT
    plan (2);

-- Create
-- Insert a new service_hours_entry and verify that it was created correctly
INSERT INTO
    service_hours_entry (
        instructor_id,
        service_role_id,
        year,
        month,
        hours
    )
VALUES
    (
        (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789),
        (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator'),
        2020,
        1,
        300
    );

-- Verify that the service_hours_entry was created
SELECT
    is (
        (
            SELECT
                hours
            FROM
                service_hours_entry
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
                AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
                AND year = 2020
                AND month = 1
        ),
        300,
        'Created service_hours_entry with instructor_id 123456789, service_role_id Pizza Party Coordinator, year 2020, month 1, hours 300'
    );

-- Update
-- Update the service_hours_entry and verify that the update was successful
UPDATE service_hours_entry
SET
    hours = 200
WHERE
    instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
    AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
    AND year = 2020
    AND month = 1;

-- Verify that the service_hours_entry was updated
SELECT
    is (
        (
            SELECT
                hours
            FROM
                service_hours_entry
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
                AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
                AND year = 2020
                AND month = 1
        ),
        200,
        'Updated hours to 200'
    );

-- End tests
SELECT
    *
FROM
    finish ();
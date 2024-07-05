-- Plan the number of tests
SELECT
    plan (2);

-- Create
-- Insert a new service_role and verify that it was created correctly
INSERT INTO
    service_role_assign (
        instructor_id,
        service_role_id,
        start_date,
        end_date,
        expected_hours
    )
VALUES
    (
        (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789),
        (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator'),
        '2020-01-01',
        '2020-12-31',
        300
    );

-- Verify that the service_role was created
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
                AND expected_hours = 300
        ),
        1::bigint,
        'Created service_role_assign with instructor_id 123456789, service_role_id Pizza Party Coordinator, start_date 2020-01-01, end_date 2020-12-31, expected_hours 300'
    );

-- Update
-- Update the service_role and verify that the update was successful
UPDATE service_role_assign
SET
    expected_hours = 200
WHERE
    instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
    AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
    AND start_date = '2020-01-01'
    AND end_date = '2020-12-31';

-- Verify that the service_role was updated
SELECT
    is (
        (
            SELECT
                expected_hours
            FROM
                service_role_assign
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789)
                AND service_role_id = (SELECT service_role_id FROM service_role WHERE title = 'Pizza Party Coordinator')
                AND start_date = '2020-01-01'
                AND end_date = '2020-12-31'
        ),
        200,
        'Updated expected_hours to 200'
    );

-- End tests
SELECT
    *
FROM
    finish ();
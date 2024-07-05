-- Plan the number of tests
SELECT
    plan (2);

-- Create
-- Insert a new service_role and verify that it was created correctly
INSERT INTO
    service_role (
        title,
        description,
        default_expected_hours,
        building,
        room_num
    )
VALUES
    (
        'Pizza Party Coordinator',
        'Guy who organizes the pizza parties',
        20,
        'SCI',
        '712'
    );

-- Verify that the service_role was created
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                service_role
            WHERE
                title = 'Pizza Party Coordinator'
                AND description = 'Guy who organizes the pizza parties'
                AND default_expected_hours = 20
                AND building = 'SCI'
                AND room_num = '712'
        ),
        1::bigint,
        'Created service_role with title Pizza Party Coordinator, description Guy who organizes the pizza parties, default_expected_hours 20, building SCI, room_num 712'
    );

-- Update
-- Update the service_role and verify that the update was successful
UPDATE service_role
SET
    default_expected_hours = 25
WHERE
    title = 'Pizza Party Coordinator';

-- Verify that the service_role was updated
SELECT
    is (
        (
            SELECT
                default_expected_hours
            FROM
                service_role
            WHERE
                title = 'Pizza Party Coordinator'
        ),
        25,
        'Updated default_expected_hours to 25'
    );

-- End tests
SELECT
    *
FROM
    finish ();
-- Plan the number of tests
SELECT
    plan (2);

-- Create
-- Insert a new service_hours_entry and verify that it was created correctly
INSERT INTO
    service_hours_benchmark (
        instructor_id,
        year,
        hours
    )
VALUES
    (
        (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 749174591),
        2020,
        100
    );

-- Verify that the service_hours_entry was created
SELECT
    is (
        (
            SELECT
                hours
            FROM
                service_hours_benchmark
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 749174591)
                AND year = 2020
        ),
        100,
        'Created service_hours_entry with 100 hours'
    );

-- Update
-- Update the service_hours_benchmark and verify that the update was successful
UPDATE service_hours_benchmark
SET
    hours = 70
WHERE
    instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 749174591)
    AND year = 2020;

-- Verify that the service_hours_benchmark was updated
SELECT
    is (
        (
            SELECT
                hours
            FROM
                service_hours_benchmark
            WHERE
                instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = 749174591)
                AND year = 2020
        ),
        70,
        'Updated hours to 70 for service_hours_benchmark with instructor_id 749174591 and year 2020'
    );

-- End tests
SELECT
    *
FROM
    finish ();
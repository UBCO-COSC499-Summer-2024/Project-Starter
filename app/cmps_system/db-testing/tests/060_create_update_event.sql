-- Plan the number of tests
SELECT
    plan (2);

-- Create
-- Insert a new evaluation metric and verify that it was created correctly
INSERT INTO
    event (
        event_datetime,
        is_meeting,
        duration,
        description,
        location
    )
VALUES
    (
        '2024-07-04 12:00:00',
        false,
        '03:00:00',
        'Grill some burgers',
        'UBCO Football Field'
    );

-- Verify that the evaluation metric was created
SELECT
    is (
        (
            SELECT
                duration
            FROM
                event
            WHERE
                description = 'Grill some burgers'
                AND location = 'UBCO Football Field'
                AND event_datetime = '2024-07-04 12:00:00'
        ),
        '03:00:00',
        'Created event with description `Grill some burgers` and location `UBCO Football Field`'
    );

-- Update
UPDATE event
SET
    duration = '04:00:00'
WHERE
    description = 'Grill some burgers'
    AND location = 'UBCO Football Field'
    AND event_datetime = '2024-07-04 12:00:00';

-- Verify that the course was updated
SELECT
    is (
        (
            SELECT
                duration
            FROM
                event
            WHERE
                description = 'Grill some burgers'
                AND location = 'UBCO Football Field'
                AND event_datetime = '2024-07-04 12:00:00'
        ),
        '04:00:00',
        'Updated event with description `Grill some burgers` and location `UBCO Football Field`'
    );

-- End tests
SELECT
    *
FROM
    finish ();
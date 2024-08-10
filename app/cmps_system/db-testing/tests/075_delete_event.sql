SELECT
    plan (1);

-- Delete
DELETE FROM event
WHERE
    description LIKE 'Grill some burgers'
    AND location LIKE 'UBCO Football Field'
    AND event_datetime = '2024-07-04 12:00:00';

-- Verify that the event was deleted
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                event
            WHERE
                description LIKE 'Grill some burgers'
                AND location LIKE 'UBCO Football Field'
                AND event_datetime = '2024-07-04 12:00:00'
        ),
        0::bigint,
        'Deleted event with description `Grill some burgers` and location `UBCO Football Field`'
    );

SELECT
    finish ();
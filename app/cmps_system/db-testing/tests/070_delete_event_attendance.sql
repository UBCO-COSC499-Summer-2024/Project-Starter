SELECT
    plan (1);

-- Delete
DELETE FROM event_attendance
WHERE
    event_id = (
        SELECT
            event_id
        FROM
            event
        WHERE
            description = 'Grill some burgers'
            AND location = 'UBCO Football Field'
            AND event_datetime = '2024-07-04 12:00:00'
    )
    AND instructor_id = (
        SELECT
            instructor_id
        FROM
            instructor
        WHERE
            ubc_employee_num = '749174591'
    );

-- Verify that the event was deleted
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                event_attendance
            WHERE
                event_id = (
                    SELECT
                        event_id
                    FROM
                        event
                    WHERE
                        description = 'Grill some burgers'
                        AND location = 'UBCO Football Field'
                        AND event_datetime = '2024-07-04 12:00:00'
                )
                AND instructor_id = (
                    SELECT
                        instructor_id
                    FROM
                        instructor
                    WHERE
                        ubc_employee_num = '749174591'
                )
        ),
        0::bigint,
        'Deleted event attendance for event with description `Grill some burgers` and location `UBCO Football Field` and instructor with UBC employee number `12345678`'
    );

SELECT
    finish ();
-- Plan the number of tests
SELECT
    plan (2);

-- Create
-- Insert a new evaluation metric and verify that it was created correctly
INSERT INTO
    event_attendance (
        event_id,
        instructor_id,
        attendance_duration
    )
VALUES
    (
        (SELECT event_id FROM event WHERE description = 'Grill some burgers' AND location = 'UBCO Football Field' AND event_datetime = '2024-07-04 12:00:00'),
        (SELECT instructor_id FROM instructor WHERE ubc_employee_num = '749174591'),
        '02:00:00'
    );

-- Verify that the evaluation metric was created
SELECT
    is (
        (
            SELECT
                attendance_duration
            FROM
                event_attendance
            WHERE
                event_id = (SELECT event_id FROM event WHERE description = 'Grill some burgers' AND location = 'UBCO Football Field' AND event_datetime = '2024-07-04 12:00:00')
                AND instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = '749174591')
        ),
        '02:00:00',
        'Created event attendance for event with description `Grill some burgers` and location `UBCO Football Field` and instructor with UBC employee number `749174591`'
    );

-- Update
UPDATE event_attendance
SET
    attendance_duration = '03:00:00'
WHERE
    event_id = (SELECT event_id FROM event WHERE description = 'Grill some burgers' AND location = 'UBCO Football Field' AND event_datetime = '2024-07-04 12:00:00')
    AND instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = '749174591');

-- Verify that the course was updated
SELECT
    is (
        (
            SELECT
                attendance_duration
            FROM
                event_attendance
            WHERE
                event_id = (SELECT event_id FROM event WHERE description = 'Grill some burgers' AND location = 'UBCO Football Field' AND event_datetime = '2024-07-04 12:00:00')
                AND instructor_id = (SELECT instructor_id FROM instructor WHERE ubc_employee_num = '749174591')
        ),
        '03:00:00',
        'Updated event attendance for event with description `Grill some burgers` and location `UBCO Football Field` and instructor with UBC employee number `749174591`'
    );

-- End tests
SELECT
    *
FROM
    finish ();
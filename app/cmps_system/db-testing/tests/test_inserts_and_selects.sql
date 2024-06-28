BEGIN;

SELECT plan(1);

-- Insert into instructor table and verify
INSERT INTO instructor (ubc_employee_num, prefix, first_name, last_name, suffix, title, hire_date)
VALUES (123456789, 'Dr.', 'John', 'Doe', 'Jr.', 'Professor', '2020-08-01');
SELECT is(
    (SELECT first_name FROM instructor WHERE ubc_employee_num = 123456789),
    'John',
    'First name should be John'
);

-- -- Insert into course table and verify
-- INSERT INTO course (academic_year, session, term, subject_code, course_num, section_num, course_title, mode_of_delivery, req_in_person_attendance, building, room_num)
-- VALUES (2024, 'winter', '1', 'COSC', 110, 101, 'Introduction to Computer Science', 'in person', true, 'ICICS', 'X150');
-- SELECT is(
--     (SELECT course_title FROM course WHERE subject_code = "COSC" AND course_num = 222 and section_num = 001),
--     'Introduction to Databases',
--     'Course title should be Introduction to Computer Science'
-- );

-- -- Insert into evaluation_entry table and verify
-- INSERT INTO evaluation_entry (evaluation_type_id, metric_num, course_id, instructor_id, evaluation_date, answer)
-- VALUES (1, 1, 1, 1, '2024-01-15', 5);
-- SELECT is(
--     (SELECT answer FROM evaluation_entry WHERE evaluation_type_id = 1 AND metric_num = 1),
--     5,
--     'Answer should be 5'
-- );

-- -- Insert into service_role table and verify
-- INSERT INTO service_role (title, description, default_expected_hours, building, room_num)
-- VALUES ('Coordinator', 'Coordinates activities', 20, 'Main Building', '101');
-- SELECT is(
--     (SELECT title FROM service_role WHERE title = 'Coordinator'),
--     'Coordinator',
--     'Service role title should be Coordinator'
-- );

-- -- Insert into service_hours_entry table and verify
-- INSERT INTO service_hours_entry (instructor_id, service_role_id, year, month, hours)
-- VALUES (1, 1, 2024, 6, 15);
-- SELECT is(
--     (SELECT hours FROM service_hours_entry WHERE instructor_id = 1 AND service_role_id = 1 AND year = 2024 AND month = 6),
--     15,
--     'Service hours should be 15'
-- );

-- -- Insert into event table and verify
-- INSERT INTO event (event_datetime, is_meeting, duration, description, location)
-- VALUES ('2024-06-26 10:00:00', true, '01:30:00', 'Project Meeting', 'Conference Room');
-- SELECT is(
--     (SELECT description FROM event WHERE event_datetime = '2024-06-26 10:00:00'),
--     'Project Meeting',
--     'Event description should be Project Meeting'
-- );

-- -- Insert into event_attendance table and verify
-- INSERT INTO event_attendance (event_id, instructor_id, attendance_duration)
-- VALUES (1, 1, '01:30:00');
-- SELECT is(
--     (SELECT attendance_duration FROM event_attendance WHERE event_id = 1 AND instructor_id = 1),
--     '01:30:00',
--     'Attendance duration should be 01:30:00'
-- );

SELECT finish();

ROLLBACK;

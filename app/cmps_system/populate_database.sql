-- Instructors
INSERT INTO instructor (ubc_employee_num, prefix, first_name, last_name, suffix, title, hire_date) VALUES
(123456789, 'Dr.', 'John', 'Doe', NULL, 'Professor', '2015-08-15'),
(987654321, 'Prof.', 'Jane', 'Smith', NULL, 'Associate Professor', '2017-05-12'),
(112233445, 'Dr.', 'Emily', 'Johnson', NULL, 'Assistant Professor', '2020-01-10'),
(223344556, 'Dr.', 'Michael', 'Brown', NULL, 'Lecturer', '2018-03-25'),
(334455667, 'Prof.', 'Sarah', 'Davis', NULL, 'Professor', '2016-07-19'),
(445566778, 'Dr.', 'David', 'Wilson', NULL, 'Lecturer', '2019-02-11'),
(556677889, 'Prof.', 'Jessica', 'Taylor', NULL, 'Associate Professor', '2014-11-23'),
(667788990, 'Dr.', 'Daniel', 'Moore', NULL, 'Assistant Professor', '2021-04-10');

-- Evaluation types
INSERT INTO "evaluation_type" ("evaluation_type_name", "description", "requires_course", "requires_instructor", "requires_service_role") VALUES
('Teaching Evaluation', 'Evaluation of teaching performance', FALSE, TRUE, FALSE),
('Course Evaluation', 'Evaluation of course content and delivery', TRUE, FALSE, FALSE),
('SEI', 'Student Evaluation of Instruction', TRUE, TRUE, FALSE),
('Peer Review', 'Evaluation by peers', FALSE, TRUE, FALSE),
('Administrative Review', 'Review of administrative duties', FALSE, TRUE, FALSE);

-- Evaluation metrics
INSERT INTO "evaluation_metric" ("evaluation_type_id", "metric_num", "metric_description") VALUES
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Teaching Evaluation'), 1, 'Clarity of instruction'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Teaching Evaluation'), 2, 'Engagement with students'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Course Evaluation'), 1, 'Course content relevance'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Course Evaluation'), 2, 'Assessment fairness'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI'), 1, 'Rate the professor from 1-5'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI'), 2, 'Rate the course from 1-5'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Peer Review'), 1, 'Contribution to research'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Peer Review'), 2, 'Collaboration with colleagues'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Administrative Review'), 1, 'Efficiency in duties'),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Administrative Review'), 2, 'Punctuality and attendance');

-- Courses
INSERT INTO "course" ("academic_year", "session", "term", "subject_code", "course_num", "section_num", "course_title", "mode_of_delivery", "req_in_person_attendance", "building", "room_num", "section_comments", "activity", "days", "start_time", "end_time", "num_students", "num_tas", "average_grade", "credits", "year_level", "registration_status", "status") VALUES
(2024, 'Winter', 'Term 1', 'COSC', '110', '001', 'Computation, Programs, and Programming', 'In-Person', TRUE, 'EME', '1150', NULL, 'Lecture', 'Mon, Wed, Fri', '09:00', '10:00', 200, 10, 85.5, 3, 1, 'Open', 'Active'),
(2024, 'Winter', 'Term 2', 'MATH', '200', '001', 'Calculus III', 'Hybrid', FALSE, 'SCI', '112', NULL, 'Lecture', 'Tue, Thu', '11:00', '12:30', 150, 5, 78.2, 3, 2, 'Open', 'Active'),
(2023, 'Summer', 'Term 1', 'PHYS', '201', '001', 'Physics of Cats', 'Online', TRUE, 'EME', '1150', 'This course is cool', 'Lecture', 'Mon, Wed, Fri', '03:00', '23:00', 500, 1, 40.5, 3, 2, 'Open', 'Active'),
(2023, 'Summer', 'Term 2', 'STAT', '401', '001', 'Probability and Statistical Inference', 'Hybrid', FALSE, 'ART', '110', NULL, 'Lecture', 'Tue, Thu', '11:00', '12:30', 10, 5, 78.2, 3, 4, 'Open', 'Active'),
(2024, 'Winter', 'Term 1', 'STAT', '101', '001', 'Introduction to Statistics', 'In-Person', TRUE, 'SCI', '101', NULL, 'Lecture', 'Mon, Wed', '14:00', '15:30', 100, 3, 88.0, 3, 1, 'Open', 'Active'),
(2024, 'Winter', 'Term 2', 'MATH', '101', '002', 'General Math', 'In-Person', TRUE, 'SCI', '200', NULL, 'Lecture', 'Mon, Wed, Fri', '10:00', '11:00', 180, 8, 82.0, 3, 1, 'Open', 'Active'),
(2023, 'Summer', 'Term 1', 'PHYS', '150', '001', 'Introduction to Fizzicks', 'Hybrid', FALSE, 'EME', '101', 'Introductory course', 'Lecture', 'Tue, Thu', '08:00', '09:30', 120, 4, 75.0, 3, 1, 'Open', 'Active');

-- Teaching assignments
INSERT INTO "course_assign" ("instructor_id", "course_id", "position", "start_date", "end_date") VALUES
((SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789), 1, 'Instructor', '2024-09-01', '2024-12-15'),
((SELECT instructor_id FROM instructor WHERE ubc_employee_num = 987654321), 2, 'Instructor', '2024-09-01', '2024-12-15'),
((SELECT instructor_id FROM instructor WHERE ubc_employee_num = 123456789), 3, 'Instructor', '2023-05-01', '2023-06-30'),
((SELECT instructor_id FROM instructor WHERE ubc_employee_num = 987654321), 4, 'Instructor', '2023-07-01', '2023-08-30'),
((SELECT instructor_id FROM instructor WHERE ubc_employee_num = 112233445), 4, 'TA', '2023-07-01', '2023-08-30'),
((SELECT instructor_id FROM instructor WHERE ubc_employee_num = 223344556), 5, 'Instructor', '2024-09-01', '2024-12-15'),
((SELECT instructor_id FROM instructor WHERE ubc_employee_num = 334455667), 6, 'Instructor', '2024-09-01', '2024-12-15'),
((SELECT instructor_id FROM instructor WHERE ubc_employee_num = 445566778), 7, 'Instructor', '2023-05-01', '2023-06-30');

-- Service roles
INSERT INTO "service_role" ("title", "description", "default_expected_hours", "building", "room_num") VALUES
('Undergraduate Advisor', 'Academic advisor for undergraduate students', 20, 'EME', '202'),
('Graduate Advisor', 'Academic advisor for graduate students', 20, 'EME', '202'),
('Research Coordinator', 'Coordinator for research activities', 15, 'ENG', '303'),
('Lab Supervisor', 'Supervisor for engineering labs', 25, 'ENG', '104'),
('Faculty Senate Member', 'Member of the faculty senate', 10, 'MAIN', '305'),
('Curriculum Committee Chair', 'Chair of the curriculum committee', 18, 'MAIN', '310');

-- Service role assignments
INSERT INTO "service_role_assign" ("instructor_id", "service_role_id", "start_date", "end_date", "expected_hours") VALUES
(1, 1, '2024-01-01', '2024-12-31', 20),
(2, 2, '2024-01-01', '2024-12-31', 10),
(3, 1, '2024-01-01', '2024-12-31', 15),
(4, 3, '2024-01-01', '2024-12-31', 20),
(5, 4, '2024-01-01', '2024-12-31', 25),
(6, 5, '2024-01-01', '2024-12-31', 10),
(7, 6, '2024-01-01', '2024-12-31', 18),
(8, 1, '2024-01-01', '2024-12-31', 15);

-- Evaluation entries
INSERT INTO "evaluation_entry" ("evaluation_type_id", "metric_num", "course_id", "instructor_id", "service_role_id", "evaluation_date", "answer") VALUES
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Teaching Evaluation'), 1, NULL, 1, NULL, '2023-12-15', 4),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Teaching Evaluation'), 2, NULL, 1, NULL, '2023-12-15', 5),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Course Evaluation'), 1, 2, NULL, NULL, '2023-12-16', 3),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Course Evaluation'), 2, 2, NULL, NULL, '2023-12-16', 4),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI'), 1, 3, 1, NULL, '2023-12-17', 4),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI'), 2, 3, 1, NULL, '2023-12-17', 5),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Peer Review'), 1, 4, 2, NULL, '2023-12-18', 3),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Peer Review'), 2, 4, 2, NULL, '2023-12-18', 4),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Administrative Review'), 1, NULL, 3, (SELECT service_role_id FROM service_role_assign WHERE instructor_id = 3 LIMIT 1), '2023-12-19', 4),
((SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'Administrative Review'), 2, NULL, 3, (SELECT service_role_id FROM service_role_assign WHERE instructor_id = 3 LIMIT 1), '2023-12-19', 5);

-- Events
INSERT INTO "event" ("event_datetime", "is_meeting", "duration", "description", "location") VALUES
('2024-07-01 10:00:00', TRUE, '01:00:00', 'Department meeting', 'SCI 257'),
('2024-07-02 15:00:00', FALSE, '02:00:00', 'Guest lecture', 'Basement'),
('2024-07-03 02:00:00', FALSE, '03:00:00', 'Pizza party', 'Bathroom'),
('2024-07-04 09:00:00', TRUE, '01:30:00', 'Research symposium', 'ENG 101'),
('2024-07-05 14:00:00', FALSE, '02:00:00', 'Lab safety training', 'ENG 104'),
('2024-07-06 11:00:00', TRUE, '02:00:00', 'Team building exercise', 'Park'),
('2024-07-07 16:00:00', FALSE, '01:00:00', 'Project presentation', 'Conference Room');

-- Event attendance
INSERT INTO "event_attendance" ("event_id", "instructor_id", "attendance_duration") VALUES
(1, 1, '01:00:00'),
(1, 2, '01:00:00'),
(1, 3, '01:00:00'),
(2, 1, '02:00:00'),
(2, 2, '02:00:00'),
(2, 3, '02:00:00'),
(3, 1, '03:00:00'),
(3, 2, '03:00:00'),
(3, 3, '03:00:00'),
(4, 4, '01:30:00'),
(4, 5, '01:30:00'),
(5, 4, '02:00:00'),
(5, 5, '02:00:00'),
(6, 6, '02:00:00'),
(7, 7, '01:00:00');

-- Service hours
INSERT INTO "service_hours_entry" ("instructor_id", "service_role_id", "year", "month", "hours") VALUES
(1, 1, 2024, 5, 15),
(2, 2, 2024, 6, 10),
(3, 1, 2024, 7, 1000),
(4, 3, 2024, 8, 20),
(5, 4, 2024, 9, 25),
(6, 5, 2024, 10, 30),
(7, 6, 2024, 11, 35),
(8, 1, 2024, 12, 40);

-- Service hours benchmarks
INSERT INTO "service_hours_benchmark" ("instructor_id", "year", "hours") VALUES
(1, 2024, 200),
(2, 2024, 100),
(3, 2024, 300),
(4, 2024, 150),
(5, 2024, 250),
(6, 2024, 180),
(7, 2024, 220),
(8, 2024, 160);

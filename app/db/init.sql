/*
 * This script CREATEs the necessary tables for the application's database.
 * 
 * Table: users
 * - id: The unique identifier for each user.
 * - first_name: The first name of the user.
 * - last_name: The last name of the user.
 * - email: The email address of the user.
 * - password: The password of the user.
 * - role: The role of the user.
 * 
 * Table: courses
 * - id: The unique identifier for each course.
 * - name: The name of the course.
 * - description: The description of the course.
 * - end_date: The end date of the course.
 * 
 * Table: exams
 * - id: The unique identifier for each exam.
 * - name: The name of the exam.
 * - date_marked: The date of the exam.
 * - visibility: The visibility status of the exam.
 * - course_id: The foreign key referencing the courses table.
 * 
 * Table: questions
 * - id: The unique identifier for each question.
 * - num_options: The number of options for the question.
 * - correct_answer: The correct answer(s) for the question.
 * - weight: The weight of the question in the exam.
 * - exam_id: The foreign key referencing the exams table.
 * 
 * Table: responses
 * - question_id: The foreign key referencing the questions table.
 * - user_id: The foreign key referencing the users table.
 * - response: The response(s) provided by the user.
 * - grade: The grade received for the response.
 */

CREATE TABLE IF NOT EXISTS users (
    id integer PRIMARY KEY,
    first_name text,
    last_name text,
    email text NOT NULL UNIQUE,
    password text,
    role integer
);


CREATE TABLE IF NOT EXISTS courses (
    id serial PRIMARY KEY,
    department text,
    code text,
    section integer,
    description text,
    start_date date,
    end_date date
);


CREATE TABLE IF NOT EXISTS registration (
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    course_id integer REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, course_id)
);


CREATE TABLE IF NOT EXISTS exams (
    id serial PRIMARY KEY,
    course_id integer REFERENCES courses(id) ON DELETE CASCADE,
    name text,
    date_marked date,
    visibility boolean
);


CREATE TABLE IF NOT EXISTS questions (
    id serial PRIMARY KEY,
    question_num integer,
    exam_id integer REFERENCES exams(id) ON DELETE CASCADE,
    num_options integer,
    correct_answer integer[],
    weight float,
    CONSTRAINT unique_exam_question UNIQUE (exam_id, question_num)
);

CREATE TABLE IF NOT EXISTS responses (
    question_id integer REFERENCES questions(id) ON DELETE CASCADE,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    question_num integer,
    response integer[],
    grade float,
    was_modified boolean,
    PRIMARY KEY (question_id, user_id)
);

CREATE TABLE IF NOT EXISTS scans (
    exam_id integer REFERENCES exams(id) ON DELETE CASCADE,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    scan text,
    PRIMARY KEY (exam_id, user_id)
);

CREATE TABLE IF NOT EXISTS flags (
    id serial PRIMARY KEY,
    exam_id integer REFERENCES exams(id) ON DELETE CASCADE,
    question_id integer REFERENCES questions(id) ON DELETE CASCADE,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    issue text
);

-- Partially AI-Generated Sample Data
-- Role 1 = student, role 2 = instructor, role 3 = admin
INSERT INTO users (id, first_name, last_name, email, password, role) VALUES (1, 'Gradeit', 'Admin', 'admin@gradeit.com', '$2b$10$UjCUgbrrKrN6ytvkZSkhA.Trbvf/UM6TcyieWjjSoCwzsKCk3YkuK', 3); -- password = password123


-- Course Sample Data
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('MATH', '100', '001', 'Differential Calculus with Applications to Physical Sciences and Engineering', '2024-09-04', '2025-01-01');
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('PHYS', '101', '001', 'Introduction to Physics', '2024-09-04', '2025-01-01');
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('CHEM', '101', '001', 'General Chemistry', '2024-09-04', '2025-01-01');
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('BIOL', '101', '001', 'Introduction to Biology', '2024-09-04', '2025-01-01');
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('COMP', '101', '001', 'Introduction to Computer Science', '2024-09-04', '2025-01-01');
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('ECON', '101', '001', 'Principles of Microeconomics', '2024-09-04', '2025-01-01');
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('HIST', '101', '001', 'World History', '2024-09-04', '2025-01-01');
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('PSYC', '101', '001', 'Introduction to Psychology', '2024-09-04', '2025-01-01');
-- INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ('ENGL', '101', '001', 'English Composition', '2024-09-04', '2025-01-01');

-- Registration Sample Data
-- Users 1-5 registered in 5 courses each
-- INSERT INTO registration (user_id, course_id) VALUES (12345678, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (12345678, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (12345678, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (12345678, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (12345678, 5);

-- INSERT INTO registration (user_id, course_id) VALUES (23456789, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (23456789, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (23456789, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (23456789, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (23456789, 9);

-- INSERT INTO registration (user_id, course_id) VALUES (34567890, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (34567890, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (34567890, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (34567890, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (34567890, 6);

-- INSERT INTO registration (user_id, course_id) VALUES (45678901, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (45678901, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (45678901, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (45678901, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (45678901, 9);

-- INSERT INTO registration (user_id, course_id) VALUES (56789012, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (56789012, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (56789012, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (56789012, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (56789012, 7);

-- -- Registration for students
-- INSERT INTO registration (user_id, course_id) VALUES (28102810, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (28102810, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (28102810, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (28102810, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (28102810, 9);

-- INSERT INTO registration (user_id, course_id) VALUES (00000069, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (00000069, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (00000069, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (00000069, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (00000069, 1);

-- INSERT INTO registration (user_id, course_id) VALUES (22211111, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (22211111, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (22211111, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (22211111, 9);
-- INSERT INTO registration (user_id, course_id) VALUES (22211111, 2);

-- INSERT INTO registration (user_id, course_id) VALUES (00000013, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (00000013, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (00000013, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (00000013, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (00000013, 5);

-- INSERT INTO registration (user_id, course_id) VALUES (00000002, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (00000002, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (00000002, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (00000002, 9);
-- INSERT INTO registration (user_id, course_id) VALUES (00000002, 1);

-- INSERT INTO registration (user_id, course_id) VALUES (00000004, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (00000004, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (00000004, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (00000004, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (00000004, 6);

-- INSERT INTO registration (user_id, course_id) VALUES (18897231, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (18897231, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (18897231, 9);
-- INSERT INTO registration (user_id, course_id) VALUES (18897231, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (18897231, 2);

-- INSERT INTO registration (user_id, course_id) VALUES (22111111, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (22111111, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (22111111, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (22111111, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (22111111, 7);

-- INSERT INTO registration (user_id, course_id) VALUES (69696969, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (69696969, 9);
-- INSERT INTO registration (user_id, course_id) VALUES (69696969, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (69696969, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (69696969, 3);

-- INSERT INTO registration (user_id, course_id) VALUES (00000012, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (00000012, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (00000012, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (00000012, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (00000012, 8);

-- INSERT INTO registration (user_id, course_id) VALUES (00000011, 9);
-- INSERT INTO registration (user_id, course_id) VALUES (00000011, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (00000011, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (00000011, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (00000011, 4);

-- INSERT INTO registration (user_id, course_id) VALUES (00000010, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (00000010, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (00000010, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (00000010, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (00000010, 9);

-- INSERT INTO registration (user_id, course_id) VALUES (00000009, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (00000009, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (00000009, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (00000009, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (00000009, 5);

-- INSERT INTO registration (user_id, course_id) VALUES (00000005, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (00000005, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (00000005, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (00000005, 9);
-- INSERT INTO registration (user_id, course_id) VALUES (00000005, 1);

-- INSERT INTO registration (user_id, course_id) VALUES (00000008, 2);
-- INSERT INTO registration (user_id, course_id) VALUES (00000008, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (00000008, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (00000008, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (00000008, 6);

-- INSERT INTO registration (user_id, course_id) VALUES (00000007, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (00000007, 8);
-- INSERT INTO registration (user_id, course_id) VALUES (00000007, 9);
-- INSERT INTO registration (user_id, course_id) VALUES (00000007, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (00000007, 2);

-- INSERT INTO registration (user_id, course_id) VALUES (00000006, 3);
-- INSERT INTO registration (user_id, course_id) VALUES (00000006, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (00000006, 5);
-- INSERT INTO registration (user_id, course_id) VALUES (00000006, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (00000006, 7);

-- -- Assign instructors to courses
-- INSERT INTO registration (user_id, course_id) VALUES (67890123, 1);
-- INSERT INTO registration (user_id, course_id) VALUES (78901234, 1);

-- INSERT INTO registration (user_id, course_id) VALUES (89012345, 2);

-- INSERT INTO registration (user_id, course_id) VALUES (78901234, 3);

-- INSERT INTO registration (user_id, course_id) VALUES (67890123, 4);
-- INSERT INTO registration (user_id, course_id) VALUES (89012345, 4);

-- INSERT INTO registration (user_id, course_id) VALUES (78901234, 5);

-- INSERT INTO registration (user_id, course_id) VALUES (89012345, 6);
-- INSERT INTO registration (user_id, course_id) VALUES (67890123, 6);

-- INSERT INTO registration (user_id, course_id) VALUES (67890123, 7);
-- INSERT INTO registration (user_id, course_id) VALUES (78901234, 7);

-- INSERT INTO registration (user_id, course_id) VALUES (78901234, 8);

-- INSERT INTO registration (user_id, course_id) VALUES (67890123, 9);
-- INSERT INTO registration (user_id, course_id) VALUES (89012345, 9);

-- -- Exams Sample Data
-- -- Course ID 1
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 1); -- Assuming course 1 will be MATH 100-001
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 1);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 1);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 1); -- Yes, I know this is on Christmas.

-- -- Course ID 2
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 2);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 2);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 2);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 2);

-- -- Course ID 3
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 3);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 3);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 3);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 3);

-- -- Course ID 4
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 4);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 4);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 4);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 4);

-- -- Course ID 5
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 5);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 5);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 5);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 5);

-- -- Course ID 6
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 6);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 6);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 6);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 6);

-- -- Course ID 7
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 7);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 7);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 7);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 7);

-- -- Course ID 8
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 8);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 8);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 8);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 8);

-- -- Course ID 9
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 9);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 9);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 9);
-- INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 9);

-- Questions Sample Data
-- Exam 1: MATH 100 Midterm 1
/*
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{0}', 1, 1, 1);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{2}', 1, 1, 2);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{3}', 1, 1, 3);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{0, 1}', 2, 1, 4);
-- Exam 2: MATH 100 Evaluation Quiz
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{4}', 1, 2, 1);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{1}', 1, 2, 2);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{3}', 1, 2, 3);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{2, 4}', 2, 2, 4);
-- Exam 3: MATH 100 Midterm 2
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{1}', 1, 3, 1);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{4}', 1, 3, 2);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{2}', 1, 3, 3);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{1, 3}', 2, 3, 4);
-- Exam 4: MATH 100 Final Exam
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{0}', 1, 4, 1);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{2}', 1, 4, 2);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{3}', 1, 4, 3);
INSERT INTO questions (num_options, correct_answer, weight, exam_id, question_num) VALUES (5, '{0, 1}', 2, 4, 4);

-- Responses Sample Data
-- Responses for questions on Midterm 1
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (1, 12345678, 1, '{0}'); --Responded with 1, should grade correct.
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (2, 12345678, 2, '{2}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (3, 12345678, 3, '{0}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (4, 12345678, 4, '{0, 3}');
-- Responses for questions on Evaluation Quiz
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (5, 12345678, 1, '{4}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (6, 12345678, 2, '{1}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (7, 12345678, 3, '{3}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (8, 12345678, 4, '{0, 4}');
-- Responses for questions on Midterm 2
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (9, 12345678, 1, '{1}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (10, 12345678, 2, '{4}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (11, 12345678, 3, '{3}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (12, 12345678, 4, '{1, 3}');
-- Responses for questions on Final Exam
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (13, 12345678, 1, '{0}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (14, 12345678, 2, '{2}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (15, 12345678, 3, '{0}');
INSERT INTO responses (question_id, user_id, question_num, response) VALUES (16, 12345678, 4,'{0, 1}');
*/
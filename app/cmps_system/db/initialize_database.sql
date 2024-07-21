--TODO: rename long constraint names
CREATE EXTENSION IF NOT EXISTS pgtap;

CREATE TABLE IF NOT EXISTS
    "instructor" (
        "instructor_id" SERIAL NOT NULL,
        "ubc_employee_num" BIGINT NOT NULL,
        "email" VARCHAR(255) NULL,
        "prefix" VARCHAR(255) NULL,
        "first_name" VARCHAR(255) NOT NULL,
        "last_name" VARCHAR(255) NOT NULL,
        "suffix" VARCHAR(255) NULL,
        "title" VARCHAR(255) NULL,
        "hire_date" DATE NULL
    );

ALTER TABLE "instructor"
ADD PRIMARY KEY ("instructor_id");

ALTER TABLE "instructor"
ADD CONSTRAINT "instructor_ubc_employee_num_unique" UNIQUE ("ubc_employee_num");

CREATE TABLE IF NOT EXISTS
    "service_role" (
        "service_role_id" SERIAL NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "default_expected_hours" INTEGER NOT NULL,
        "building" VARCHAR(255) NULL,
        "room_num" VARCHAR(255) NULL
    );

ALTER TABLE "service_role"
ADD PRIMARY KEY ("service_role_id");

CREATE TABLE IF NOT EXISTS
    "course" (
        "course_id" SERIAL NOT NULL,
        "academic_year" INTEGER NOT NULL,
        "session" VARCHAR(255) CHECK ("session" IN ('Winter', 'Summer')) NOT NULL,
        "term" VARCHAR(255) CHECK ("term" IN ('Term 1', 'Term 2', 'Term 1-2')) NOT NULL,
        "subject_code" CHAR(4) NOT NULL,
        "course_num" VARCHAR(3) NOT NULL,
        "section_num" VARCHAR(3) NOT NULL,
        "course_title" VARCHAR(255) NULL,
        "mode_of_delivery" VARCHAR(255) CHECK (
            "mode_of_delivery" IN ('Online', 'In-Person', 'Hybrid', 'Multi-access')
        ) NULL,
        "req_in_person_attendance" BOOLEAN NULL,
        "building" VARCHAR(255) NULL,
        "room_num" VARCHAR(255) NULL,
        "section_comments" TEXT NULL,
        "activity" VARCHAR(255) NULL,
        "days" VARCHAR(255) NULL,
        "start_time" TIME(0) WITHOUT TIME ZONE NULL,
        "end_time" TIME(0) WITHOUT TIME ZONE NULL,
        "num_students" INTEGER NULL,
        "num_tas" INTEGER NULL,
        "average_grade" DECIMAL(5, 3) NULL,
        "credits" INTEGER NULL,
        "year_level" INTEGER NULL,
        "registration_status" VARCHAR(255) NULL,
        "status" VARCHAR(255) NULL
    );

ALTER TABLE "course"
ADD PRIMARY KEY ("course_id");

CREATE TABLE IF NOT EXISTS
    "course_assign" (
        "assignment_id" SERIAL NOT NULL,
        "instructor_id" INTEGER NOT NULL,
        "course_id" INTEGER NOT NULL,
        "position" VARCHAR(255) NOT NULL,
        "start_date" DATE NULL,
        "end_date" DATE NULL
    );

ALTER TABLE "course_assign"
ADD CONSTRAINT "course_assign_unique" UNIQUE ("instructor_id", "course_id");

ALTER TABLE "course_assign"
ADD PRIMARY KEY ("assignment_id");

CREATE TABLE IF NOT EXISTS
    "service_role_assign" (
        "service_role_assign_id" SERIAL NOT NULL,
        "instructor_id" INTEGER NOT NULL,
        "service_role_id" INTEGER NOT NULL,
        "start_date" DATE NOT NULL,
        "end_date" DATE NOT NULL,
        "expected_hours" INTEGER NOT NULL
    );

ALTER TABLE "service_role_assign"
ADD CONSTRAINT "service_role_assign_unique" UNIQUE ("instructor_id", "service_role_id");

ALTER TABLE "service_role_assign"
ADD PRIMARY KEY ("service_role_assign_id");

CREATE TABLE IF NOT EXISTS
    "event" (
        "event_id" SERIAL NOT NULL,
        "event_datetime" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
        "is_meeting" BOOLEAN NOT NULL,
        "duration" TIME(0) WITHOUT TIME ZONE NOT NULL,
        "description" TEXT NULL,
        "location" VARCHAR(255) NULL
    );

ALTER TABLE "event"
ADD PRIMARY KEY ("event_id");

ALTER TABLE "event"
ADD CONSTRAINT "event_unique" UNIQUE ("event_datetime", "location", "description");

CREATE TABLE IF NOT EXISTS
    "service_hours_entry" (
        "service_hours_entry_id" SERIAL NOT NULL,
        "instructor_id" INTEGER NOT NULL,
        "service_role_id" INTEGER NOT NULL,
        "year" INTEGER NOT NULL,
        "month" INTEGER NOT NULL,
        "hours" INTEGER NOT NULL
    );

ALTER TABLE "service_hours_entry"
ADD CONSTRAINT "service_hours_entry_unique" UNIQUE (
    "service_role_id",
    "instructor_id",
    "year",
    "month"
);

-- Grant all privileges on all tables to anon
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;

-- Grant all privileges on all sequences to anon
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;

CREATE TABLE IF NOT EXISTS
    "event_attendance" (
        "event_id" INTEGER NOT NULL,
        "instructor_id" INTEGER NOT NULL,
        "attendance_duration" TIME(0) WITHOUT TIME ZONE NOT NULL
    );

ALTER TABLE "event_attendance"
ADD PRIMARY KEY ("event_id", "instructor_id");

CREATE TABLE IF NOT EXISTS
    "evaluation_type" (
        "evaluation_type_id" SERIAL NOT NULL,
        "evaluation_type_name" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "requires_course" BOOLEAN NULL DEFAULT NULL,
        "requires_instructor" BOOLEAN NULL DEFAULT NULL,
        "requires_service_role" BOOLEAN NULL DEFAULT NULL
    );

ALTER TABLE "evaluation_type"
ADD PRIMARY KEY ("evaluation_type_id");

CREATE TABLE IF NOT EXISTS
    "evaluation_metric" (
        "evaluation_type_id" INTEGER NOT NULL,
        "metric_num" INTEGER NOT NULL,
        "metric_description" TEXT NOT NULL,
        "min_value" INTEGER NULL,
        "max_value" INTEGER NULL
    );

ALTER TABLE "evaluation_metric"
ADD PRIMARY KEY ("evaluation_type_id", "metric_num");

ALTER TABLE "evaluation_type"
ADD CONSTRAINT "evaluation_type_name_unique" UNIQUE ("evaluation_type_name");

CREATE TABLE IF NOT EXISTS
    "evaluation_entry" (
        "evaluation_entry_id" SERIAL NOT NULL,
        "evaluation_type_id" INTEGER NOT NULL,
        "metric_num" INTEGER NOT NULL,
        "course_id" INTEGER NULL,
        "instructor_id" INTEGER NULL,
        "service_role_id" INTEGER NULL,
        "evaluation_date" DATE NULL,
        "answer" INTEGER NULL
    );

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_unique" UNIQUE (
    "evaluation_type_id",
    "metric_num",
    "course_id",
    "instructor_id",
    "service_role_id",
    "evaluation_date"
);

ALTER TABLE "evaluation_entry"
ADD PRIMARY KEY ("evaluation_entry_id");

CREATE TABLE IF NOT EXISTS
    "service_hours_benchmark" (
        "benchmark_id" SERIAL NOT NULL,
        "instructor_id" INTEGER NOT NULL,
        "year" INTEGER NOT NULL,
        "hours" INTEGER NOT NULL
    );

-- Trigger function to enforce evaluation requirements
CREATE
OR REPLACE FUNCTION enforce_evaluation_requirements () RETURNS TRIGGER AS $$
    DECLARE
        f_requires_course BOOLEAN;
        f_requires_instructor BOOLEAN;
        f_requires_service_role BOOLEAN;
        f_min_value INTEGER;
        f_max_value INTEGER;
    BEGIN
        -- Retrieve the requirement flags for the evaluation type of the new entry
        SELECT 
            et.requires_course, 
            et.requires_instructor, 
            et.requires_service_role,
            em.min_value,
            em.max_value
        INTO 
            f_requires_course, 
            f_requires_instructor, 
            f_requires_service_role,
            f_min_value,
            f_max_value
        FROM 
            evaluation_type et
        JOIN 
            evaluation_metric em ON et.evaluation_type_id = em.evaluation_type_id
        WHERE 
            et.evaluation_type_id = NEW.evaluation_type_id
        AND 
            em.metric_num = NEW.metric_num;

        -- Check if the course_id is required and not provided
        IF f_requires_course AND NEW.course_id IS NULL THEN
            RAISE EXCEPTION 'Course ID is required for this evaluation type';
        END IF;

        IF f_requires_course IS FALSE AND NEW.course_id IS NOT NULL THEN
            RAISE EXCEPTION 'Course ID is not allowed for this evaluation type';
        END IF;

        -- Check if the instructor_id is required and not provided
        IF f_requires_instructor AND NEW.instructor_id IS NULL THEN
            RAISE EXCEPTION 'Instructor ID is required for this evaluation type';
        END IF;

        IF f_requires_instructor IS FALSE AND NEW.instructor_id IS NOT NULL THEN
            RAISE EXCEPTION 'Instructor ID is not allowed for this evaluation type';
        END IF;

        -- Check if the service_role_id is required and not provided
        IF f_requires_service_role AND NEW.service_role_id IS NULL THEN
            RAISE EXCEPTION 'Service Role ID is required for this evaluation type';
        END IF;

        IF f_requires_service_role IS FALSE AND NEW.service_role_id IS NOT NULL THEN
            RAISE EXCEPTION 'Service Role ID is not allowed for this evaluation type';
        END IF;

        -- Check if the answer is within the allowed range
        IF NEW.answer IS NOT NULL THEN
            IF f_min_value IS NOT NULL AND NEW.answer < f_min_value THEN
                RAISE EXCEPTION 'Answer % is below the minimum value % for this evaluation metric', NEW.answer, f_min_value;
            END IF;
            IF f_max_value IS NOT NULL AND NEW.answer > f_max_value THEN
                RAISE EXCEPTION 'Answer % is above the maximum value % for this evaluation metric', NEW.answer, f_max_value;
            END IF;
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

-- Create the trigger to call the function before insert or update on evaluation_entry
CREATE TRIGGER trg_enforce_evaluation_requirements BEFORE INSERT
OR
UPDATE ON evaluation_entry FOR EACH ROW
EXECUTE FUNCTION enforce_evaluation_requirements ();

ALTER TABLE "service_hours_benchmark"
ADD PRIMARY KEY ("benchmark_id");

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_service_role_id_foreign" FOREIGN KEY ("service_role_id") REFERENCES "service_role" ("service_role_id") ON DELETE CASCADE;

ALTER TABLE "event_attendance"
ADD CONSTRAINT "event_attendance_event_id_foreign" FOREIGN KEY ("event_id") REFERENCES "event" ("event_id") ON DELETE CASCADE;

ALTER TABLE "service_role_assign"
ADD CONSTRAINT "service_role_assign_service_role_id_foreign" FOREIGN KEY ("service_role_id") REFERENCES "service_role" ("service_role_id") ON DELETE CASCADE;

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_metric_num_foreign" FOREIGN KEY ("metric_num", "evaluation_type_id") REFERENCES "evaluation_metric" ("metric_num", "evaluation_type_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_course_id_foreign" FOREIGN KEY ("course_id") REFERENCES "course" ("course_id") ON DELETE SET NULL;

ALTER TABLE "service_hours_entry"
ADD CONSTRAINT "service_hours_entry_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id") ON DELETE CASCADE;

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id") ON DELETE CASCADE;

ALTER TABLE "service_hours_entry"
ADD CONSTRAINT "service_hours_entry_service_role_id_foreign" FOREIGN KEY ("service_role_id") REFERENCES "service_role" ("service_role_id") ON DELETE CASCADE;

ALTER TABLE "service_hours_benchmark"
ADD CONSTRAINT "service_hours_benchmark_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id") ON DELETE CASCADE;

ALTER TABLE "course_assign"
ADD CONSTRAINT "course_assign_course_id_foreign" FOREIGN KEY ("course_id") REFERENCES "course" ("course_id") ON DELETE CASCADE;

ALTER TABLE "evaluation_metric"
ADD CONSTRAINT "evaluation_metric_evaluation_type_id_foreign" FOREIGN KEY ("evaluation_type_id") REFERENCES "evaluation_type" ("evaluation_type_id") ON DELETE CASCADE;

ALTER TABLE "service_role_assign"
ADD CONSTRAINT "service_role_assign_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id") ON DELETE CASCADE;

ALTER TABLE "event_attendance"
ADD CONSTRAINT "event_attendance_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id") ON DELETE CASCADE;

ALTER TABLE "course_assign"
ADD CONSTRAINT "course_assign_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id") ON DELETE CASCADE;

CREATE OR REPLACE VIEW
    v_instructor_instructor AS
SELECT
    instructor_id,
    prefix,
    first_name,
    last_name,
    suffix,
    title
from
    instructor;

CREATE OR REPLACE VIEW
    v_course AS
SELECT
    course_assign.assignment_id as id,
    course_title,
    CONCAT(building, ' ', room_num) as location,
    CONCAT(instructor.last_name, ', ', instructor.first_name) as instructor_name,
    num_students,
    course."num_tas",
    average_grade,
    year_level,
    session
FROM
    course
    JOIN course_assign on course.course_id = course_assign.course_id
    JOIN instructor ON instructor.instructor_id = course_assign.instructor_id;

CREATE OR REPLACE VIEW
    v_timetracking AS
SELECT
    service_hours_entry_id as id,
     CONCAT(
        instructor.instructor_id,
        ' - ',
        instructor.last_name,
        ', ',
        instructor.first_name
    ) as instructor_name,
    CONCAT(
        service_role.service_role_id,
        ' - ',
        service_role.title
    ) as service_role_name,
    year,
    month,
    hours
from
    service_hours_entry
    JOIN service_role ON service_role.service_role_id = service_hours_entry.service_role_id
    JOIN instructor ON instructor.instructor_id = service_hours_entry.instructor_id;

CREATE OR REPLACE VIEW
    list_of_instructors AS
SELECT
    instructor_id,
    CONCAT(
        instructor.instructor_id,
        ' - ',
        instructor.last_name,
        ', ',
        instructor.first_name
    ) AS name
FROM
    instructor;

CREATE OR REPLACE VIEW
    v_benchmark AS
SELECT
    benchmark_id as id,
    CONCAT(
        instructor.instructor_id,
        ' - ',
        instructor.last_name,
        ', ',
        instructor.first_name
    ) as instructor,
    year,
    hours
from
    service_hours_benchmark
    JOIN instructor ON instructor.instructor_id = service_hours_benchmark.instructor_id;

CREATE OR REPLACE VIEW
    v_evaluations_page AS
SELECT
    evaluation_entry_id as id,
    evaluation_type_name as evaluation_type,
    CASE
        WHEN instructor.instructor_id IS NOT NULL THEN CONCAT(instructor.last_name, ', ', instructor.first_name)
        ELSE ''
    END AS instructor,
    CASE
        WHEN course.course_id IS NOT NULL THEN CONCAT(
            course.subject_code,
            ' ',
            course.course_num,
            ' ',
            course.section_num
        )
        ELSE ''
    END AS course,
    service_role.title as service_role,
    evaluation_entry.metric_num as question_num,
    metric_description as question,
    answer,
    evaluation_date
FROM
    evaluation_entry
    JOIN evaluation_metric ON evaluation_entry.metric_num = evaluation_metric.metric_num
    AND evaluation_entry.evaluation_type_id = evaluation_metric.evaluation_type_id
    JOIN evaluation_type ON evaluation_type.evaluation_type_id = evaluation_entry.evaluation_type_id
    LEFT JOIN instructor ON instructor.instructor_id = evaluation_entry.instructor_id
    LEFT JOIN course ON course.course_id = evaluation_entry.course_id
    LEFT JOIN service_role ON service_role.service_role_id = evaluation_entry.service_role_id;

CREATE OR REPLACE VIEW
    v_evaluation_type_info AS
SELECT
    evaluation_metric.evaluation_type_id as id,
    evaluation_type_name as name,
    description,
    requires_course,
    requires_instructor,
    requires_service_role,
    COUNT(*) as num_entries
FROM
    evaluation_type
    LEFT JOIN evaluation_metric ON evaluation_metric.evaluation_type_id = evaluation_type.evaluation_type_id
GROUP BY
    evaluation_metric.evaluation_type_id,
    evaluation_type_name,
    description,
    requires_course,
    requires_instructor,
    requires_service_role;

CREATE VIEW list_all_service_roles as SELECT service_role.service_role_id, CONCAT(service_role.service_role_id, ' - ', service_role.title) AS service_role_name FROM service_role
--TODO: rename long constraint names
CREATE EXTENSION IF NOT EXISTS pgtap;

CREATE TABLE
    "instructor" (
        "instructor_id" SERIAL NOT NULL,
        "ubc_employee_num" BIGINT NOT NULL,
        "prefix" VARCHAR(255) NULL,
        "first_name" VARCHAR(255) NOT NULL,
        "last_name" VARCHAR(255) NOT NULL,
        "suffix" VARCHAR(255) NULL,
        "title" VARCHAR(255) NULL,
        "hire_date" DATE NULL
    );

ALTER TABLE "instructor"
ADD PRIMARY KEY ("instructor_id");

CREATE TABLE
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
    "evaluation_date"
);

ALTER TABLE "evaluation_entry"
ADD PRIMARY KEY ("evaluation_entry_id");

CREATE TABLE
    "service_role" (
        "service_role_id" SERIAL NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "default_expected_hours" INTEGER NOT NULL,
        "building" VARCHAR(255) NULL,
        "room_num" VARCHAR(255) NOT NULL
    );

ALTER TABLE "service_role"
ADD PRIMARY KEY ("service_role_id");

CREATE TABLE
    "course" (
        "course_id" SERIAL NOT NULL,
        "academic_year" INTEGER NOT NULL,
        "session" VARCHAR(255) CHECK ("session" IN ('Winter', 'Summer')) NOT NULL,
        "term" VARCHAR(255) CHECK ("term" IN ('Term 1', 'Term 2', 'Term 1-2')) NOT NULL,
        "subject_code" CHAR(4) NOT NULL,
        "course_num" INTEGER NOT NULL,
        "section_num" INTEGER NOT NULL,
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

CREATE TABLE
    "evaluation_metric" (
        "evaluation_type_id" INTEGER NOT NULL,
        "metric_num" INTEGER NOT NULL,
        "metric_description" TEXT NOT NULL
    );

ALTER TABLE "evaluation_metric"
ADD PRIMARY KEY ("evaluation_type_id", "metric_num");

CREATE TABLE
    "course_assign" (
        "assignment_id" SERIAL NOT NULL,
        "instructor_id" INTEGER NOT NULL,
        "course_id" INTEGER NOT NULL,
        "position" VARCHAR(255) CHECK ("position" IN ('Instructor', 'TA', 'Other')) NOT NULL,
        "start_date" DATE NOT NULL,
        "end_date" DATE NOT NULL
    );

ALTER TABLE "course_assign"
ADD CONSTRAINT "course_assign_unique" UNIQUE ("instructor_id", "course_id");

ALTER TABLE "course_assign"
ADD PRIMARY KEY ("assignment_id");

CREATE TABLE
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

CREATE TABLE
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

CREATE TABLE
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

CREATE TABLE
    "event_attendance" (
        "event_id" INTEGER NOT NULL,
        "instructor_id" INTEGER NOT NULL,
        "attendance_duration" TIME(0) WITHOUT TIME ZONE NOT NULL
    );

ALTER TABLE "event_attendance"
ADD PRIMARY KEY ("event_id", "instructor_id");

CREATE TABLE
    "evaluation_type" (
        "evaluation_type_id" SERIAL NOT NULL,
        "evaluation_type_name" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL
    );

ALTER TABLE "evaluation_type"
ADD PRIMARY KEY ("evaluation_type_id");

ALTER TABLE "evaluation_type"
ADD CONSTRAINT "evaluation_type_name_unique" UNIQUE ("evaluation_type_name");

CREATE TABLE
    "service_hours_benchmark" (
        "benchmark_id" SERIAL NOT NULL,
        "instructor_id" INTEGER NOT NULL,
        "year" INTEGER NOT NULL,
        "hours" INTEGER NOT NULL
    );

ALTER TABLE "service_hours_benchmark"
ADD PRIMARY KEY ("benchmark_id");

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_service_role_id_foreign" FOREIGN KEY ("service_role_id") REFERENCES "service_role" ("service_role_id")
ON DELETE CASCADE;

ALTER TABLE "event_attendance"
ADD CONSTRAINT "event_attendance_event_id_foreign" FOREIGN KEY ("event_id") REFERENCES "event" ("event_id")
ON DELETE CASCADE;

ALTER TABLE "service_role_assign"
ADD CONSTRAINT "service_role_assign_service_role_id_foreign" FOREIGN KEY ("service_role_id") REFERENCES "service_role" ("service_role_id")
ON DELETE CASCADE;

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_metric_num_foreign" FOREIGN KEY ("metric_num", "evaluation_type_id") REFERENCES "evaluation_metric" ("metric_num", "evaluation_type_id")
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_course_id_foreign" FOREIGN KEY ("course_id") REFERENCES "course" ("course_id")
ON DELETE SET NULL;

ALTER TABLE "service_hours_entry"
ADD CONSTRAINT "service_hours_entry_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id")
ON DELETE CASCADE;

ALTER TABLE "evaluation_entry"
ADD CONSTRAINT "evaluation_entry_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id")
ON DELETE CASCADE;

ALTER TABLE "service_hours_entry"
ADD CONSTRAINT "service_hours_entry_service_role_id_foreign" FOREIGN KEY ("service_role_id") REFERENCES "service_role" ("service_role_id")
ON DELETE CASCADE;

ALTER TABLE "service_hours_benchmark"
ADD CONSTRAINT "service_hours_benchmark_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id")
ON DELETE CASCADE;

ALTER TABLE "course_assign"
ADD CONSTRAINT "course_assign_course_id_foreign" FOREIGN KEY ("course_id") REFERENCES "course" ("course_id")
ON DELETE CASCADE;

ALTER TABLE "evaluation_metric"
ADD CONSTRAINT "evaluation_metric_evaluation_type_id_foreign" FOREIGN KEY ("evaluation_type_id") REFERENCES "evaluation_type" ("evaluation_type_id")
ON DELETE CASCADE;

ALTER TABLE "service_role_assign"
ADD CONSTRAINT "service_role_assign_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id")
ON DELETE CASCADE;

ALTER TABLE "event_attendance"
ADD CONSTRAINT "event_attendance_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id")
ON DELETE CASCADE;

ALTER TABLE "course_assign"
ADD CONSTRAINT "course_assign_instructor_id_foreign" FOREIGN KEY ("instructor_id") REFERENCES "instructor" ("instructor_id")
ON DELETE CASCADE;

CREATE VIEW
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

CREATE VIEW
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

CREATE VIEW v_timetracking AS SELECT service_hours_entry_id as id, CONCAT(instructor.last_name, ',', instructor.first_name) as instructor_name, service_role.title as service_role_name, year, month, hours from service_hours_entry JOIN service_role ON service_role.service_role_id=service_hours_entry.service_role_id JOIN instructor ON instructor.instructor_id=service_hours_entry.instructor_id;

CREATE VIEW v_benchmark AS SELECT benchmark_id as id, CONCAT(instructor.last_name, ', ', instructor.first_name) as instructor, year, hours from service_hours_benchmark JOIN instructor ON instructor.instructor_id=service_hours_benchmark.instructor_id;

CREATE VIEW list_of_instructors AS SELECT instructor_id, CONCAT(instructor.last_name, ', ', instructor.first_name) AS name FROM instructor
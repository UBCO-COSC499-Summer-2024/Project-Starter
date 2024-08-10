-- Plan the number of tests
SELECT
    plan (2);

-- Create
-- Insert a new evaluation metric and verify that it was created correctly
INSERT INTO
    evaluation_entry (
        evaluation_entry_id,
        evaluation_type_id,
        course_id,
        instructor_id,
        metric_num,
        answer
    )
VALUES
    (
        -122,
        (
            SELECT
                evaluation_type_id
            FROM
                evaluation_type
            WHERE
                evaluation_type_name = 'SEI_Survey'
        ),
        (
            SELECT
                course_id
            FROM
                course
            WHERE
                academic_year = 2023
                AND session = 'Winter'
                AND term = 'Term 1'
                AND subject_code = 'MATH'
                AND course_num = '101'
                AND section_num = '001'
        ),
        (
            SELECT
                instructor_id
            FROM
                instructor
            WHERE
                ubc_employee_num = 749174591
        ),
        1,
        4
    );

-- Verify that the evaluation metric was created
SELECT
    is (
        (
            SELECT
                answer
            FROM
                evaluation_entry
            WHERE
                evaluation_entry_id = -122
        ),
        4,
        'Created evaluation entry for `SEI` question 1 with answer 4'
    );

-- Update
UPDATE evaluation_entry
SET
    answer = 9000000
WHERE
    evaluation_entry_id = -122;

-- Verify that the course was updated
SELECT
    is (
        (
            SELECT
                answer
            FROM
                evaluation_entry
            WHERE
                evaluation_entry_id = -122
        ),
        9000000,
        'Updated evaluation entry for `SEI_Survey` question 1 with answer 9000000'
    );

-- End tests
SELECT
    *
FROM
    finish ();
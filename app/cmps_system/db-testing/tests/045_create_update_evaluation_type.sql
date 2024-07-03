-- Plan for the number of tests
BEGIN;

-- Plan the number of tests
SELECT
    plan (3);

-- Create
-- Insert a new evaluation type and verify that it was created correctly
INSERT INTO
    evaluation_type (
        evaluation_type_name,
        description
    )
VALUES
    (
        'SEI',
        'Student Experience of Instruction survey'
    );

-- Verify that the course was created
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                evaluation_type
            WHERE
                evaluation_type_name = 'SEI'
        ),
        1::bigint,
        'Created evaluation `SEI`'
    );

-- Update
-- Update the course and verify that the update was successful
UPDATE evaluation_type
SET
    evaluation_type_name = 'SEI_Survey'
WHERE
    evaluation_type_name = 'SEI';

-- Verify that the course was updated
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                evaluation_type
            WHERE
                evaluation_type_name = 'SEI_Survey'
        ),
        1::bigint,
        'Created evaluation `SEI`'
    );

SELECT
    is (
        (
            SELECT
                description
            FROM
                evaluation_type
            WHERE
                evaluation_type_name = 'SEI_Survey'
        ),
        'Student Experience of Instruction survey',
        'Updated description to `Student Experience of Instruction survey`'
    );

-- End tests
SELECT
    *
FROM
    finish ();
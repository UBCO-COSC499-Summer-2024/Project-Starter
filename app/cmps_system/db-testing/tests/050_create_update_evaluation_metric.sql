-- Plan the number of tests
SELECT
    plan (1);

-- Create
-- Insert a new evaluation metric and verify that it was created correctly
INSERT INTO
    evaluation_metric (
        evaluation_type_id,
        metric_num,
        metric_description
    )
VALUES
    (
        (SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI_Survey'),
        1,
        'How would you rate this course from 1 to 5?'
    );

-- Verify that the evaluation metric was created
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                evaluation_metric
            WHERE
                metric_num = 1
        ),
        1::bigint,
        'Created evaluation `SEI`'
    );

/*
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
*/

-- End tests
SELECT
    *
FROM
    finish ();
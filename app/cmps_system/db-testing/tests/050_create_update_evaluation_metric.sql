-- Plan the number of tests
SELECT
    plan (2);

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

-- Update
UPDATE evaluation_metric
SET
    metric_description = 'How would you rate this course from 1 to 9 gorillion?'
WHERE
    evaluation_type_id = (SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI_Survey')
    AND
    metric_num = 1;

-- Verify that the course was updated
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                evaluation_metric
            WHERE
                evaluation_type_id = (SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI_Survey')
                AND
                metric_num = 1
        ),
        1::bigint,
        'Updated evaluation metric 1 for `SEI_Survey`'
    );

-- End tests
SELECT
    *
FROM
    finish ();
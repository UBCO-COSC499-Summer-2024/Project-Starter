-- Plan for the number of tests
BEGIN;

-- Plan the number of tests
SELECT
    plan (1);

-- Delete the course and verify that the deletion was successful
DELETE FROM evaluation_type
WHERE
    evaluation_type_name = 'SEI_Survey';

-- Verify that the course was deleted
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
        0::bigint,
        'Deleted evaluation `SEI_Survey`'
    );

-- End tests
SELECT
    *
FROM
    finish ();
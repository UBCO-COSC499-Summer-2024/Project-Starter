-- Plan the number of tests
SELECT
    plan (1);

-- Delete
-- Delete the service role and verify that the deletion was successful
DELETE FROM service_role
WHERE
    title = 'Pizza Party Coordinator';

-- Verify that the service role was deleted
SELECT
    is (
        (
            SELECT
                COUNT(*)
            FROM
                service_role
            WHERE
                title = 'Pizza Party Coordinator'
        ),
        0::bigint,
        'Deleted service_role with title Pizza Party Coordinator'
    );

-- End tests
SELECT
    *
FROM
    finish ();
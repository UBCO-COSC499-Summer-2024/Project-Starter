BEGIN;

SELECT plan(1); --adjust this number to be the number of tests to run (or else it will fail)

-- Delete
DELETE FROM evaluation_entry
WHERE
    evaluation_entry_id = -122;

-- Verify that the evaluation entry was deleted
SELECT is(
    (SELECT COUNT(*) FROM evaluation_entry WHERE evaluation_entry_id = -122),
    0::bigint,
    'Deleted manually inserted evaluation entry for `SEI` question 1'
);

SELECT finish();

ROLLBACK;

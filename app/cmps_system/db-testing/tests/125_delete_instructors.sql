SELECT plan(1);

-- Delete
DELETE FROM instructor WHERE ubc_employee_num = 749174591;
SELECT is(
    (SELECT COUNT(*) FROM instructor WHERE ubc_employee_num = 749174591),
    '0', --note: this is a string because the result of COUNT(*) is a bigint which is converted somewhere along the line to a string
    'Instructor should have been deleted'
);

SELECT * FROM finish();
SELECT
    plan (2);

-- Create
INSERT INTO
    instructor (
        ubc_employee_num,
        prefix,
        first_name,
        last_name,
        suffix,
        title,
        hire_date
    )
VALUES
    (
        749174591,
        'Dr.',
        'John',
        'Doe',
        'Jr.',
        'Professor',
        '2020-08-01'
    );

SELECT
    is (
        (
            SELECT
                first_name
            FROM
                instructor
            WHERE
                ubc_employee_num = 749174591
        ),
        'John',
        'First name should be John'
    );

-- Read (not necessary because the other tests already use SELECT statements)
-- Update
UPDATE instructor
SET
    first_name = 'Jane'
WHERE
    ubc_employee_num = 749174591;

SELECT
    is (
        (
            SELECT
                first_name
            FROM
                instructor
            WHERE
                ubc_employee_num = 749174591
        ),
        'Jane',
        'First name should be updated to Jane'
    );

SELECT
    *
FROM
    finish ();
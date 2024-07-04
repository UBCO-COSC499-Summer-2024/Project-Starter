SELECT plan(2);

-- Create
INSERT INTO instructor (ubc_employee_num, prefix, first_name, last_name, suffix, title, hire_date)
VALUES (123412345, 'Dr.', 'Dingus', 'Junior', 'Sr.', 'Professor', '2020-08-01');
SELECT is(
    (SELECT first_name FROM instructor WHERE ubc_employee_num = 123412345),
    'Dingus',
    'First name should be Dingus'
);

-- Read (not necessary because the other tests already use SELECT statements)

-- Update
UPDATE instructor SET first_name = 'Joe' WHERE ubc_employee_num = 123412345;
SELECT is(
    (SELECT first_name FROM instructor WHERE ubc_employee_num = 123412345),
    'Joe',
    'First name should be updated to Joe'
);

SELECT * FROM finish();
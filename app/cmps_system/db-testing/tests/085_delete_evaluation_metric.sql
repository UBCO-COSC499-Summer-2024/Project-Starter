SELECT plan(1); --adjust this number to be the number of tests to run (or else it will fail)

-- Delete
DELETE FROM evaluation_metric
WHERE
    evaluation_type_id = (SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI_Survey')
    AND
    metric_num = 1;

-- Verify that the evaluation metric was deleted
SELECT is(
    (SELECT COUNT(*) FROM evaluation_metric WHERE metric_num = 1 and evaluation_type_id = (SELECT evaluation_type_id FROM evaluation_type WHERE evaluation_type_name = 'SEI_Survey')),
    0::bigint,
    'Deleted evaluation metric with metric_num 1'
);


SELECT finish();

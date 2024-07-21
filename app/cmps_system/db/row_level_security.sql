CREATE
OR REPLACE FUNCTION get_user_email () RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT current_setting('request.jwt.claims', true)::json ->> 'email'
$$;

-- Enable RLS on all relevant tables
ALTER TABLE public.instructor ENABLE ROW LEVEL SECURITY;

--ALTER TABLE public.service_role ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.service_role_assign ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.service_hours_entry ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.service_hours_benchmark ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.course_assign ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.course ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.evaluation_type ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.evaluation_metric ENABLE ROW LEVEL SECURITY;
--ALTER TABLE public.evaluation_entry ENABLE ROW LEVEL SECURITY;
-- instructor
-- Read access for everyone
CREATE POLICY "select_all_instructors" ON public.instructor FOR
SELECT
    TO authenticated USING (true);

-- Write access for staff and head
CREATE POLICY "update_instructors" ON public.instructor FOR
UPDATE TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            auth.users
        WHERE
            auth.users.email = get_user_email ()
            AND auth.users.raw_app_meta_data ->> 'role' IN ('staff', 'head')
    )
);

-- Insert policy: Allow insertions for staff and head
CREATE POLICY "insert_instructors" ON public.instructor FOR INSERT TO authenticated
WITH
    CHECK (
        EXISTS (
            SELECT
                1
            FROM
                auth.users
            WHERE
                auth.users.email = get_user_email ()
                AND auth.users.raw_app_meta_data ->> 'role' IN ('staff', 'head')
        )
    );
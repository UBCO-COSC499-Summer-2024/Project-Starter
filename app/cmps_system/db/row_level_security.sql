-- instructor table
ALTER TABLE public.instructor ENABLE ROW LEVEL SECURITY;

-- Read access for everyone
CREATE POLICY "select_all_instructors" ON public.instructor FOR
SELECT
    TO authenticated USING (true);

-- Write access for everyone
CREATE POLICY "update_instructors" ON public.instructor FOR
UPDATE TO authenticated USING (true);

-- Insert access for staff and head
CREATE POLICY "insert_instructors" ON public.instructor FOR INSERT TO authenticated
WITH
    CHECK (
        (
            SELECT
                role
            FROM
                public.user_role
            WHERE
                user_id = auth.uid ()
        ) IN ('head', 'staff')
    );
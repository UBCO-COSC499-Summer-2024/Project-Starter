-- instructor table
ALTER TABLE public.instructor ENABLE ROW LEVEL SECURITY;

-- Read access for everyone
CREATE POLICY "select_all_instructors" ON public.instructor FOR
SELECT
    TO authenticated USING (true);

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

-- Update access for staff and head
CREATE POLICY "update_instructors" ON public.instructor FOR
UPDATE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
)
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

-- Delete access for staff and head
CREATE POLICY "delete_instructors" ON public.instructor FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);

-- course table
ALTER TABLE public.course ENABLE ROW LEVEL SECURITY;

-- Read access for everyone
CREATE POLICY "select_all_courses" ON public.course FOR
SELECT
    TO authenticated USING (true);

-- Insert access for staff and head
CREATE POLICY "insert_courses" ON public.course FOR INSERT TO authenticated
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

-- Update access for staff and head
CREATE POLICY "update_courses" ON public.course FOR
UPDATE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
)
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

-- Delete access for staff and head
CREATE POLICY "delete_courses" ON public.course FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);

-- service_role table
ALTER TABLE public.service_role ENABLE ROW LEVEL SECURITY;

-- Read access for everyone
CREATE POLICY "select_all_service_roles" ON public.service_role FOR
SELECT
    TO authenticated USING (true);

-- Insert access for staff and head
CREATE POLICY "insert_service_roles" ON public.service_role FOR INSERT TO authenticated
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

-- Update access for staff and head
CREATE POLICY "update_service_roles" ON public.service_role FOR
UPDATE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
)
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

-- Delete access for staff and head
CREATE POLICY "delete_service_roles" ON public.service_role FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);
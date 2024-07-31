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

-- evaluation_type table
ALTER TABLE public.evaluation_type ENABLE ROW LEVEL SECURITY;

-- Read access for everyone
CREATE POLICY "select_all_evaluation_types" ON public.evaluation_type FOR
SELECT
    TO authenticated USING (true);

-- Insert access for staff and head
CREATE POLICY "insert_evaluation_types" ON public.evaluation_type FOR INSERT TO authenticated
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
CREATE POLICY "update_evaluation_types" ON public.evaluation_type FOR
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
CREATE POLICY "delete_evaluation_types" ON public.evaluation_type FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);

-- evaluation_metric table
ALTER TABLE public.evaluation_metric ENABLE ROW LEVEL SECURITY;

-- Read access for everyone
CREATE POLICY "select_all_evaluation_metrics" ON public.evaluation_metric FOR
SELECT
    TO authenticated USING (true);

-- Insert access for staff and head
CREATE POLICY "insert_evaluation_metrics" ON public.evaluation_metric FOR INSERT TO authenticated
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
CREATE POLICY "update_evaluation_metrics" ON public.evaluation_metric FOR
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
CREATE POLICY "delete_evaluation_metrics" ON public.evaluation_metric FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);

-- evaluation_entry table
ALTER TABLE public.evaluation_entry ENABLE ROW LEVEL SECURITY;

-- Read access for relevant instructor, staff, and head
CREATE POLICY "select_relevant_evaluation_entrys" ON public.evaluation_entry FOR
SELECT
    TO authenticated USING (
        (
            SELECT
                role
            FROM
                public.user_role
            WHERE
                user_id = auth.uid ()
        ) IN ('head', 'staff')
        OR (
            SELECT
                email
            FROM
                public.instructor
            WHERE
                instructor.instructor_id = evaluation_entry.instructor_id
        ) = auth.email ()
    );

-- Insert access for staff and head
CREATE POLICY "insert_evaluation_entrys" ON public.evaluation_entry FOR INSERT TO authenticated
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
CREATE POLICY "update_evaluation_entrys" ON public.evaluation_entry FOR
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
CREATE POLICY "delete_evaluation_entrys" ON public.evaluation_entry FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);

-- event table
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;

-- Read access for relevant instructor, staff, and head
CREATE POLICY "select_relevant_events" ON public.event FOR
SELECT
    TO authenticated USING (
        (
            SELECT
                role
            FROM
                public.user_role
            WHERE
                user_id = auth.uid ()
        ) IN ('head', 'staff')
        OR EXISTS (
            SELECT
                1
            FROM
                public.event_attendance
                JOIN public.instructor ON public.event_attendance.instructor_id = public.instructor.instructor_id
            WHERE
                public.event_attendance.event_id = public.event.event_id
                AND public.instructor.email = auth.email ()
        )
    );

-- Insert access for staff and head
CREATE POLICY "insert_events" ON public.event FOR INSERT TO authenticated
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
CREATE POLICY "update_events" ON public.event FOR
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
CREATE POLICY "delete_events" ON public.event FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);

-- Make helper function to check if an instructor attended an event
-- in order to solve the infinite recursion problem with event_attendance RLS
-- Because the function is owned by postgres which bypasses RLS
CREATE FUNCTION has_attended (_email text, _event_id int) RETURNS bool AS $$
SELECT EXISTS (
  SELECT 1
  FROM instructor
    JOIN event_attendance ON instructor.instructor_id = event_attendance.instructor_id
  WHERE instructor.email = _email AND event_attendance.event_id = _event_id
);
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on the event_attendance table
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;

-- Read access for users to see their own attendances and attendances of events they attended, plus staff and head can see all attendances
CREATE POLICY "select_relevant_event_attendance" ON public.event_attendance FOR
SELECT
    TO authenticated USING (
        (
            SELECT
                role
            FROM
                public.user_role
            WHERE
                user_id = auth.uid ()
        ) IN ('head', 'staff')
        OR has_attended (auth.email (), event_id)
    );

-- Insert access for staff and head
CREATE POLICY "insert_event_attendance" ON public.event_attendance FOR INSERT TO authenticated
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
CREATE POLICY "update_event_attendance" ON public.event_attendance FOR
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
CREATE POLICY "delete_event_attendance" ON public.event_attendance FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);

-- course_assign table
ALTER TABLE public.course_assign ENABLE ROW LEVEL SECURITY;

-- Read access for everyone
CREATE POLICY "select_all_course_assigns" ON public.course_assign FOR
SELECT
    TO authenticated USING (true);

-- Insert access for staff and head
CREATE POLICY "insert_course_assigns" ON public.course_assign FOR INSERT TO authenticated
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
CREATE POLICY "update_course_assigns" ON public.course_assign FOR
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
CREATE POLICY "delete_course_assigns" ON public.course_assign FOR DELETE TO authenticated USING (
    (
        SELECT
            role
        FROM
            public.user_role
        WHERE
            user_id = auth.uid ()
    ) IN ('head', 'staff')
);
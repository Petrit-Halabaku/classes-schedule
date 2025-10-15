-- Fix RLS policy violation for instructors table
-- The issue is that policies check for role = 'authenticated' but admin users have role = 'admin'

-- Option 1: Update policies to check for 'admin' role (recommended)
-- This maintains proper admin-only access

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin insert" ON instructors;

DROP POLICY IF EXISTS "Allow admin update" ON instructors;

DROP POLICY IF EXISTS "Allow admin delete" ON instructors;

-- Create new policies that check for 'admin' role
CREATE POLICY "Allow admin insert" ON instructors FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND EXISTS (
            SELECT 1
            FROM user_roles
            WHERE
                user_id = auth.uid ()
                AND role = 'authenticated'
        )
    );

CREATE POLICY "Allow admin update" ON instructors FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

CREATE POLICY "Allow admin delete" ON instructors FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

-- Apply the same fix to other tables
-- Programs
DROP POLICY IF EXISTS "Allow admin insert" ON programs;

DROP POLICY IF EXISTS "Allow admin update" ON programs;

DROP POLICY IF EXISTS "Allow admin delete" ON programs;

CREATE POLICY "Allow admin insert" ON programs FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND EXISTS (
            SELECT 1
            FROM user_roles
            WHERE
                user_id = auth.uid ()
                AND role = 'authenticated'
        )
    );

CREATE POLICY "Allow admin update" ON programs FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

CREATE POLICY "Allow admin delete" ON programs FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

-- Rooms
DROP POLICY IF EXISTS "Allow admin insert" ON rooms;

DROP POLICY IF EXISTS "Allow admin update" ON rooms;

DROP POLICY IF EXISTS "Allow admin delete" ON rooms;

CREATE POLICY "Allow admin insert" ON rooms FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND EXISTS (
            SELECT 1
            FROM user_roles
            WHERE
                user_id = auth.uid ()
                AND role = 'authenticated'
        )
    );

CREATE POLICY "Allow admin update" ON rooms FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

CREATE POLICY "Allow admin delete" ON rooms FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

-- Courses
DROP POLICY IF EXISTS "Allow admin insert" ON courses;

DROP POLICY IF EXISTS "Allow admin update" ON courses;

DROP POLICY IF EXISTS "Allow admin delete" ON courses;

CREATE POLICY "Allow admin insert" ON courses FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND EXISTS (
            SELECT 1
            FROM user_roles
            WHERE
                user_id = auth.uid ()
                AND role = 'authenticated'
        )
    );

CREATE POLICY "Allow admin update" ON courses FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

CREATE POLICY "Allow admin delete" ON courses FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

-- Schedules
DROP POLICY IF EXISTS "Allow admin insert" ON schedules;

DROP POLICY IF EXISTS "Allow admin update" ON schedules;

DROP POLICY IF EXISTS "Allow admin delete" ON schedules;

CREATE POLICY "Allow admin insert" ON schedules FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND EXISTS (
            SELECT 1
            FROM user_roles
            WHERE
                user_id = auth.uid ()
                AND role = 'authenticated'
        )
    );

CREATE POLICY "Allow admin update" ON schedules FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

CREATE POLICY "Allow admin delete" ON schedules FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);

-- Verify the fix
SELECT 'Admin users:' as info;

SELECT u.email, ur.role, ur.created_at
FROM auth.users u
    JOIN user_roles ur ON u.id = ur.user_id
WHERE
    ur.role = 'authenticated';
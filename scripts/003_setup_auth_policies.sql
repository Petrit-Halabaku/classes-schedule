-- Enable Row Level Security on all tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Create a user_roles table to manage admin access
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read all data (public viewing)
CREATE POLICY "Allow public read access" ON programs FOR
SELECT USING (true);

CREATE POLICY "Allow public read access" ON instructors FOR
SELECT USING (true);

CREATE POLICY "Allow public read access" ON rooms FOR
SELECT USING (true);

CREATE POLICY "Allow public read access" ON courses FOR
SELECT USING (true);

CREATE POLICY "Allow public read access" ON schedules FOR
SELECT USING (true);

-- Only allow authenticated users with admin role to modify data
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

-- Repeat for all other tables
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

-- Policy for user_roles table
CREATE POLICY "Users can view their own role" ON user_roles FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Only admins can manage roles" ON user_roles FOR ALL USING (
    auth.uid () IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM user_roles
        WHERE
            user_id = auth.uid ()
            AND role = 'authenticated'
    )
);
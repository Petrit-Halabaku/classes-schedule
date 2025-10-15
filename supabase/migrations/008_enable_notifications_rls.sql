-- Ensure RLS is enabled on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Public read active notifications" ON notifications;

DROP POLICY IF EXISTS "Auth can insert notifications" ON notifications;

DROP POLICY IF EXISTS "Auth can update notifications" ON notifications;

DROP POLICY IF EXISTS "Auth can delete notifications" ON notifications;

-- Public read of active notifications only
CREATE POLICY "Public read active notifications" ON notifications FOR
SELECT USING (
        is_active = true
        AND (
            start_at IS NULL
            OR start_at <= NOW()
        )
        AND (
            end_at IS NULL
            OR end_at >= NOW()
        )
    );

-- Authenticated users can manage notifications
CREATE POLICY "Auth can insert notifications" ON notifications FOR
INSERT
    TO authenticated
WITH
    CHECK (true);

CREATE POLICY "Auth can update notifications" ON notifications FOR
UPDATE TO authenticated USING (true)
WITH
    CHECK (true);

CREATE POLICY "Auth can delete notifications" ON notifications FOR DELETE TO authenticated USING (true);
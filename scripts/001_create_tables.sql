-- Create tables for the class scheduling system
-- Based on the academic schedule format provided

-- Programs/Degrees table
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    level TEXT NOT NULL CHECK (
        level IN ('BACHELOR', 'MASTER', 'PHD')
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    title TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Rooms/Halls table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    capacity INTEGER,
    room_type TEXT CHECK (
        room_type IN (
            'LECTURE',
            'LAB',
            'SEMINAR',
            'COMPUTER_LAB'
        )
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    program_id UUID NOT NULL REFERENCES programs (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    ects_credits INTEGER NOT NULL DEFAULT 0,
    lecture_hours INTEGER NOT NULL DEFAULT 0,
    lab_hours INTEGER NOT NULL DEFAULT 0,
    semester INTEGER NOT NULL CHECK (
        semester IN (1, 2, 3, 4, 5, 6, 7, 8)
    ),
    year INTEGER NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (program_id, code, year)
);

-- Schedule table
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    course_id UUID NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_type TEXT NOT NULL CHECK (
        session_type IN (
            'LECTURE',
            'LAB',
            'SEMINAR',
            'EXAM'
        )
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        CHECK (end_time > start_time)
);

-- Enable RLS on all related tables
alter table programs enable row level security;

alter table instructors enable row level security;

alter table rooms enable row level security;

alter table courses enable row level security;

alter table schedules enable row level security;

-- Allow read for everyone (anon + authenticated)
drop policy if exists "Public read programs" on programs;

create policy "Public read programs" on programs for
select using (true);

drop policy if exists "Public read instructors" on instructors;

create policy "Public read instructors" on instructors for
select using (true);

drop policy if exists "Public read rooms" on rooms;

create policy "Public read rooms" on rooms for select using (true);

drop policy if exists "Public read courses" on courses;

create policy "Public read courses" on courses for
select using (true);

drop policy if exists "Public read schedules" on schedules;

create policy "Public read schedules" on schedules for
select using (true);

drop policy if exists "Auth can insert schedules" on schedules;

create policy "Auth can insert schedules" on schedules for
insert
    to authenticated
with
    check (true);
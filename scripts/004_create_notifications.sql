-- Notifications for system-wide announcements/banners
create table if not exists notifications (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    message text not null,
    severity text not null check (
        severity in (
            'info',
            'success',
            'warning',
            'destructive'
        )
    ) default 'info',
    is_active boolean not null default true,
    start_at timestamptz default now(),
    end_at timestamptz,
    created_at timestamptz default now()
);

alter table notifications enable row level security;

-- Public read of active notifications only
drop policy if exists "Public read active notifications" on notifications;

create policy "Public read active notifications" on notifications for
select using (
        is_active = true
        and (
            start_at is null
            or start_at <= now()
        )
        and (
            end_at is null
            or end_at >= now()
        )
    );

-- Authenticated users can manage notifications
drop policy if exists "Auth can insert notifications" on notifications;

create policy "Auth can insert notifications" on notifications for
insert
    to authenticated
with
    check (true);

drop policy if exists "Auth can update notifications" on notifications;

create policy "Auth can update notifications" on notifications for
update to authenticated using (true)
with
    check (true);

drop policy if exists "Auth can delete notifications" on notifications;

create policy "Auth can delete notifications" on notifications for delete to authenticated using (true);

-- Optional seed example (safe to ignore if exists)
insert into
    notifications (
        title,
        message,
        severity,
        is_active
    )
values (
        'Semester Start',
        'Lectures begin on 15 September 2025.',
        'info',
        true
    ) on conflict do nothing;
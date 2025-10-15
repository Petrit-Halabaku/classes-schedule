INSERT INTO
    user_roles (user_id, role)
SELECT id, 'authenticated'
FROM auth.users
WHERE
    email = 'phalabaku@gmail.com' -- Replace with your actual email
    ON CONFLICT (user_id) DO
UPDATE
SET role = 'authenticated';

-- Example for multiple admins:
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'authenticated'
-- FROM auth.users
-- WHERE email IN ('admin1@example.com', 'admin2@example.com')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'authenticated';

-- To check if the admin user was created successfully:
-- SELECT u.email, ur.role, ur.created_at
-- FROM auth.users u
-- JOIN user_roles ur ON u.id = ur.user_id
-- WHERE ur.role = 'authenticated';
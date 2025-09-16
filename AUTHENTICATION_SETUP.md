# Authentication Setup Guide

This guide will help you set up authentication for the Class Schedule Management System.

## Overview

The application now includes:

- ✅ Header navigation on all pages
- ✅ Authentication protection for `/manage` and `/dashboard` routes
- ✅ Login page at `/login`
- ✅ Signup page at `/signup`
- ✅ Automatic redirects based on authentication status
- ✅ Logout functionality in the navigation

## Setup Steps

### 1. Database Setup

Make sure you have run all the SQL scripts in the `scripts/` directory:

```bash
# Run these in order in your Supabase SQL editor:
1. 001_create_tables.sql
2. 002_seed_data.sql
3. 003_setup_auth_policies.sql
```

### 2. Create Admin User

#### Option A: Using the Signup Page (Recommended)

1. Navigate to `/signup` in your application
2. Create an account with your email and password
3. Check your email and confirm your account
4. Run the admin setup script (see Option B step 2)

#### Option B: Manual Setup

1. Go to your Supabase dashboard → Authentication → Users
2. Create a new user manually or use the signup form
3. Run the admin setup script:

```sql
-- Replace 'your-email@example.com' with your actual email
INSERT INTO user_roles (user_id, role)
SELECT id, 'authenticated'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'authenticated';
```

### 3. Verify Setup

1. Try accessing `/manage` or `/dashboard` without being logged in - you should be redirected to `/login`
2. Log in with your admin credentials
3. You should be redirected to the dashboard and see the admin navigation items
4. Test the logout functionality

## Features

### Authentication Flow

- **Public Access**: The main schedule view (`/`) is accessible to everyone
- **Protected Routes**: `/manage` and `/dashboard` require authentication
- **Automatic Redirects**:
  - Unauthenticated users accessing protected routes → `/login`
  - Authenticated users accessing `/login` → `/dashboard`
  - After login, users are redirected to their intended destination

### Navigation

- **Public Users**: See only "Schedule View" link
- **Authenticated Users**: See "Schedule View", "Manage", and "Dashboard" links
- **User Menu**: Authenticated users see a user avatar with logout option

### Security

- Row Level Security (RLS) is enabled on all tables
- Only users with 'authenticated' role can modify data
- Public read access is allowed for viewing schedules
- All authentication is handled through Supabase Auth

## Troubleshooting

### Common Issues

1. **"User not found" error**: Make sure you've run the admin setup script after creating your account
2. **Can't access protected routes**: Verify your user has the 'authenticated' role in the `user_roles` table
3. **Login redirects not working**: Check that your Supabase environment variables are set correctly

### Check Admin Status

Run this query in your Supabase SQL editor to verify your admin status:

```sql
SELECT u.email, ur.role, ur.created_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'authenticated';
```

## Environment Variables

Make sure these are set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps

Once authentication is set up, you can:

1. Create additional admin users by running the admin setup script for their emails
2. Customize the authentication flow if needed
3. Add more granular permissions (e.g., different user roles)
4. Implement user profile management

-- ==============================================================================
-- Routiva Super Administrator Database Seeder
-- Email:    admin@routiva.com
-- Password: wqlRtq5sTEOdD7wd
-- ==============================================================================

-- 1. Insert or Update Super Admin User in app_users
INSERT INTO public.app_users (
    id,
    email,
    phone,
    role,
    password_hash,
    is_email_verified,
    status,
    created_at,
    updated_at
)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@routiva.com',
    '+919876543210',
    'super_admin',
    crypt('wqlRtq5sTEOdD7wd', gen_salt('bf')),
    true,
    'active',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    role = 'super_admin',
    password_hash = crypt('wqlRtq5sTEOdD7wd', gen_salt('bf')),
    is_email_verified = true,
    status = 'active',
    updated_at = NOW();

-- 2. Insert or Update Admin Profile in profiles
INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    profession,
    city,
    role,
    is_verified,
    created_at,
    updated_at
)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Super Administrator',
    'admin@routiva.com',
    '+919876543210',
    'Platform Operations & Governance',
    'Ahmedabad',
    'super_admin',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    full_name = 'Super Administrator',
    role = 'super_admin',
    is_verified = true,
    updated_at = NOW();

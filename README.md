# Routiva — Product, Edge Functions & Supabase SQL Documentation

**Routiva** is a production-quality recurring daily-commute route matching platform built with React, Vite, JavaScript, Tailwind CSS, Leaflet, and Supabase Edge Functions.

---

## 1. Complete List of Supabase Edge Functions

All frontend client actions and database operations communicate **exclusively** with these Edge Functions (no direct table queries from the frontend):

| # | Edge Function Name | Method | Input Payload | Description & Output |
|---|--------------------|--------|---------------|----------------------|
| **1** | `auth-register` | `POST` | `{ email, phone, password }` | Validates credentials, generates secure 6-digit Email OTP, records pending verification, returns `{ success: true, message, expiresAt }`. |
| **2** | `auth-verify-otp` | `POST` | `{ email, otp, phone, password }` | Validates 6-digit OTP, activates user account in `app_users`, initializes `profiles`, returns session token and user details. |
| **3** | `auth-resend-otp` | `POST` | `{ email }` | Regenerates a fresh 6-digit OTP with a 10-minute validity and delivers it to user email. |
| **4** | `auth-login` | `POST` | `{ email, password }` | Authenticates user credentials via Edge Function, returns session token, profile, and vehicle. |
| **5** | `get-profile` | `POST` | `{ userId }` | Fetches authenticated user profile, rating, and vehicle details. |
| **6** | `update-profile` | `POST` | `{ userId, profileData, role, vehicleData }` | Updates profile metadata and vehicle configuration. |
| **7** | `create-commute` | `POST` | `{ userId, commuteData }` | Saves origin, destination, full sequenced route points (`route_points`), and preferred pickup/drop points (`preferred_route_points`). |
| **8** | `get-user-commutes` | `POST` | `{ userId }` | Retrieves all active and paused commutes created by the authenticated user. |
| **9** | `update-commute-status` | `POST` | `{ commuteId, status: 'active' \| 'paused' }` | Toggles commute active state for matching visibility. |
| **10** | `find-matches` | `POST` | `{ commuteId, userId }` | **Core Matching Engine**: Evaluates full route sequence (`pickup_seq < drop_seq`), calculates proximity distances (Haversine), filters by days & time flexibility, checks seats, and returns ranked matches with compatibility scores. |
| **11** | `send-connection-request` | `POST` | `{ fromUserId, toUserId, fromCommuteId, toCommuteId, pickupPoint, dropPoint, message }` | Dispatches a commute partner request and creates real-time notification. |
| **12** | `respond-connection-request` | `POST` | `{ connectionId, status: 'accepted' \| 'rejected', userId }` | Accepts/declines request. On acceptance, automatically decrements Rider available seats and initializes a private chat conversation. |
| **13** | `get-connections` | `POST` | `{ userId }` | Retrieves all incoming, outgoing, accepted, and rejected connection requests. |
| **14** | `get-messages` | `POST` | `{ conversationId }` | Fetches conversation message history between connected commute partners. |
| **15** | `send-message` | `POST` | `{ conversationId, senderId, message }` | Posts a new in-app coordination message. |
| **16** | `get-notifications` | `POST` | `{ userId }` | Retrieves in-app alerts and notifications. |
| **17** | `mark-notification-read` | `POST` | `{ notificationId }` | Updates notification read status. |
| **18** | `submit-contact` | `POST` | `{ name, email, phone, message }` | Securely stores landing page contact/support inquiries in `contact_messages`. |

---

## 2. Complete SQL Queries to Run in Supabase SQL Editor

Copy and execute the following SQL in your **Supabase Dashboard → SQL Editor**:

```sql
-- ==============================================================================
-- ROUTIVA DATABASE INITIALIZATION SCRIPT
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. APP USERS (Custom Auth Table)
CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EMAIL OTPS (Email Verification & Auth OTPs)
CREATE TABLE IF NOT EXISTS public.email_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON public.email_otps (email, expires_at);

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES public.app_users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    occupation_type TEXT,
    profession TEXT,
    city TEXT DEFAULT 'Ahmedabad',
    area TEXT,
    landmark TEXT,
    avatar_url TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    identity_verified BOOLEAN DEFAULT FALSE,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    trips_completed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES public.app_users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('rider', 'seeker', 'both')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VEHICLES (For Riders)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike', 'scooter', 'ev_car', 'ev_scooter')),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    colour TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    available_seats INTEGER NOT NULL DEFAULT 1 CHECK (available_seats >= 1),
    vehicle_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMMUTES (Daily Recurring Commutes)
CREATE TABLE IF NOT EXISTS public.commutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    commute_type TEXT NOT NULL CHECK (commute_type IN ('rider', 'seeker')),
    start_location TEXT NOT NULL,
    start_city TEXT DEFAULT 'Ahmedabad',
    start_lat NUMERIC(10, 7) NOT NULL,
    start_lng NUMERIC(10, 7) NOT NULL,
    destination_location TEXT NOT NULL,
    destination_city TEXT DEFAULT 'Ahmedabad',
    destination_lat NUMERIC(10, 7) NOT NULL,
    destination_lng NUMERIC(10, 7) NOT NULL,
    days TEXT[] NOT NULL DEFAULT ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    departure_time TIME NOT NULL,
    flexibility_minutes INTEGER DEFAULT 15,
    return_time TIME,
    verified_only BOOLEAN DEFAULT FALSE,
    gender_preference TEXT DEFAULT 'any' CHECK (gender_preference IN ('any', 'same_gender', 'female_only')),
    occupation_preference TEXT DEFAULT 'any',
    max_pickup_km NUMERIC(4, 2) DEFAULT 2.50,
    max_drop_km NUMERIC(4, 2) DEFAULT 2.50,
    contribution_type TEXT DEFAULT 'petrol_split' CHECK (contribution_type IN ('free', 'petrol_split', 'fixed_daily')),
    contribution_amount NUMERIC(8, 2) DEFAULT 50.00,
    available_seats INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROUTE POINTS (The Full Route Sequence Order)
CREATE TABLE IF NOT EXISTS public.route_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commute_id UUID NOT NULL REFERENCES public.commutes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_route_points_commute ON public.route_points (commute_id, sequence_order);

-- 8. PREFERRED ROUTE POINTS (Preferred Pickup & Drop Points near route)
CREATE TABLE IF NOT EXISTS public.preferred_route_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commute_id UUID NOT NULL REFERENCES public.commutes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    point_type TEXT NOT NULL CHECK (point_type IN ('pickup', 'drop')),
    sequence_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONNECTION REQUESTS
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    to_user UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    from_commute_id UUID NOT NULL REFERENCES public.commutes(id) ON DELETE CASCADE,
    to_commute_id UUID NOT NULL REFERENCES public.commutes(id) ON DELETE CASCADE,
    pickup_point TEXT,
    drop_point TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_request 
ON public.connection_requests (from_user, to_user, from_commute_id, to_commute_id) 
WHERE status = 'pending';

-- 10. CONVERSATIONS & CHAT
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_request_id UUID REFERENCES public.connection_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_members (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON public.messages (conversation_id, created_at ASC);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id, is_read, created_at DESC);

-- 12. CONTACT FORM SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferred_route_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
```

---

## 3. How to Run and Test Locally

```bash
cd d:\Routiva\Routiva
npm install
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to experience:
- Interactive Hero Route Visualizer (Nikol → Thaltej).
- Zero-auth Matching Sandbox Demo.
- Email + Phone + Password Registration with 6-digit Email OTP verification.
- 4-Step Commute Creation Wizard with sequenced Leaflet maps.
- Live Matches Explorer and Connection Requests manager.

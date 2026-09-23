# Supabase Edge Functions Deployment & SQL Reference Guide

This document contains the complete step-by-step instructions for deploying Routiva Edge Functions and executing database schema migrations.

---

## 1. Quick Deploy with Supabase CLI

To deploy all Routiva Edge Functions to your live Supabase project:

```bash
# 1. Login to Supabase CLI
supabase login

# 2. Link your local project to your Supabase project ref
supabase link --project-ref your-project-ref

# 3. Deploy all Edge Functions
supabase functions deploy auth-register
supabase functions deploy auth-verify-otp
supabase functions deploy find-matches
```

---

## 2. Edge Functions Directory Structure

```
d:\Routiva\Routiva\
└── supabase/
    ├── schema.sql                         # Complete PostgreSQL database DDL
    └── functions/
        ├── auth-register/
        │   └── index.ts                   # Generates 6-digit Email OTP & records pending user
        ├── auth-verify-otp/
        │   └── index.ts                   # Validates OTP, activates user & creates session
        └── find-matches/
            └── index.ts                   # Full route sequence matching & scoring engine
```

---

## 3. Edge Functions List & Payloads

### 1. `auth-register`
- **Path**: `supabase/functions/auth-register/index.ts`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "phone": "+91 98765 43210",
    "password": "mySecurePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Verification OTP sent to your email address.",
    "email": "user@example.com",
    "expiresAt": "2026-09-23T11:05:00.000Z",
    "debugOtp": "582910"
  }
  ```

---

### 2. `auth-verify-otp`
- **Path**: `supabase/functions/auth-verify-otp/index.ts`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "582910",
    "phone": "+91 98765 43210",
    "password": "mySecurePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "routiva_jwt_user_123456789",
    "userId": "uuid-here",
    "user": { "id": "uuid-here", "email": "user@example.com" }
  }
  ```

---

### 3. `find-matches`
- **Path**: `supabase/functions/find-matches/index.ts`
- **Request Body**:
  ```json
  {
    "commuteId": "commute_uuid_here",
    "userId": "user_uuid_here"
  }
  ```
- **Matching Rule**: Validates sequence index (`pickup_seq < drop_seq`), calculates Haversine proximity, filters by days & time flexibility, checks seats, and returns scored matches.
- **Response**:
  ```json
  {
    "success": true,
    "matches": [
      {
        "candidateCommute": { "start_location": "Nikol", "destination_location": "Thaltej" },
        "matchScore": 98,
        "scoreBreakdown": {
          "routeCompatibility": "Excellent",
          "pickupDistanceKm": 0.0,
          "dropDistanceKm": 0.0,
          "pickupPointName": "Nikol",
          "dropPointName": "Vijay Cross Road",
          "timeDeltaMinutes": 5,
          "sharedDaysCount": 5
        },
        "explanation": "Matched because your journey overlaps the Rider's full route."
      }
    ]
  }
  ```

---

## 4. SQL Execution Script

Run the script in [supabase/schema.sql](file:///d:/Routiva/Routiva/supabase/schema.sql) in your Supabase SQL Editor to initialize the database tables, indices, and RLS policies.

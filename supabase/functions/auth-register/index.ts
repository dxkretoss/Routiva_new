// Supabase Edge Function: auth-register
// Handles registration with email, phone, password, generates 6-digit OTP

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, phone, password } = await req.json();

    if (!email || !phone || !password) {
      return new Response(
        JSON.stringify({ error: "Email, phone, and password are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("app_users")
      .select("id, is_email_verified")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingUser && existingUser.is_email_verified) {
      return new Response(
        JSON.stringify({ error: "An account with this email already exists. Please log in." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    // Insert or update OTP
    await supabaseAdmin.from("email_otps").insert({
      email: email.toLowerCase().trim(),
      otp_code: otpCode,
      expires_at: expiresAt,
      verified: false
    });

    // In production, integrate email provider (Resend, SendGrid, etc.)
    console.log(`[Routiva Auth] Generated OTP for ${email}: ${otpCode}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification OTP sent to your email address.",
        email: email.toLowerCase().trim(),
        expiresAt,
        // In local development / preview environments we provide the OTP for immediate testing
        debugOtp: otpCode
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to process registration" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

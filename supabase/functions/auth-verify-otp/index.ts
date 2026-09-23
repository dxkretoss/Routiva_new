// Supabase Edge Function: auth-verify-otp
// Verifies 6-digit email OTP, activates user profile and issues session

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
    const { email, phone, password, otp, fullName } = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: "Email and OTP code are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify OTP
    const { data: otpRecord, error: otpErr } = await supabaseAdmin
      .from("email_otps")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .eq("otp_code", otp.trim())
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpErr || !otpRecord) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP code. Please check or request a new code." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark OTP as verified
    await supabaseAdmin
      .from("email_otps")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    // Check if user already exists in app_users
    let userId;
    const { data: existingUser } = await supabaseAdmin
      .from("app_users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingUser) {
      userId = existingUser.id;
      await supabaseAdmin
        .from("app_users")
        .update({ is_email_verified: true, updated_at: new Date().toISOString() })
        .eq("id", userId);
    } else {
      // Create user record
      const { data: newUser, error: createErr } = await supabaseAdmin
        .from("app_users")
        .insert({
          email: email.toLowerCase().trim(),
          phone: phone || "",
          password_hash: password || "custom_hash",
          is_email_verified: true,
          status: "active"
        })
        .select("id")
        .single();

      if (createErr) throw createErr;
      userId = newUser.id;
    }

    // Upsert Profile with provided Full Name
    const derivedName = (fullName && fullName.trim()) || email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim() || "Routiva Commuter";
    const profileRecord = {
      id: userId,
      full_name: derivedName,
      city: "Ahmedabad",
      area: "Nikol",
      onboarding_complete: false,
      phone_verified: true
    };
    await supabaseAdmin.from("profiles").upsert(profileRecord);

    // Generate token / payload
    const token = `routiva_jwt_${userId}_${Date.now()}`;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email verified successfully!",
        token,
        userId,
        user: {
          id: userId,
          email: email.toLowerCase().trim(),
          phone: phone || ""
        },
        profile: profileRecord
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "OTP verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

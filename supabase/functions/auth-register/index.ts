// Supabase Edge Function: auth-register
// Handles registration with email, phone, password, generates 6-digit OTP, sends real email via Gmail / Google SMTP

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

async function sendOtpEmail(email: string, otpCode: string): Promise<{ success: boolean; message?: string }> {
  const gmailUser = Deno.env.get("GMAIL_USER") || "dakshkretoss@gmail.com";
  const rawPassword = Deno.env.get("GMAIL_APP_PASSWORD") || "jkruremwwzdafmqy";
  const gmailPassword = rawPassword.replace(/\s+/g, "");

  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  // 1. Primary: Google / Gmail TLS SMTP Relay (smtp.gmail.com:465)
  if (gmailUser && gmailPassword) {
    try {
      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: {
            username: gmailUser,
            password: gmailPassword,
          },
        },
      });

      await client.send({
        from: `Routiva <${gmailUser}>`,
        to: email,
        subject: `Your Routiva Verification Code: ${otpCode}`,
        content: `Your Routiva 6-digit verification code is: ${otpCode}. Valid for 10 minutes.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #ea580c; font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">ROUTIVA</h1>
              <p style="color: #64748b; font-size: 13px; margin-top: 4px; font-weight: 600;">Ahmedabad ↔ Gandhinagar Corporate Commutes</p>
            </div>
            
            <div style="padding: 24px; background: #fafaf9; border-radius: 16px; border: 1px solid #f5f5f4; text-align: center;">
              <p style="color: #1c1917; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Your 6-Digit Email Verification Code</p>
              <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ea580c; background: #fff7ed; padding: 14px 28px; border-radius: 14px; display: inline-block; border: 1px solid #ffedd5; font-family: monospace;">
                ${otpCode}
              </div>
              <p style="color: #78716c; font-size: 12px; margin: 16px 0 0 0;">Valid for the next 10 minutes. Do not share this code with anyone.</p>
            </div>
            
            <div style="margin-top: 24px; text-align: center; border-top: 1px solid #f5f5f4; padding-top: 16px;">
              <p style="color: #a8a29e; font-size: 11px; margin: 0;">Sent securely via Google Mail relay to ${email}.</p>
            </div>
          </div>
        `,
      });

      await client.close();
      console.log(`[Routiva Auth] Email dispatched successfully to ${email} via Gmail.`);
      return { success: true, message: "Email sent successfully via Gmail" };
    } catch (err) {
      console.error("[Routiva Auth] Gmail SMTP error, trying fallback...", err);
    }
  }

  // 2. Secondary Fallback: Resend API
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: [email],
          subject: `Your Routiva Verification Code: ${otpCode}`,
          html: `<p>Your code is: <b>${otpCode}</b></p>`
        })
      });
      if (res.ok) return { success: true, message: "Email sent via Resend fallback" };
    } catch (err) {
      console.error("[Routiva Auth] Resend fallback error", err);
    }
  }

  return { success: false, message: "Could not dispatch email. Please check credentials." };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, phone, password, fullName } = await req.json();

    if (!email || !phone || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Email, phone, and password are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("app_users")
      .select("id, is_email_verified")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existingUser && existingUser.is_email_verified) {
      return new Response(
        JSON.stringify({ success: false, error: "An account with this email already exists. Please log in." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP in database
    await supabaseAdmin.from("email_otps").insert({
      email: cleanEmail,
      otp_code: otpCode,
      expires_at: expiresAt,
      verified: false
    });

    // Dispatch real email via Gmail
    const emailResult = await sendOtpEmail(cleanEmail, otpCode);

    return new Response(
      JSON.stringify({
        success: true,
        message: emailResult.success
          ? `Verification code has been sent to ${cleanEmail}`
          : `Verification code generated (${emailResult.message})`,
        email: cleanEmail,
        expiresAt,
        emailSent: emailResult.success,
        emailError: emailResult.success ? null : emailResult.message
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to process registration" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

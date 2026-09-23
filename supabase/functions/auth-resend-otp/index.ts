// Supabase Edge Function: auth-resend-otp
// Resends 6-digit email OTP for authentication via Gmail SMTP / Google

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

async function sendOtpEmail(email: string, otpCode: string): Promise<{ success: boolean; message?: string }> {
  const gmailUser = Deno.env.get("GMAIL_USER") || "dakshkretoss@gmail.com";
  const rawPassword = Deno.env.get("GMAIL_APP_PASSWORD") || "jkruremwwzdafmqy";
  const gmailPassword = rawPassword.replace(/\s+/g, "");

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
        subject: `Your New Routiva Verification Code: ${otpCode}`,
        content: `Your new 6-digit Routiva verification code is: ${otpCode}. Valid for 10 minutes.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px;">
            <h1 style="color: #ea580c; font-size: 26px; font-weight: 900; margin: 0 0 16px 0;">ROUTIVA</h1>
            <p style="color: #1c1917; font-size: 14px; font-weight: 600;">Here is your new 6-digit verification code:</p>
            <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ea580c; background: #fff7ed; padding: 14px 28px; border-radius: 14px; display: inline-block; border: 1px solid #ffedd5; font-family: monospace; margin: 12px 0;">
              ${otpCode}
            </div>
            <p style="color: #78716c; font-size: 12px; margin: 16px 0 0 0;">Valid for 10 minutes.</p>
          </div>
        `,
      });

      await client.close();
      return { success: true, message: "Email resent successfully via Gmail" };
    } catch (err) {
      console.error("[Routiva Auth] Gmail SMTP error", err);
    }
  }

  return { success: false, message: "Gmail SMTP failed" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin.from("email_otps").insert({
      email: cleanEmail,
      otp_code: otpCode,
      expires_at: expiresAt,
      verified: false
    });

    const emailResult = await sendOtpEmail(cleanEmail, otpCode);

    return new Response(
      JSON.stringify({
        success: true,
        message: "A new 6-digit OTP code has been sent.",
        email: cleanEmail,
        emailSent: emailResult.success,
        emailError: emailResult.success ? null : emailResult.message
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

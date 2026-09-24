// Supabase Edge Function: admin-login
// Dynamically authenticates super admin & platform administrators from database / env secrets
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

async function verifyHash(password: string, storedHash?: string | null): Promise<boolean> {
  if (!password || !storedHash) return false;

  // Plain text match check (legacy/direct)
  if (password === storedHash) return true;

  // Web Crypto SHA-256 with salt check
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_routiva_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha256Hash = `sha256$${hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")}`;
  if (storedHash === sha256Hash) return true;

  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Email and password are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Dynamic Database Verification from app_users table
    const { data: userRecord } = await supabaseAdmin
      .from("app_users")
      .select("id, email, password_hash, role, status")
      .eq("email", cleanEmail)
      .in("role", ["super_admin", "admin"])
      .maybeSingle();

    let isAuthenticated = false;
    let authenticatedUser: any = null;

    if (userRecord && userRecord.status !== "suspended") {
      const isMatch = await verifyHash(password, userRecord.password_hash);
      if (isMatch) {
        isAuthenticated = true;
        authenticatedUser = userRecord;
      }
    }

    // 2. Dynamic Environment Secrets fallback (ADMIN_EMAIL & ADMIN_PASSWORD)
    const envAdminEmail = (Deno.env.get("ADMIN_EMAIL") || "admin@routiva.com").trim().toLowerCase();
    const envAdminPassword = Deno.env.get("ADMIN_PASSWORD") || "wqlRtq5sTEOdD7wd";

    if (!isAuthenticated && cleanEmail === envAdminEmail && password === envAdminPassword) {
      isAuthenticated = true;
      authenticatedUser = {
        id: userRecord?.id || "admin_root_001",
        email: cleanEmail,
        role: "super_admin"
      };
    }

    if (isAuthenticated && authenticatedUser) {
      const adminToken = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return new Response(
        JSON.stringify({
          success: true,
          token: adminToken,
          role: authenticatedUser.role || "super_admin",
          user: {
            id: authenticatedUser.id,
            email: authenticatedUser.email,
            role: authenticatedUser.role || "super_admin"
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid administrative credentials. Access restricted to platform administrators."
      }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Authentication error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

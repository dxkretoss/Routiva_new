// Supabase Edge Function: get-notifications
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: notifications, error } = await supabaseClient
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback empty list if table doesn't exist yet
      return new Response(JSON.stringify({ success: true, notifications: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, notifications: notifications || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: true, notifications: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

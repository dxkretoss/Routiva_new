// Supabase Edge Function: get-connections
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let query = supabaseAdmin.from("connections").select("*").order("created_at", { ascending: false });
    if (userId) {
      query = query.or(`from_user.eq.${userId},to_user.eq.${userId}`);
    }

    const { data: connections, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ success: true, connections: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, connections: connections || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: true, connections: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

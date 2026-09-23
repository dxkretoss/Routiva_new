// Supabase Edge Function: send-connection-request
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fromUserId, toUserId, fromCommuteId, toCommuteId, pickupPoint, dropPoint, message } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: connection, error } = await supabaseAdmin
      .from("connections")
      .insert({
        from_user: fromUserId,
        to_user: toUserId,
        from_commute_id: fromCommuteId,
        to_commute_id: toCommuteId,
        pickup_point: pickupPoint,
        drop_point: dropPoint,
        message: message || "Hi! Let's share a daily commute along our shared route.",
        status: "pending"
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, connection }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to send request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

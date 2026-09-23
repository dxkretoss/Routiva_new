// Supabase Edge Function: create-commute
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, commuteData } = await req.json();

    if (!userId || !commuteData) {
      return new Response(
        JSON.stringify({ error: "userId and commuteData are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { route_points, preferred_route_points, ...mainCommute } = commuteData;

    const { data: commute, error: commuteErr } = await supabaseAdmin
      .from("commutes")
      .insert({
        user_id: userId,
        ...mainCommute,
        status: "active"
      })
      .select()
      .single();

    if (commuteErr) throw commuteErr;

    // Insert intermediate route points
    if (route_points && route_points.length > 0) {
      const formattedPoints = route_points.map((pt: any, idx: number) => ({
        commute_id: commute.id,
        name: pt.name,
        sequence_order: idx + 1,
        latitude: pt.latitude || pt.lat || 0,
        longitude: pt.longitude || pt.lng || 0
      }));
      await supabaseAdmin.from("route_points").insert(formattedPoints);
    }

    return new Response(
      JSON.stringify({ success: true, commute }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to create commute" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

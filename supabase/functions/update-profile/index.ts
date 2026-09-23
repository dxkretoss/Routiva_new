// Supabase Edge Function: update-profile
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, profileData, role, vehicleData } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Update Profile
    const { data: updatedProfile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        ...profileData,
        onboarding_complete: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileErr) throw profileErr;

    // Update Vehicle if provided
    let updatedVehicle = null;
    if (vehicleData) {
      const { data: veh, error: vehErr } = await supabaseAdmin
        .from("vehicles")
        .upsert({
          user_id: userId,
          ...vehicleData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (!vehErr) updatedVehicle = veh;
    }

    return new Response(
      JSON.stringify({ success: true, profile: updatedProfile, vehicle: updatedVehicle }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to update profile" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

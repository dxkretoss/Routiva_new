// Supabase Edge Function: get-admin-data
// Supplies real-time aggregated stats, users, commutes, connections, and system metrics for Admin Panel
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const [usersRes, profilesRes, commutesRes, connectionsRes, vehiclesRes] = await Promise.all([
      supabaseAdmin.from("app_users").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("profiles").select("*"),
      supabaseAdmin.from("commutes").select("*, route_points(*)").order("created_at", { ascending: false }),
      supabaseAdmin.from("connections").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("vehicles").select("*")
    ]);

    const users = usersRes.data || [];
    const profiles = profilesRes.data || [];
    const commutes = commutesRes.data || [];
    const connections = connectionsRes.data || [];
    const vehicles = vehiclesRes.data || [];

    // Combine user records
    const commuters = users.map(u => {
      const p = profiles.find(pr => pr.id === u.id);
      const v = vehicles.find(veh => veh.user_id === u.id);
      const userCommutes = commutes.filter(c => c.user_id === u.id);
      return {
        id: u.id,
        email: u.email,
        phone: u.phone,
        full_name: p?.full_name || 'Commuter',
        city: p?.city || 'Ahmedabad',
        area: p?.area || 'Nikol',
        status: u.status || 'active',
        is_email_verified: u.is_email_verified,
        onboarding_complete: p?.onboarding_complete,
        vehicle: v || null,
        commute_count: userCommutes.length,
        created_at: u.created_at
      };
    });

    const stats = {
      totalUsers: users.length,
      activeCommutes: commutes.filter(c => c.status === 'active').length,
      totalRiders: commutes.filter(c => c.commute_type === 'rider').length,
      totalSeekers: commutes.filter(c => c.commute_type === 'seeker').length,
      totalConnections: connections.length,
      acceptedConnections: connections.filter(c => c.status === 'accepted').length,
      totalVehicles: vehicles.length
    };

    return new Response(
      JSON.stringify({
        success: true,
        stats,
        commuters,
        commutes,
        connections
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to load admin data" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

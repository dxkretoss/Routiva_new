// Supabase Edge Function: find-matches
// Executes multi-factor Route Overlap & Sequential Point Matching Algorithm

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(" ");
  const time = parts[0];
  const modifier = parts[1] || "AM";
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return (hours || 0) * 60 + (minutes || 0);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { commuteId, userId } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Fetch user's commute
    let myCommute = null;
    if (commuteId) {
      const { data, error: commuteErr } = await supabaseAdmin
        .from("commutes")
        .select("*, route_points(*), preferred_route_points(*)")
        .eq("id", commuteId)
        .single();
      if (!commuteErr && data) myCommute = data;
    }

    // Fallback by userId if commuteId not provided or not single
    if (!myCommute && userId) {
      const { data, error: userCommuteErr } = await supabaseAdmin
        .from("commutes")
        .select("*, route_points(*), preferred_route_points(*)")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (!userCommuteErr && data) myCommute = data;
    }

    if (!myCommute) {
      return new Response(
        JSON.stringify({ success: true, matches: [], message: "No active commute found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetType = myCommute.commute_type === "rider" ? "seeker" : "rider";

    // 2. Fetch candidate commutes without failing on missing foreign key join
    const { data: rawCandidates, error: candidateErr } = await supabaseAdmin
      .from("commutes")
      .select("*, route_points(*), preferred_route_points(*)")
      .eq("commute_type", targetType)
      .eq("status", "active")
      .neq("user_id", myCommute.user_id);

    if (candidateErr) throw candidateErr;

    const candidates = rawCandidates || [];
    const candUserIds = Array.from(new Set(candidates.map((c: any) => c.user_id).filter(Boolean)));

    // Fetch matching profiles & vehicles in batch
    let profilesMap: Record<string, any> = {};
    let vehiclesMap: Record<string, any> = {};

    if (candUserIds.length > 0) {
      const [profilesRes, vehiclesRes] = await Promise.all([
        supabaseAdmin.from("profiles").select("*").in("id", candUserIds),
        supabaseAdmin.from("vehicles").select("*").in("user_id", candUserIds)
      ]);

      (profilesRes.data || []).forEach((p: any) => {
        profilesMap[p.id] = p;
      });

      (vehiclesRes.data || []).forEach((v: any) => {
        vehiclesMap[v.user_id] = v;
      });
    }

    const matches = [];

    for (const candidate of candidates) {
      const candProfile = profilesMap[candidate.user_id] || {
        full_name: "Verified Commuter",
        profession: "Corporate Professional",
        city: "Ahmedabad",
        rating: 5.0
      };
      const candVehicle = vehiclesMap[candidate.user_id] || null;

      // Must have seats if candidate is Rider
      if (candidate.commute_type === "rider" && (candidate.available_seats || 0) < 1) {
        continue;
      }
      if (myCommute.commute_type === "rider" && (myCommute.available_seats || 0) < 1) {
        continue;
      }

      // Check day overlap
      const sharedDays = (myCommute.days || []).filter((d: string) => (candidate.days || []).includes(d));
      if (sharedDays.length === 0) continue;

      // Time compatibility
      const myMinutes = parseTimeToMinutes(myCommute.departure_time);
      const candMinutes = parseTimeToMinutes(candidate.departure_time);
      const timeDiff = Math.abs(myMinutes - candMinutes);
      const maxFlex = Math.max(myCommute.flexibility_minutes || 15, candidate.flexibility_minutes || 15);
      if (timeDiff > maxFlex) continue;

      // Identify Rider and Seeker
      const riderCommute = myCommute.commute_type === "rider" ? myCommute : candidate;
      const seekerCommute = myCommute.commute_type === "seeker" ? myCommute : candidate;

      // Construct rider full sequence
      const riderPoints = [
        { name: riderCommute.start_location, lat: Number(riderCommute.start_lat), lng: Number(riderCommute.start_lng), seq: 0 },
        ...(riderCommute.route_points || [])
          .sort((a: any, b: any) => (a.sequence_order || 0) - (b.sequence_order || 0))
          .map((p: any, idx: number) => ({ name: p.name, lat: Number(p.latitude || p.lat), lng: Number(p.longitude || p.lng), seq: idx + 1 })),
        { name: riderCommute.destination_location, lat: Number(riderCommute.destination_lat), lng: Number(riderCommute.destination_lng), seq: 999 }
      ];

      // Find best pickup point on rider route
      let bestPickupPoint = null;
      let minPickupDist = Infinity;
      for (const rp of riderPoints) {
        const d = calculateHaversineKm(rp.lat, rp.lng, Number(seekerCommute.start_lat), Number(seekerCommute.start_lng));
        if (d < minPickupDist) {
          minPickupDist = d;
          bestPickupPoint = rp;
        }
      }

      // Check preferred pickup points
      const preferredPickups = (riderCommute.preferred_route_points || []).filter((p: any) => p.point_type === "pickup");
      for (const pref of preferredPickups) {
        const d = calculateHaversineKm(Number(pref.latitude || pref.lat), Number(pref.longitude || pref.lng), Number(seekerCommute.start_lat), Number(seekerCommute.start_lng));
        if (d < minPickupDist) {
          minPickupDist = d;
          bestPickupPoint = { name: pref.name, lat: Number(pref.latitude || pref.lat), lng: Number(pref.longitude || pref.lng), seq: 50 };
        }
      }

      // Find best drop point on rider route
      let bestDropPoint = null;
      let minDropDist = Infinity;
      for (const rp of riderPoints) {
        const d = calculateHaversineKm(rp.lat, rp.lng, Number(seekerCommute.destination_lat), Number(seekerCommute.destination_lng));
        if (d < minDropDist) {
          minDropDist = d;
          bestDropPoint = rp;
        }
      }

      // Check preferred drop points
      const preferredDrops = (riderCommute.preferred_route_points || []).filter((p: any) => p.point_type === "drop");
      for (const pref of preferredDrops) {
        const d = calculateHaversineKm(Number(pref.latitude || pref.lat), Number(pref.longitude || pref.lng), Number(seekerCommute.destination_lat), Number(seekerCommute.destination_lng));
        if (d < minDropDist) {
          minDropDist = d;
          bestDropPoint = { name: pref.name, lat: Number(pref.latitude || pref.lat), lng: Number(pref.longitude || pref.lng), seq: 60 };
        }
      }

      const maxAllowedPickup = Math.max(Number(myCommute.max_pickup_km) || 3.0, Number(candidate.max_pickup_km) || 3.0);
      const maxAllowedDrop = Math.max(Number(myCommute.max_drop_km) || 3.0, Number(candidate.max_drop_km) || 3.0);

      if (minPickupDist > maxAllowedPickup || minDropDist > maxAllowedDrop) {
        continue;
      }

      // Check sequence validity (Drop must come after Pickup)
      if (bestPickupPoint && bestDropPoint && bestPickupPoint.seq >= bestDropPoint.seq && bestPickupPoint.seq !== 50 && bestDropPoint.seq !== 60) {
        continue;
      }

      // Compute multi-factor match score (0-100%)
      const distScore = Math.max(0, 100 - (minPickupDist + minDropDist) * 12);
      const timeScore = Math.max(0, 100 - (timeDiff / maxFlex) * 30);
      const daysScore = (sharedDays.length / (myCommute.days || []).length) * 100;
      const overallScore = Math.min(99, Math.round(distScore * 0.45 + timeScore * 0.35 + daysScore * 0.20));

      matches.push({
        candidate_commute_id: candidate.id,
        user_id: candidate.user_id,
        commute_type: candidate.commute_type,
        start_location: candidate.start_location,
        destination_location: candidate.destination_location,
        departure_time: candidate.departure_time,
        days: candidate.days,
        contribution_amount: candidate.contribution_amount,
        available_seats: candidate.available_seats,
        match_score: overallScore,
        pickup_point: bestPickupPoint?.name || candidate.start_location,
        drop_point: bestDropPoint?.name || candidate.destination_location,
        pickup_distance_km: Math.round(minPickupDist * 10) / 10,
        drop_distance_km: Math.round(minDropDist * 10) / 10,
        time_difference_minutes: timeDiff,
        shared_days: sharedDays,
        profile: candProfile,
        vehicle: candVehicle
      });
    }

    matches.sort((a, b) => b.match_score - a.match_score);

    return new Response(
      JSON.stringify({ success: true, matches }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

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
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
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
    const { data: myCommute, error: commuteErr } = await supabaseAdmin
      .from("commutes")
      .select("*, route_points(*), preferred_route_points(*)")
      .eq("id", commuteId)
      .single();

    if (commuteErr || !myCommute) {
      return new Response(
        JSON.stringify({ error: "Commute not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetType = myCommute.commute_type === "rider" ? "seeker" : "rider";

    // 2. Fetch candidates of opposite commute type
    const { data: candidates, error: candidateErr } = await supabaseAdmin
      .from("commutes")
      .select(`
        *,
        profiles!inner(*),
        vehicles(*),
        route_points(*),
        preferred_route_points(*)
      `)
      .eq("commute_type", targetType)
      .eq("status", "active")
      .neq("user_id", myCommute.user_id);

    if (candidateErr) throw candidateErr;

    const matches = [];

    for (const candidate of candidates || []) {
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
          .sort((a: any, b: any) => a.sequence_order - b.sequence_order)
          .map((p: any, idx: number) => ({ name: p.name, lat: Number(p.latitude), lng: Number(p.longitude), seq: idx + 1 })),
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
        const d = calculateHaversineKm(Number(pref.latitude), Number(pref.longitude), Number(seekerCommute.start_lat), Number(seekerCommute.start_lng));
        if (d < minPickupDist) {
          minPickupDist = d;
          bestPickupPoint = { name: pref.name, lat: Number(pref.latitude), lng: Number(pref.longitude), seq: 0 };
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
        const d = calculateHaversineKm(Number(pref.latitude), Number(pref.longitude), Number(seekerCommute.destination_lat), Number(seekerCommute.destination_lng));
        if (d < minDropDist) {
          minDropDist = d;
          bestDropPoint = { name: pref.name, lat: Number(pref.latitude), lng: Number(pref.longitude), seq: 999 };
        }
      }

      const allowedPickupKm = Number(riderCommute.max_pickup_km || 2.5);
      const allowedDropKm = Number(riderCommute.max_drop_km || 2.5);

      if (minPickupDist > allowedPickupKm || minDropDist > allowedDropKm) {
        continue; // Outside proximity tolerance
      }

      // SEQUENCE VALIDATION: Pickup point must occur BEFORE drop point
      if (bestPickupPoint && bestDropPoint && bestPickupPoint.seq >= bestDropPoint.seq) {
        continue; // Reverse direction invalid
      }

      // Calculate score
      let score = 100;
      score -= minPickupDist * 5;
      score -= minDropDist * 5;
      score -= (timeDiff / maxFlex) * 15;
      score = Math.max(50, Math.min(99, Math.round(score)));

      matches.push({
        candidateCommute: candidate,
        profile: candidate.profiles,
        vehicle: candidate.vehicles?.[0] || null,
        matchScore: score,
        pickupPoint: bestPickupPoint?.name || seekerCommute.start_location,
        dropPoint: bestDropPoint?.name || seekerCommute.destination_location,
        pickupDistanceKm: Number(minPickupDist.toFixed(1)),
        dropDistanceKm: Number(minDropDist.toFixed(1)),
        timeDifferenceMinutes: timeDiff,
        sharedDays
      });
    }

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return new Response(
      JSON.stringify({ success: true, matches }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to find matches" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Routiva Deterministic Route Sequence Matching Engine

import { calculateHaversineKm, parseTimeToMinutes, getLocationCoords } from './geoUtils';

/**
 * Validates whether a Seeker journey is compatible with a Rider's full sequenced route.
 * Rule: Rider may travel Nikol -> Naroda -> Memco -> Shahibaug -> Vijay Cross Road -> Thaltej
 * Seeker needs Nikol -> Vijay Cross Road.
 * This is a VALID match because Vijay Cross Road is sequentially after Nikol on Rider's route.
 */
export function evaluateRouteMatch(riderCommute, seekerCommute) {
  // 1. Check Active Status
  if (riderCommute.status !== 'active' || seekerCommute.status !== 'active') {
    return { isMatch: false, reason: 'Commute is paused or inactive' };
  }

  // 2. Check Available Seats
  if ((riderCommute.available_seats || 0) < 1) {
    return { isMatch: false, reason: 'Rider has no available seats remaining' };
  }

  // 3. Check Shared Days
  const riderDays = riderCommute.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const seekerDays = seekerCommute.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const sharedDays = riderDays.filter(d => seekerDays.includes(d));
  if (sharedDays.length === 0) {
    return { isMatch: false, reason: 'No overlapping commute days' };
  }

  // 4. Check Departure Time Compatibility
  const riderTimeMin = parseTimeToMinutes(riderCommute.departure_time || '8:30 AM');
  const seekerTimeMin = parseTimeToMinutes(seekerCommute.departure_time || '8:35 AM');
  const timeDelta = Math.abs(riderTimeMin - seekerTimeMin);
  const maxAllowedFlex = Math.max(riderCommute.flexibility_minutes || 15, seekerCommute.flexibility_minutes || 15);
  
  if (timeDelta > maxAllowedFlex) {
    return { isMatch: false, reason: `Departure time difference (${timeDelta}m) exceeds flexibility (${maxAllowedFlex}m)` };
  }

  // 5. Build Complete Rider Ordered Sequence
  const riderStartCoord = riderCommute.start_lat ? { lat: Number(riderCommute.start_lat), lng: Number(riderCommute.start_lng) } : getLocationCoords(riderCommute.start_location);
  const riderDestCoord = riderCommute.destination_lat ? { lat: Number(riderCommute.destination_lat), lng: Number(riderCommute.destination_lng) } : getLocationCoords(riderCommute.destination_location);

  const fullRiderSequence = [
    { name: riderCommute.start_location, ...riderStartCoord, seq: 0, isStart: true },
    ...(riderCommute.route_points || []).map((p, idx) => ({
      name: p.name,
      lat: Number(p.latitude || p.lat || getLocationCoords(p.name).lat),
      lng: Number(p.longitude || p.lng || getLocationCoords(p.name).lng),
      seq: idx + 1
    })),
    { name: riderCommute.destination_location, ...riderDestCoord, seq: (riderCommute.route_points?.length || 0) + 1, isDest: true }
  ];

  // Preferred Points
  const preferredPickups = (riderCommute.preferred_route_points || []).filter(p => p.point_type === 'pickup');
  const preferredDrops = (riderCommute.preferred_route_points || []).filter(p => p.point_type === 'drop');

  const seekerStartCoord = seekerCommute.start_lat ? { lat: Number(seekerCommute.start_lat), lng: Number(seekerCommute.start_lng) } : getLocationCoords(seekerCommute.start_location);
  const seekerDestCoord = seekerCommute.destination_lat ? { lat: Number(seekerCommute.destination_lat), lng: Number(seekerCommute.destination_lng) } : getLocationCoords(seekerCommute.destination_location);

  // 6. Find Nearest Pickup along Rider Sequence or Preferred Points
  let bestPickup = null;
  let minPickupDist = Infinity;

  for (const pt of fullRiderSequence) {
    const dist = calculateHaversineKm(pt.lat, pt.lng, seekerStartCoord.lat, seekerStartCoord.lng);
    if (dist < minPickupDist) {
      minPickupDist = dist;
      bestPickup = { ...pt, distanceKm: dist };
    }
  }

  for (const pref of preferredPickups) {
    const prefCoord = pref.latitude ? { lat: Number(pref.latitude), lng: Number(pref.longitude) } : getLocationCoords(pref.name);
    const dist = calculateHaversineKm(prefCoord.lat, prefCoord.lng, seekerStartCoord.lat, seekerStartCoord.lng);
    if (dist < minPickupDist) {
      minPickupDist = dist;
      bestPickup = { name: pref.name, ...prefCoord, seq: 0.5, distanceKm: dist, isPreferred: true };
    }
  }

  // 7. Find Nearest Drop along Rider Sequence or Preferred Points
  let bestDrop = null;
  let minDropDist = Infinity;

  for (const pt of fullRiderSequence) {
    const dist = calculateHaversineKm(pt.lat, pt.lng, seekerDestCoord.lat, seekerDestCoord.lng);
    if (dist < minDropDist) {
      minDropDist = dist;
      bestDrop = { ...pt, distanceKm: dist };
    }
  }

  for (const pref of preferredDrops) {
    const prefCoord = pref.latitude ? { lat: Number(pref.latitude), lng: Number(pref.longitude) } : getLocationCoords(pref.name);
    const dist = calculateHaversineKm(prefCoord.lat, prefCoord.lng, seekerDestCoord.lat, seekerDestCoord.lng);
    if (dist < minDropDist) {
      minDropDist = dist;
      bestDrop = { name: pref.name, ...prefCoord, seq: 998, distanceKm: dist, isPreferred: true };
    }
  }

  // Check Radius limits
  const maxPickupRadius = Number(riderCommute.max_pickup_km || 3.0);
  const maxDropRadius = Number(riderCommute.max_drop_km || 3.0);

  if (minPickupDist > maxPickupRadius) {
    return { isMatch: false, reason: `Pickup is ${minPickupDist.toFixed(1)}km away (max ${maxPickupRadius}km)` };
  }
  if (minDropDist > maxDropRadius) {
    return { isMatch: false, reason: `Drop is ${minDropDist.toFixed(1)}km away (max ${maxDropRadius}km)` };
  }

  // 8. DIRECTION / SEQUENCE VALIDATION (CRUCIAL):
  // Drop sequence MUST be greater than Pickup sequence
  if (bestPickup && bestDrop && bestPickup.seq >= bestDrop.seq) {
    return { isMatch: false, reason: 'Opposite travel direction: drop point occurs before pickup point on route' };
  }

  // 9. Calculate Match Score (0 to 100)
  let score = 98;
  score -= Math.min(20, minPickupDist * 4);
  score -= Math.min(20, minDropDist * 4);
  score -= Math.min(15, (timeDelta / (maxAllowedFlex || 1)) * 12);
  if (sharedDays.length < 5) score -= (5 - sharedDays.length) * 3;

  const finalScore = Math.max(60, Math.min(99, Math.round(score)));

  return {
    isMatch: true,
    matchScore: finalScore,
    scoreBreakdown: {
      routeCompatibility: minPickupDist < 1.0 && minDropDist < 1.0 ? 'Excellent' : 'Good',
      pickupDistanceKm: Number(minPickupDist.toFixed(1)),
      dropDistanceKm: Number(minDropDist.toFixed(1)),
      pickupPointName: bestPickup?.name || seekerCommute.start_location,
      dropPointName: bestDrop?.name || seekerCommute.destination_location,
      timeDeltaMinutes: timeDelta,
      sharedDaysCount: sharedDays.length,
      sharedDaysList: sharedDays,
      availableSeats: riderCommute.available_seats || 1
    },
    explanation: `Matched because your journey from ${seekerCommute.start_location} to ${seekerCommute.destination_location} seamlessly overlaps the Rider's full route.`
  };
}

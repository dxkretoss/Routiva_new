// Geolocation and Route Utilities for Ahmedabad & Gandhinagar Region

export const AHMEDABAD_LOCATIONS = {
  "Nikol": { lat: 23.0450, lng: 72.6710, label: "Nikol, East Ahmedabad" },
  "Naroda": { lat: 23.0670, lng: 72.6560, label: "Naroda GIDC / Cross Road" },
  "Memco": { lat: 23.0550, lng: 72.6320, label: "Memco Cross Road" },
  "Shahibaug": { lat: 23.0580, lng: 72.5930, label: "Shahibaug Underpass" },
  "Income Tax": { lat: 23.0395, lng: 72.5714, label: "Income Tax Circle, Ashram Rd" },
  "Vijay Cross Road": { lat: 23.0370, lng: 72.5480, label: "Vijay Cross Road, Navrangpura" },
  "Gurukul": { lat: 23.0490, lng: 72.5290, label: "Gurukul Road, Memnagar" },
  "Thaltej": { lat: 23.0520, lng: 72.5110, label: "Thaltej Cross Road / Metro" },
  "Bapunagar": { lat: 23.0380, lng: 72.6280, label: "Bapunagar, Ahmedabad" },
  "Maninagar": { lat: 22.9980, lng: 72.6020, label: "Maninagar Railway Station" },
  "Prahlad Nagar": { lat: 23.0110, lng: 72.5080, label: "Prahlad Nagar Garden" },
  "SG Highway": { lat: 23.0680, lng: 72.5280, label: "SG Highway (Gota / Science City)" },
  "Science City": { lat: 23.0760, lng: 72.5020, label: "Science City Road" },
  "Chandkheda": { lat: 23.1110, lng: 72.5850, label: "Chandkheda / Visat Circle" },
  "Infocity Gandhinagar": { lat: 23.1930, lng: 72.6270, label: "Infocity, Gandhinagar" },
  "GIFT City": { lat: 23.1610, lng: 72.6840, label: "GIFT City Club & Towers" },
  "Satellite": { lat: 23.0290, lng: 72.5240, label: "Satellite, Shivranjani" },
  "Vastrapur": { lat: 23.0350, lng: 72.5290, label: "Vastrapur Lake" },
  "Iskcon Circle": { lat: 23.0280, lng: 72.5060, label: "Iskcon Cross Road" },
  "Paldi": { lat: 23.0130, lng: 72.5620, label: "Paldi Cross Road" }
};

export function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
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
  return Number((R * c).toFixed(2));
}

export function getLocationCoords(name) {
  if (!name) return { lat: 23.0450, lng: 72.6710 };
  const cleanName = Object.keys(AHMEDABAD_LOCATIONS).find(k => 
    name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())
  );
  if (cleanName) {
    return AHMEDABAD_LOCATIONS[cleanName];
  }
  // Default centered in Ahmedabad
  return { lat: 23.0300 + (Math.random() - 0.5) * 0.05, lng: 72.5800 + (Math.random() - 0.5) * 0.05 };
}

export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.trim().split(" ");
  const parts = time.split(":");
  let hours = parseInt(parts[0], 10);
  let minutes = parseInt(parts[1] || "0", 10);
  if (modifier) {
    if (modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
  }
  return hours * 60 + minutes;
}

export function formatMinutesToTime(minutes) {
  let hrs = Math.floor(minutes / 60);
  let mins = minutes % 60;
  const modifier = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12;
  hrs = hrs ? hrs : 12;
  return `${hrs}:${mins < 10 ? "0" + mins : mins} ${modifier}`;
}

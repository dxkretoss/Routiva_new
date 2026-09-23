// Geolocation and Route Utilities for Ahmedabad & Gandhinagar Region

export const AHMEDABAD_LOCATIONS = {
  // Ahmedabad West & Central
  "Thaltej": { lat: 23.0520, lng: 72.5110, label: "Thaltej Cross Road / Metro" },
  "Bodakdev": { lat: 23.0410, lng: 72.5180, label: "Bodakdev / Judges Bungalow" },
  "Vastrapur": { lat: 23.0350, lng: 72.5290, label: "Vastrapur Lake" },
  "Satellite": { lat: 23.0290, lng: 72.5240, label: "Satellite / Shivranjani" },
  "Prahlad Nagar": { lat: 23.0110, lng: 72.5080, label: "Prahlad Nagar Garden" },
  "SG Highway": { lat: 23.0680, lng: 72.5280, label: "SG Highway (Gota / Science City)" },
  "Science City": { lat: 23.0760, lng: 72.5020, label: "Science City Road" },
  "Navrangpura": { lat: 23.0360, lng: 72.5590, label: "Navrangpura / Commerce Six Rd" },
  "CG Road": { lat: 23.0310, lng: 72.5610, label: "CG Road / Panchvati" },
  "Ashram Road": { lat: 23.0340, lng: 72.5710, label: "Ashram Road / Usmanpura" },
  "Income Tax": { lat: 23.0395, lng: 72.5714, label: "Income Tax Circle, Ashram Rd" },
  "Paldi": { lat: 23.0130, lng: 72.5620, label: "Paldi Cross Road / Mahalaxmi" },
  "Usmanpura": { lat: 23.0480, lng: 72.5680, label: "Usmanpura / Riverfront" },
  "Memnagar": { lat: 23.0530, lng: 72.5360, label: "Memnagar / Subhash Chowk" },
  "Gurukul": { lat: 23.0490, lng: 72.5290, label: "Gurukul Road, Memnagar" },
  "Drive In Road": { lat: 23.0480, lng: 72.5320, label: "Drive In Road / Himalaya Mall" },
  "Naranpura": { lat: 23.0570, lng: 72.5530, label: "Naranpura / AEC Cross Rd" },
  "Ambawadi": { lat: 23.0210, lng: 72.5480, label: "Ambawadi / Polytech" },
  "Ellis Bridge": { lat: 23.0240, lng: 72.5730, label: "Ellis Bridge / VS Hospital" },
  "Jodhpur": { lat: 23.0190, lng: 72.5220, label: "Jodhpur Cross Road" },
  "Vejalpur": { lat: 23.0070, lng: 72.5290, label: "Vejalpur / Bakeri City" },
  "Makarba": { lat: 22.9940, lng: 72.5070, label: "Makarba / Corporate Rd" },
  "South Bopal": { lat: 23.0230, lng: 72.4680, label: "South Bopal / Gala Gymkhana" },
  "Bopal": { lat: 23.0350, lng: 72.4640, label: "Bopal Cross Road" },
  "Shela": { lat: 23.0080, lng: 72.4610, label: "Shela / Club O7" },
  "Shilaj": { lat: 23.0610, lng: 72.4760, label: "Shilaj / Rancharda Rd" },
  "Sindhu Bhavan Road": { lat: 23.0460, lng: 72.5040, label: "Sindhu Bhavan Road" },
  "Gota": { lat: 23.0980, lng: 72.5350, label: "Gota Bridge / SG Highway" },
  "Chandlodiya": { lat: 23.0810, lng: 72.5470, label: "Chandlodiya / Station Rd" },
  "Ranip": { lat: 23.0780, lng: 72.5840, label: "Ranip / RTO Circle" },
  "New Ranip": { lat: 23.0920, lng: 72.5780, label: "New Ranip / GST Crossing" },

  // Ahmedabad East & North
  "Nikol": { lat: 23.0450, lng: 72.6710, label: "Nikol, East Ahmedabad" },
  "Naroda": { lat: 23.0670, lng: 72.6560, label: "Naroda GIDC / Cross Road" },
  "Bapunagar": { lat: 23.0380, lng: 72.6280, label: "Bapunagar / India Colony" },
  "Viratnagar": { lat: 23.0330, lng: 72.6450, label: "Viratnagar / Canal Cross Road" },
  "Odhav": { lat: 23.0220, lng: 72.6590, label: "Odhav Ring Road" },
  "Vastral": { lat: 23.0060, lng: 72.6640, label: "Vastral Metro Station" },
  "Ramol": { lat: 22.9860, lng: 72.6550, label: "Ramol / Express Highway" },
  "Amraiwadi": { lat: 23.0090, lng: 72.6280, label: "Amraiwadi / CTM Rd" },
  "Maninagar": { lat: 22.9980, lng: 72.6020, label: "Maninagar Railway Station" },
  "Isanpur": { lat: 22.9810, lng: 72.5970, label: "Isanpur / Govindwadi" },
  "Ghodasar": { lat: 22.9870, lng: 72.6100, label: "Ghodasar Canal Road" },
  "CTM": { lat: 22.9960, lng: 72.6350, label: "CTM Cross Road" },
  "Jasodanagar": { lat: 22.9840, lng: 72.6310, label: "Jasodanagar Cross Road" },
  "Shahibaug": { lat: 23.0580, lng: 72.5930, label: "Shahibaug Underpass" },
  "Memco": { lat: 23.0550, lng: 72.6320, label: "Memco Cross Road" },
  "Asarwa": { lat: 23.0480, lng: 72.6060, label: "Civil Hospital / Asarwa" },
  "Narol": { lat: 22.9690, lng: 72.5890, label: "Narol Circle" },
  "Vatva GIDC": { lat: 22.9620, lng: 72.6240, label: "Vatva GIDC / Phase 1-4" },
  "Krishnanagar": { lat: 23.0610, lng: 72.6460, label: "Krishnanagar / Saijpur" },
  "Naroda GIDC": { lat: 23.0760, lng: 72.6670, label: "Naroda GIDC Phase 2" },
  "Hansol / Airport Road": { lat: 23.0720, lng: 72.6210, label: "Hansol / Airport Road" },
  "Motera": { lat: 23.1040, lng: 72.6010, label: "Motera Stadium / Metro" },
  "Chandkheda": { lat: 23.1110, lng: 72.5850, label: "Chandkheda / Visat Circle" },
  "Sabarmati": { lat: 23.0840, lng: 72.5890, label: "Sabarmati / Torrent Power" },
  "Tragad": { lat: 23.1230, lng: 72.5580, label: "Tragad / Godrej Garden City" },
  "Jagatpur": { lat: 23.1080, lng: 72.5480, label: "Jagatpur / Godrej" },

  // Gandhinagar & GIFT City Corridor
  "GIFT City": { lat: 23.1610, lng: 72.6840, label: "GIFT City Club & Towers" },
  "Infocity Gandhinagar": { lat: 23.1930, lng: 72.6270, label: "Infocity, Gandhinagar" },
  "Kudasan": { lat: 23.1810, lng: 72.6320, label: "Kudasan / PDPU Cross Rd" },
  "Raysan": { lat: 23.1670, lng: 72.6420, label: "Raysan / GNLU" },
  "Randesan": { lat: 23.1760, lng: 72.6470, label: "Randesan / Riverfront" },
  "Sargasan": { lat: 23.1880, lng: 72.6080, label: "Sargasan Cross Road" },
  "PDPU / PDEU Road": { lat: 23.1590, lng: 72.6560, label: "PDPU / PDEU Campus" },
  "Bhaijipura": { lat: 23.1720, lng: 72.6390, label: "Bhaijipura Cross Road" },
  "Koba Circle": { lat: 23.1420, lng: 72.6380, label: "Koba Circle / Airport Rd" },
  "Sector 1 to 7": { lat: 23.2180, lng: 72.6460, label: "Gandhinagar Sector 1-7 (Sachivalaya)" },
  "Sector 8 to 14": { lat: 23.2260, lng: 72.6580, label: "Gandhinagar Sector 8-14" },
  "Sector 15 to 21": { lat: 23.2350, lng: 72.6470, label: "Gandhinagar Sector 15-21 (Gh-5)" },
  "Sector 22 to 30": { lat: 23.2450, lng: 72.6380, label: "Gandhinagar Sector 22-30 (Gh-6)" },
  "Adalaj": { lat: 23.1660, lng: 72.5810, label: "Adalaj Stepwell / Trimandir" },
  "Uvarsad": { lat: 23.1990, lng: 72.5850, label: "Uvarsad / Karnavati University" },
  "Vavol": { lat: 23.2350, lng: 72.6150, label: "Vavol, Gandhinagar" },
  "Chiloda": { lat: 23.2180, lng: 72.7160, label: "Chiloda Circle / NH-48" },
  "Iskcon Circle": { lat: 23.0280, lng: 72.5060, label: "Iskcon Cross Road" }
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

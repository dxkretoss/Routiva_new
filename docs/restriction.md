# 🚨 ROUTIVA PROJECT RESTRICTIONS & CODING RULES

Before implementing any prompt, task, or feature in Routiva, you **MUST** read and adhere strictly to all restrictions listed below.

---

## 1. ⚡ ALWAYS USE EDGE FUNCTIONS FOR ALL BACKEND CALLS
- **NO Direct Database Queries**: The frontend must **NEVER** run direct table queries (e.g. `supabase.from('...')`).
- **All Actions via Edge Functions**: Every query, mutation, connection request, authentication, matching calculation, and profile update must route through the Supabase Edge Function layer via `invokeEdgeFunction(functionName, payload)` in `src/lib/edgeFunctions.js`.
- All SQL schemas and Edge Function definitions must follow the architecture documented in [`EDGE_FUNCTIONS_AND_SQL.md`](file:///d:/Routiva/Routiva/EDGE_FUNCTIONS_AND_SQL.md).

---

## 2. 🚫 NEVER USE EMOJIS OR WHATSAPP-STYLE ICONS
- **Zero Emojis**: Emojis (e.g., 🚗, 🎒, 🚕, 👥, ✨, 🚀, 🎉, 🤝, 🔎, 🇮🇳) are **strictly forbidden** in UI components, notifications, modals, dropdowns, and buttons.
- **Always Use Lucide React SVG Icons**: Use standard `<Car />`, `<User />`, `<Repeat />`, `<Sparkles />`, `<ShieldCheck />`, `<KeyRound />`, `<MapPin />`, `<Clock />`, `<CheckCircle2 />`, `<AlertCircle />`, etc. from `lucide-react`.
- **Images When Icons Unavailable**: If an icon is not in `lucide-react`, use official SVG / PNG images from `/public/assets/images/`.
- **Official Logos Only**:
  - Desktop Logo: `/assets/images/routiva-logo-desktop.png`
  - Mobile Logo: `/assets/images/routiva-logo-mobile.png`
  - Favicon: `/assets/images/favicon.png`

---

## 3. 🛡️ NEVER CHANGE EXISTING FUNCTIONALITY WITHOUT CONFIRMATION
- Never delete, refactor, or alter existing working features, routes, or algorithms without first explaining the proposed change and obtaining explicit user confirmation.
- Keep all working flows (custom Auth with Email OTP, 4-step commute creation, Leaflet interactive map, route sequence matching engine, connection requests, 1-click demo accounts) intact.

---

## 4. 🎨 EXACT OKLCH DESIGN SYSTEM & THEME
- Adhere strictly to the configured OKLCH design tokens in `src/index.css` and `tailwind.config.js`:
  - `--background: oklch(99.5% 0.012 85)` (Warm ivory editorial canvas)
  - `--foreground: oklch(22% 0.04 55)` (Deep charcoal/espresso typography)
  - `--card: oklch(100% 0 0)` (Crisp white elevated surfaces)
  - `--primary: oklch(72% 0.19 55)` (Vibrant coral/orange brand CTA)
  - `--secondary: oklch(96% 0.05 85)` (Soft sandstone neutral)
  - `--border: oklch(92% 0.03 75)` (Subtle warm border strokes)
  - `--radius: 0.875rem` (14px rounded corners)
- Never introduce hardcoded dark backgrounds (`bg-black`, `bg-slate-950`, `bg-dark-bg`) unless explicitly requested.

---

## 5. 📜 STRICT JAVASCRIPT ONLY (.js, .jsx)
- **Zero TypeScript**: Do not create or rename files to `.ts` or `.tsx`.
- All frontend components and scripts must remain clean modern JavaScript (`.jsx` and `.js`).

---

## 6. 📍 CORE PRODUCT PRINCIPLE: DIRECTIONAL ROUTE MATCHING
- **"Same route does NOT mean same destination"**:
  - A match is valid if the Seeker's pickup and drop fall along the Rider's existing sequence (`pickup_sequence < drop_sequence`).
  - Strict forward-order sequencing is enforced; reverse commutes are never matched.

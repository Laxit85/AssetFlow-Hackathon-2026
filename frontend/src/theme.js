// Centralized design tokens — the ONLY file that defines colors/fonts.
// Everyone imports from here instead of hardcoding hex values in their pages,
// so the whole app stays visually consistent even with 5 people building in parallel.

export const COLORS = {
  ink: "#1B2430",       // sidebar background
  ink2: "#232E3D",
  paper: "#F4F5F1",     // page background
  card: "#FFFFFF",
  line: "#E4E3DB",
  accent: "#2F6F5E",    // primary accent (teal-green — "asset tag" identity)
  accentDeep: "#1F4C40",
  amber: "#C1811A",     // Reserved / warning
  red: "#C1483A",       // Lost / overdue / danger
  green: "#2F9E44",     // Available
  blue: "#2563EB",       // Allocated
  textDim: "#8B9099",
};

export const FONTS = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Status -> color mapping used by <StatusBadge /> everywhere in the app.
export const STATUS_COLORS = {
  AVAILABLE: COLORS.green,
  ALLOCATED: COLORS.blue,
  RESERVED: COLORS.amber,
  UNDER_MAINTENANCE: "#D9622B",
  LOST: COLORS.red,
  RETIRED: "#6B7280",
  DISPOSED: "#4B5563",
};

import { COLORS, FONTS } from "../theme";

// Used by every screen not yet built in the 6-hour MVP scope
// (Transfer, Maintenance, Audit, Reports, Notifications, Activity Logs).
// Swap this out for the real page once your module is ready — the route
// in App.jsx already points here, so you only ever touch your own file.
export default function Placeholder({ label }) {
  return (
    <div style={{
      background: COLORS.card, border: `1px dashed ${COLORS.line}`, borderRadius: 10,
      padding: 40, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 8, color: COLORS.textDim, minHeight: 320,
    }}>
      <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.accent }}>MODULE · {label}</span>
      <p style={{ margin: 0, fontSize: 14, color: COLORS.ink, fontWeight: 500 }}>{label} screen renders here</p>
      <p style={{ margin: 0, fontSize: 12.5, textAlign: "center", maxWidth: 360 }}>
        Not in the 6-hour MVP scope. Replace this file's contents with the real page when there's time.
      </p>
    </div>
  );
}

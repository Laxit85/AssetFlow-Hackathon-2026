import { Search, Bell } from "lucide-react";
import { COLORS, FONTS } from "../theme";

export default function Topbar({ title, parent }) {
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 16, padding: "14px 24px",
      borderBottom: `1px solid ${COLORS.line}`, background: COLORS.card,
    }}>
      <div>
        <div style={{ fontSize: 11, color: COLORS.textDim }}>
          {parent ? `${parent} / ` : ""}<span style={{ color: COLORS.accent }}>{title}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 18, fontFamily: FONTS.display, color: COLORS.ink, fontWeight: 600 }}>
          {title}
        </h1>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 8, background: COLORS.paper,
        border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "7px 12px", width: 220,
      }}>
        <Search size={14} color={COLORS.textDim} />
        <span style={{ fontSize: 13, color: COLORS.textDim }}>Search asset tag, employee…</span>
      </div>
      <div style={{ position: "relative" }}>
        <Bell size={18} color={COLORS.ink} />
        <span style={{
          position: "absolute", top: -4, right: -5, background: COLORS.red, color: "#fff",
          fontSize: 9, fontWeight: 700, borderRadius: 8, padding: "1px 4px",
        }}>3</span>
      </div>
    </header>
  );
}

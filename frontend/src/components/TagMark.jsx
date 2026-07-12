import { COLORS } from "../theme";

// Signature logo mark: a die-cut asset tag, echoing the physical asset
// tags this whole app is built to track.
export default function TagMark({ size = 34 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: "100%", height: "100%", background: COLORS.accent,
        clipPath: "polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%)",
      }} />
      <div style={{
        position: "absolute", left: size * 0.16, top: "50%",
        width: 5, height: 5, borderRadius: "50%",
        background: COLORS.ink, transform: "translateY(-50%)",
      }} />
    </div>
  );
}

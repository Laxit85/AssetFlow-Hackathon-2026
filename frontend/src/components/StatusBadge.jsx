import { STATUS_COLORS } from "../theme";

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || "#8B9099";
  return (
    <span style={{
      display: "inline-block", fontSize: 11.5, fontWeight: 600, color,
      background: color + "1A", padding: "3px 9px", borderRadius: 20,
      textTransform: "capitalize",
    }}>
      {status?.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}

import { COLORS } from "../theme";

// Generic table used by every Masters/Transactions page.
// columns: [{ key, label, render? }]
export default function DataTable({ columns, rows, emptyLabel = "No records yet." }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: COLORS.paper }}>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: "left", padding: "10px 14px", color: COLORS.textDim, fontWeight: 600, fontSize: 12 }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: 20, textAlign: "center", color: COLORS.textDim }}>{emptyLabel}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={row.id ?? i} style={{ borderTop: `1px solid ${COLORS.line}` }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "10px 14px" }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

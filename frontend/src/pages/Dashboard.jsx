import { useEffect, useState } from "react";
import api from "../api/axios";
import { COLORS, FONTS } from "../theme";

function KpiCard({ idx, label, value }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: "16px 18px" }}>
      <span style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: COLORS.textDim, letterSpacing: 1 }}>K·{idx}</span>
      <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.ink, marginTop: 6, fontFamily: FONTS.display }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "#5B6068", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Hit all three endpoints in parallel; each is owned by a different
    // teammate's module but the Dashboard just reads whatever's live.
    Promise.allSettled([
      api.get("/assets"),
      api.get("/allocations"),
      api.get("/bookings"),
    ]).then(([a, al, b]) => {
      if (a.status === "fulfilled") setAssets(a.value.data.data || []);
      if (al.status === "fulfilled") setAllocations(al.value.data.data || []);
      if (b.status === "fulfilled") setBookings(b.value.data.data || []);
    });
  }, []);

  const available = assets.filter((a) => a.status === "AVAILABLE").length;
  const allocated = assets.filter((a) => a.status === "ALLOCATED").length;
  const activeBookings = bookings.filter((b) => b.status === "UPCOMING" || b.status === "ONGOING").length;

  const kpis = [
    { idx: "01", label: "Assets available", value: available },
    { idx: "02", label: "Assets allocated", value: allocated },
    { idx: "03", label: "Maintenance today", value: 0 },
    { idx: "04", label: "Active bookings", value: activeBookings },
    { idx: "05", label: "Pending transfers", value: 0 },
    { idx: "06", label: "Upcoming returns", value: allocations.filter((a) => a.status === "ACTIVE").length },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 22 }}>
        {kpis.map((k) => <KpiCard key={k.idx} {...k} />)}
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 18 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: COLORS.ink }}>Quick actions</h3>
        {["Register asset", "Book resource", "Raise maintenance request"].map((a) => (
          <button key={a} style={{
            display: "block", width: "100%", textAlign: "left", marginBottom: 8,
            padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLORS.line}`,
            background: COLORS.paper, color: COLORS.ink, fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            {a}
          </button>
        ))}
      </div>
    </>
  );
}

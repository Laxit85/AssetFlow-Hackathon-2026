import { useEffect, useState } from "react";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import { COLORS } from "../theme";

export default function Booking() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ resourceAssetId: "", bookedBy: "", start: "", end: "" });
  const [message, setMessage] = useState(null);

  const load = () => {
    api.get("/assets/bookable").then((r) => setResources(r.data.data));
    api.get("/bookings").then((r) => setBookings(r.data.data));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post("/bookings", {
        resourceAssetId: Number(form.resourceAssetId),
        bookedBy: Number(form.bookedBy),
        startTime: form.start,
        endTime: form.end,
      });
      setMessage({ type: "success", text: "Resource booked." });
      setForm({ resourceAssetId: "", bookedBy: "", start: "", end: "" });
      load();
    } catch (err) {
      // THIS is the overlap rejection from the spec (Room B2 example).
      const text = err.response?.data?.message || "Could not book this resource.";
      setMessage({ type: "error", text });
    }
  };

  return (
    <>
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <select value={form.resourceAssetId} onChange={(e) => setForm({ ...form, resourceAssetId: e.target.value })}
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8 }}>
          <option value="">Select resource…</option>
          {resources.map((r) => <option key={r.id} value={r.id}>{r.assetTag} — {r.name}</option>)}
        </select>
        <input placeholder="Employee ID" value={form.bookedBy} onChange={(e) => setForm({ ...form, bookedBy: e.target.value })}
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8, width: 110 }} />
        <input type="datetime-local" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })}
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8 }} />
        <input type="datetime-local" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })}
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8 }} />
        <button style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: COLORS.accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Book
        </button>
      </form>

      {message && (
        <div style={{
          marginBottom: 16, padding: "10px 14px", borderRadius: 8, fontSize: 13,
          background: message.type === "error" ? "#FBE9E6" : "#EAF3DE",
          color: message.type === "error" ? COLORS.red : "#3B6D11",
        }}>
          {message.text}
        </div>
      )}

      <DataTable
        columns={[
          { key: "resourceAssetId", label: "Resource ID" },
          { key: "bookedBy", label: "Booked by" },
          { key: "startTime", label: "Start" },
          { key: "endTime", label: "End" },
          { key: "status", label: "Status" },
        ]}
        rows={bookings}
      />
    </>
  );
}

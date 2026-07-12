import { useEffect, useState } from "react";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { COLORS, FONTS } from "../theme";

export default function Assets() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: "", categoryId: "", locationId: "", bookable: false });

  const load = () => api.get("/assets").then((r) => setRows(r.data.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await api.post("/assets", {
      name: form.name,
      categoryId: form.categoryId || null,
      locationId: form.locationId || null,
      bookable: form.bookable,
      condition: "Good",
    });
    setForm({ name: "", categoryId: "", locationId: "", bookable: false });
    load();
  };

  return (
    <>
      <form onSubmit={create} style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Asset name"
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8, width: 200 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <input type="checkbox" checked={form.bookable} onChange={(e) => setForm({ ...form, bookable: e.target.checked })} />
          Shared / bookable
        </label>
        <button style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: COLORS.accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Register asset
        </button>
      </form>

      <DataTable
        columns={[
          { key: "assetTag", label: "Asset tag", render: (r) => <span style={{ fontFamily: FONTS.mono, fontSize: 12.5 }}>{r.assetTag}</span> },
          { key: "name", label: "Name" },
          { key: "condition", label: "Condition" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "bookable", label: "Bookable", render: (r) => (r.bookable ? "Yes" : "No") },
        ]}
        rows={rows}
      />
    </>
  );
}

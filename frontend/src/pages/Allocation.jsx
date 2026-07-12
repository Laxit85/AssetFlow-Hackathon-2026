import { useEffect, useState } from "react";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import { COLORS, FONTS } from "../theme";

export default function Allocation() {
  const [assets, setAssets] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [form, setForm] = useState({ assetId: "", employeeId: "", expectedReturnDate: "" });
  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text }

  const load = () => {
    api.get("/assets").then((r) => setAssets(r.data.data));
    api.get("/allocations").then((r) => setAllocations(r.data.data));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post("/allocations", {
        assetId: Number(form.assetId),
        employeeId: Number(form.employeeId),
        expectedReturnDate: form.expectedReturnDate || null,
      });
      setMessage({ type: "success", text: "Asset allocated." });
      setForm({ assetId: "", employeeId: "", expectedReturnDate: "" });
      load();
    } catch (err) {
      // THIS is the conflict message from the spec: "currently held by X,
      // offers a Transfer Request instead" — surfaced straight from the backend.
      const text = err.response?.data?.message || "Could not allocate this asset.";
      setMessage({ type: "error", text });
    }
  };

  return (
    <>
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <select value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8 }}>
          <option value="">Select asset…</option>
          {assets.map((a) => <option key={a.id} value={a.id}>{a.assetTag} — {a.name}</option>)}
        </select>
        <input placeholder="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8, width: 120 }} />
        <input type="date" value={form.expectedReturnDate} onChange={(e) => setForm({ ...form, expectedReturnDate: e.target.value })}
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8 }} />
        <button style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: COLORS.accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Allocate
        </button>
      </form>

      {message && (
        <div style={{
          marginBottom: 16, padding: "10px 14px", borderRadius: 8, fontSize: 13,
          background: message.type === "error" ? "#FBE9E6" : "#EAF3DE",
          color: message.type === "error" ? COLORS.red : "#3B6D11",
        }}>
          {message.text}
          {message.type === "error" && (
            <button style={{ marginLeft: 12, fontSize: 12, background: "none", border: "none", color: COLORS.accent, cursor: "pointer", textDecoration: "underline" }}>
              Raise transfer request
            </button>
          )}
        </div>
      )}

      <DataTable
        columns={[
          { key: "assetId", label: "Asset ID" },
          { key: "employeeId", label: "Employee ID" },
          { key: "expectedReturnDate", label: "Expected return" },
          { key: "status", label: "Status" },
        ]}
        rows={allocations}
      />
    </>
  );
}

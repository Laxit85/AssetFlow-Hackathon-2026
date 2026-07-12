import { useEffect, useState } from "react";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import { COLORS } from "../theme";

const ROLES = ["EMPLOYEE", "DEPARTMENT_HEAD", "ASSET_MANAGER"];

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  const load = () => api.get("/employees").then((r) => setRows(r.data.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    await api.post("/employees", { ...form, role: "EMPLOYEE", status: "ACTIVE" });
    setForm({ name: "", email: "" });
    load();
  };

  const promote = async (id, role) => {
    await api.patch(`/employees/${id}/role`, { role });
    load();
  };

  return (
    <>
      <form onSubmit={create} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name"
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8, width: 160 }} />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email"
          style={{ padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8, width: 220 }} />
        <button style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: COLORS.accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Add employee
        </button>
      </form>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          {
            key: "promote", label: "Promote to (Admin only)",
            render: (row) => (
              <select defaultValue="" onChange={(e) => e.target.value && promote(row.id, e.target.value)}
                style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${COLORS.line}` }}>
                <option value="" disabled>Change role…</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            ),
          },
        ]}
        rows={rows}
      />
    </>
  );
}

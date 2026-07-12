import { useEffect, useState } from "react";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import { COLORS } from "../theme";

export default function Departments() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");

  const load = () => api.get("/departments").then((r) => setRows(r.data.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/departments", { name, status: "ACTIVE" });
    setName("");
    load();
  };

  return (
    <>
      <form onSubmit={create} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New department name"
          style={{ flex: 1, maxWidth: 280, padding: "9px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 8 }} />
        <button style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: COLORS.accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Add department
        </button>
      </form>

      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
      />
    </>
  );
}

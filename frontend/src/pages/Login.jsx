import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { COLORS, FONTS } from "../theme";
import TagMark from "../components/TagMark";

export default function Login() {
  const [email, setEmail] = useState("manager@assetflow.io");
  const [password, setPassword] = useState("manager123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("assetflow_user", JSON.stringify(res.data.data));
        navigate("/dashboard");
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Could not reach the server. Is the backend running on :8080?");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: COLORS.paper,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12,
        padding: 32, width: 340,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <TagMark size={30} />
          <span style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 17, color: COLORS.ink }}>AssetFlow</span>
        </div>

        <label style={{ fontSize: 12.5, color: COLORS.textDim }}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

        <label style={{ fontSize: 12.5, color: COLORS.textDim }}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

        {error && <p style={{ color: COLORS.red, fontSize: 12.5 }}>{error}</p>}

        <button type="submit" style={{
          width: "100%", padding: "10px 0", marginTop: 8, borderRadius: 8, border: "none",
          background: COLORS.accent, color: "#fff", fontWeight: 600, cursor: "pointer",
        }}>
          Log in
        </button>

        <p style={{ fontSize: 11.5, color: COLORS.textDim, marginTop: 14, textAlign: "center" }}>
          Seeded demo accounts: admin@assetflow.io / admin123 · manager@assetflow.io / manager123
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "9px 10px", marginTop: 4, marginBottom: 14,
  border: `1px solid ${COLORS.line}`, borderRadius: 8, fontSize: 13.5,
};

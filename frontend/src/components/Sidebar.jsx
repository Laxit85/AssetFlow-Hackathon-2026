import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Building2, Users, Tag, Package, MapPin,
  ArrowLeftRight, Repeat, CalendarClock, Wrench, ClipboardCheck,
  BarChart3, Bell, FileClock, ChevronDown, ChevronRight, LogOut,
} from "lucide-react";
import { COLORS, FONTS } from "../theme";
import TagMark from "./TagMark";

// NAV mirrors the required menu tree exactly. Add a `path` here once a
// page exists; leave items without a path pointing at a placeholder route.
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  {
    key: "masters", label: "Masters", icon: Tag,
    children: [
      { key: "departments", label: "Departments", icon: Building2, path: "/masters/departments" },
      { key: "employees", label: "Employees", icon: Users, path: "/masters/employees" },
      { key: "categories", label: "Asset Categories", icon: Tag, path: "/masters/categories" },
      { key: "assets", label: "Assets", icon: Package, path: "/masters/assets" },
      { key: "locations", label: "Locations", icon: MapPin, path: "/masters/locations" },
    ],
  },
  {
    key: "transactions", label: "Transactions", icon: Repeat,
    children: [
      { key: "allocation", label: "Asset Allocation", icon: ArrowLeftRight, path: "/transactions/allocation" },
      { key: "transfer", label: "Asset Transfer", icon: Repeat, path: "/transactions/transfer" },
      { key: "booking", label: "Resource Booking", icon: CalendarClock, path: "/transactions/booking" },
      { key: "maintenance", label: "Maintenance", icon: Wrench, path: "/transactions/maintenance" },
      { key: "audit", label: "Audit", icon: ClipboardCheck, path: "/transactions/audit" },
    ],
  },
  { key: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
  { key: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  { key: "activity", label: "Activity Logs", icon: FileClock, path: "/activity-logs" },
];

const linkStyle = ({ isActive }) => ({
  display: "flex", alignItems: "center", gap: 10,
  padding: "9px 14px 9px 16px", textDecoration: "none",
  borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent",
  color: isActive ? "#fff" : "#B7BEC7",
  fontSize: 13.5, fontWeight: isActive ? 600 : 500,
  borderRadius: "0 6px 6px 0",
  background: isActive ? "rgba(47,111,94,0.18)" : "transparent",
});

const childLinkStyle = ({ isActive }) => ({
  display: "flex", alignItems: "center", gap: 10,
  padding: "8px 14px 8px 34px", textDecoration: "none",
  borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent",
  color: isActive ? "#fff" : "#8C93A0",
  fontSize: 13, fontWeight: isActive ? 600 : 400,
  borderRadius: "0 6px 6px 0",
  background: isActive ? "rgba(47,111,94,0.18)" : "transparent",
});

export default function Sidebar() {
  const [open, setOpen] = useState(["masters", "transactions"]);
  const toggle = (key) => setOpen((g) => (g.includes(key) ? g.filter((x) => x !== key) : [...g, key]));

  return (
    <aside style={{ width: 240, background: COLORS.ink, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 16px 16px" }}>
        <TagMark />
        <div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, fontFamily: FONTS.display, lineHeight: 1.1 }}>AssetFlow</div>
          <div style={{ color: "#7C8592", fontSize: 10.5, letterSpacing: 1.5, textTransform: "uppercase" }}>Enterprise ERP</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "6px 6px" }}>
        {NAV.map((item) => {
          const Icon = item.icon;
          if (!item.children) {
            return <NavLink key={item.key} to={item.path} style={linkStyle}><Icon size={16} strokeWidth={2} />{item.label}</NavLink>;
          }
          const isOpen = open.includes(item.key);
          return (
            <div key={item.key}>
              <button onClick={() => toggle(item.key)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 14px 9px 16px", background: "transparent", border: "none",
                color: "#9CA4AE", cursor: "pointer", fontSize: 12, fontWeight: 600,
                letterSpacing: 0.4, textTransform: "uppercase",
              }}>
                <Icon size={15} strokeWidth={2} />
                <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {isOpen && item.children.map((child) => {
                const ChildIcon = child.icon;
                return (
                  <NavLink key={child.key} to={child.path} style={childLinkStyle}>
                    <ChildIcon size={14} strokeWidth={2} />{child.label}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div style={{ padding: "12px 16px", borderTop: "1px solid #2A3542", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%", background: COLORS.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 600, color: "#fff",
        }}>AM</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 500 }}>Asset Manager</div>
          <div style={{ color: "#7C8592", fontSize: 11 }}>manager@assetflow.io</div>
        </div>
        <LogOut size={15} color="#7C8592" />
      </div>
    </aside>
  );
}

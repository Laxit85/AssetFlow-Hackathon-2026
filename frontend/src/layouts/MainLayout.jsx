import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { COLORS } from "../theme";

// Maps a route path to the title/breadcrumb shown in the Topbar.
const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard" },
  "/masters/departments": { title: "Departments", parent: "Masters" },
  "/masters/employees": { title: "Employees", parent: "Masters" },
  "/masters/categories": { title: "Asset Categories", parent: "Masters" },
  "/masters/assets": { title: "Assets", parent: "Masters" },
  "/masters/locations": { title: "Locations", parent: "Masters" },
  "/transactions/allocation": { title: "Asset Allocation", parent: "Transactions" },
  "/transactions/transfer": { title: "Asset Transfer", parent: "Transactions" },
  "/transactions/booking": { title: "Resource Booking", parent: "Transactions" },
  "/transactions/maintenance": { title: "Maintenance", parent: "Transactions" },
  "/transactions/audit": { title: "Audit", parent: "Transactions" },
  "/reports": { title: "Reports" },
  "/notifications": { title: "Notifications" },
  "/activity-logs": { title: "Activity Logs" },
};

// THIS is the main/center page every master screen connects through.
// It never needs editing when someone adds a new page — Sidebar links to
// a path, App.jsx adds one <Route>, and this shell just renders whatever's active.
export default function MainLayout() {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || { title: "AssetFlow" };

  return (
    <div style={{
      display: "flex", width: "100%", minHeight: "100vh", fontFamily: "'Inter', sans-serif",
      background: COLORS.paper,
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title={page.title} parent={page.parent} />
        <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

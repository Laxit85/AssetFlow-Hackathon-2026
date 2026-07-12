import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import Categories from "./pages/Categories";
import Assets from "./pages/Assets";
import Locations from "./pages/Locations";
import Allocation from "./pages/Allocation";
import Booking from "./pages/Booking";
import Placeholder from "./pages/Placeholder";

// This is the ONLY file that lists routes. Adding a page = one line here.
// Assign one person (the Lead) as the only one who edits this file during
// the hackathon — everyone else hands them a one-line route when ready.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/masters/departments" element={<Departments />} />
        <Route path="/masters/employees" element={<Employees />} />
        <Route path="/masters/categories" element={<Categories />} />
        <Route path="/masters/assets" element={<Assets />} />
        <Route path="/masters/locations" element={<Locations />} />

        <Route path="/transactions/allocation" element={<Allocation />} />
        <Route path="/transactions/transfer" element={<Placeholder label="Asset Transfer" />} />
        <Route path="/transactions/booking" element={<Booking />} />
        <Route path="/transactions/maintenance" element={<Placeholder label="Maintenance" />} />
        <Route path="/transactions/audit" element={<Placeholder label="Audit" />} />

        <Route path="/reports" element={<Placeholder label="Reports" />} />
        <Route path="/notifications" element={<Placeholder label="Notifications" />} />
        <Route path="/activity-logs" element={<Placeholder label="Activity Logs" />} />
      </Route>
    </Routes>
  );
}

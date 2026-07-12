import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Package, Users, Building2, Tag, MapPin,
  ArrowRightLeft, Calendar, Wrench, ClipboardList, BarChart3,
  Bell, Activity, ChevronRight, ChevronLeft, Search, Settings,
  LogOut, Menu, X, Plus, Filter, Download, Upload, Eye,
  Edit2, Trash2, CheckCircle2, Clock, AlertTriangle, TrendingUp,
  TrendingDown, Layers, Shield, Cpu, HardDrive, Zap, RefreshCw,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Circle, Check,
  ChevronDown, ChevronUp, User, Mail, Phone, Globe, Lock,
  EyeOff, AlertCircle, Info, Star, Archive, Send, Inbox
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = "#B89A61";
const GOLD_HOVER = "#CCB07C";
const BG = "#090909";
const SURFACE = "#111111";
const CARD = "#181818";
const ELEVATED = "#1F1F1F";
const BORDER = "#262626";
const TEXT_PRIMARY = "#F4F4F4";
const TEXT_SECONDARY = "#B6B6B6";
const SUCCESS = "#5A7A4A";
const DANGER = "#7A2C2C";
const WARNING = "#8A6A32";

const fontHeading = "'Plus Jakarta Sans', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'IBM Plex Mono', monospace";

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const areaData = [
  { month: "Jan", assets: 240, maintenance: 18, allocations: 92 },
  { month: "Feb", assets: 255, maintenance: 22, allocations: 108 },
  { month: "Mar", assets: 261, maintenance: 15, allocations: 121 },
  { month: "Apr", assets: 278, maintenance: 31, allocations: 134 },
  { month: "May", assets: 290, maintenance: 24, allocations: 148 },
  { month: "Jun", assets: 304, maintenance: 19, allocations: 162 },
  { month: "Jul", assets: 318, maintenance: 27, allocations: 177 },
];

const deptData = [
  { name: "Engineering", value: 128 },
  { name: "Operations", value: 87 },
  { name: "Finance", value: 44 },
  { name: "HR", value: 31 },
  { name: "Legal", value: 28 },
];

const CHART_COLORS = [GOLD, "#6B7E5A", "#8A7A5A", "#4A5E4A", "#CCB07C"];

const mockAssets = [
  { id: "AST-001", name: "MacBook Pro 16\"", category: "Laptop", department: "Engineering", assignedTo: "James Whitmore", location: "HQ Floor 3", status: "Active", value: 3499 },
  { id: "AST-002", name: "Dell UltraSharp 32", category: "Monitor", department: "Finance", assignedTo: "Rachel Chen", location: "HQ Floor 2", status: "Active", value: 1299 },
  { id: "AST-003", name: "Cisco Catalyst 9300", category: "Network", department: "IT", assignedTo: "—", location: "Server Room A", status: "Maintenance", value: 8750 },
  { id: "AST-004", name: "Herman Miller Aeron", category: "Furniture", department: "HR", assignedTo: "Sofia Martinez", location: "HQ Floor 1", status: "Active", value: 1895 },
  { id: "AST-005", name: "HP LaserJet Pro", category: "Printer", department: "Operations", assignedTo: "—", location: "HQ Floor 2", status: "Inactive", value: 649 },
  { id: "AST-006", name: "iPad Pro 12.9\"", category: "Tablet", department: "Sales", assignedTo: "David Park", location: "Remote", status: "Active", value: 1099 },
  { id: "AST-007", name: "ThinkPad X1 Carbon", category: "Laptop", department: "Legal", assignedTo: "Emma Richardson", location: "HQ Floor 4", status: "Active", value: 2299 },
  { id: "AST-008", name: "Sony A7 IV Camera", category: "Equipment", department: "Marketing", assignedTo: "—", location: "Storage B", status: "Maintenance", value: 3499 },
];

const mockEmployees = [
  { id: "EMP-001", name: "James Whitmore", email: "j.whitmore@corp.io", department: "Engineering", role: "Senior Engineer", location: "HQ Floor 3", status: "Active" },
  { id: "EMP-002", name: "Rachel Chen", email: "r.chen@corp.io", department: "Finance", role: "Financial Analyst", location: "HQ Floor 2", status: "Active" },
  { id: "EMP-003", name: "Sofia Martinez", email: "s.martinez@corp.io", department: "HR", role: "HR Manager", location: "HQ Floor 1", status: "Active" },
  { id: "EMP-004", name: "David Park", email: "d.park@corp.io", department: "Sales", role: "Account Executive", location: "Remote", status: "Active" },
  { id: "EMP-005", name: "Emma Richardson", email: "e.richardson@corp.io", department: "Legal", role: "Senior Counsel", location: "HQ Floor 4", status: "On Leave" },
  { id: "EMP-006", name: "Marcus Webb", email: "m.webb@corp.io", department: "Operations", role: "Operations Lead", location: "HQ Floor 1", status: "Active" },
];

const mockDepartments = [
  { id: "DEP-001", name: "Engineering", head: "James Whitmore", employees: 48, assets: 128, location: "HQ Floor 3", budget: 2400000, status: "Active" },
  { id: "DEP-002", name: "Finance", head: "Rachel Chen", employees: 22, assets: 44, location: "HQ Floor 2", budget: 880000, status: "Active" },
  { id: "DEP-003", name: "Human Resources", head: "Sofia Martinez", employees: 14, assets: 31, location: "HQ Floor 1", budget: 560000, status: "Active" },
  { id: "DEP-004", name: "Operations", head: "Marcus Webb", employees: 36, assets: 87, location: "HQ Floor 1", budget: 1440000, status: "Active" },
  { id: "DEP-005", name: "Legal", head: "Emma Richardson", employees: 9, assets: 28, location: "HQ Floor 4", budget: 360000, status: "Active" },
  { id: "DEP-006", name: "Marketing", head: "Alicia Thorn", employees: 19, assets: 52, location: "HQ Floor 3", budget: 760000, status: "Active" },
];

const mockAllocations = [
  { id: "ALO-001", asset: "MacBook Pro 16\"", employee: "James Whitmore", department: "Engineering", date: "2025-01-15", returnDate: "2026-01-15", status: "Active" },
  { id: "ALO-002", asset: "Dell UltraSharp 32", employee: "Rachel Chen", department: "Finance", date: "2025-03-22", returnDate: "2026-03-22", status: "Active" },
  { id: "ALO-003", asset: "iPad Pro 12.9\"", employee: "David Park", department: "Sales", date: "2025-02-10", returnDate: "2025-08-10", status: "Expired" },
  { id: "ALO-004", asset: "ThinkPad X1 Carbon", employee: "Emma Richardson", department: "Legal", date: "2025-04-01", returnDate: "2026-04-01", status: "Active" },
];

const mockNotifications = [
  { id: 1, type: "warning", title: "Maintenance Due", message: "Cisco Catalyst 9300 requires scheduled maintenance within 7 days.", time: "2 hours ago", read: false },
  { id: 2, type: "success", title: "Allocation Approved", message: "Asset ALO-004 ThinkPad X1 Carbon has been successfully allocated to Emma Richardson.", time: "4 hours ago", read: false },
  { id: 3, type: "info", title: "Audit Scheduled", message: "Quarterly asset audit for Engineering department is scheduled for Dec 15, 2025.", time: "1 day ago", read: true },
  { id: 4, type: "danger", title: "Asset Overdue", message: "iPad Pro 12.9\" allocation to David Park expired on Aug 10. Return requested.", time: "2 days ago", read: false },
  { id: 5, type: "info", title: "New Employee Onboarded", message: "Liam Torres has joined the Operations team. Asset provisioning pending.", time: "3 days ago", read: true },
  { id: 6, type: "success", title: "Transfer Complete", message: "HP LaserJet Pro transferred from Engineering to Operations successfully.", time: "4 days ago", read: true },
];

const mockActivityLogs = [
  { id: 1, user: "James Whitmore", action: "Asset Allocated", target: "MacBook Pro 16\" → Engineering", ip: "10.0.1.42", timestamp: "2025-07-12 09:14:23", type: "create" },
  { id: 2, user: "Sofia Martinez", action: "Employee Record Updated", target: "Marcus Webb — role changed", ip: "10.0.1.18", timestamp: "2025-07-12 08:47:11", type: "update" },
  { id: 3, user: "Rachel Chen", action: "Report Exported", target: "Q2 Asset Utilization Report (PDF)", ip: "10.0.1.27", timestamp: "2025-07-11 17:32:09", type: "export" },
  { id: 4, user: "System", action: "Maintenance Alert Triggered", target: "Cisco Catalyst 9300 — overdue", ip: "Internal", timestamp: "2025-07-11 14:00:00", type: "alert" },
  { id: 5, user: "David Park", action: "Booking Created", target: "Sony A7 IV Camera — Jul 18–20", ip: "10.0.1.55", timestamp: "2025-07-11 11:22:47", type: "create" },
  { id: 6, user: "Emma Richardson", action: "Asset Viewed", target: "AST-007 ThinkPad X1 Carbon", ip: "10.0.1.33", timestamp: "2025-07-10 16:05:12", type: "view" },
  { id: 7, user: "Admin", action: "User Account Created", target: "Liam Torres — Operations", ip: "10.0.1.1", timestamp: "2025-07-10 09:00:00", type: "create" },
];

const reportKPIs = [
  { label: "Total Asset Value", value: "$2,847,320", delta: "+12.4%", up: true },
  { label: "Active Allocations", value: "312", delta: "+8 this month", up: true },
  { label: "Maintenance Cost", value: "$48,220", delta: "-6.2%", up: false },
  { label: "Asset Utilization", value: "87.4%", delta: "+2.1%", up: true },
];

// ─── Utility Components ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    Active: { color: SUCCESS, bg: `${SUCCESS}22` },
    Inactive: { color: TEXT_SECONDARY, bg: `${BORDER}` },
    Maintenance: { color: WARNING, bg: `${WARNING}22` },
    Expired: { color: DANGER, bg: `${DANGER}22` },
    "On Leave": { color: WARNING, bg: `${WARNING}22` },
    Pending: { color: GOLD, bg: `${GOLD}22` },
  };
  const s = map[status] || { color: TEXT_SECONDARY, bg: BORDER };
  return (
    <span
      style={{
        color: s.color,
        backgroundColor: s.bg,
        fontFamily: fontMono,
        fontSize: "0.68rem",
        padding: "2px 10px",
        borderRadius: "3px",
        letterSpacing: "0.08em",
        border: `1px solid ${s.color}33`,
        fontWeight: 500,
      }}
    >
      {status}
    </span>
  );
}

function GoldButton({ children, onClick, variant = "primary", small = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  small?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const base = {
    fontFamily: fontBody,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    letterSpacing: "0.03em",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: small ? "6px 14px" : "9px 20px",
    fontSize: small ? "0.78rem" : "0.85rem",
    borderRadius: "6px",
  };
  if (variant === "primary") return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...base,
        background: hovered ? GOLD_HOVER : GOLD,
        color: "#090909",
        boxShadow: hovered ? `0 4px 20px ${GOLD}40` : `0 2px 10px ${GOLD}20`,
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >{children}</button>
  );
  if (variant === "ghost") return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...base,
        background: hovered ? `${GOLD}12` : "transparent",
        color: hovered ? GOLD : TEXT_SECONDARY,
        border: "none",
      }}
    >{children}</button>
  );
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...base,
        background: hovered ? `${GOLD}10` : "transparent",
        color: hovered ? GOLD : TEXT_SECONDARY,
        border: `1px solid ${hovered ? GOLD : BORDER}`,
      }}
    >{children}</button>
  );
}

function SearchInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <Search size={14} color={TEXT_SECONDARY} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: ELEVATED,
          border: `1px solid ${BORDER}`,
          borderRadius: "6px",
          color: TEXT_PRIMARY,
          fontFamily: fontBody,
          fontSize: "0.83rem",
          padding: "8px 12px 8px 34px",
          outline: "none",
          width: "220px",
          transition: "border-color 0.2s",
        }}
      />
    </div>
  );
}

function Skeleton({ h = 20, w = "100%" }: { h?: number; w?: string | number }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        background: `linear-gradient(90deg, ${CARD} 25%, ${ELEVATED} 50%, ${CARD} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        borderRadius: "4px",
      }}
    />
  );
}

// ─── Preloader ─────────────────────────────────────────────────────────────────

const loadingMessages = [
  "Initializing Workspace",
  "Loading Assets",
  "Preparing Dashboard",
  "Connecting Services",
  "Optimizing Interface",
];

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPct(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onDone, 600); return 100; }
        return p + Math.random() * 4 + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onDone]);

  useEffect(() => {
    const interval = setInterval(() => setMsgIdx(i => (i + 1) % loadingMessages.length), 900);
    return () => clearInterval(interval);
  }, []);

  const clamped = Math.min(Math.round(pct), 100);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: "fixed", inset: 0, background: BG,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
        width: 400, height: 400,
        background: `radial-gradient(circle, ${GOLD}0f 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{ marginBottom: 56, position: "relative" }}
      >
        <div style={{
          width: 72, height: 72, border: `1px solid ${GOLD}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          background: `radial-gradient(circle at center, ${GOLD}12, transparent)`,
        }}>
          <div style={{
            position: "absolute", inset: -8, border: `1px solid ${GOLD}18`,
            animation: "spin 8s linear infinite",
          }} />
          <Layers size={28} color={GOLD} />
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ fontFamily: fontHeading, fontSize: "1.4rem", color: TEXT_PRIMARY, fontWeight: 600, letterSpacing: "0.12em" }}>EAMS</div>
          <div style={{ fontFamily: fontMono, fontSize: "0.65rem", color: TEXT_SECONDARY, letterSpacing: "0.25em", marginTop: 4 }}>ENTERPRISE ASSET MANAGEMENT</div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ width: 280, textAlign: "center" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: fontMono, fontSize: "0.7rem", color: TEXT_SECONDARY, letterSpacing: "0.1em", marginBottom: 20 }}
          >
            {loadingMessages[msgIdx]}
          </motion.div>
        </AnimatePresence>

        <div style={{ height: 1, background: BORDER, borderRadius: 1, overflow: "hidden", marginBottom: 12 }}>
          <motion.div
            style={{ height: "100%", background: `linear-gradient(90deg, ${GOLD}80, ${GOLD})`, borderRadius: 1 }}
            animate={{ width: `${clamped}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
        <div style={{ fontFamily: fontMono, fontSize: "0.75rem", color: GOLD, letterSpacing: "0.08em" }}>
          {String(clamped).padStart(3, "0")}%
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Login Page ────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(onLogin, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr",
        background: BG, fontFamily: fontBody,
      }}
      className="max-lg:grid-cols-1"
    >
      {/* Left panel — cinematic */}
      <div
        className="max-lg:hidden"
        style={{
          position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, #0e0e0e 0%, #090909 100%)`,
          borderRight: `1px solid ${BORDER}`,
          display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "56px",
        }}
      >
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${BORDER}30 1px, transparent 1px), linear-gradient(90deg, ${BORDER}30 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
        }} />

        {/* Ambient spotlight */}
        <div style={{
          position: "absolute", top: "20%", left: "30%",
          width: 500, height: 500,
          background: `radial-gradient(circle, ${GOLD}08 0%, transparent 65%)`,
        }} />

        {/* Floating stat cards */}
        {[
          { top: "18%", left: "10%", label: "Total Assets", value: "2,847", icon: Package },
          { top: "36%", left: "55%", label: "Active Staff", value: "318", icon: Users },
          { top: "58%", left: "8%", label: "Departments", value: "14", icon: Building2 },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.8 }}
            style={{
              position: "absolute", top: card.top, left: card.left,
              background: CARD, border: `1px solid ${BORDER}`,
              padding: "14px 20px", minWidth: 160,
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <card.icon size={14} color={GOLD} />
              <span style={{ fontSize: "0.7rem", color: TEXT_SECONDARY, fontFamily: fontMono, letterSpacing: "0.08em" }}>{card.label}</span>
            </div>
            <div style={{ fontSize: "1.6rem", fontFamily: fontMono, color: TEXT_PRIMARY, fontWeight: 500 }}>{card.value}</div>
          </motion.div>
        ))}

        {/* Bottom content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, border: `1px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={18} color={GOLD} />
            </div>
            <div>
              <div style={{ fontFamily: fontHeading, fontWeight: 600, letterSpacing: "0.1em", color: TEXT_PRIMARY }}>EAMS</div>
              <div style={{ fontSize: "0.65rem", fontFamily: fontMono, color: TEXT_SECONDARY, letterSpacing: "0.2em" }}>ENTERPRISE ASSET MANAGEMENT</div>
            </div>
          </div>
          <h1 style={{ fontFamily: fontHeading, fontSize: "2.4rem", fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Manage every asset.<br />
            <span style={{ color: GOLD }}>Precisely.</span>
          </h1>
          <p style={{ fontSize: "0.9rem", color: TEXT_SECONDARY, lineHeight: 1.7, maxWidth: 360 }}>
            A single unified platform for tracking, allocating, and maintaining all enterprise resources across every department and location.
          </p>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: fontHeading, fontSize: "1.75rem", color: TEXT_PRIMARY, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>
              Welcome back
            </h2>
            <p style={{ color: TEXT_SECONDARY, fontSize: "0.88rem" }}>Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email */}
            <div style={{ position: "relative" }}>
              <label style={{
                position: "absolute", left: 14,
                top: focused === "email" || email ? "8px" : "50%",
                transform: focused === "email" || email ? "none" : "translateY(-50%)",
                fontSize: focused === "email" || email ? "0.65rem" : "0.85rem",
                color: focused === "email" ? GOLD : TEXT_SECONDARY,
                transition: "all 0.2s",
                pointerEvents: "none",
                fontFamily: fontBody,
                letterSpacing: "0.04em",
              }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                style={{
                  width: "100%", padding: email || focused === "email" ? "24px 14px 10px" : "18px 14px",
                  background: ELEVATED, border: `1px solid ${focused === "email" ? GOLD + "60" : BORDER}`,
                  color: TEXT_PRIMARY, fontFamily: fontBody, fontSize: "0.9rem",
                  outline: "none", transition: "border-color 0.2s",
                  borderRadius: "6px",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ position: "relative" }}>
              <label style={{
                position: "absolute", left: 14,
                top: focused === "pwd" || password ? "8px" : "50%",
                transform: focused === "pwd" || password ? "none" : "translateY(-50%)",
                fontSize: focused === "pwd" || password ? "0.65rem" : "0.85rem",
                color: focused === "pwd" ? GOLD : TEXT_SECONDARY,
                transition: "all 0.2s",
                pointerEvents: "none",
                fontFamily: fontBody,
                letterSpacing: "0.04em",
              }}>Password</label>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("pwd")}
                onBlur={() => setFocused(null)}
                style={{
                  width: "100%", padding: password || focused === "pwd" ? "24px 44px 10px 14px" : "18px 44px 18px 14px",
                  background: ELEVATED, border: `1px solid ${focused === "pwd" ? GOLD + "60" : BORDER}`,
                  color: TEXT_PRIMARY, fontFamily: fontBody, fontSize: "0.9rem",
                  outline: "none", transition: "border-color 0.2s",
                  borderRadius: "6px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: TEXT_SECONDARY, padding: 0 }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontFamily: fontBody, fontSize: "0.82rem" }}>
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%", padding: "14px",
                background: loading ? GOLD + "80" : GOLD,
                color: "#090909", border: "none", borderRadius: "6px",
                fontFamily: fontHeading, fontWeight: 600, fontSize: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.06em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.2s",
                boxShadow: `0 4px 24px ${GOLD}30`,
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: 16, height: 16, border: `2px solid #09090960`, borderTop: `2px solid #090909`, borderRadius: "50%" }}
                  />
                  Authenticating...
                </>
              ) : "Sign In"}
            </motion.button>
          </form>

          <div style={{ marginTop: 32, padding: "16px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "6px" }}>
            <div style={{ fontSize: "0.75rem", color: TEXT_SECONDARY, fontFamily: fontMono, letterSpacing: "0.06em", marginBottom: 8 }}>DEMO CREDENTIALS</div>
            <div style={{ fontSize: "0.82rem", color: TEXT_SECONDARY }}>
              <span style={{ color: TEXT_PRIMARY }}>admin@corp.io</span> / <span style={{ color: TEXT_PRIMARY }}>••••••••</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

type Page = "dashboard" | "assets" | "departments" | "employees" | "categories" | "locations" |
  "allocations" | "transfers" | "bookings" | "maintenance" | "audits" |
  "reports" | "notifications" | "activity-logs";

const navGroups = [
  {
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Masters",
    items: [
      { id: "assets", label: "Assets", icon: Package },
      { id: "departments", label: "Departments", icon: Building2 },
      { id: "employees", label: "Employees", icon: Users },
      { id: "categories", label: "Categories", icon: Tag },
      { id: "locations", label: "Locations", icon: MapPin },
    ],
  },
  {
    label: "Transactions",
    items: [
      { id: "allocations", label: "Allocation", icon: ArrowRightLeft },
      { id: "transfers", label: "Transfer", icon: Send },
      { id: "bookings", label: "Booking", icon: Calendar },
      { id: "maintenance", label: "Maintenance", icon: Wrench },
      { id: "audits", label: "Audit", icon: ClipboardList },
    ],
  },
  {
    label: "System",
    items: [
      { id: "reports", label: "Reports", icon: BarChart3 },
      { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
      { id: "activity-logs", label: "Activity Logs", icon: Activity },
    ],
  },
];

function Sidebar({ current, onNavigate, collapsed, onToggle }: {
  current: Page;
  onNavigate: (p: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 228 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: SURFACE, borderRight: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column", height: "100vh",
        position: "fixed", left: 0, top: 0, zIndex: 50, overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: collapsed ? "20px 0" : "20px 16px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", borderBottom: `1px solid ${BORDER}`, minHeight: 64 }}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, border: `1px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Layers size={14} color={GOLD} />
            </div>
            <div>
              <div style={{ fontFamily: fontHeading, fontWeight: 700, fontSize: "0.85rem", color: TEXT_PRIMARY, letterSpacing: "0.1em" }}>EAMS</div>
              <div style={{ fontFamily: fontMono, fontSize: "0.55rem", color: TEXT_SECONDARY, letterSpacing: "0.18em" }}>ENTERPRISE</div>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div style={{ width: 28, height: 28, border: `1px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={14} color={GOLD} />
          </div>
        )}
        <button
          onClick={onToggle}
          style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_SECONDARY, padding: 4, display: collapsed ? "none" : "block" }}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 0", scrollbarWidth: "none" }}>
        {navGroups.map(group => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{ padding: "8px 16px 4px", fontFamily: fontMono, fontSize: "0.58rem", color: TEXT_SECONDARY, letterSpacing: "0.2em", opacity: 0.7 }}>
                {group.label.toUpperCase()}
              </div>
            )}
            {group.items.map(item => {
              const active = current === item.id;
              return (
                <NavItem
                  key={item.id}
                  item={item as any}
                  active={active}
                  collapsed={collapsed}
                  onClick={() => onNavigate(item.id as Page)}
                />
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: collapsed ? "12px 0" : "12px 10px" }}>
        <button
          onClick={onToggle}
          style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
            gap: 10, padding: "8px", color: TEXT_SECONDARY, borderRadius: 6,
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span style={{ fontFamily: fontBody, fontSize: "0.8rem" }}>Collapse</span></>}
        </button>
      </div>
    </motion.aside>
  );
}

function NavItem({ item, active, collapsed, onClick }: { item: { id: string; label: string; icon: any; badge?: number }; active: boolean; collapsed: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? item.label : undefined}
      style={{
        width: "100%", background: active ? `${GOLD}12` : hovered ? `${GOLD}06` : "transparent",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
        gap: 12, padding: collapsed ? "10px 0" : "9px 16px",
        color: active ? GOLD : hovered ? TEXT_PRIMARY : TEXT_SECONDARY,
        transition: "all 0.18s",
        position: "relative",
      }}
    >
      {active && (
        <div style={{
          position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2,
          background: GOLD, borderRadius: "0 2px 2px 0",
        }} />
      )}
      <motion.div
        animate={{ rotate: hovered && !active ? 5 : 0, scale: active ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <item.icon size={16} />
      </motion.div>
      {!collapsed && (
        <span style={{ fontFamily: fontBody, fontSize: "0.83rem", fontWeight: active ? 500 : 400, flex: 1, textAlign: "left" }}>
          {item.label}
        </span>
      )}
      {!collapsed && item.badge && (
        <span style={{
          background: GOLD, color: "#090909", fontFamily: fontMono, fontSize: "0.6rem",
          padding: "1px 6px", borderRadius: "10px", fontWeight: 600,
        }}>{item.badge}</span>
      )}
      {collapsed && item.badge && (
        <div style={{
          position: "absolute", top: 6, right: 10, width: 6, height: 6,
          background: GOLD, borderRadius: "50%",
        }} />
      )}
    </button>
  );
}

// ─── Topbar ────────────────────────────────────────────────────────────────────

function Topbar({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const [time, setTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const label = navGroups.flatMap(g => g.items).find(i => i.id === currentPage)?.label || "Dashboard";

  return (
    <div style={{
      height: 56, background: `${SURFACE}e0`, backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${BORDER}`,
      display: "flex", alignItems: "center", paddingInline: 24, gap: 16,
      position: "sticky", top: 0, zIndex: 40,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        <span style={{ fontFamily: fontMono, fontSize: "0.68rem", color: TEXT_SECONDARY, letterSpacing: "0.08em" }}>WORKSPACE</span>
        <ChevronRight size={12} color={BORDER} />
        <span style={{ fontFamily: fontBody, fontSize: "0.83rem", color: TEXT_PRIMARY, fontWeight: 500 }}>{label}</span>
      </div>

      {/* Clock */}
      <div style={{ fontFamily: fontMono, fontSize: "0.75rem", color: TEXT_SECONDARY, letterSpacing: "0.06em" }}>
        {time.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <IconButton onClick={() => setSearchOpen(!searchOpen)} icon={Search} />
        <IconButton onClick={() => onNavigate("notifications")} icon={Bell} badge={3} />
        <IconButton onClick={() => {}} icon={Settings} />

        {/* Avatar */}
        <div style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{
            width: 32, height: 32, background: `${GOLD}20`, border: `1px solid ${GOLD}40`,
            display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
          }}>
            <span style={{ fontFamily: fontMono, fontSize: "0.7rem", color: GOLD }}>JW</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, onClick, badge }: { icon: any; onClick: () => void; badge?: number }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? `${GOLD}10` : "transparent",
        border: "none", cursor: "pointer",
        width: 36, height: 36, borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: h ? GOLD : TEXT_SECONDARY, transition: "all 0.18s",
        position: "relative",
      }}
    >
      <Icon size={16} />
      {badge && (
        <div style={{
          position: "absolute", top: 6, right: 6, width: 7, height: 7,
          background: GOLD, borderRadius: "50%", border: `1.5px solid ${SURFACE}`,
        }} />
      )}
    </button>
  );
}

// ─── Page transition wrapper ───────────────────────────────────────────────────

function PageWrapper({ children, pageKey }: { children: React.ReactNode; pageKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{ minHeight: "100%", fontFamily: fontBody }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Page Header ───────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div>
        <h1 style={{ fontFamily: fontHeading, fontSize: "1.5rem", fontWeight: 600, color: TEXT_PRIMARY, letterSpacing: "-0.01em", marginBottom: 4 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "0.84rem", color: TEXT_SECONDARY }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────────────────────

function KPICard({ label, value, delta, icon: Icon, up, delay = 0 }: {
  label: string; value: string; delta?: string; icon: any; up?: boolean; delay?: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? ELEVATED : CARD, border: `1px solid ${hovered ? GOLD + "30" : BORDER}`,
        padding: "24px", cursor: "default",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 8px 32px ${GOLD}10` : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <span style={{ fontFamily: fontMono, fontSize: "0.65rem", color: TEXT_SECONDARY, letterSpacing: "0.12em" }}>{label.toUpperCase()}</span>
        <div style={{ color: hovered ? GOLD : TEXT_SECONDARY, transition: "color 0.2s" }}>
          <Icon size={16} />
        </div>
      </div>
      <div style={{ fontFamily: fontMono, fontSize: "2rem", color: TEXT_PRIMARY, fontWeight: 500, marginBottom: 8 }}>{value}</div>
      {delta && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {up !== undefined && (up ? <TrendingUp size={12} color={SUCCESS} /> : <TrendingDown size={12} color={DANGER} />)}
          <span style={{ fontFamily: fontMono, fontSize: "0.7rem", color: up ? SUCCESS : DANGER }}>{delta}</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <PageWrapper pageKey="dashboard">
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="Dashboard"
          subtitle="System overview — Jul 12, 2025"
          actions={
            <>
              <GoldButton variant="outline" small><RefreshCw size={13} /> Refresh</GoldButton>
              <GoldButton small><Plus size={13} /> New Asset</GoldButton>
            </>
          }
        />

        {/* KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }} className="max-xl:grid-cols-2 max-sm:grid-cols-1">
          <KPICard label="Total Assets" value="2,847" delta="+38 this month" icon={Package} up delay={0} />
          <KPICard label="Active Allocations" value="312" delta="+8 this month" icon={ArrowRightLeft} up delay={0.07} />
          <KPICard label="In Maintenance" value="24" delta="+3 this week" icon={Wrench} up={false} delay={0.14} />
          <KPICard label="Asset Utilization" value="87.4%" delta="+2.1% vs last month" icon={TrendingUp} up delay={0.21} />
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="max-lg:grid-cols-1">
          {/* Area chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: fontHeading, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 4 }}>Asset Growth</div>
                <div style={{ fontFamily: fontMono, fontSize: "0.68rem", color: TEXT_SECONDARY }}>Last 7 months</div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[{ label: "Assets", color: GOLD }, { label: "Allocations", color: SUCCESS }, { label: "Maintenance", color: WARNING }].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 2, background: l.color, borderRadius: 1 }} />
                    <span style={{ fontFamily: fontMono, fontSize: "0.65rem", color: TEXT_SECONDARY }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAlloc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SUCCESS} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={SUCCESS} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="month" tick={{ fill: TEXT_SECONDARY, fontSize: 11, fontFamily: fontMono }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: TEXT_SECONDARY, fontSize: 11, fontFamily: fontMono }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: ELEVATED, border: `1px solid ${BORDER}`, color: TEXT_PRIMARY, fontFamily: fontMono, fontSize: 12 }} />
                <Area type="monotone" dataKey="assets" stroke={GOLD} strokeWidth={2} fill="url(#gAssets)" dot={false} />
                <Area type="monotone" dataKey="allocations" stroke={SUCCESS} strokeWidth={1.5} fill="url(#gAlloc)" dot={false} />
                <Line type="monotone" dataKey="maintenance" stroke={WARNING} strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "24px" }}
          >
            <div style={{ fontFamily: fontHeading, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 4 }}>Assets by Department</div>
            <div style={{ fontFamily: fontMono, fontSize: "0.68rem", color: TEXT_SECONDARY, marginBottom: 20 }}>Distribution</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={2} dataKey="value">
                  {deptData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: ELEVATED, border: `1px solid ${BORDER}`, color: TEXT_PRIMARY, fontFamily: fontMono, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {deptData.map((d, i) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i] }} />
                    <span style={{ fontFamily: fontBody, fontSize: "0.78rem", color: TEXT_SECONDARY }}>{d.name}</span>
                  </div>
                  <span style={{ fontFamily: fontMono, fontSize: "0.75rem", color: TEXT_PRIMARY }}>{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="max-lg:grid-cols-1">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "24px" }}
          >
            <div style={{ fontFamily: fontHeading, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 20 }}>Recent Activity</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {mockActivityLogs.slice(0, 5).map((log, i) => (
                <div key={log.id} style={{ display: "flex", gap: 14, paddingBlock: 12, borderBottom: i < 4 ? `1px solid ${BORDER}` : "none" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: log.type === "create" ? `${SUCCESS}20` : log.type === "alert" ? `${DANGER}20` : `${GOLD}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: log.type === "create" ? SUCCESS : log.type === "alert" ? DANGER : GOLD,
                  }}>
                    {log.type === "create" ? <Plus size={12} /> : log.type === "alert" ? <AlertTriangle size={12} /> : <Activity size={12} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.83rem", color: TEXT_PRIMARY }}>{log.action}</div>
                    <div style={{ fontSize: "0.75rem", color: TEXT_SECONDARY, marginTop: 2 }}>{log.target}</div>
                  </div>
                  <div style={{ fontFamily: fontMono, fontSize: "0.65rem", color: TEXT_SECONDARY, flexShrink: 0, alignSelf: "flex-start", marginTop: 2 }}>
                    {log.timestamp.split(" ")[1]}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "24px" }}
          >
            <div style={{ fontFamily: fontHeading, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 20 }}>Upcoming Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Maintenance due", count: 7, icon: Wrench, color: WARNING, urgency: "This week" },
                { label: "Allocations expiring", count: 12, icon: Clock, color: GOLD, urgency: "Next 30 days" },
                { label: "Audit scheduled", count: 2, icon: ClipboardList, color: SUCCESS, urgency: "This month" },
                { label: "Transfers pending", count: 5, icon: ArrowRightLeft, color: TEXT_SECONDARY, urgency: "Awaiting approval" },
              ].map(item => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                  background: ELEVATED, border: `1px solid ${BORDER}`, borderRadius: 4,
                }}>
                  <div style={{ color: item.color }}><item.icon size={15} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.83rem", color: TEXT_PRIMARY }}>{item.label}</div>
                    <div style={{ fontSize: "0.72rem", color: TEXT_SECONDARY, marginTop: 1 }}>{item.urgency}</div>
                  </div>
                  <div style={{ fontFamily: fontMono, fontSize: "1rem", color: item.color, fontWeight: 500 }}>{item.count}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Generic Table Page ────────────────────────────────────────────────────────

function AssetsPage() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = mockAssets.filter(a =>
    [a.name, a.category, a.department, a.assignedTo, a.id].some(f => f.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const cols = [
    { key: "id", label: "Asset ID" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "department", label: "Department" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "status", label: "Status" },
    { key: "value", label: "Value" },
  ];

  return (
    <PageWrapper pageKey="assets">
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="Assets"
          subtitle={`${mockAssets.length} total assets across all departments`}
          actions={
            <>
              <GoldButton variant="outline" small><Upload size={13} /> Import</GoldButton>
              <GoldButton variant="outline" small><Download size={13} /> Export</GoldButton>
              <GoldButton small><Plus size={13} /> Add Asset</GoldButton>
            </>
          }
        />

        {/* Toolbar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          <SearchInput placeholder="Search assets..." value={search} onChange={setSearch} />
          <GoldButton variant="outline" small><Filter size={13} /> Filters</GoldButton>
          {selected.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
              <GoldButton variant="ghost" small><Trash2 size={13} /> Delete ({selected.length})</GoldButton>
              <GoldButton variant="outline" small><Archive size={13} /> Archive</GoldButton>
            </motion.div>
          )}
        </div>

        {/* Table */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <th style={{ padding: "12px 16px", width: 40 }}>
                    <input type="checkbox" onChange={e => setSelected(e.target.checked ? paginated.map(a => a.id) : [])} style={{ accentColor: GOLD }} />
                  </th>
                  {cols.map(col => (
                    <th key={col.key}
                      onClick={() => { setSortField(col.key); setSortDir(sortField === col.key && sortDir === "asc" ? "desc" : "asc"); }}
                      style={{
                        padding: "12px 16px", textAlign: "left", fontFamily: fontMono,
                        fontSize: "0.65rem", color: TEXT_SECONDARY, letterSpacing: "0.1em",
                        cursor: "pointer", whiteSpace: "nowrap", userSelect: "none",
                        background: sortField === col.key ? `${GOLD}08` : "transparent",
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {col.label.toUpperCase()}
                        {sortField === col.key && (sortDir === "asc" ? <ChevronUp size={10} color={GOLD} /> : <ChevronDown size={10} color={GOLD} />)}
                      </div>
                    </th>
                  ))}
                  <th style={{ padding: "12px 16px", fontFamily: fontMono, fontSize: "0.65rem", color: TEXT_SECONDARY, letterSpacing: "0.1em" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((asset, i) => (
                  <TableRow key={asset.id} asset={asset} i={i} selected={selected.includes(asset.id)} onSelect={() => setSelected(s => s.includes(asset.id) ? s.filter(x => x !== asset.id) : [...s, asset.id])} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: fontMono, fontSize: "0.7rem", color: TEXT_SECONDARY }}>
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: Math.ceil(filtered.length / perPage) }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{
                  width: 28, height: 28, background: page === i + 1 ? GOLD : "transparent",
                  color: page === i + 1 ? "#090909" : TEXT_SECONDARY,
                  border: `1px solid ${page === i + 1 ? GOLD : BORDER}`,
                  cursor: "pointer", fontFamily: fontMono, fontSize: "0.72rem", borderRadius: 4,
                }}>{i + 1}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function TableRow({ asset, i, selected, onSelect }: { asset: typeof mockAssets[0]; i: number; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: selected ? `${GOLD}08` : hovered ? `${GOLD}05` : "transparent", borderBottom: `1px solid ${BORDER}`, transition: "background 0.15s" }}
    >
      <td style={{ padding: "14px 16px" }}>
        <input type="checkbox" checked={selected} onChange={onSelect} style={{ accentColor: GOLD }} />
      </td>
      <td style={{ padding: "14px 16px", fontFamily: fontMono, fontSize: "0.72rem", color: GOLD }}>{asset.id}</td>
      <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.85rem", color: TEXT_PRIMARY, fontWeight: 500 }}>{asset.name}</td>
      <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.82rem", color: TEXT_SECONDARY }}>{asset.category}</td>
      <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.82rem", color: TEXT_SECONDARY }}>{asset.department}</td>
      <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.82rem", color: TEXT_SECONDARY }}>{asset.assignedTo}</td>
      <td style={{ padding: "14px 16px" }}><StatusBadge status={asset.status} /></td>
      <td style={{ padding: "14px 16px", fontFamily: fontMono, fontSize: "0.82rem", color: TEXT_PRIMARY }}>${asset.value.toLocaleString()}</td>
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <ActionButton icon={Eye} />
          <ActionButton icon={Edit2} />
          <ActionButton icon={Trash2} danger />
        </div>
      </td>
    </motion.tr>
  );
}

function ActionButton({ icon: Icon, danger = false, onClick }: { icon: any; danger?: boolean; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? (danger ? `${DANGER}20` : `${GOLD}12`) : "transparent",
      border: `1px solid ${h ? (danger ? DANGER : GOLD) : BORDER}`,
      cursor: "pointer", width: 28, height: 28, borderRadius: 4,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: h ? (danger ? DANGER : GOLD) : TEXT_SECONDARY, transition: "all 0.15s",
    }}>
      <Icon size={12} />
    </button>
  );
}

// ─── Departments Page ──────────────────────────────────────────────────────────

function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockDepartments.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageWrapper pageKey="departments">
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="Departments"
          subtitle={`${mockDepartments.length} departments configured`}
          actions={<GoldButton small><Plus size={13} /> New Department</GoldButton>}
        />

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <SearchInput placeholder="Search departments..." value={search} onChange={setSearch} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="max-lg:grid-cols-2 max-sm:grid-cols-1">
          {filtered.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{
                background: CARD, border: `1px solid ${BORDER}`, padding: "24px",
                cursor: "pointer", transition: "all 0.2s",
              }}
              whileHover={{ borderColor: `${GOLD}40`, translateY: -2, boxShadow: `0 8px 32px ${GOLD}0a` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={16} color={GOLD} />
                </div>
                <StatusBadge status={dept.status} />
              </div>
              <div style={{ fontFamily: fontHeading, fontWeight: 600, color: TEXT_PRIMARY, fontSize: "1rem", marginBottom: 4 }}>{dept.name}</div>
              <div style={{ fontFamily: fontBody, fontSize: "0.8rem", color: TEXT_SECONDARY, marginBottom: 20 }}>{dept.head}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { label: "Employees", value: dept.employees },
                  { label: "Assets", value: dept.assets },
                  { label: "Budget", value: `$${(dept.budget / 1000).toFixed(0)}k` },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: fontMono, fontSize: "1rem", color: TEXT_PRIMARY, fontWeight: 500 }}>{s.value}</div>
                    <div style={{ fontFamily: fontMono, fontSize: "0.6rem", color: TEXT_SECONDARY, letterSpacing: "0.08em" }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Employees Page ────────────────────────────────────────────────────────────

function EmployeesPage() {
  const [search, setSearch] = useState("");
  const filtered = mockEmployees.filter(e => [e.name, e.email, e.department, e.role].some(f => f.toLowerCase().includes(search.toLowerCase())));

  return (
    <PageWrapper pageKey="employees">
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="Employees"
          subtitle={`${mockEmployees.length} employees on record`}
          actions={<GoldButton small><Plus size={13} /> Add Employee</GoldButton>}
        />
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <SearchInput placeholder="Search employees..." value={search} onChange={setSearch} />
          <GoldButton variant="outline" small><Filter size={13} /> Filter</GoldButton>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["EMP ID", "NAME", "EMAIL", "DEPARTMENT", "ROLE", "LOCATION", "STATUS", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: fontMono, fontSize: "0.62rem", color: TEXT_SECONDARY, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => {
                const [hovered, setHovered] = useState(false);
                return (
                  <motion.tr key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
                    style={{ borderBottom: `1px solid ${BORDER}`, background: hovered ? `${GOLD}05` : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "14px 16px", fontFamily: fontMono, fontSize: "0.72rem", color: GOLD }}>{emp.id}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${GOLD}15`, border: `1px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontMono, fontSize: "0.65rem", color: GOLD, flexShrink: 0 }}>
                          {emp.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span style={{ fontFamily: fontBody, fontSize: "0.85rem", color: TEXT_PRIMARY, fontWeight: 500 }}>{emp.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.8rem", color: TEXT_SECONDARY }}>{emp.email}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.82rem", color: TEXT_SECONDARY }}>{emp.department}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.82rem", color: TEXT_SECONDARY }}>{emp.role}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.82rem", color: TEXT_SECONDARY }}>{emp.location}</td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={emp.status} /></td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <ActionButton icon={Eye} />
                        <ActionButton icon={Edit2} />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Allocations Page ──────────────────────────────────────────────────────────

function AllocationsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <PageWrapper pageKey="allocations">
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="Allocation"
          subtitle="Manage asset-to-employee assignments"
          actions={<GoldButton small onClick={() => setShowForm(true)}><Plus size={13} /> New Allocation</GoldButton>}
        />

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }} className="max-xl:grid-cols-2">
          {[
            { label: "Active", value: "312", color: SUCCESS },
            { label: "Expired", value: "18", color: DANGER },
            { label: "Expiring Soon", value: "24", color: WARNING },
            { label: "Pending Approval", value: "7", color: GOLD },
          ].map(s => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "18px 20px" }}>
              <div style={{ fontFamily: fontMono, fontSize: "0.62rem", color: TEXT_SECONDARY, letterSpacing: "0.1em", marginBottom: 8 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontFamily: fontMono, fontSize: "1.6rem", color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["ALLOC ID", "ASSET", "EMPLOYEE", "DEPARTMENT", "START DATE", "END DATE", "STATUS", "ACTIONS"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: fontMono, fontSize: "0.62rem", color: TEXT_SECONDARY, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockAllocations.map((a, i) => {
                const [h, setH] = useState(false);
                return (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                    onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
                    style={{ borderBottom: `1px solid ${BORDER}`, background: h ? `${GOLD}05` : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "14px 16px", fontFamily: fontMono, fontSize: "0.72rem", color: GOLD }}>{a.id}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.85rem", color: TEXT_PRIMARY }}>{a.asset}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.83rem", color: TEXT_SECONDARY }}>{a.employee}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.83rem", color: TEXT_SECONDARY }}>{a.department}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontMono, fontSize: "0.75rem", color: TEXT_SECONDARY }}>{a.date}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontMono, fontSize: "0.75rem", color: TEXT_SECONDARY }}>{a.returnDate}</td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={a.status} /></td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <ActionButton icon={Eye} />
                        <ActionButton icon={Edit2} />
                        <ActionButton icon={Trash2} danger />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <AllocationModal onClose={() => setShowForm(false)} />
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}

function AllocationModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ background: CARD, border: `1px solid ${BORDER}`, width: "100%", maxWidth: 520, padding: "32px", boxShadow: `0 32px 80px rgba(0,0,0,0.5)` }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontFamily: fontHeading, fontSize: "1.1rem", fontWeight: 600, color: TEXT_PRIMARY }}>New Allocation</h2>
            <p style={{ fontFamily: fontBody, fontSize: "0.8rem", color: TEXT_SECONDARY, marginTop: 4 }}>Assign an asset to an employee</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_SECONDARY }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {["Asset", "Employee", "Department", "Return Date"].map(field => (
            <div key={field}>
              <label style={{ fontFamily: fontMono, fontSize: "0.65rem", color: TEXT_SECONDARY, letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>{field.toUpperCase()}</label>
              <input placeholder={`Select ${field.toLowerCase()}`} style={{
                width: "100%", background: ELEVATED, border: `1px solid ${BORDER}`,
                color: TEXT_PRIMARY, fontFamily: fontBody, fontSize: "0.85rem",
                padding: "10px 14px", outline: "none", borderRadius: 4,
              }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
          <GoldButton variant="outline" onClick={onClose}>Cancel</GoldButton>
          <GoldButton>Confirm Allocation</GoldButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Generic simple pages ──────────────────────────────────────────────────────

function SimplePlaceholderPage({ title, subtitle, pageKey, icon: Icon }: { title: string; subtitle: string; pageKey: string; icon: any }) {
  return (
    <PageWrapper pageKey={pageKey}>
      <div style={{ padding: "32px" }}>
        <PageHeader title={title} subtitle={subtitle} actions={<GoldButton small><Plus size={13} /> New {title.split(" ")[0]}</GoldButton>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }} className="max-lg:grid-cols-1">
          {[0, 1, 2].map(i => (
            <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "24px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Skeleton h={14} w="60%" />
              <Skeleton h={32} w="40%" />
              <Skeleton h={12} w="80%" />
            </div>
          ))}
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={24} color={TEXT_SECONDARY} />
          </div>
          <div style={{ fontFamily: fontHeading, fontSize: "1rem", color: TEXT_PRIMARY }}>No records yet</div>
          <div style={{ fontFamily: fontBody, fontSize: "0.84rem", color: TEXT_SECONDARY, maxWidth: 320, textAlign: "center" }}>
            {subtitle}. Click the button above to get started.
          </div>
          <GoldButton><Plus size={14} /> Create First Record</GoldButton>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Reports Page ─────────────────────────────────────────────────────────────

function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"utilization" | "financial" | "maintenance">("utilization");

  return (
    <PageWrapper pageKey="reports">
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="Reports & Analytics"
          subtitle="Enterprise asset intelligence"
          actions={
            <>
              <GoldButton variant="outline" small><Download size={13} /> Export PDF</GoldButton>
              <GoldButton variant="outline" small><Download size={13} /> Export CSV</GoldButton>
            </>
          }
        />

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }} className="max-xl:grid-cols-2">
          {reportKPIs.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "20px 24px" }}>
              <div style={{ fontFamily: fontMono, fontSize: "0.62rem", color: TEXT_SECONDARY, letterSpacing: "0.1em", marginBottom: 10 }}>{kpi.label.toUpperCase()}</div>
              <div style={{ fontFamily: fontMono, fontSize: "1.5rem", color: TEXT_PRIMARY, marginBottom: 6 }}>{kpi.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {kpi.up ? <ArrowUpRight size={12} color={SUCCESS} /> : <ArrowDownRight size={12} color={DANGER} />}
                <span style={{ fontFamily: fontMono, fontSize: "0.7rem", color: kpi.up ? SUCCESS : DANGER }}>{kpi.delta}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `1px solid ${BORDER}`, paddingBottom: 0 }}>
          {(["utilization", "financial", "maintenance"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "10px 20px",
              fontFamily: fontBody, fontSize: "0.85rem", fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? GOLD : TEXT_SECONDARY,
              borderBottom: `2px solid ${activeTab === tab ? GOLD : "transparent"}`,
              transition: "all 0.2s", textTransform: "capitalize",
            }}>{tab}</button>
          ))}
        </div>

        {/* Chart */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "24px" }}>
          <div style={{ fontFamily: fontHeading, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 4 }}>
            {activeTab === "utilization" ? "Asset Utilization Rate" : activeTab === "financial" ? "Financial Overview" : "Maintenance Trends"}
          </div>
          <div style={{ fontFamily: fontMono, fontSize: "0.68rem", color: TEXT_SECONDARY, marginBottom: 24 }}>January – July 2025</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={areaData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="month" tick={{ fill: TEXT_SECONDARY, fontSize: 11, fontFamily: fontMono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT_SECONDARY, fontSize: 11, fontFamily: fontMono }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: ELEVATED, border: `1px solid ${BORDER}`, color: TEXT_PRIMARY, fontFamily: fontMono, fontSize: 12 }} />
              <Bar dataKey={activeTab === "maintenance" ? "maintenance" : "assets"} fill={GOLD} radius={[2, 2, 0, 0]} opacity={0.85} />
              <Bar dataKey="allocations" fill={SUCCESS} radius={[2, 2, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

// ─── Notifications Page ───────────────────────────────────────────────────────

function NotificationsPage() {
  const [items, setItems] = useState(mockNotifications);
  const icons: Record<string, any> = { warning: AlertTriangle, success: CheckCircle2, info: Info, danger: AlertCircle };
  const colors: Record<string, string> = { warning: WARNING, success: SUCCESS, info: GOLD, danger: DANGER };

  return (
    <PageWrapper pageKey="notifications">
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="Notifications"
          subtitle={`${items.filter(n => !n.read).length} unread`}
          actions={
            <GoldButton variant="ghost" small onClick={() => setItems(items.map(n => ({ ...n, read: true })))}>
              <Check size={13} /> Mark all read
            </GoldButton>
          }
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((notif, i) => {
            const IconComp = icons[notif.type];
            const color = colors[notif.type];
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{
                  background: notif.read ? CARD : ELEVATED, border: `1px solid ${notif.read ? BORDER : color + "30"}`,
                  padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                <div style={{ width: 36, height: 36, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconComp size={16} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: fontBody, fontWeight: notif.read ? 400 : 600, fontSize: "0.88rem", color: TEXT_PRIMARY, marginBottom: 4 }}>{notif.title}</div>
                      <div style={{ fontFamily: fontBody, fontSize: "0.82rem", color: TEXT_SECONDARY, lineHeight: 1.5 }}>{notif.message}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      {!notif.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />}
                      <span style={{ fontFamily: fontMono, fontSize: "0.68rem", color: TEXT_SECONDARY, whiteSpace: "nowrap" }}>{notif.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Activity Logs Page ───────────────────────────────────────────────────────

function ActivityLogsPage() {
  const typeColors: Record<string, string> = { create: SUCCESS, update: GOLD, export: TEXT_SECONDARY, alert: DANGER, view: TEXT_SECONDARY };
  const typeIcons: Record<string, any> = { create: Plus, update: Edit2, export: Download, alert: AlertTriangle, view: Eye };

  return (
    <PageWrapper pageKey="activity-logs">
      <div style={{ padding: "32px" }}>
        <PageHeader
          title="Activity Logs"
          subtitle="Complete audit trail of all system events"
          actions={
            <>
              <GoldButton variant="outline" small><Filter size={13} /> Filter</GoldButton>
              <GoldButton variant="outline" small><Download size={13} /> Export</GoldButton>
            </>
          }
        />

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["TYPE", "USER", "ACTION", "TARGET", "IP ADDRESS", "TIMESTAMP"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: fontMono, fontSize: "0.62rem", color: TEXT_SECONDARY, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockActivityLogs.map((log, i) => {
                const [h, setH] = useState(false);
                const IconComp = typeIcons[log.type] || Activity;
                const color = typeColors[log.type] || TEXT_SECONDARY;
                return (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
                    style={{ borderBottom: `1px solid ${BORDER}`, background: h ? `${GOLD}04` : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ width: 28, height: 28, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
                        <IconComp size={12} color={color} />
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.84rem", color: TEXT_PRIMARY, fontWeight: 500 }}>{log.user}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.83rem", color: TEXT_SECONDARY }}>{log.action}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontBody, fontSize: "0.82rem", color: TEXT_SECONDARY, maxWidth: 200 }}>{log.target}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontMono, fontSize: "0.72rem", color: TEXT_SECONDARY }}>{log.ip}</td>
                    <td style={{ padding: "14px 16px", fontFamily: fontMono, fontSize: "0.72rem", color: TEXT_SECONDARY, whiteSpace: "nowrap" }}>{log.timestamp}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── App Shell ─────────────────────────────────────────────────────────────────

function AppShell() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <DashboardPage />;
      case "assets": return <AssetsPage />;
      case "departments": return <DepartmentsPage />;
      case "employees": return <EmployeesPage />;
      case "allocations": return <AllocationsPage />;
      case "reports": return <ReportsPage />;
      case "notifications": return <NotificationsPage />;
      case "activity-logs": return <ActivityLogsPage />;
      case "categories": return <SimplePlaceholderPage title="Categories" subtitle="Manage asset categories and classification hierarchy" pageKey="categories" icon={Tag} />;
      case "locations": return <SimplePlaceholderPage title="Locations" subtitle="Track physical locations and site configurations" pageKey="locations" icon={MapPin} />;
      case "transfers": return <SimplePlaceholderPage title="Transfers" subtitle="Manage inter-department asset transfers" pageKey="transfers" icon={Send} />;
      case "bookings": return <SimplePlaceholderPage title="Bookings" subtitle="Reserve shared assets and schedule usage" pageKey="bookings" icon={Calendar} />;
      case "maintenance": return <SimplePlaceholderPage title="Maintenance" subtitle="Schedule and track asset maintenance activities" pageKey="maintenance" icon={Wrench} />;
      case "audits": return <SimplePlaceholderPage title="Audits" subtitle="Conduct and record asset verification audits" pageKey="audits" icon={ClipboardList} />;
      default: return <DashboardPage />;
    }
  };

  const sidebarWidth = sidebarCollapsed ? 64 : 228;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: fontBody }}>
      <Sidebar current={currentPage} onNavigate={setCurrentPage} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, marginLeft: sidebarWidth, transition: "margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Topbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

type AppState = "loading" | "login" | "app";

export default function App() {
  const [state, setState] = useState<AppState>("loading");

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { background: ${BG}; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: ${GOLD}50; }
        input::placeholder { color: ${TEXT_SECONDARY}; opacity: 0.5; }
        input[type="checkbox"] { width: 14px; height: 14px; cursor: pointer; }
      `}</style>

      <AnimatePresence mode="wait">
        {state === "loading" && (
          <Preloader key="loader" onDone={() => setState("login")} />
        )}
        {state === "login" && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }} transition={{ duration: 0.5 }}>
            <LoginPage onLogin={() => setState("app")} />
          </motion.div>
        )}
        {state === "app" && (
          <motion.div key="app" initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.6 }} style={{ width: "100%" }}>
            <AppShell />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

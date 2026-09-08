import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Map,
  StickyNote,
  CheckSquare,
  LayoutPanelLeft,
  Sparkles,
  Database,
  Palette,
  GraduationCap,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
} from "lucide-react";
import { navigation, navGroups } from "../data/navigation";
import { useAuth } from "../context/AuthContext";

const iconMap = {
  LayoutDashboard,
  FolderKanban,
  Map,
  StickyNote,
  CheckSquare,
  LayoutPanelLeft,
  Sparkles,
  Database,
  Palette,
  GraduationCap,
  Bot,
  Settings,
};

function groupItems(group) {
  return navigation.filter((n) => n.group === group);
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const breadcrumbMap = {
    "": "Dasbor",
    "projects": "Proyek",
    "planning": "Perencanaan",
    "pages": "Halaman",
    "features": "Fitur",
    "database": "Basis Data",
    "design": "Desain",
    "notes": "Catatan",
    "tasks": "Tugas",
    "learning": "Pembelajaran",
    "prompts": "AI / OpenCode",
    "settings": "Pengaturan",
  };
  const breadcrumb = location.pathname
    .replace("/admin", "")
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean)
    .map((s) => breadcrumbMap[s] || s.charAt(0).toUpperCase() + s.slice(1))
    .join(" / ") || "Dasbor";

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="topbar-menu-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Alihkan navigasi"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <span className="topbar-brand">DepnexProject</span>
          <span className="topbar-badge">PRIBADI</span>
          <span style={{ width:1, height:16, background:"var(--border)", margin:"0 4px" }} aria-hidden />
          <span style={{ fontSize:12, color:"var(--text-faint)", fontWeight:500, letterSpacing:"0.02em" }}>{breadcrumb}</span>
        </div>
        <div className="topbar-right">
          <button className="btn-ghost sm" aria-label="Cari" style={{ padding:"6px 8px", borderColor:"transparent", background:"transparent" }}>
            <Search size={14} />
          </button>
          <button className="btn-ghost sm" aria-label="Notifikasi" style={{ padding:"6px 8px", borderColor:"transparent", background:"transparent" }}>
            <Bell size={14} />
          </button>
          <div className="topbar-profile">
            <span className="topbar-email">{user?.email}</span>
            <span className="topbar-role">Ruang Kerja Pribadi</span>
          </div>
          <div className="topbar-avatar" aria-hidden>
            {(user?.email?.[0] || "W").toUpperCase()}
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`} aria-label="Sidebar">
          <div style={{ padding:"4px 6px 12px", display:"grid", gap:2 }}>
            <div style={{ fontSize:11, letterSpacing:"0.12em", fontWeight:700, color:"var(--text-faint)", padding:"4px 10px" }}>DepnexProject</div>
            <div style={{ fontSize:11, color:"var(--text-faint)", padding:"0 10px", lineHeight:1.4 }}>Pusat kendali<br/>dev pribadi</div>
          </div>

          <nav className="sidebar-nav" aria-label="Primary">
            {navGroups.map((group) => (
              <div key={group} style={{ display:"grid", gap:2, marginBottom:4 }}>
                <div className="sidebar-section-label">{group}</div>
                {groupItems(group).map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path === "/" ? "/admin" : `/admin${item.path}`}
                      end={item.path === "/"}
                      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                      onClick={() => setMobileOpen(false)}
                    >
                      {Icon && <Icon size={16} className="nav-icon" aria-hidden />}
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          <div style={{ marginTop:12, display:"grid", gap:2 }}>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={() => setMobileOpen(false)}
            >
              <Settings size={16} className="nav-icon" aria-hidden />
              <span>Pengaturan</span>
            </NavLink>
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <small className="sidebar-user-email" title={user?.email}>
                {user?.email}
              </small>
              <small className="sidebar-user-role">Pengembang tunggal</small>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </aside>

        {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-hidden />}

        <main className="app-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

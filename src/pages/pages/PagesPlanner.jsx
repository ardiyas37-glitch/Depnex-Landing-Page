import { useState } from "react";
import { LayoutPanelLeft, Network, FileText, ClipboardList, RotateCcw } from "lucide-react";
import { usePages } from "../../hooks/usePages";
import SitemapTab from "../../components/pages/SitemapTab";
import PagePlanningTab from "../../components/pages/PagePlanningTab";
import PageRequirementsTab from "../../components/pages/PageRequirementsTab";

const TABS = [
  { id: "sitemap", label: "Peta Situs", icon: Network },
  { id: "planning", label: "Perencanaan Halaman", icon: FileText },
  { id: "requirements", label: "Persyaratan Halaman", icon: ClipboardList },
];

export default function PagesPlanner() {
  const [active, setActive] = useState("sitemap");
  const hook = usePages();

  if (!hook.loaded) {
    return <div className="page"><div className="auth-loading" style={{ minHeight: 200 }}><div className="spinner" /></div></div>;
  }

  const { pages, requirements, stats, reset } = hook;

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <LayoutPanelLeft size={20} /> Halaman
            <span className="badge" style={{ textTransform: "none", letterSpacing: 0 }}>FASE 04</span>
          </h1>
          <p style={{ maxWidth: 600 }}>
            Struktur halaman sebelum pengembangan — peta situs sebagai sumber kebenaran, lalu rincian perencanaan & persyaratan per halaman.
          </p>
        </div>
        <button className="btn-ghost sm" onClick={() => { if (confirm("Apakah kamu yakin ingin menghapus semua halaman? Tindakan ini tidak dapat dibatalkan.")) reset(); }} type="button"><RotateCcw size={14} /> Atur Ulang</button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="stat"><span className="stat-val">{stats.total}</span><span className="stat-label">Total Halaman</span></div>
        <div className="stat"><span className="stat-val">{stats.totalReqs}</span><span className="stat-label">Persyaratan · {stats.doneReqs} selesai</span></div>
        <div className="stat"><span className="stat-val">{stats.coverage}%</span><span className="stat-label">Halaman dengan Blok</span></div>
      </div>

      <div className="planning-tabs" role="tablist" style={{ marginBottom: 16 }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} role="tab" aria-selected={isActive} onClick={() => setActive(t.id)} className={`planning-tab ${isActive ? "planning-tab--active" : ""}`} type="button">
              <Icon size={16} /> {t.label}
              {t.id === "sitemap" && <span className="planning-tab-count">{pages.length}</span>}
              {t.id === "requirements" && <span className="planning-tab-count">{requirements.length}</span>}
              {t.id === "planning" && <span className="planning-tab-count">{pages.filter((p)=>p.blocks?.length).length}/{pages.length}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 8 }}>
        {active === "sitemap" && <SitemapTab pages={pages} addPage={hook.addPage} updatePage={hook.updatePage} removePage={hook.removePage} duplicatePage={hook.duplicatePage} movePage={hook.movePage} />}
        {active === "planning" && <PagePlanningTab pages={pages} updatePage={hook.updatePage} addBlock={hook.addBlock} updateBlock={hook.updateBlock} removeBlock={hook.removeBlock} />}
        {active === "requirements" && <PageRequirementsTab pages={pages} requirements={requirements} addRequirement={hook.addRequirement} updateRequirement={hook.updateRequirement} removeRequirement={hook.removeRequirement} />}
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>
        Simpan otomatis aktif · kunci: <code>{hook.STORAGE_KEY}</code> · terhubung ke <a href="#/admin/planning" style={{ color: "var(--text-muted)" }}>bagian Perencanaan</a>
      </p>
    </div>
  );
}
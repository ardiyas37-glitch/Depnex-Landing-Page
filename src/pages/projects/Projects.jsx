import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Plus, Search, RotateCcw, TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useProjects, STATUS_OPTIONS } from "../../hooks/useProjects";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectForm from "../../components/projects/ProjectForm";

export default function Proyek() {
  const { projects, createProject, removeProject, duplicateProject, stats, reset } = useProjects();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = query.toLowerCase();
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [projects, query, statusFilter]);

  function handleHapus(id) {
    if (confirm("Hapus project ini?")) removeProject(id);
  }

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FolderKanban size={20} /> Proyek
            <span className="badge" style={{ textTransform: "none", letterSpacing: 0 }}>PHASE 03</span>
          </h1>
          <p>Kelola semua proyek website — status & kemajuan terpusat. Klik kartu untuk masuk ke Ruang Kerja Proyek.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost sm" onClick={() => { if (confirm("Hapus semua proyek?")) reset(); }} type="button"><RotateCcw size={14} /> Bersihkan</button>
          <button className="btn-primary" onClick={() => setShowForm(true)} type="button"><Plus size={14} /> Buat Proyek</button>
        </div>
      </div>

       {/* Stats */}
      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card" style={{ display: "flex", gap: 12, alignItems: "center", padding:"14px 16px" }}>
          <span className="stat-icon"><FolderKanban size={16} /></span>
          <div><div style={{ fontWeight: 700, fontSize: 18, color:"var(--text)" }}>{stats.total}</div><div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing:"0.06em", textTransform:"uppercase", fontWeight:600 }}>Total Proyek</div></div>
        </div>
        <div className="card" style={{ display: "flex", gap: 12, alignItems: "center", padding:"14px 16px" }}>
          <span className="stat-icon"><TrendingUp size={16} /></span>
          <div><div style={{ fontWeight: 700, fontSize: 18, color:"var(--text)" }}>{stats.avgProgress}%</div><div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing:"0.06em", textTransform:"uppercase", fontWeight:600 }}>Rata-rata Kemajuan</div></div>
        </div>
        <div className="card" style={{ display: "flex", gap: 12, alignItems: "center", padding:"14px 16px" }}>
          <span className="stat-icon">{stats.overdue ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}</span>
          <div><div style={{ fontWeight: 700, fontSize: 18, color:"var(--text)" }}>{stats.overdue ? `${stats.overdue} Terlambat` : `${stats.completed} Selesai`}</div><div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing:"0.06em", textTransform:"uppercase", fontWeight:600 }}>{stats.inProgress} sedang dikerjakan</div></div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 16, padding: 12 }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama, deskripsi, tipe..." style={{ paddingLeft: 34, width: "100%" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setStatusFilter("all")} className={`btn-ghost sm ${statusFilter === "all" ? "active-filter" : ""}`} type="button">Semua</button>
          {STATUS_OPTIONS.map((s) => (
            <button key={s.value} onClick={() => setStatusFilter(s.value)} className={`btn-ghost sm ${statusFilter === s.value ? "active-filter" : ""}`} type="button" style={{ borderColor: statusFilter === s.value ? s.color : undefined, color: statusFilter === s.value ? s.color : undefined }}>
              <span className="status-dot" style={{ background: s.color }} /> {s.label}
              <span style={{ fontSize: 11, opacity: 0.7 }}>({stats.byStatus[s.value] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FolderKanban size={18} /></div>
          <h3>Belum ada proyek</h3>
          <p>Buat proyek pertama kamu untuk mulai bekerja.</p>
          <button className="btn-primary sm" onClick={() => setShowForm(true)} type="button"><Plus size={14} /> Buat Proyek</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Clock size={18} /></div>
          <h3>Tidak ada hasil</h3>
          <p>Tidak ada proyek yang cocok dengan pencarian atau filter.</p>
          <button className="btn-ghost sm" onClick={() => { setStatusFilter("all"); setQuery(""); }} type="button">Atur Ulang Filter</button>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onHapus={handleHapus} onDuplicate={duplicateProject} />
          ))}
        </div>
      )}

      <p style={{ marginTop: 14, fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>
        Auto-save aktif · <Link to="/admin/planning" style={{ color: "var(--text-muted)" }}>Perencanaan</Link> terhubung via ruang kerja →
      </p>

      <ProjectForm open={showForm} onTutup={() => setShowForm(false)} onSubmit={(data) => createProject(data)} />
    </div>
  );
}
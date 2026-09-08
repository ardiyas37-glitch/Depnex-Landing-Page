import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Trash2, Edit3, ExternalLink, Map, StickyNote, CheckSquare, Layers, Sparkles } from "lucide-react";
import { useProjects, statusMeta } from "../../hooks/useProjects";
import ProjectStatus from "../../components/projects/ProjectStatus";
import ProjectProgress from "../../components/projects/ProjectProgress";
import ProjectForm from "../../components/projects/ProjectForm";

export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getById, updateProject, removeProject, duplicateProject } = useProjects();
  const project = getById(projectId);
  const [active, setActive] = useState("overview");
  const [editing, setEditing] = useState(false);

  if (!project) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center", padding: 36 }}>
          <h3>Proyek tidak ditemukan</h3>
          <p>ID: {projectId} — mungkin sudah dihapus atau belum tersync.</p>
          <Link to="/admin/projects" className="btn-primary" style={{ marginTop: 12, display: "inline-flex", textDecoration: "none" }}>Kembali ke Proyek</Link>
        </div>
      </div>
    );
  }

  const meta = statusMeta(project.status);

  const TABS = [
    { id: "overview", label: "Ringkasan", icon: Layers },
    { id: "status", label: "Status Proyek", icon: CheckSquare },
    { id: "progress", label: "Kemajuan Proyek", icon: TrendingIcon },
  ];

  function handleStatusChange(next) {
    updateProject(project.id, { status: next });
  }
  function handleProgressChange(next) {
    updateProject(project.id, { progress: next });
  }

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <Link to="/admin/projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 12 }}>
        <ArrowLeft size={14} /> Kembali ke Proyek
      </Link>

      {/* Header */}
      <div className="card" style={{ display: "grid", gap: 14, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontSize: 20, letterSpacing: "-0.02em" }}>{project.name}</h1>
              <span className="badge" style={{ background: meta.color, color: "#fff", borderColor: meta.color }}>{meta.label}</span>
              <span className="badge">{project.type}</span>
            </div>
            <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>{project.description || "— belum ada deskripsi —"}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
              <span>Teknologi: {project.stack}</span><span>•</span><span>Tim: {project.team}</span><span>•</span><span>Prioritas: {project.priority}</span>
              {project.deadline && <><span>•</span><span>Tenggat: {new Date(project.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span></>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn-ghost sm" onClick={() => setEditing(true)} type="button"><Edit3 size={14} /> Sunting</button>
            <button className="btn-ghost sm" onClick={() => { const dup = duplicateProject(project.id); if (dup) navigate(`/admin/projects/${dup.id}`); }} type="button"><Copy size={14} /> Gandakan</button>
            <button className="btn-ghost sm danger" onClick={() => { if (confirm("Hapus project ini?")) { removeProject(project.id); navigate("/admin/projects"); } }} type="button"><Trash2 size={14} /> Hapus</button>
          </div>
        </div>

        <div className="progress-track" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${project.progress}%`, background: meta.color }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="planning-tabs" role="tablist" style={{ marginBottom: 16 }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} role="tab" aria-selected={isActive} onClick={() => setActive(t.id)} className={`planning-tab ${isActive ? "planning-tab--active" : ""}`} type="button">
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {active === "overview" && (
        <div className="grid grid-2">
          <div className="card" style={{ display: "grid", gap: 12 }}>
            <h3 style={{ margin: 0 }}>Ruang Kerja Proyek</h3>
            <p>Ruang kerja terpusat untuk proyek ini — hubungkan Perencanaan, Halaman, Fitur, Tugas sebelum generate ke AI.</p>
            <div style={{ display: "grid", gap: 8 }}>
              <WorkspaceLink to="/admin/planning" icon={Map} title="Perencanaan" desc={`${project.progress}% progress → lanjutkan sections & requirements`} />
              <WorkspaceLink to="/admin/pages" icon={Layers} title="Halaman" desc="Atur sitemap & struktur halaman" />
              <WorkspaceLink to="/admin/features" icon={Sparkles} title="Fitur" desc="Kembalilog fitur & prioritas" />
              <WorkspaceLink to="/admin/tasks" icon={CheckSquare} title="Tugas" desc="Breakdown checklist ke task harian" />
              <WorkspaceLink to="/admin/notes" icon={StickyNote} title="Catatan" desc="Riset & referensi desain" />
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <ProjectStatus value={project.status} onChange={handleStatusChange} />
            <ProjectProgress progress={project.progress} onChange={handleProgressChange} />
            <div className="card" style={{ background: "var(--off-white)" }}>
              <strong style={{ fontSize: 13 }}>Info Cepat</strong>
              <div style={{ display: "grid", gap: 6, marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>
                <div>Dibuat: {new Date(project.createdAt).toLocaleString("id-ID")}</div>
                <div>Diperbarui: {new Date(project.updatedAt).toLocaleString("id-ID")}</div>
                <div>ID: <code style={{ fontSize: 11 }}>{project.id}</code> · slug: <code style={{ fontSize: 11 }}>{project.slug}</code></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {active === "status" && (
        <div className="grid grid-2">
          <div className="card" style={{ display: "grid", gap: 14 }}>
            <h3 style={{ margin: 0 }}>Status Proyek</h3>
            <p>Status menggambarkan fase siklus hidup proyek — ganti sesuai kondisi nyata.</p>
            <ProjectStatus value={project.status} onChange={handleStatusChange} />
            <div style={{ padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text)" }}>{meta.label}:</strong>{" "}
              {project.status === "draft" && "Ide awal, belum breakdown detail. Lanjut ke Planning."}
              {project.status === "planning" && "Sedang menyusun sections, requirements, dan brief desain."}
              {project.status === "in-progress" && "Development aktif — build sections & integrasi."}
              {project.status === "review" && "Menunggu review / feedback sebelum launch."}
              {project.status === "completed" && "Sudah launch — tinggal maintenance & iterasi."}
              {project.status === "on-hold" && "Dijeda sementara — catat blocker di Catatan."}
            </div>
          </div>
          <div className="card">
            <h3 style={{ margin: 0 }}>Alur Status</h3>
            <div style={{ display: "grid", gap: 6, marginTop: 12 }}>
              {["draft", "planning", "in-progress", "review", "completed"].map((s, idx, arr) => {
                const m = statusMeta(s);
                const isPast = arr.indexOf(project.status) >= idx;
                const isCurrent = project.status === s;
                return (
                  <div key={s} style={{ display: "flex", gap: 10, alignItems: "center", opacity: isPast ? 1 : 0.4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: isPast ? m.color : "var(--border-strong)", border: isCurrent ? `2px solid ${m.color}` : "none" }} />
                    <span style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500 }}>{m.label}</span>
                    {isCurrent && <span className="badge" style={{ background: m.color, color: "#fff", borderColor: m.color, fontSize: 10 }}>saat ini</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {active === "progress" && (
        <div className="grid grid-2">
          <ProjectProgress progress={project.progress} onChange={handleProgressChange} />
          <div className="card" style={{ display: "grid", gap: 12 }}>
            <h3 style={{ margin: 0 }}>Detail Kemajuan Proyek</h3>
            <p>Kontrol kemajuan manual + estimasi fase. Kemajuan otomatis terupdate di kartu <Link to="/admin/projects">Daftar proyek</Link>.</p>
            <div className="grid grid-2">
              <div className="stat"><span className="stat-val" style={{ color: statusMeta(project.status).color }}>{project.progress}%</span><span className="stat-label">Saat Ini</span></div>
              <div className="stat"><span className="stat-val">{100 - project.progress}%</span><span className="stat-label">Tersisa</span></div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn-secondary sm" onClick={() => handleProgressChange(Math.min(100, project.progress + 10))} type="button">+10%</button>
              <button className="btn-secondary sm" onClick={() => handleProgressChange(Math.max(0, project.progress - 10))} type="button">-10%</button>
              <button className="btn-ghost sm" onClick={() => handleProgressChange(100)} type="button">Tandai Selesai → status selesai</button>
            </div>
          </div>
        </div>
      )}

      <ProjectForm open={editing} onTutup={() => setEditing(false)} initial={project} onSubmit={(patch) => updateProject(project.id, patch)} />
    </div>
  );
}

function WorkspaceLink({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, textDecoration: "none", background: "var(--bg-card)" }}>
      <span style={{ width: 32, height: 32, display: "grid", placeItems: "center", background: "var(--bg-elevated)", borderRadius: 6, border: "1px solid var(--border)" }}><Icon size={14} style={{ color:"var(--text-secondary)" }} /></span>
      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 12, display: "flex", gap: 6, alignItems: "center", color:"var(--text)" }}>{title} <ExternalLink size={10} style={{ color: "var(--text-faint)" }} /></div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>{desc}</div></div>
    </Link>
  );
}

function TrendingIcon(props) {
  // inline to avoid extra import
  return (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
  );
}
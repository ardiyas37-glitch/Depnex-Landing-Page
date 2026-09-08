import { Link } from "react-router-dom";
import { ArrowUpRight, Copy, Trash2, Calendar, Layers } from "lucide-react";
import { statusMeta, progressColor } from "../../hooks/useProjects";

export default function ProjectCard({ project, onHapus, onDuplicate }) {
  const meta = statusMeta(project.status);
  const pct = Number(project.progress) || 0;

  return (
    <div className="project-card">
      <div className="project-card-top">
        <span className="badge">{project.type}</span>
        <span className="badge" style={{ background: meta.color + "18", color: meta.color, borderColor: meta.color + "35" }}>{meta.label}</span>
      </div>

      <Link to={`/admin/projects/${project.id}`} className="project-card-title">
        <h3>{project.name}</h3>
        <ArrowUpRight size={16} className="project-card-arrow" />
      </Link>
      <p className="project-card-desc">{project.description || "— belum ada deskripsi —"}</p>

      <div className="project-card-meta">
        <span className="project-meta-item"><Layers size={12} /> {project.stack}</span>
        {project.deadline && <span className="project-meta-item"><Calendar size={12} /> {new Date(project.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}</span>}
        <span className={`badge prio-${project.priority}`} style={{ fontSize: 10 }}>{project.priority}</span>
      </div>

      <div className="project-progress-wrap">
        <div className="project-progress-head">
          <span>Progress</span><strong>{pct}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, background: progressColor(pct) }} />
        </div>
      </div>

      <div className="project-card-actions">
        <Link to={`/admin/projects/${project.id}`} className="btn-secondary sm" style={{ flex: 1, textAlign: "center", textDecoration: "none", display: "grid", placeItems: "center" }}>
          Open Workspace
        </Link>
        <button className="btn-ghost sm" onClick={() => onDuplicate?.(project.id)} type="button" title="Gandakan"><Copy size={14} /></button>
        <button className="btn-ghost sm danger" onClick={() => onHapus?.(project.id)} type="button" title="Hapus"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}
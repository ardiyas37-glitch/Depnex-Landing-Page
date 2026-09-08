import { STATUS_OPTIONS, statusMeta } from "../../hooks/useProjects";

export default function ProjectStatus({ value, onChange, compact = false }) {
  const meta = statusMeta(value);

  if (compact) {
    return <span className="badge" style={{ background: meta.color + "18", color: meta.color, borderColor: meta.color + "35" }}>{meta.label}</span>;
  }

  return (
    <div className="status-selector">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span className="badge" style={{ background: meta.color, color: "#fff", borderColor: meta.color }}>{meta.label}</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Update status project</span>
      </div>
      <div className="status-grid">
        {STATUS_OPTIONS.map((s) => {
          const active = s.value === value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange?.(s.value)}
              className={`status-chip ${active ? "status-chip--active" : ""}`}
              style={{ borderColor: active ? s.color : "var(--border)", background: active ? s.color + "14" : "#fff", color: active ? s.color : "var(--text-muted)" }}
            >
              <span className="status-dot" style={{ background: s.color }} />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
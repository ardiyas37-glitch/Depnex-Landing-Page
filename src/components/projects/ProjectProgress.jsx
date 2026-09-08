import { progressColor } from "../../hooks/useProjects";

const MILESTONES = [
  { at: 0, label: "Kickoff" },
  { at: 25, label: "Planning" },
  { at: 50, label: "Build" },
  { at: 75, label: "Ditinjau" },
  { at: 100, label: "Launch" },
];

export default function ProjectProgress({ progress, onChange }) {
  const pct = Math.min(100, Math.max(0, Number(progress) || 0));
  const color = progressColor(pct);

  return (
    <div className="progress-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <strong style={{ fontSize: 14 }}>Project Progress</strong>
        <span className="badge" style={{ background: color, color: "#fff", borderColor: color }}>{pct}%</span>
      </div>

      <div className="progress-track" style={{ height: 10, marginTop: 12 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>

      <div className="milestone-row">
        {MILESTONES.map((m) => (
          <span key={m.at} className={`milestone ${pct >= m.at ? "milestone--done" : ""}`} style={{ color: pct >= m.at ? color : "var(--text-faint)" }}>
            <span className="milestone-dot" style={{ background: pct >= m.at ? color : "var(--border-strong)" }} />
            {m.label}
          </span>
        ))}
      </div>

      {onChange && (
        <div style={{ marginTop: 14 }}>
          <input type="range" min={0} max={100} value={pct} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>
      )}

      <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[25, 50, 75, 100].map((v) => (
          onChange && <button key={v} type="button" className="btn-ghost sm" onClick={() => onChange(v)}>{v}%</button>
        ))}
      </div>
    </div>
  );
}
import { FEATURE_STATUS, featureStatusMeta } from "../../hooks/useFeatures";

export default function FeatureStatusTab({ features, updateFeature, stats }) {
  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="grid grid-3">
        <div className="stat"><span className="stat-val">{stats.total}</span><span className="stat-label">Total</span></div>
        <div className="stat"><span className="stat-val" style={{ color: "#15803d" }}>{stats.shipped}</span><span className="stat-label">Shipped · {stats.completion}%</span></div>
        <div className="stat"><span className="stat-val" style={{ color: "#d97706" }}>{stats.building}</span><span className="stat-label">Building</span></div>
      </div>

      <div style={{ height: 6, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${stats.completion}%`, height: "100%", background: "#15803d", transition: "width 0.3s" }} />
      </div>

      <div className="feature-status-board">
        {FEATURE_STATUS.map((s) => {
          const list = features.filter((f) => f.status === s.value);
          return (
            <div key={s.value} className="status-column">
              <div className="status-column-head" style={{ borderTopColor: s.color }}>
                <span className="status-dot" style={{ background: s.color }} /> {s.label}
                <span className="badge" style={{ marginLeft: "auto", fontSize: 10 }}>{list.length}</span>
              </div>
              <div className="status-column-body">
                {list.length === 0 ? (
                  <p style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center", padding: 12, border: "1px dashed var(--border)", borderRadius: 8 }}>Empty</p>
                ) : list.map((f) => (
                  <div key={f.id} className="feature-mini">
                    <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{f.category} · {f.priority} · {f.effort}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                      {FEATURE_STATUS.filter((x) => x.value !== f.status).slice(0, 3).map((next) => (
                        <button key={next.value} className="btn-ghost" style={{ padding: "3px 6px", fontSize: 11, borderColor: next.color, color: next.color }} onClick={() => updateFeature(f.id, { status: next.value })} type="button">
                          → {next.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ background: "var(--off-white)" }}>
        <strong style={{ fontSize: 13 }}>Workflow:</strong>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
          {FEATURE_STATUS.map((s, idx) => (
            <span key={s.value} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="status-dot" style={{ background: s.color }} /> {s.label}
              {idx < FEATURE_STATUS.length - 1 && <span style={{ margin: "0 4px" }}>→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
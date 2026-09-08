import { useState } from "react";

const typeOptions = [
  { value: "functional", label: "Functional" },
  { value: "non-functional", label: "Non-Functional" },
  { value: "technical", label: "Technical" },
];
const prioOptions = ["high", "medium", "low"];

export default function RequirementsTab({ requirements, addRequirement, updateRequirement, removeRequirement }) {
  const [draft, setDraf] = useState({ title: "", type: "functional", priority: "high" });

  function handleAdd() {
    if (!draft.title.trim()) return;
    addRequirement({ title: draft.title.trim(), type: draft.type, priority: draft.priority });
    setDraf({ title: "", type: "functional", priority: "high" });
  }

  const grouped = {
    functional: requirements.filter((r) => r.type === "functional"),
    "non-functional": requirements.filter((r) => r.type === "non-functional"),
    technical: requirements.filter((r) => r.type === "technical"),
  };

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0 }}>Persyaratan</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>
          Pisahkan fungsional / non-functional / technical. Centang jika sudah terpenuhi.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <input value={draft.title} onChange={(e) => setDraf((d) => ({ ...d, title: e.target.value }))} placeholder="Ex: Checkout harus support COD & transfer" style={{ flex: "2 1 260px" }} />
          <select value={draft.type} onChange={(e) => setDraf((d) => ({ ...d, type: e.target.value }))} className="field-input" style={{ flex: "0 1 160px" }}>
            {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={draft.priority} onChange={(e) => setDraf((d) => ({ ...d, priority: e.target.value }))} className="field-input" style={{ flex: "0 1 120px" }}>
            {prioOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="btn-primary" onClick={handleAdd} type="button">+ Tambah</button>
        </div>

        {requirements.length === 0 ? (
          <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Belum ada requirements.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {Object.entries(grouped).map(([type, list]) => (
              list.length > 0 && (
                <div key={type}>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
                    {type} — {list.length}
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {list.map((r) => (
                      <div key={r.id} className="planning-item">
                        <label style={{ display: "flex", gap: 10, flex: 1, alignItems: "center" }}>
                          <input type="checkbox" checked={!!r.done} onChange={(e) => updateRequirement(r.id, { done: e.target.checked })} />
                          <input
                            value={r.title}
                            onChange={(e) => updateRequirement(r.id, { title: e.target.value })}
                            style={{ flex: 1, textDecoration: r.done ? "line-through" : "none", opacity: r.done ? 0.6 : 1, border: "1px solid transparent", background: "transparent", padding: "2px 4px" }}
                          />
                        </label>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <select value={r.priority} onChange={(e) => updateRequirement(r.id, { priority: e.target.value })} className="select-sm">
                            {prioOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <span className={`badge prio-${r.priority}`}>{r.priority}</span>
                          <button className="btn-ghost sm danger" onClick={() => removeRequirement(r.id)} type="button">Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
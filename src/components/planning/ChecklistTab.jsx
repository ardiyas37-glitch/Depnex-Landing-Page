import { useState } from "react";

export default function ChecklistTab({ checklist, addChecklist, toggleChecklist, removeChecklist, updateChecklist, completion }) {
  const [draft, setDraf] = useState("");

  function handleAdd() {
    if (!draft.trim()) return;
    addChecklist(draft.trim());
    setDraf("");
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0 }}>Checklist</h3>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>{completion.done} dari {completion.total} selesai — {completion.pct}%</p>
          </div>
          <span className="badge">{completion.pct}% complete</span>
        </div>

        <div style={{ margin: "14px 0 12px", height: 8, background: "var(--off-white)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div style={{ width: `${completion.pct}%`, height: "100%", background: "var(--charcoal)", transition: "width 0.3s" }} />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            value={draft}
            onChange={(e) => setDraf(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Tambah item checklist — ex: Siapkan copywriting hero"
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={handleAdd} type="button">+ Tambah</button>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {checklist.map((c) => (
            <div key={c.id} className="planning-item" style={{ opacity: c.done ? 0.75 : 1 }}>
              <label style={{ display: "flex", gap: 10, flex: 1, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={c.done} onChange={() => toggleChecklist(c.id)} />
                <input
                  value={c.text}
                  onChange={(e) => updateChecklist(c.id, { text: e.target.value })}
                  style={{ flex: 1, textDecoration: c.done ? "line-through" : "none", border: "1px solid transparent", background: "transparent", padding: "2px 4px" }}
                />
              </label>
              <button className="btn-ghost sm danger" onClick={() => removeChecklist(c.id)} type="button">Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
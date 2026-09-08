import { useState } from "react";
import { Plus, Copy, Trash2, Box } from "lucide-react";
import { compStatusMeta } from "../../hooks/useDesign";

export default function KomponenTab({ components, addComponent, updateComponent, removeComponent, duplicateComponent }) {
  const [draft, setDraf] = useState({ name: "", description: "", category: "General", status: "planned" });
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = filterStatus === "all" ? components : components.filter((c) => c.status === filterStatus);

  function handleAdd() {
    if (!draft.name.trim()) return;
    addComponent({ ...draft, name: draft.name.trim() });
    setDraf({ name: "", description: "", category: "General", status: "planned" });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0, display: "flex", gap: 8, alignItems: "center" }}><Box size={16} /> Komponen</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>Inventory komponen — status live untuk yang sudah dipakai di app.</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <input value={draft.name} onChange={(e) => setDraf((d) => ({ ...d, name: e.target.value }))} placeholder="Name — ex: Button Ghost" style={{ flex: "1 1 160px" }} />
          <input value={draft.description} onChange={(e) => setDraf((d) => ({ ...d, description: e.target.value }))} placeholder="description" style={{ flex: "2 1 220px" }} />
          <input value={draft.category} onChange={(e) => setDraf((d) => ({ ...d, category: e.target.value }))} placeholder="category" style={{ flex: "0 1 120px" }} />
          <select value={draft.status} onChange={(e) => setDraf((d) => ({ ...d, status: e.target.value }))} className="field-input" style={{ flex: "0 1 130px", padding: "8px 10px" }}>
            <option value="planned">Direncanakan</option><option value="building">Building</option><option value="live">Live</option><option value="deprecated">Deprecated</option>
          </select>
          <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah</button>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={() => setFilterStatus("all")} className={`btn-ghost sm ${filterStatus === "all" ? "active-filter" : ""}`} type="button">All ({components.length})</button>
          {["planned", "building", "live", "deprecated"].map((s) => {
            const meta = compStatusMeta(s);
            return <button key={s} onClick={() => setFilterStatus(s)} className={`btn-ghost sm ${filterStatus === s ? "active-filter" : ""}`} type="button" style={{ borderColor: filterStatus === s ? meta.color : undefined, color: filterStatus === s ? meta.color : undefined }}>{meta.label}</button>;
          })}
        </div>

        <div className="components-grid">
          {filtered.map((c) => {
            const meta = compStatusMeta(c.status);
            return (
              <div key={c.id} className="card" style={{ padding: 14, display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <span className="badge" style={{ fontSize: 10 }}>{c.category}</span>
                  <span className="badge" style={{ background: meta.color, color: "#fff", borderColor: meta.color, fontSize: 10 }}>{meta.label}</span>
                </div>
                <input value={c.name} onChange={(e) => updateComponent(c.id, { name: e.target.value })} style={{ fontWeight: 700, fontSize: 14, border: "1px solid transparent", background: "transparent", padding: "2px 4px" }} />
                <textarea rows={2} value={c.description} onChange={(e) => updateComponent(c.id, { description: e.target.value })} placeholder="description" className="field-input" style={{ fontSize: 12 }} />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <input value={c.category} onChange={(e) => updateComponent(c.id, { category: e.target.value })} style={{ fontSize: 12, border: "1px solid transparent", background: "transparent", padding: "2px 4px", flex: "1 1 80px" }} />
                  <select value={c.status} onChange={(e) => updateComponent(c.id, { status: e.target.value })} className="select-sm">
                    <option value="planned">Direncanakan</option><option value="building">Building</option><option value="live">Live</option><option value="deprecated">Deprecated</option>
                  </select>
                </div>
                {c.variants?.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{c.variants.map((v) => <span key={v} className="badge" style={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}>{v}</span>)}</div>}
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-ghost sm" onClick={() => duplicateComponent(c.id)} type="button"><Copy size={12} /> Dup</button>
                  <button className="btn-ghost sm danger" onClick={() => removeComponent(c.id)} type="button"><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Plus, Copy, Trash2, Palette } from "lucide-react";
import { COLOR_ROLES } from "../../hooks/useDesign";

export default function WarnaTab({ colors, addColor, updateColor, removeColor, duplicateColor }) {
  const [draft, setDraf] = useState({ name: "", value: "#737373", role: "Neutral", token: "--custom", usage: "" });
  const [filterRole, setFilterRole] = useState("all");

  const filtered = filterRole === "all" ? colors : colors.filter((c) => c.role === filterRole);

  function handleAdd() {
    if (!draft.name.trim()) return;
    addColor({ ...draft, name: draft.name.trim(), token: draft.token.startsWith("--") ? draft.token : `--${draft.token.replace(/^--/, "")}` });
    setDraf({ name: "", value: "#737373", role: "Neutral", token: "--custom", usage: "" });
  }
  async function copy(text) { try { await navigator.clipboard.writeText(text); } catch {} }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0, display: "flex", gap: 8, alignItems: "center" }}><Palette size={16} /> Warna</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>Palette tokens — pakai <code>var(--token)</code> di CSS. Klik swatch untuk copy hex.</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <input value={draft.name} onChange={(e) => setDraf((d) => ({ ...d, name: e.target.value }))} placeholder="Name — ex: Brand Blue" style={{ flex: "1 1 140px" }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center", flex: "0 1 120px" }}>
            <input type="color" value={draft.value} onChange={(e) => setDraf((d) => ({ ...d, value: e.target.value }))} style={{ width: 40, height: 36, padding: 2, borderRadius: 8, border: "1px solid var(--border)" }} />
            <input value={draft.value} onChange={(e) => setDraf((d) => ({ ...d, value: e.target.value }))} placeholder="#hex" style={{ flex: 1 }} />
          </div>
          <select value={draft.role} onChange={(e) => setDraf((d) => ({ ...d, role: e.target.value }))} className="field-input" style={{ flex: "0 1 130px", padding: "8px 10px" }}>
            {COLOR_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <input value={draft.token} onChange={(e) => setDraf((d) => ({ ...d, token: e.target.value }))} placeholder="--token" style={{ flex: "0 1 120px" }} />
          <input value={draft.usage} onChange={(e) => setDraf((d) => ({ ...d, usage: e.target.value }))} placeholder="usage" style={{ flex: "1 1 160px" }} />
          <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah</button>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={() => setFilterRole("all")} className={`btn-ghost sm ${filterRole === "all" ? "active-filter" : ""}`} type="button">All ({colors.length})</button>
          {COLOR_ROLES.map((r) => <button key={r} onClick={() => setFilterRole(r)} className={`btn-ghost sm ${filterRole === r ? "active-filter" : ""}`} type="button">{r}</button>)}
        </div>

        <div className="colors-grid">
          {filtered.map((c) => (
            <div key={c.id} className="color-card">
              <button onClick={() => copy(c.value)} type="button" className="color-swatch" style={{ background: c.value }} title={`Salin ${c.value}`} />
              <div style={{ display: "grid", gap: 4, flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <input value={c.name} onChange={(e) => updateColor(c.id, { name: e.target.value })} style={{ fontWeight: 600, fontSize: 13, border: "1px solid transparent", background: "transparent", padding: "2px 4px", flex: "1 1 80px" }} />
                  <span className="badge" style={{ fontSize: 10 }}>{c.role}</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <code style={{ fontSize: 11, background: "var(--off-white)", padding: "2px 6px", borderRadius: 6, border: "1px solid var(--border)" }}>{c.value}</code>
                  <input value={c.token} onChange={(e) => updateColor(c.id, { token: e.target.value })} style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", border: "1px solid transparent", background: "transparent", padding: "2px 4px", flex: "1 1 60px" }} />
                  <select value={c.role} onChange={(e) => updateColor(c.id, { role: e.target.value })} className="select-sm" style={{ fontSize: 11 }}>
                    {COLOR_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <input value={c.usage || ""} onChange={(e) => updateColor(c.id, { usage: e.target.value })} placeholder="usage" style={{ fontSize: 12, color: "var(--text-muted)", border: "1px solid transparent", background: "transparent", padding: "2px 4px" }} />
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="color" value={c.value} onChange={(e) => updateColor(c.id, { value: e.target.value })} style={{ width: 28, height: 24, padding: 1, borderRadius: 6, border: "1px solid var(--border)" }} />
                  <button className="btn-ghost sm" onClick={() => copy(c.value)} type="button"><Copy size={12} /> Hex</button>
                  <button className="btn-ghost sm" onClick={() => copy(`var(${c.token})`)} type="button"><Copy size={12} /> Token</button>
                  <button className="btn-ghost sm" onClick={() => duplicateColor(c.id)} type="button"><Copy size={12} /></button>
                  <button className="btn-ghost sm danger" onClick={() => removeColor(c.id)} type="button"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
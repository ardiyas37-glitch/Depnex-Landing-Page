import { useState } from "react";
import { Plus, Trash2, Type } from "lucide-react";
import { TYPO_ROLES } from "../../hooks/useDesign";

export default function TipografiTab({ typography, addTipografi, updateTipografi, removeTipografi }) {
  const [draft, setDraf] = useState({ name: "", family: "Inter", size: "14px", weight: "400", lineHeight: "1.5", letterSpacing: "0", role: "Body", example: "Example text" });

  function handleAdd() {
    if (!draft.name.trim()) return;
    addTipografi({ ...draft, name: draft.name.trim() });
    setDraf({ name: "", family: "Inter", size: "14px", weight: "400", lineHeight: "1.5", letterSpacing: "0", role: "Body", example: "Example text" });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0, display: "flex", gap: 8, alignItems: "center" }}><Type size={16} /> Tipografi</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>Skala tipografi — preview live. Edit inline untuk tuning.</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <input value={draft.name} onChange={(e) => setDraf((d) => ({ ...d, name: e.target.value }))} placeholder="Name — ex: H2" style={{ flex: "1 1 120px" }} />
          <select value={draft.family} onChange={(e) => setDraf((d) => ({ ...d, family: e.target.value }))} className="field-input" style={{ flex: "0 1 120px", padding: "8px 10px" }}>
            <option value="Inter">Inter</option><option value="Geist">Geist</option><option value="Mono">Mono</option>
          </select>
          <input value={draft.size} onChange={(e) => setDraf((d) => ({ ...d, size: e.target.value }))} placeholder="14px" style={{ flex: "0 1 80px" }} />
          <select value={draft.weight} onChange={(e) => setDraf((d) => ({ ...d, weight: e.target.value }))} className="field-input" style={{ flex: "0 1 90px", padding: "8px 10px" }}>
            <option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option>
          </select>
          <input value={draft.lineHeight} onChange={(e) => setDraf((d) => ({ ...d, lineHeight: e.target.value }))} placeholder="1.5" style={{ flex: "0 1 70px" }} />
          <select value={draft.role} onChange={(e) => setDraf((d) => ({ ...d, role: e.target.value }))} className="field-input" style={{ flex: "0 1 110px", padding: "8px 10px" }}>
            {TYPO_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah</button>
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          {typography.map((t) => (
            <div key={t.id} className="card" style={{ padding: 14, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <input value={t.name} onChange={(e) => updateTipografi(t.id, { name: e.target.value })} style={{ fontWeight: 700, fontSize: 13, border: "1px solid transparent", background: "transparent", padding: "2px 6px", width: 140 }} />
                  <span className="badge" style={{ fontSize: 10 }}>{t.role}</span>
                  <span className="badge" style={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}>{t.family} · {t.size} · {t.weight}</span>
                </div>
                <button className="btn-ghost sm danger" onClick={() => removeTipografi(t.id)} type="button"><Trash2 size={12} /></button>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input value={t.size} onChange={(e) => updateTipografi(t.id, { size: e.target.value })} placeholder="size" style={{ flex: "0 1 80px", fontSize: 12 }} />
                <select value={t.weight} onChange={(e) => updateTipografi(t.id, { weight: e.target.value })} className="select-sm">
                  <option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option>
                </select>
                <input value={t.lineHeight} onChange={(e) => updateTipografi(t.id, { lineHeight: e.target.value })} placeholder="lh" style={{ flex: "0 1 70px", fontSize: 12 }} />
                <input value={t.letterSpacing} onChange={(e) => updateTipografi(t.id, { letterSpacing: e.target.value })} placeholder="ls" style={{ flex: "0 1 90px", fontSize: 12 }} />
                <select value={t.family} onChange={(e) => updateTipografi(t.id, { family: e.target.value })} className="select-sm">
                  <option value="Inter">Inter</option><option value="Geist">Geist</option><option value="Mono">Mono</option>
                </select>
              </div>

              <div style={{ padding: 14, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontFamily: t.family === "Mono" ? "ui-monospace, monospace" : "Inter, sans-serif", fontSize: t.size, fontWeight: t.weight, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing }}>{t.example}</div>
                <input value={t.example} onChange={(e) => updateTipografi(t.id, { example: e.target.value })} placeholder="example text" style={{ marginTop: 8, fontSize: 12, width: "100%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
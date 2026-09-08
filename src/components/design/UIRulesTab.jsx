import { useState, useMemo } from "react";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { RULE_CATEGORY, RULE_PRIORITY } from "../../hooks/useDesign";

export default function UIRulesTab({ rules, addRule, updateRule, toggleRule, removeRule }) {
  const [draft, setDraf] = useState({ title: "", category: "Spacing", description: "", priority: "medium" });
  const [filterCat, setFilterCat] = useState("all");

  const filtered = useMemo(() => filterCat === "all" ? rules : rules.filter((r) => r.category === filterCat), [rules, filterCat]);

  function handleAdd() {
    if (!draft.title.trim()) return;
    addRule({ ...draft, title: draft.title.trim() });
    setDraf({ title: "", category: "Spacing", description: "", priority: "medium" });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0, display: "flex", gap: 8, alignItems: "center" }}><ShieldCheck size={16} /> Aturan UI</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>Aturan desain — checklist kepatuhan sebelum build.</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <input value={draft.title} onChange={(e) => setDraf((d) => ({ ...d, title: e.target.value }))} placeholder="Rule — ex: Max 2 primary buttons per screen" style={{ flex: "2 1 200px" }} />
          <select value={draft.category} onChange={(e) => setDraf((d) => ({ ...d, category: e.target.value }))} className="field-input" style={{ flex: "0 1 140px", padding: "8px 10px" }}>
            {RULE_CATEGORY.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={draft.priority} onChange={(e) => setDraf((d) => ({ ...d, priority: e.target.value }))} className="field-input" style={{ flex: "0 1 110px", padding: "8px 10px" }}>
            {RULE_PRIORITY.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Add Rule</button>
        </div>
        <div style={{ marginTop: 8 }}>
          <input value={draft.description} onChange={(e) => setDraf((d) => ({ ...d, description: e.target.value }))} placeholder="description — detail aturan" style={{ width: "100%" }} />
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Filter:</span>
          <button onClick={() => setFilterCat("all")} className={`btn-ghost sm ${filterCat === "all" ? "active-filter" : ""}`} type="button">All ({rules.length})</button>
          {RULE_CATEGORY.map((c) => <button key={c} onClick={() => setFilterCat(c)} className={`btn-ghost sm ${filterCat === c ? "active-filter" : ""}`} type="button">{c}</button>)}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>{filtered.filter((r) => r.done).length}/{filtered.length} done</span>
        </div>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 13, padding: 16, border: "1px dashed var(--border)", borderRadius: 10 }}>Belum ada rules.</p>
          ) : filtered.map((r) => (
            <div key={r.id} className="planning-item" style={{ opacity: r.done ? 0.7 : 1, alignItems: "flex-start" }}>
              <label style={{ display: "flex", gap: 10, flex: 1, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" checked={!!r.done} onChange={() => toggleRule(r.id)} style={{ marginTop: 4 }} />
                <div style={{ flex: 1, display: "grid", gap: 4 }}>
                  <input value={r.title} onChange={(e) => updateRule(r.id, { title: e.target.value })} style={{ fontWeight: 600, fontSize: 13, border: "1px solid transparent", background: "transparent", padding: "2px 4px", textDecoration: r.done ? "line-through" : "none" }} />
                  <textarea rows={2} value={r.description} onChange={(e) => updateRule(r.id, { description: e.target.value })} placeholder="description" className="field-input" style={{ fontSize: 12, padding: "6px 8px" }} />
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <select value={r.category} onChange={(e) => updateRule(r.id, { category: e.target.value })} className="select-sm">
                      {RULE_CATEGORY.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={r.priority} onChange={(e) => updateRule(r.id, { priority: e.target.value })} className="select-sm">
                      {RULE_PRIORITY.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <span className={`badge prio-${r.priority}`} style={{ fontSize: 10 }}>{r.priority}</span>
                    <span className="badge" style={{ fontSize: 10 }}>{r.category}</span>
                  </div>
                </div>
              </label>
              <button className="btn-ghost sm danger" onClick={() => removeRule(r.id)} type="button"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
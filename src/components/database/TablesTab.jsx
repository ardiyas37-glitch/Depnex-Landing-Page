import { useState } from "react";
import { Plus, Copy, Trash2, Search, Table2 } from "lucide-react";
import { tableStatusMeta, TABLE_STATUS } from "../../hooks/useDatabase";

export default function TabelTab({ tables, addTable, updateTable, removeTable, duplicateTable }) {
  const [query, setQuery] = useState("");
  const [draft, setDraf] = useState({ name: "", description: "", status: "planned" });

  const filtered = tables.filter((t) => {
    const q = query.toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
  });

  function handleAdd() {
    if (!draft.name.trim()) return;
    addTable({ name: draft.name.trim(), description: draft.description.trim(), status: draft.status });
    setDraf({ name: "", description: "", status: "planned" });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0, display: "flex", gap: 8, alignItems: "center" }}><Table2 size={16} /> Tabel</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>Daftar tabel — tambah via form, edit inline, duplicate untuk varian.</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <input value={draft.name} onChange={(e) => setDraf((d) => ({ ...d, name: e.target.value }))} placeholder="name — ex: orders" style={{ flex: "1 1 160px" }} />
          <input value={draft.description} onChange={(e) => setDraf((d) => ({ ...d, description: e.target.value }))} placeholder="description" style={{ flex: "2 1 240px" }} />
          <select value={draft.status} onChange={(e) => setDraf((d) => ({ ...d, status: e.target.value }))} className="field-input" style={{ flex: "0 1 140px", padding: "8px 10px" }}>
            {TABLE_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah Tabel</button>
        </div>

        <div style={{ position: "relative", marginTop: 12 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari table..." style={{ paddingLeft: 32, width: "100%" }} />
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 13, padding: 20, border: "1px dashed var(--border)", borderRadius: 10 }}>Tidak ada tabel untuk filter.</p>
          ) : filtered.map((t) => {
            const meta = tableStatusMeta(t.status);
            return (
              <div key={t.id} className="planning-item" style={{ alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <input value={t.name} onChange={(e) => updateTable(t.id, { name: e.target.value.toLowerCase().replace(/\s+/g, "_") })} style={{ fontWeight: 700, fontFamily: "ui-monospace, monospace", border: "1px solid transparent", background: "transparent", padding: "2px 6px", flex: "0 1 160px" }} />
                    <span className="badge" style={{ background: meta.color, color: "#fff", borderColor: meta.color, fontSize: 10 }}>{meta.label}</span>
                    <span className="badge" style={{ fontSize: 10 }}>{t.columns.length} cols</span>
                  </div>
                  <input value={t.description} onChange={(e) => updateTable(t.id, { description: e.target.value })} placeholder="description" style={{ fontSize: 13, color: "var(--text-muted)", border: "1px solid transparent", background: "transparent", padding: "2px 6px" }} />
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {t.columns.slice(0, 6).map((c) => (
                      <span key={c.id} className="badge" style={{ fontSize: 10, fontFamily: "ui-monospace, monospace", background: c.isPK ? "#171717" : c.isFK ? "#fffbeb" : "#fff", color: c.isPK ? "#fff" : c.isFK ? "#92400e" : "var(--text-muted)", borderColor: c.isPK ? "#171717" : c.isFK ? "#fde68a" : "var(--border)" }}>
                        {c.isPK ? "PK " : c.isFK ? "FK " : ""}{c.name}:{c.type}
                      </span>
                    ))}
                    {t.columns.length > 6 && <span className="badge" style={{ fontSize: 10 }}>+{t.columns.length - 6} more</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                  <select value={t.status} onChange={(e) => updateTable(t.id, { status: e.target.value })} className="select-sm">
                    {TABLE_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <button className="btn-ghost sm" onClick={() => duplicateTable(t.id)} type="button"><Copy size={12} /></button>
                  <button className="btn-ghost sm danger" onClick={() => { if (confirm(`Hapus tabel ${t.name}?`)) removeTable(t.id); }} type="button"><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
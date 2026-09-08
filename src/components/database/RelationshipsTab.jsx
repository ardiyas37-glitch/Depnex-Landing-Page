import { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { REL_TYPES } from "../../hooks/useDatabase";

export default function RelasiTab({ tables, relationships, addRelationship, updateRelationship, removeRelationship }) {
  const firstTable = tables[0];
  const [draft, setDraf] = useState({
    fromTable: firstTable?.id || "",
    fromColumn: firstTable?.columns[0]?.id || "",
    toTable: tables[1]?.id || tables[0]?.id || "",
    toColumn: tables[1]?.columns[0]?.id || "",
    type: "many-to-one",
    onHapus: "CASCADE",
  });

  function handleFromTableChange(id) {
    const tbl = tables.find((t) => t.id === id);
    setDraf((d) => ({ ...d, fromTable: id, fromColumn: tbl?.columns[0]?.id || "" }));
  }
  function handleToTableChange(id) {
    const tbl = tables.find((t) => t.id === id);
    setDraf((d) => ({ ...d, toTable: id, toColumn: tbl?.columns[0]?.id || "" }));
  }

  function handleAdd() {
    if (!draft.fromTable || !draft.fromColumn || !draft.toTable || !draft.toColumn) return;
    if (draft.fromTable === draft.toTable && draft.fromColumn === draft.toColumn) return;
    addRelationship(draft);
  }

  function labelFor(tableId, colId) {
    const tbl = tables.find((t) => t.id === tableId);
    const col = tbl?.columns.find((c) => c.id === colId);
    return `${tbl?.name || "?"} . ${col?.name || "?"}`;
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0 }}>Relasi</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>
          Foreign keys antar tabel — tentukan FK → PK, type, dan onHapus.
        </p>

        {tables.length < 2 ? (
          <p style={{ color: "var(--text-faint)", fontSize: 13, padding: 12, border: "1px dashed var(--border)", borderRadius: 10 }}>Butuh minimal 2 tabel untuk membuat relationship.</p>
        ) : (
          <div style={{ display: "grid", gap: 10, padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
              <div style={{ display: "grid", gap: 6 }}>
                <span className="field-label">From (FK)</span>
                <select value={draft.fromTable} onChange={(e) => handleFromTableChange(e.target.value)} className="field-input" style={{ padding: "8px 10px" }}>
                  {tables.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select value={draft.fromColumn} onChange={(e) => setDraf((d) => ({ ...d, fromColumn: e.target.value }))} className="field-input" style={{ padding: "8px 10px" }}>
                  {(tables.find((t) => t.id === draft.fromTable)?.columns || []).map((c) => <option key={c.id} value={c.id}>{c.name} — {c.type}{c.isFK ? " (FK)" : ""}</option>)}
                </select>
              </div>
              <ArrowRight size={20} style={{ color: "var(--text-faint)", marginTop: 18 }} />
              <div style={{ display: "grid", gap: 6 }}>
                <span className="field-label">To (PK)</span>
                <select value={draft.toTable} onChange={(e) => handleToTableChange(e.target.value)} className="field-input" style={{ padding: "8px 10px" }}>
                  {tables.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select value={draft.toColumn} onChange={(e) => setDraf((d) => ({ ...d, toColumn: e.target.value }))} className="field-input" style={{ padding: "8px 10px" }}>
                  {(tables.find((t) => t.id === draft.toTable)?.columns || []).map((c) => <option key={c.id} value={c.id}>{c.name} — {c.type}{c.isPK ? " (PK)" : ""}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <select value={draft.type} onChange={(e) => setDraf((d) => ({ ...d, type: e.target.value }))} className="field-input" style={{ flex: "0 1 140px", padding: "8px 10px" }}>
                {REL_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label} ({r.value})</option>)}
              </select>
              <select value={draft.onHapus} onChange={(e) => setDraf((d) => ({ ...d, onHapus: e.target.value }))} className="field-input" style={{ flex: "0 1 160px", padding: "8px 10px" }}>
                <option value="CASCADE">CASCADE</option><option value="SET NULL">SET NULL</option><option value="RESTRICT">RESTRICT</option><option value="NO ACTION">NO ACTION</option>
              </select>
              <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah Relasi</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
          {relationships.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 13, padding: 16, border: "1px dashed var(--border)", borderRadius: 10 }}>Belum ada relationships.</p>
          ) : relationships.map((r) => (
            <div key={r.id} className="planning-item" style={{ gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
                <span style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "3px 6px", borderRadius: 6 }}>{labelFor(r.fromTable, r.fromColumn)}</span>
                <ArrowRight size={14} style={{ color: "var(--text-faint)" }} />
                <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "3px 6px", borderRadius: 6 }}>{labelFor(r.toTable, r.toColumn)}</span>
                <span className="badge" style={{ fontSize: 10 }}>{r.type}</span>
                <span className="badge" style={{ fontSize: 10 }}>ON DELETE {r.onHapus}</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <select value={r.type} onChange={(e) => updateRelationship(r.id, { type: e.target.value })} className="select-sm">
                  {REL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <select value={r.onHapus} onChange={(e) => updateRelationship(r.id, { onHapus: e.target.value })} className="select-sm">
                  <option value="CASCADE">CASCADE</option><option value="SET NULL">SET NULL</option><option value="RESTRICT">RESTRICT</option><option value="NO ACTION">NO ACTION</option>
                </select>
                <button className="btn-ghost sm danger" onClick={() => removeRelationship(r.id)} type="button"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
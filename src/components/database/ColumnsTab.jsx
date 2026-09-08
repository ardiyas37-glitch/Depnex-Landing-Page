import { useState, useMemo } from "react";
import { Plus, Trash2, Key, Link2 } from "lucide-react";
import { COLUMN_TYPES } from "../../hooks/useDatabase";

export default function KolomTab({ tables, addColumn, updateColumn, removeColumn }) {
  const [selectedTable, setSelectedTable] = useState(tables[0]?.id || "");
  const [draft, setDraf] = useState({ name: "", type: "text", nullable: true, isPK: false, isFK: false, defaultValue: "", description: "" });

  const table = useMemo(() => tables.find((t) => t.id === selectedTable) || null, [tables, selectedTable]);

  if (!tables.length) return <div className="card" style={{ textAlign: "center", color: "var(--text-muted)", padding: 28 }}>Belum ada tabel — buat di tab Tabel dulu.</div>;

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Table:</span>
        <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="field-input" style={{ flex: "1 1 220px", maxWidth: 300, padding: "8px 12px" }}>
          {tables.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.columns.length} cols</option>)}
        </select>
        {table && <span className="badge" style={{ fontFamily: "ui-monospace, monospace" }}>{table.name}</span>}
      </div>

      {!table ? <div className="card" style={{ textAlign: "center", color: "var(--text-faint)" }}>Pilih tabel.</div> : (
        <>
          <div className="card">
            <h3 style={{ margin: 0 }}>Kolom — {table.name}</h3>
            <p style={{ margin: "4px 0 12px", color: "var(--text-muted)", fontSize: 13 }}>{table.description || "— belum ada deskripsi tabel —"}</p>

            <div style={{ display: "grid", gap: 8, padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input value={draft.name} onChange={(e) => setDraf((d) => ({ ...d, name: e.target.value }))} placeholder="name — ex: user_id" style={{ flex: "1 1 140px" }} />
                <select value={draft.type} onChange={(e) => setDraf((d) => ({ ...d, type: e.target.value }))} className="field-input" style={{ flex: "0 1 160px", padding: "8px 10px" }}>
                  {COLUMN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input value={draft.defaultValue} onChange={(e) => setDraf((d) => ({ ...d, defaultValue: e.target.value }))} placeholder="default — ex: now()" style={{ flex: "1 1 140px" }} />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", fontSize: 13 }}>
                <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={!draft.nullable} onChange={(e) => setDraf((d) => ({ ...d, nullable: !e.target.checked }))} /> NOT NULL</label>
                <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={draft.isPK} onChange={(e) => setDraf((d) => ({ ...d, isPK: e.target.checked }))} /> <Key size={12} /> PK</label>
                <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={draft.isFK} onChange={(e) => setDraf((d) => ({ ...d, isFK: e.target.checked }))} /> <Link2 size={12} /> FK</label>
                <input value={draft.description} onChange={(e) => setDraf((d) => ({ ...d, description: e.target.value }))} placeholder="description" style={{ flex: "1 1 180px" }} />
                <button className="btn-primary sm" onClick={() => { if (!draft.name.trim()) return; addColumn(table.id, { ...draft, name: draft.name.trim() }); setDraf({ name: "", type: "text", nullable: true, isPK: false, isFK: false, defaultValue: "", description: "" }); }} type="button"><Plus size={14} /> Tambah Kolom</button>
              </div>
            </div>

            <div style={{ overflowX: "auto", marginTop: 14 }}>
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Type</th><th>Nullable</th><th>PK</th><th>FK</th><th>Default</th><th>Description</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((c) => (
                    <tr key={c.id}>
                      <td><input value={c.name} onChange={(e) => updateColumn(table.id, c.id, { name: e.target.value })} style={{ fontFamily: "ui-monospace, monospace", fontWeight: c.isPK ? 700 : 400, border: "1px solid transparent", background: "transparent", padding: "2px 4px", width: 120 }} /></td>
                      <td>
                        <select value={c.type} onChange={(e) => updateColumn(table.id, c.id, { type: e.target.value })} className="select-sm">
                          {COLUMN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </td>
                      <td><input type="checkbox" checked={!c.nullable} onChange={(e) => updateColumn(table.id, c.id, { nullable: !e.target.checked })} /></td>
                      <td><input type="checkbox" checked={!!c.isPK} onChange={(e) => updateColumn(table.id, c.id, { isPK: e.target.checked })} /></td>
                      <td><input type="checkbox" checked={!!c.isFK} onChange={(e) => updateColumn(table.id, c.id, { isFK: e.target.checked })} /></td>
                      <td><input value={c.defaultValue || ""} onChange={(e) => updateColumn(table.id, c.id, { defaultValue: e.target.value })} placeholder="—" style={{ width: 110, border: "1px solid transparent", background: "transparent", padding: "2px 4px", fontSize: 12 }} /></td>
                      <td><input value={c.description || ""} onChange={(e) => updateColumn(table.id, c.id, { description: e.target.value })} placeholder="—" style={{ width: 140, border: "1px solid transparent", background: "transparent", padding: "2px 4px", fontSize: 12 }} /></td>
                      <td><button className="btn-ghost sm danger" onClick={() => removeColumn(table.id, c.id)} type="button"><Trash2 size={12} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
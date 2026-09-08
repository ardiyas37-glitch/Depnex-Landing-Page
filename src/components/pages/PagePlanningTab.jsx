import { useState, useMemo } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { pageStatusMeta, PAGE_TYPE } from "../../hooks/usePages";

export default function PagePlanningTab({ pages, updatePage, addBlock, updateBlock, removeBlock }) {
  const [selectedId, setSelectedId] = useState(pages[0]?.id || "");
  const [editMode, setEditMode] = useState(false);
  const [blockDraf, setBlockDraf] = useState({ name: "", purpose: "" });

  const selected = useMemo(() => pages.find((p) => p.id === selectedId) || null, [pages, selectedId]);

  // keep selection valid when pages changes
  if (pages.length && !selected && selectedId) {
    // fallback in render not effect to avoid loop; set via handler below
  }

  function handleAddBlock() {
    if (!selected || !blockDraf.name.trim()) return;
    addBlock(selected.id, { name: blockDraf.name.trim(), purpose: blockDraf.purpose.trim() || "-" });
    setBlockDraf({ name: "", purpose: "" });
  }

  if (!pages.length) {
    return <div className="card" style={{ textAlign: "center", color: "var(--text-muted)", padding: 28 }}>Belum ada halaman — tambah di Peta Situs dulu.</div>;
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Pilih halaman:</span>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="field-input" style={{ flex: "1 1 220px", maxWidth: 360, padding: "8px 12px" }}>
          {pages.map((p) => <option key={p.id} value={p.id}>{p.title} — {p.path}</option>)}
        </select>
        {selected && (
          <>
            <span className="badge" style={{ background: pageStatusMeta(selected.status).color, color: "#fff", borderColor: pageStatusMeta(selected.status).color }}>{pageStatusMeta(selected.status).label}</span>
            <span className="badge">{selected.type}</span>
            <code style={{ fontSize: 12, background: "var(--off-white)", padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)" }}>{selected.path}</code>
          </>
        )}
      </div>

      {!selected ? (
        <div className="card" style={{ textAlign: "center", color: "var(--text-faint)" }}>Pilih halaman di atas.</div>
      ) : (
        <>
          <div className="card" style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0 }}>Perencanaan Halaman — {selected.title}</h3>
              <button className={`btn-ghost sm ${editMode ? "active-filter" : ""}`} onClick={() => setEditMode((v) => !v)} type="button"><Edit3 size={12} /> {editMode ? "Done" : "Edit"}</button>
            </div>

            {editMode ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div className="grid grid-2">
                  <label className="field"><span className="field-label">Title</span><input value={selected.title} onChange={(e) => updatePage(selected.id, { title: e.target.value })} /></label>
                  <label className="field"><span className="field-label">Path</span><input value={selected.path} onChange={(e) => updatePage(selected.id, { path: e.target.value })} /></label>
                </div>
                <div className="grid grid-2">
                  <label className="field"><span className="field-label">Type</span>
                    <select value={selected.type} onChange={(e) => updatePage(selected.id, { type: e.target.value })} className="field-input">
                      {PAGE_TYPE.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Status</span>
                    <select value={selected.status} onChange={(e) => updatePage(selected.id, { status: e.target.value })} className="field-input">
                      <option value="draft">Draf</option><option value="planned">Direncanakan</option><option value="building">Building</option><option value="review">Ditinjau</option><option value="live">Live</option>
                    </select>
                  </label>
                </div>
                <label className="field"><span className="field-label">Description / Purpose</span><textarea rows={2} value={selected.description} onChange={(e) => updatePage(selected.id, { description: e.target.value })} className="field-input" /></label>
                <div className="grid grid-2">
                  <label className="field"><span className="field-label">SEO Title</span><input value={selected.seoTitle || ""} onChange={(e) => updatePage(selected.id, { seoTitle: e.target.value })} placeholder="Ex: Toko Kue — Home" /></label>
                  <label className="field"><span className="field-label">SEO Description</span><input value={selected.seoDesc || ""} onChange={(e) => updatePage(selected.id, { seoDesc: e.target.value })} placeholder="Max 160 chars" /></label>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 6, fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)" }}>
                <div><strong style={{ color: "var(--text)" }}>Purpose:</strong> {selected.description || "— belum diisi —"}</div>
                <div><strong style={{ color: "var(--text)" }}>SEO:</strong> {selected.seoTitle ? `${selected.seoTitle} — ${selected.seoDesc || "-"}` : "— belum diisi —"}</div>
              </div>
            )}
          </div>

          <div className="card" style={{ display: "grid", gap: 12 }}>
            <h3 style={{ margin: 0 }}>Blocks / Bagian in this Page</h3>
            <p style={{ margin: 0 }}>Susun block komponen di dalam halaman ini (mirip sections di Planning). Urutan = urutan render.</p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input value={blockDraf.name} onChange={(e) => setBlockDraf((d) => ({ ...d, name: e.target.value }))} placeholder="Block — ex: Hero / Product Grid" style={{ flex: "1 1 180px" }} />
              <input value={blockDraf.purpose} onChange={(e) => setBlockDraf((d) => ({ ...d, purpose: e.target.value }))} placeholder="Purpose — ex: 3 tier pricing" style={{ flex: "2 1 240px" }} />
              <button className="btn-primary sm" onClick={handleAddBlock} type="button"><Plus size={14} /> Add Block</button>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {(selected.blocks || []).length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", padding: 16, border: "1px dashed var(--border)", borderRadius: 10 }}>Belum ada blocks. Tambahkan minimal 1 block utama.</p>
              ) : selected.blocks.map((b, idx) => (
                <div key={b.id} className="planning-item">
                  <div style={{ display: "flex", gap: 10, flex: 1, alignItems: "center" }}>
                    <span className="badge" style={{ fontSize: 10 }}>#{idx + 1}</span>
                    <input value={b.name} onChange={(e) => updateBlock(selected.id, b.id, { name: e.target.value })} style={{ fontWeight: 600, flex: "0 1 180px", border: "1px solid transparent", background: "transparent", padding: "2px 6px" }} />
                    <input value={b.purpose} onChange={(e) => updateBlock(selected.id, b.id, { purpose: e.target.value })} style={{ flex: 1, fontSize: 13, color: "var(--text-muted)", border: "1px solid transparent", background: "transparent", padding: "2px 6px" }} />
                  </div>
                  <button className="btn-ghost sm danger" onClick={() => removeBlock(selected.id, b.id)} type="button"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { FEATURE_CATEGORY, FEATURE_STATUS, featureStatusMeta } from "../../hooks/useFeatures";

export default function FeatureDetailTab({ features, updateFeature, addCriteria, toggleCriteria, removeCriteria, updateCriteria, forcedId }) {
  const [selectedId, setSelectedId] = useState(forcedId || features[0]?.id || "");
  const [criteriaDraf, setCriteriaDraf] = useState("");

  useEffect(() => { if (forcedId) setSelectedId(forcedId); }, [forcedId]);
  useEffect(() => { if (!features.find((f)=>f.id===selectedId) && features[0]) setSelectedId(features[0].id); }, [features, selectedId]);

  const selected = useMemo(() => features.find((f) => f.id === selectedId) || null, [features, selectedId]);

  if (!features.length) return <div className="card" style={{ textAlign: "center", color: "var(--text-muted)", padding: 28 }}>Belum ada feature — tambah di Daftar Fitur dulu.</div>;

  if (!selected) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 20 }}>
        <p style={{ color: "var(--text-muted)" }}>Pilih feature di bawah.</p>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="field-input" style={{ maxWidth: 360, margin: "0 auto" }}>
          {features.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
        </select>
      </div>
    );
  }

  const meta = featureStatusMeta(selected.status);

  function handleAddCriteria() {
    if (!criteriaDraf.trim()) return;
    addCriteria(selected.id, criteriaDraf.trim());
    setCriteriaDraf("");
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Feature:</span>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="field-input" style={{ flex: "1 1 260px", maxWidth: 420, padding: "8px 12px" }}>
          {features.map((f) => <option key={f.id} value={f.id}>{f.title} — {f.status}</option>)}
        </select>
        <span className="badge" style={{ background: meta.color, color: "#fff", borderColor: meta.color }}>{meta.label}</span>
        <span className="badge">{selected.category}</span>
      </div>

      <div className="grid grid-2">
        <div className="card" style={{ display: "grid", gap: 12 }}>
          <h3 style={{ margin: 0 }}>Detail</h3>
          <label className="field"><span className="field-label">Title</span><input value={selected.title} onChange={(e) => updateFeature(selected.id, { title: e.target.value })} /></label>
          <label className="field"><span className="field-label">Description</span><textarea rows={3} value={selected.description} onChange={(e) => updateFeature(selected.id, { description: e.target.value })} className="field-input" /></label>
          <div className="grid grid-2">
            <label className="field"><span className="field-label">Category</span>
              <select value={selected.category} onChange={(e) => updateFeature(selected.id, { category: e.target.value })} className="field-input">
                {FEATURE_CATEGORY.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="field"><span className="field-label">Status</span>
              <select value={selected.status} onChange={(e) => updateFeature(selected.id, { status: e.target.value })} className="field-input">
                {FEATURE_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-2">
            <label className="field"><span className="field-label">Prioritas</span>
              <select value={selected.priority} onChange={(e) => updateFeature(selected.id, { priority: e.target.value })} className="field-input">
                <option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
              </select>
            </label>
            <label className="field"><span className="field-label">Effort</span>
              <select value={selected.effort} onChange={(e) => updateFeature(selected.id, { effort: e.target.value })} className="field-input">
                <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option>
              </select>
            </label>
          </div>
          <div className="grid grid-2">
            <label className="field"><span className="field-label">Page</span><input value={selected.page} onChange={(e) => updateFeature(selected.id, { page: e.target.value })} placeholder="/products atau global" /></label>
            <label className="field"><span className="field-label">Updated</span><input value={new Date(selected.updatedAt).toLocaleString("id-ID")} disabled /></label>
          </div>
          <label className="field"><span className="field-label">Catatan</span><textarea rows={3} value={selected.notes || ""} onChange={(e) => updateFeature(selected.id, { notes: e.target.value })} placeholder="Catatan teknis, dependency, dll" className="field-input" /></label>
        </div>

        <div className="card" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Acceptance Criteria</h3>
            <span className="badge">{(selected.criteria || []).filter((c)=>c.done).length}/{(selected.criteria || []).length}</span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Daftar Tugas kondisi selesai — centang untuk progress.</p>

          <div style={{ display: "flex", gap: 8 }}>
            <input value={criteriaDraf} onChange={(e) => setCriteriaDraf(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && handleAddCriteria()} placeholder="Tambah criteria — ex: Handle empty state" style={{ flex: 1 }} />
            <button className="btn-primary sm" onClick={handleAddCriteria} type="button"><Plus size={14} /></button>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {(selected.criteria || []).length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", padding: 16, border: "1px dashed var(--border)", borderRadius: 10 }}>Belum ada criteria.</p>
            ) : selected.criteria.map((c) => (
              <div key={c.id} className="planning-item" style={{ opacity: c.done ? 0.7 : 1 }}>
                <label style={{ display: "flex", gap: 10, flex: 1, alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" checked={!!c.done} onChange={() => toggleCriteria(selected.id, c.id)} />
                  <input value={c.text} onChange={(e) => updateCriteria(selected.id, c.id, { text: e.target.value })} style={{ flex: 1, textDecoration: c.done ? "line-through" : "none", border: "1px solid transparent", background: "transparent", padding: "2px 4px" }} />
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  {c.done && <span style={{ color: "#15803d", display: "grid", placeItems: "center" }}><Check size={14} /></span>}
                  <button className="btn-ghost sm danger" onClick={() => removeCriteria(selected.id, c.id)} type="button"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 10, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text)" }}>Tip:</strong> Tulis criteria dengan format testable: “User dapat...”, “System harus...”.
          </div>
        </div>
      </div>
    </div>
  );
}
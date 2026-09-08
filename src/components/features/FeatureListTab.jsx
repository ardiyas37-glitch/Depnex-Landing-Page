import { useMemo, useState } from "react";
import { Search, Plus, Copy, Trash2, Edit3 } from "lucide-react";
import { FEATURE_STATUS, FEATURE_CATEGORY, featureStatusMeta } from "../../hooks/useFeatures";

export default function FeatureListTab({ features, addFeature, updateFeature, removeFeature, duplicateFeature, onSelect }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [draft, setDraf] = useState({ title: "", category: "Core", status: "idea", priority: "medium", effort: "M" });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return features.filter((f) => {
      const matchQ = !q || f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || f.status === statusFilter;
      const matchCat = catFilter === "all" || f.category === catFilter;
      return matchQ && matchStatus && matchCat;
    });
  }, [features, query, statusFilter, catFilter]);

  function handleAdd() {
    if (!draft.title.trim()) return;
    addFeature({ title: draft.title.trim(), category: draft.category, status: draft.status, priority: draft.priority, effort: draft.effort });
    setDraf({ title: "", category: "Core", status: "idea", priority: "medium", effort: "M" });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0 }}>Daftar Fitur</h3>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>Kembalilog fitur — filter, sort, dan lompat ke Detail.</p>
          </div>
        </div>

        {/* Add quick */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <input value={draft.title} onChange={(e) => setDraf((d) => ({ ...d, title: e.target.value }))} placeholder="Feature title — ex: Payment QRIS" style={{ flex: "2 1 200px" }} />
          <select value={draft.category} onChange={(e) => setDraf((d) => ({ ...d, category: e.target.value }))} className="field-input" style={{ flex: "0 1 130px", padding: "8px 10px" }}>
            {FEATURE_CATEGORY.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={draft.status} onChange={(e) => setDraf((d) => ({ ...d, status: e.target.value }))} className="field-input" style={{ flex: "0 1 130px", padding: "8px 10px" }}>
            {FEATURE_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={draft.priority} onChange={(e) => setDraf((d) => ({ ...d, priority: e.target.value }))} className="field-input" style={{ flex: "0 1 110px", padding: "8px 10px" }}>
            <option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
          </select>
          <select value={draft.effort} onChange={(e) => setDraf((d) => ({ ...d, effort: e.target.value }))} className="field-input" style={{ flex: "0 1 80px", padding: "8px 10px" }}>
            <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option>
          </select>
          <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah</button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari title / description..." style={{ paddingLeft: 32, width: "100%" }} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field-input" style={{ flex: "0 1 150px", padding: "8px 10px" }}>
            <option value="all">All status</option>{FEATURE_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="field-input" style={{ flex: "0 1 140px", padding: "8px 10px" }}>
            <option value="all">All category</option>{FEATURE_CATEGORY.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Grid */}
        <div className="features-grid" style={{ marginTop: 14 }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 13, padding: 20, border: "1px dashed var(--border)", borderRadius: 10, gridColumn: "1 / -1" }}>Tidak ada feature untuk filter ini.</p>
          ) : filtered.map((f) => {
            const meta = featureStatusMeta(f.status);
            return (
              <div key={f.id} className="feature-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <span className="badge" style={{ fontSize: 10 }}>{f.category}</span>
                  <span className="badge" style={{ background: meta.color, color: "#fff", borderColor: meta.color, fontSize: 10 }}>{meta.label}</span>
                </div>
                <h4 style={{ margin: "6px 0 4px", fontSize: 14, lineHeight: 1.3, cursor: "pointer" }} onClick={() => onSelect?.(f.id)}>{f.title}</h4>
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, minHeight: 36, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{f.description || "— belum ada deskripsi —"}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 8, fontSize: 11 }}>
                  <span className={`badge prio-${f.priority}`} style={{ fontSize: 10 }}>{f.priority}</span>
                  <span className="badge" style={{ fontSize: 10 }}>effort {f.effort}</span>
                  <span style={{ color: "var(--text-faint)" }}>{f.page}</span>
                  {(f.criteria?.length || 0) > 0 && <span style={{ color: "var(--text-muted)" }}>{f.criteria.filter((c)=>c.done).length}/{f.criteria.length} criteria</span>}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  <button className="btn-secondary sm" onClick={() => onSelect?.(f.id)} type="button" style={{ flex: 1 }}><Edit3 size={12} /> Detail</button>
                  <button className="btn-ghost sm" onClick={() => duplicateFeature(f.id)} type="button"><Copy size={12} /></button>
                  <button className="btn-ghost sm danger" onClick={() => { if (confirm(`Hapus ${f.title}?`)) removeFeature(f.id); }} type="button"><Trash2 size={12} /></button>
                </div>
                <div style={{ marginTop: 8 }}>
                  <select value={f.status} onChange={(e) => updateFeature(f.id, { status: e.target.value })} className="select-sm" style={{ width: "100%" }}>
                    {FEATURE_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
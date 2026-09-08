import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { REQ_TYPE, REQ_PRIORITY } from "../../hooks/usePages";

export default function PageRequirementsTab({ pages, requirements, addRequirement, updateRequirement, removeRequirement }) {
  const [filterPage, setFilterPage] = useState("all");
  const [draft, setDraf] = useState({ pageId: pages[0]?.id || "", title: "", type: "functional", priority: "medium" });

  const filtered = useMemo(() => {
    const f = filterPage === "all" ? requirements : requirements.filter((r) => r.pageId === filterPage);
    return f;
  }, [requirements, filterPage]);

  const grouped = useMemo(() => {
    const g = {};
    for (const r of filtered) {
      const key = pages.find((p) => p.id === r.pageId)?.title || "Unknown";
      if (!g[key]) g[key] = [];
      g[key].push(r);
    }
    return g;
  }, [filtered, pages]);

  function handleAdd() {
    if (!draft.title.trim() || !draft.pageId) return;
    addRequirement({ pageId: draft.pageId, title: draft.title.trim(), type: draft.type, priority: draft.priority });
    setDraf((d) => ({ ...d, title: "" }));
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0 }}>Persyaratan Halaman</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>
          Requirement per halaman — fungsional, SEO, UI, data, auth. Centang jika done. Filter untuk fokus 1 page.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <select value={draft.pageId} onChange={(e) => setDraf((d) => ({ ...d, pageId: e.target.value }))} className="field-input" style={{ flex: "1 1 160px", padding: "8px 10px" }}>
            {pages.map((p) => <option key={p.id} value={p.id}>{p.title} — {p.path}</option>)}
          </select>
          <input value={draft.title} onChange={(e) => setDraf((d) => ({ ...d, title: e.target.value }))} placeholder="Requirement — ex: Handle 404 jika :id tidak ada" style={{ flex: "2 1 260px" }} />
          <select value={draft.type} onChange={(e) => setDraf((d) => ({ ...d, type: e.target.value }))} className="field-input" style={{ flex: "0 1 130px", padding: "8px 10px" }}>
            {REQ_TYPE.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={draft.priority} onChange={(e) => setDraf((d) => ({ ...d, priority: e.target.value }))} className="field-input" style={{ flex: "0 1 110px", padding: "8px 10px" }}>
            {REQ_PRIORITY.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah</button>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Filter:</span>
          <button onClick={() => setFilterPage("all")} className={`btn-ghost sm ${filterPage === "all" ? "active-filter" : ""}`} type="button">All ({requirements.length})</button>
          {pages.map((p) => {
            const count = requirements.filter((r) => r.pageId === p.id).length;
            return (
              <button key={p.id} onClick={() => setFilterPage(p.id)} className={`btn-ghost sm ${filterPage === p.id ? "active-filter" : ""}`} type="button">
                {p.title} <span style={{ fontSize: 11, opacity: 0.7 }}>({count})</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, fontSize: 12, color: "var(--text-muted)" }}>
          <span>Done: {filtered.filter((r) => r.done).length}/{filtered.length}</span><span>•</span><span>Tinggi: {filtered.filter((r) => r.priority === "high").length}</span>
        </div>

        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 13, padding: 20, border: "1px dashed var(--border)", borderRadius: 10 }}>Belum ada requirements untuk filter ini.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {filterPage === "all" ? (
              Object.entries(grouped).map(([pageTitle, list]) => (
                <div key={pageTitle}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>{pageTitle} — {list.length}</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {list.map((r) => (
                      <RequirementRow key={r.id} r={r} pages={pages} updateRequirement={updateRequirement} removeRequirement={removeRequirement} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {filtered.map((r) => <RequirementRow key={r.id} r={r} pages={pages} updateRequirement={updateRequirement} removeRequirement={removeRequirement} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RequirementRow({ r, pages, updateRequirement, removeRequirement }) {
  const page = pages.find((p) => p.id === r.pageId);
  return (
    <div className="planning-item" style={{ opacity: r.done ? 0.75 : 1 }}>
      <label style={{ display: "flex", gap: 10, flex: 1, alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={!!r.done} onChange={(e) => updateRequirement(r.id, { done: e.target.checked })} />
        <input value={r.title} onChange={(e) => updateRequirement(r.id, { title: e.target.value })} style={{ flex: 1, textDecoration: r.done ? "line-through" : "none", border: "1px solid transparent", background: "transparent", padding: "2px 4px" }} />
      </label>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {!page ? null : <span className="badge" style={{ fontSize: 10, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.path}</span>}
        <span className="badge" style={{ fontSize: 10 }}>{r.type}</span>
        <select value={r.priority} onChange={(e) => updateRequirement(r.id, { priority: e.target.value })} className="select-sm">
          <option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
        </select>
        <span className={`badge prio-${r.priority}`} style={{ fontSize: 10 }}>{r.priority}</span>
        <select value={r.pageId} onChange={(e) => updateRequirement(r.id, { pageId: e.target.value })} className="select-sm">
          {pages.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <button className="btn-ghost sm danger" onClick={() => removeRequirement(r.id)} type="button"><Trash2 size={12} /></button>
      </div>
    </div>
  );
}
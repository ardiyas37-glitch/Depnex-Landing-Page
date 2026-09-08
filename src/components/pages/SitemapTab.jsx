import { useState, useMemo } from "react";
import { Search, Plus, Copy, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { pageStatusMeta, PAGE_TYPE, PAGE_STATUS } from "../../hooks/usePages";

export default function SitemapTab({ pages, addPage, updatePage, removePage, duplicatePage, movePage }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [draft, setDraf] = useState({ title: "", path: "", type: "Public", status: "draft" });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return pages.filter((p) => {
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.path.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [pages, query, statusFilter]);

  function handleAdd() {
    if (!draft.title.trim() || !draft.path.trim()) return;
    const path = draft.path.startsWith("/") ? draft.path : `/${draft.path}`;
    addPage({ title: draft.title.trim(), path, type: draft.type, status: draft.status });
    setDraf({ title: "", path: "", type: "Public", status: "draft" });
  }

  function exportSitemap() {
    const data = pages.map((p) => ({ path: p.path, title: p.title, type: p.type, status: p.status }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "sitemap.json"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0 }}>Sitemap</h3>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
              Daftar semua halaman — urutkan sesuai navigasi. Path harus unik. Parent via indent (opsional).
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost sm" onClick={exportSitemap} type="button"><ExternalLink size={14} /> Export JSON</button>
          </div>
        </div>

        {/* Add form */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, padding: 12, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <input value={draft.title} onChange={(e) => setDraf((d) => ({ ...d, title: e.target.value }))} placeholder="Title — ex: Contact" style={{ flex: "1 1 160px" }} />
          <input value={draft.path} onChange={(e) => setDraf((d) => ({ ...d, path: e.target.value }))} placeholder="Path — ex: /contact" style={{ flex: "1 1 160px" }} />
          <select value={draft.type} onChange={(e) => setDraf((d) => ({ ...d, type: e.target.value }))} className="field-input" style={{ flex: "0 1 130px", padding: "8px 10px" }}>
            {PAGE_TYPE.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={draft.status} onChange={(e) => setDraf((d) => ({ ...d, status: e.target.value }))} className="field-input" style={{ flex: "0 1 130px", padding: "8px 10px" }}>
            {PAGE_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah</button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 14 }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari title / path..." style={{ paddingLeft: 32, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => setStatusFilter("all")} className={`btn-ghost sm ${statusFilter === "all" ? "active-filter" : ""}`} type="button">All ({pages.length})</button>
            {PAGE_STATUS.map((s) => (
              <button key={s.value} onClick={() => setStatusFilter(s.value)} className={`btn-ghost sm ${statusFilter === s.value ? "active-filter" : ""}`} type="button" style={{ borderColor: statusFilter === s.value ? s.color : undefined, color: statusFilter === s.value ? s.color : undefined }}>
                <span className="status-dot" style={{ background: s.color }} /> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 13, padding: 20, border: "1px dashed var(--border)", borderRadius: 10 }}>Tidak ada halaman untuk filter ini.</p>
          ) : filtered.map((p, idx) => {
            const meta = pageStatusMeta(p.status);
            const isChild = !!p.parentId;
            return (
              <div key={p.id} className="planning-item" style={{ marginLeft: isChild ? 20 : 0, borderLeft: isChild ? "3px solid var(--border)" : undefined }}>
                <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 4 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <input value={p.title} onChange={(e) => updatePage(p.id, { title: e.target.value })} style={{ fontWeight: 600, border: "1px solid transparent", background: "transparent", padding: "2px 4px", flex: "0 1 auto", minWidth: 120 }} />
                    <span className="badge" style={{ fontSize: 10 }}>{p.type}</span>
                    <span className="badge" style={{ background: meta.color, color: "#fff", borderColor: meta.color, fontSize: 10 }}>{meta.label}</span>
                    {isChild && <span className="badge" style={{ fontSize: 10 }}>child</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <code style={{ fontSize: 12, background: "var(--off-white)", padding: "2px 6px", borderRadius: 6, border: "1px solid var(--border)" }}>{p.path}</code>
                    <input value={p.path} onChange={(e) => updatePage(p.id, { path: e.target.value })} style={{ fontSize: 12, color: "var(--text-muted)", border: "1px solid transparent", background: "transparent", padding: "2px 4px", flex: "1 1 140px" }} placeholder="/path" />
                  </div>
                  {p.description && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.description}</span>}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <span className="badge" style={{ fontSize: 10 }}>#{idx + 1}</span>
                  <button className="btn-ghost sm" onClick={() => movePage(p.id, "up")} disabled={idx === 0} type="button"><ArrowUp size={12} /></button>
                  <button className="btn-ghost sm" onClick={() => movePage(p.id, "down")} disabled={idx === filtered.length - 1} type="button"><ArrowDown size={12} /></button>
                  <button className="btn-ghost sm" onClick={() => duplicatePage(p.id)} type="button"><Copy size={12} /></button>
                  <button className="btn-ghost sm danger" onClick={() => { if (confirm(`Hapus ${p.title}?`)) removePage(p.id); }} type="button"><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12, padding: 10, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>Tips sitemap:</strong> Susun urutan sesuai navigasi (Home → About → Products → Contact). Dynamic routes pakai <code>:id</code> (ex: <code>/products/:id</code>) sebagai child dari parent. Path duplikat akan warning saat generate.
        </div>
      </div>
    </div>
  );
}
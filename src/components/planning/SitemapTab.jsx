import { useState } from "react";

export default function SitemapTab({ sitemap, addSitemapPage, updateSitemapPage, removeSitemapPage, moveSitemap }) {
  const [draft, setDraf] = useState({ title:"", path:"", description:"" });

  function handleAdd(){
    if(!draft.title.trim()) return;
    const path = draft.path.trim() || "/" + draft.title.toLowerCase().replace(/\s+/g,"-");
    addSitemapPage({ title: draft.title.trim(), path, description: draft.description.trim() });
    setDraf({ title:"", path:"", description:"" });
  }

  function renderTree(){
    // simple flat list with indent if parentId (future)
    return sitemap.map((p, idx)=> (
      <div key={p.id} className="planning-item">
        <div style={{ flex:1, display:"grid", gap:4 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span className="badge" style={{ fontSize:10 }}>{idx+1}</span>
            <input value={p.title} onChange={e=> updateSitemapPage(p.id, { title: e.target.value })} style={{ fontWeight:600, border:"1px solid transparent", background:"transparent", padding:"2px 4px", flex:"0 1 160px" }} />
            <code style={{ fontSize:11, background:"var(--bg)", border:"1px solid var(--border)", padding:"2px 6px", borderRadius:6, color:"var(--text-muted)" }}>{p.path}</code>
          </div>
          <input value={p.path} onChange={e=> updateSitemapPage(p.id, { path: e.target.value })} placeholder="/path" style={{ fontSize:12, color:"var(--text-muted)", border:"1px solid transparent", background:"transparent", padding:"2px 4px" }} />
          <input value={p.description||""} onChange={e=> updateSitemapPage(p.id, { description: e.target.value })} placeholder="Description — purpose of this page" style={{ fontSize:12, color:"var(--text-muted)", border:"1px solid transparent", background:"transparent", padding:"2px 4px" }} />
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button className="btn-ghost sm" onClick={()=> moveSitemap(p.id,"up")} disabled={idx===0} type="button">▲</button>
          <button className="btn-ghost sm" onClick={()=> moveSitemap(p.id,"down")} disabled={idx===sitemap.length-1} type="button">▼</button>
          <button className="btn-ghost sm danger" onClick={()=> removeSitemapPage(p.id)} type="button">Hapus</button>
        </div>
      </div>
    ));
  }

  return (
    <div className="planning-panel" style={{ display:"grid", gap:16 }}>
      <div className="card">
        <h3 style={{ margin:0 }}>Sitemap</h3>
        <p style={{ margin:"4px 0 14px", color:"var(--text-muted)", fontSize:13 }}>Bangun hierarki halaman. This becomes your routing plan. Keep paths lowercase, kebab-case.</p>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          <input value={draft.title} onChange={e=> setDraf(d=>({...d, title:e.target.value}))} placeholder="Judul — ex: Tentang" style={{ flex:"1 1 140px" }} />
          <input value={draft.path} onChange={e=> setDraf(d=>({...d, path:e.target.value}))} placeholder="Path — ex: /tentang" style={{ flex:"1 1 140px" }} />
          <input value={draft.description} onChange={e=> setDraf(d=>({...d, description:e.target.value}))} placeholder="Tujuan — ex: Cerita perusahaan" style={{ flex:"2 1 200px" }} />
          <button className="btn-primary" onClick={handleAdd} type="button">+ Tambah</button>
        </div>

        {sitemap.length===0 ? (
          <div style={{ padding:16, textAlign:"center", border:"1px dashed var(--border)", borderRadius:8, background:"var(--bg)" }}>
            <p style={{ fontSize:12, color:"var(--text-faint)", margin:0 }}>Belum ada halaman. Mulai dengan Beranda → About → Services → Contact.</p>
            <pre style={{ textAlign:"left", display:"inline-block", margin:"12px 0 0", fontSize:11, color:"var(--text-muted)", background:"var(--bg)", border:"1px solid var(--border)", padding:"8px 10px", borderRadius:6 }}>Home
├── About
├── Services
├── Portfolio
└── Contact</pre>
          </div>
        ) : (
          <div style={{ display:"grid", gap:8 }}>{renderTree()}</div>
        )}
      </div>
    </div>
  );
}
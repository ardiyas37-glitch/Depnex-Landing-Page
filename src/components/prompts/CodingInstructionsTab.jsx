import { useState } from "react";
import { Plus, Trash2, Code2 } from "lucide-react";
import { INSTRUCTION_CATEGORY } from "../../hooks/useAI";

export default function CodingInstructionsTab({ ai }) {
  const [draft, setDraf] = useState({ title: "", category: "General", body: "", enabled: true });
  const [filterCat, setFilterCat] = useState("all");

  const filtered = filterCat==="all" ? ai.instructions : ai.instructions.filter(i=>i.category===filterCat);

  function handleAdd() {
    if (!draft.title.trim()) return;
    ai.addInstruction({ ...draft, title: draft.title.trim() });
    setDraf({ title: "", category: "General", body: "", enabled: true });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin:0, display:"flex", gap:8, alignItems:"center" }}><Code2 size={16} /> Instruksi Coding</h3>
        <p style={{ margin:"4px 0 14px", color:"var(--text-muted)", fontSize:13 }}>Aturan untuk agent — hanya yang <strong>enabled</strong> masuk ke prompt.</p>

        <div style={{ display:"grid", gap:8, padding:12, background:"var(--off-white)", border:"1px solid var(--border)", borderRadius:12 }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <input value={draft.title} onChange={(e)=>setDraf(d=>({...d,title:e.target.value}))} placeholder="Title — ex: No inline styles" style={{ flex:"2 1 200px" }} />
            <select value={draft.category} onChange={(e)=>setDraf(d=>({...d,category:e.target.value}))} className="field-input" style={{ flex:"0 1 140px", padding:"8px 10px" }}>
              {INSTRUCTION_CATEGORY.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={{ display:"inline-flex", gap:6, alignItems:"center", fontSize:13 }}><input type="checkbox" checked={draft.enabled} onChange={(e)=>setDraf(d=>({...d,enabled:e.target.checked}))} /> Enabled</label>
            <button className="btn-primary sm" onClick={handleAdd} type="button"><Plus size={14} /> Tambah</button>
          </div>
          <textarea rows={2} value={draft.body} onChange={(e)=>setDraf(d=>({...d,body:e.target.value}))} placeholder="Body — detail instruksi" className="field-input" />
        </div>

        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12, alignItems:"center" }}>
          <span style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)" }}>Filter:</span>
          <button onClick={()=>setFilterCat("all")} className={`btn-ghost sm ${filterCat==="all"?"active-filter":""}`} type="button">All ({ai.instructions.length})</button>
          {INSTRUCTION_CATEGORY.map(c=> <button key={c} onClick={()=>setFilterCat(c)} className={`btn-ghost sm ${filterCat===c?"active-filter":""}`} type="button">{c}</button>)}
          <span style={{ marginLeft:"auto", fontSize:12, color:"var(--text-muted)" }}>{ai.instructions.filter(i=>i.enabled).length} enabled</span>
        </div>

        <div style={{ display:"grid", gap:8, marginTop:12 }}>
          {filtered.length===0 ? <p style={{ textAlign:"center", color:"var(--text-faint)", fontSize:13, padding:16, border:"1px dashed var(--border)", borderRadius:10 }}>Belum ada instructions.</p> :
            filtered.map(ins=> (
              <div key={ins.id} className="planning-item" style={{ opacity: ins.enabled?1:0.6, alignItems:"flex-start" }}>
                <label style={{ display:"flex", gap:10, flex:1, alignItems:"flex-start", cursor:"pointer" }}>
                  <input type="checkbox" checked={!!ins.enabled} onChange={()=>ai.toggleInstruction(ins.id)} style={{ marginTop:4 }} />
                  <div style={{ flex:1, display:"grid", gap:4 }}>
                    <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                      <input value={ins.title} onChange={(e)=>ai.updateInstruction(ins.id,{title:e.target.value})} style={{ fontWeight:600, fontSize:13, border:"1px solid transparent", background:"transparent", padding:"2px 4px", flex:"1 1 160px" }} />
                      <span className="badge" style={{ fontSize:10 }}>{ins.category}</span>
                      <span className={`badge ${ins.enabled?"prio-low":""}`} style={{ fontSize:10 }}>{ins.enabled?"enabled":"disabled"}</span>
                    </div>
                    <textarea rows={2} value={ins.body} onChange={(e)=>ai.updateInstruction(ins.id,{body:e.target.value})} placeholder="body" className="field-input" style={{ fontSize:12, padding:"6px 8px" }} />
                  </div>
                </label>
                <div style={{ display:"flex", gap:6, flexDirection:"column" }}>
                  <select value={ins.category} onChange={(e)=>ai.updateInstruction(ins.id,{category:e.target.value})} className="select-sm">
                    {INSTRUCTION_CATEGORY.map(c=> <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button className="btn-ghost sm danger" onClick={()=>ai.removeInstruction(ins.id)} type="button"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
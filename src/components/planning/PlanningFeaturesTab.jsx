import { useState } from "react";

const prio = ["low","medium","high","critical"];

export default function PlanningFeaturesTab({ features, addFeature, updateFeature, removeFeature, toggleFeature }) {
  const [draft, setDraf] = useState({ title:"", description:"", priority:"medium" });

  function handleAdd(){
    if(!draft.title.trim()) return;
    addFeature(draft);
    setDraf({ title:"", description:"", priority:"medium" });
  }

  return (
    <div className="planning-panel" style={{ display:"grid", gap:16 }}>
      <div className="card">
        <h3 style={{ margin:0 }}>Fitur</h3>
        <p style={{ margin:"4px 0 14px", color:"var(--text-muted)", fontSize:13 }}>Kemampuan inti at a glance. Keep titles action-oriented. Link to Peta Situs/Bagian later.</p>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          <input value={draft.title} onChange={e=> setDraf(d=>({...d, title:e.target.value}))} placeholder="Feature — ex: Booking form" style={{ flex:"1 1 180px" }} />
          <input value={draft.description} onChange={e=> setDraf(d=>({...d, description:e.target.value}))} placeholder="Description — ex: Select date + time + submit" style={{ flex:"2 1 260px" }} />
          <select value={draft.priority} onChange={e=> setDraf(d=>({...d, priority:e.target.value}))} className="field-input" style={{ flex:"0 1 130px" }}>
            {prio.map(p=> <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="btn-primary" onClick={handleAdd} type="button">+ Tambah</button>
        </div>

        {features.length===0 ? (
          <p style={{ fontSize:12, color:"var(--text-faint)", textAlign:"center", padding:12, border:"1px dashed var(--border)", borderRadius:8, margin:0 }}>Belum ada fitur. Add the first must-have.</p>
        ) : (
          <div style={{ display:"grid", gap:8 }}>
            {features.map(f=> (
              <div key={f.id} className="planning-item" style={{ opacity: f.done ? 0.7 : 1 }}>
                <label style={{ display:"flex", gap:8, flex:1, alignItems:"center" }}>
                  <input type="checkbox" checked={!!f.done} onChange={()=> toggleFeature(f.id)} />
                  <input value={f.title} onChange={e=> updateFeature(f.id, { title: e.target.value })} style={{ flex:"0 1 180px", fontWeight:600, border:"1px solid transparent", background:"transparent", padding:"2px 4px", textDecoration: f.done ? "line-through":"none" }} />
                  <input value={f.description} onChange={e=> updateFeature(f.id, { description: e.target.value })} style={{ flex:1, fontSize:12, color:"var(--text-muted)", border:"1px solid transparent", background:"transparent", padding:"2px 4px" }} placeholder="description" />
                </label>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <select value={f.priority} onChange={e=> updateFeature(f.id, { priority: e.target.value })} className="select-sm">
                    {prio.map(p=> <option key={p} value={p}>{p}</option>)}
                  </select>
                  <span className={`badge prio-${f.priority==='critical'?'high':f.priority}`} style={{ fontSize:10 }}>{f.priority}</span>
                  <button className="btn-ghost sm danger" onClick={()=> removeFeature(f.id)} type="button">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";

const priorities = ["low","medium","high","critical"];
const statuses = ["pending","in-progress","done","cancelled"];

export default function GoalsTab({ goals, addGoal, updateGoal, removeGoal }) {
  const [draft, setDraf] = useState({ text:"", priority:"medium", status:"pending" });

  function handleAdd(){
    if(!draft.text.trim()) return;
    addGoal(draft);
    setDraf({ text:"", priority:"medium", status:"pending" });
  }

  return (
    <div className="planning-panel" style={{ display:"grid", gap:16 }}>
      <div className="card">
        <h3 style={{ margin:0 }}>Tujuan</h3>
        <p style={{ margin:"4px 0 14px", color:"var(--text-muted)", fontSize:13 }}>Tentukan hasil yang terukur. Each goal has priority & status. Kosong secara default — tambah hanya tujuan nyata.</p>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          <input value={draft.text} onChange={e=> setDraf(d=>({...d, text:e.target.value}))} placeholder="Tujuan — ex: Meningkatkan pelanggan" style={{ flex:"2 1 260px" }} onKeyDown={e=> e.key==="Enter" && handleAdd()} />
          <select value={draft.priority} onChange={e=> setDraf(d=>({...d, priority:e.target.value}))} className="field-input" style={{ flex:"0 1 130px" }}>
            {priorities.map(p=> <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={draft.status} onChange={e=> setDraf(d=>({...d, status:e.target.value}))} className="field-input" style={{ flex:"0 1 130px" }}>
            {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-primary" onClick={handleAdd} type="button">+ Tambah Tujuan</button>
        </div>

        {goals.length===0 ? (
          <div style={{ padding:20, textAlign:"center", border:"1px dashed var(--border)", borderRadius:10, background:"var(--bg)" }}>
            <p style={{ color:"var(--text-faint)", fontSize:13, margin:0 }}>Belum ada tujuan. Klik “Tambah Tujuan” to capture the first outcome.</p>
          </div>
        ) : (
          <div style={{ display:"grid", gap:8 }}>
            {goals.map(g=> (
              <div key={g.id} className="planning-item">
                <div style={{ flex:1, display:"flex", gap:8, alignItems:"center" }}>
                  <input value={g.text} onChange={e=> updateGoal(g.id, { text: e.target.value })} style={{ flex:1, border:"1px solid transparent", background:"transparent", padding:"2px 4px", fontWeight:500 }} />
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <select value={g.priority} onChange={e=> updateGoal(g.id, { priority: e.target.value })} className="select-sm">
                    {priorities.map(p=> <option key={p} value={p}>{p}</option>)}
                  </select>
                  <span className={`badge prio-${g.priority==='critical'?'high':g.priority}`} style={{ fontSize:10 }}>{g.priority}</span>
                  <select value={g.status} onChange={e=> updateGoal(g.id, { status: e.target.value })} className="select-sm">
                    {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="btn-ghost sm danger" onClick={()=> removeGoal(g.id)} type="button">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
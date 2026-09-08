import { useState } from "react";

function ScopeList({ title, items, kind, add, update, remove }) {
  const [draft, setDraf] = useState("");
  function handleAdd(){
    if(!draft.trim()) return;
    add(kind, draft);
    setDraf("");
  }
  return (
    <div className="card" style={{ display:"grid", gap:10 }}>
      <h3 style={{ margin:0, display:"flex", gap:8, alignItems:"center" }}>{title} <span className="badge" style={{ fontSize:10 }}>{items.length}</span></h3>
      <div style={{ display:"flex", gap:8 }}>
        <input value={draft} onChange={e=> setDraf(e.target.value)} placeholder={kind==="in" ? "In scope — ex: Booking form" : "Out of scope — ex: Payment gateway"} style={{ flex:1 }} onKeyDown={e=> e.key==="Enter" && handleAdd()} />
        <button className="btn-primary sm" onClick={handleAdd} type="button">+ Tambah</button>
      </div>
      {items.length===0 ? (
        <p style={{ fontSize:12, color:"var(--text-faint)", textAlign:"center", padding:12, border:"1px dashed var(--border)", borderRadius:8, margin:0 }}>Belum ada item.</p>
      ) : (
        <div style={{ display:"grid", gap:8 }}>
          {items.map(it=> (
            <div key={it.id} className="planning-item">
              <input value={it.text} onChange={e=> update(kind, it.id, e.target.value)} style={{ flex:1, border:"1px solid transparent", background:"transparent", padding:"2px 4px" }} />
              <button className="btn-ghost sm danger" onClick={()=> remove(kind, it.id)} type="button">Hapus</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScopeTab({ scope, addScopeItem, updateScopeItem, removeScopeItem }) {
  return (
    <div className="planning-panel" style={{ display:"grid", gap:16 }}>
      <div style={{ display:"grid", gap:4 }}>
        <h3 style={{ margin:0 }}>Ruang Lingkup</h3>
        <p style={{ margin:0, color:"var(--text-muted)", fontSize:13 }}>Tentukan batasan untuk mencegah scope creep. Be explicit about what you will and will not build now.</p>
      </div>
      <div className="grid grid-2">
        <ScopeList title="DALAM LINGKUP" items={scope.inScope} kind="in" add={addScopeItem} update={updateScopeItem} remove={removeScopeItem} />
        <ScopeList title="DI LUAR LINGKUP" items={scope.outOfScope} kind="out" add={addScopeItem} update={updateScopeItem} remove={removeScopeItem} />
      </div>
    </div>
  );
}
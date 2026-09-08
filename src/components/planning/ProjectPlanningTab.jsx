import { useState } from "react";
import { PROJECT_TYPES, PLATFORMS, STACK_OPTIONS } from "../../hooks/usePlanning";

export default function ProjectPlanningTab({ project, updateProject }) {
  const [stackInput, setStackInput] = useState("");

  const stack = Array.isArray(project.stack) ? project.stack : [];

  function toggleStack(val) {
    if (stack.includes(val)) updateProject({ stack: stack.filter(s => s!==val) });
    else updateProject({ stack: [...stack, val] });
  }
  function addCustomStack() {
    const v = stackInput.trim();
    if (!v || stack.includes(v)) return;
    updateProject({ stack: [...stack, v] });
    setStackInput("");
  }
  function removeStack(val) {
    updateProject({ stack: stack.filter(s=> s!==val) });
  }

  return (
    <div className="planning-panel">
      <div className="card" style={{ display: "grid", gap: 16 }}>
        <div>
          <h3 style={{ margin: 0 }}>Informasi Proyek</h3>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
            Structured briefing — single source of truth for AI generation. All fields optional but the more complete, the better the prompt.
          </p>
        </div>

        <div className="grid grid-2">
          <label className="field">
            <span className="field-label">Nama Proyek *</span>
            <input value={project.name} onChange={(e) => updateProject({ name: e.target.value })} placeholder="Ex: DepalBooking" />
          </label>
          <label className="field">
            <span className="field-label">Jenis Proyek</span>
            <select value={project.type} onChange={(e) => updateProject({ type: e.target.value })} className="field-input">
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field-label">Description</span>
          <textarea rows={3} value={project.description} onChange={(e) => updateProject({ description: e.target.value })} placeholder="What are you building? 2-3 sentences, plain language." className="field-input" />
        </label>

        <div className="grid grid-2">
          <label className="field">
            <span className="field-label">Tujuan Proyek</span>
            <input value={project.goal || ""} onChange={(e)=> updateProject({ goal: e.target.value })} placeholder="Ex: Increase bookings by 30%" />
          </label>
          <label className="field">
            <span className="field-label">Target Pengguna</span>
            <input value={project.targetAudience || project.audience || ""} onChange={(e)=> updateProject({ targetAudience: e.target.value, audience: e.target.value })} placeholder="Ex: UMKM owners, 25-40" />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="field">
            <span className="field-label">Platform</span>
            <select value={project.platform || "Web"} onChange={(e)=> updateProject({ platform: e.target.value })} className="field-input">
              {PLATFORMS.map(p=> <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Status</span>
            <select value={project.status} onChange={(e) => updateProject({ status: e.target.value })} className="field-input">
              <option value="draft">Draf</option>
              <option value="in-progress">Sedang Dikerjakan</option>
              <option value="review">Ditinjau</option>
              <option value="ready">Ready to Build</option>
            </select>
          </label>
        </div>

        <div className="field">
          <span className="field-label">Teknologi <span style={{ fontWeight:400, color:"var(--text-faint)"}}>(tap to toggle, add custom)</span></span>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            {STACK_OPTIONS.map(s=> (
              <button key={s} type="button" onClick={()=> toggleStack(s)} className={`btn-ghost sm ${stack.includes(s) ? "active-filter" : ""}`} style={{ fontSize:12, padding:"4px 8px" }}>{s}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={stackInput} onChange={(e)=> setStackInput(e.target.value)} onKeyDown={e=> e.key==="Enter" && (e.preventDefault(), addCustomStack())} placeholder="Custom stack — ex: Supabase" style={{ flex:1 }} />
            <button type="button" className="btn-secondary" onClick={addCustomStack}>Tambah</button>
          </div>
          {stack.length>0 && <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>{stack.map(s=> <span key={s} className="badge" style={{ gap:6 }}>{s} <button onClick={()=> removeStack(s)} style={{ background:"none", border:0, color:"inherit", cursor:"pointer", padding:0, fontSize:10 }}>✕</button></span>)}</div>}
        </div>

        <div className="grid grid-2">
          <label className="field">
            <span className="field-label">Tenggat Waktu</span>
            <input type="date" value={project.deadline} onChange={(e) => updateProject({ deadline: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Anggaran / Estimasi</span>
            <input value={project.budget} onChange={(e) => updateProject({ budget: e.target.value })} placeholder="Ex: Rp 5jt, flexible" />
          </label>
        </div>

        <label className="field">
          <span className="field-label">Referensi Inspirasi / References</span>
          <input value={project.inspiration} onChange={(e) => updateProject({ inspiration: e.target.value })} placeholder="Links, dribbble, competitors" />
        </label>
      </div>
    </div>
  );
}
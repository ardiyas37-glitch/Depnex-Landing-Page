import { useState } from "react";
import { Plus, Trash2, Workflow, Check } from "lucide-react";
import { workflowProgress } from "../../hooks/useAI";

export default function AgentWorkflowTab({ ai }) {
  const [draftWf, setDrafWf] = useState({ title: "", description: "" });
  const [draftStep, setDrafStep] = useState({});
  const [expanded, setExpanded] = useState(ai.workflows[0]?.id || "");

  function handleAddWorkflow() {
    if (!draftWf.title.trim()) return;
    ai.addWorkflow({ title: draftWf.title.trim(), description: draftWf.description.trim(), status: "todo", steps: [] });
    setDrafWf({ title: "", description: "" });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin:0, display:"flex", gap:8, alignItems:"center" }}><Workflow size={16} /> Alur Kerja Agent</h3>
        <p style={{ margin:"4px 0 14px", color:"var(--text-muted)", fontSize:13 }}>Langkah kerja agent — checklist progres, bisa dipakai sebagai runbook.</p>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", padding:12, background:"var(--off-white)", border:"1px solid var(--border)", borderRadius:12 }}>
          <input value={draftWf.title} onChange={(e)=>setDrafWf(d=>({...d,title:e.target.value}))} placeholder="Workflow title — ex: Fix RLS" style={{ flex:"2 1 200px" }} />
          <input value={draftWf.description} onChange={(e)=>setDrafWf(d=>({...d,description:e.target.value}))} placeholder="description" style={{ flex:"2 1 220px" }} />
          <button className="btn-primary sm" onClick={handleAddWorkflow} type="button"><Plus size={14} /> Add Workflow</button>
        </div>

        <div style={{ display:"grid", gap:12, marginTop:14 }}>
          {ai.workflows.length===0 ? <p style={{ textAlign:"center", color:"var(--text-faint)", fontSize:13, padding:16, border:"1px dashed var(--border)", borderRadius:10 }}>Belum ada workflow.</p> :
            ai.workflows.map(wf=> {
              const prog = workflowProgress(wf);
              const isOpen = expanded===wf.id;
              return (
                <div key={wf.id} className="card" style={{ padding:12, display:"grid", gap:10, borderLeft: `3px solid ${wf.status==="done"?"#15803d":wf.status==="doing"?"#d97706":"var(--border)"}` }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap" }}>
                    <div style={{ flex:1, minWidth:180, display:"grid", gap:4 }}>
                      <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                        <input value={wf.title} onChange={(e)=>ai.updateWorkflow(wf.id,{title:e.target.value})} style={{ fontWeight:700, fontSize:14, border:"1px solid transparent", background:"transparent", padding:"2px 4px", flex:"1 1 160px" }} />
                        <select value={wf.status} onChange={(e)=>ai.updateWorkflow(wf.id,{status:e.target.value})} className="select-sm">
                          <option value="todo">To Do</option><option value="doing">Doing</option><option value="done">Done</option>
                        </select>
                        <span className="badge" style={{ fontSize:10 }}>{prog.done}/{prog.total} · {prog.pct}%</span>
                      </div>
                      <input value={wf.description||""} onChange={(e)=>ai.updateWorkflow(wf.id,{description:e.target.value})} placeholder="description" style={{ fontSize:12, color:"var(--text-muted)", border:"1px solid transparent", background:"transparent", padding:"2px 4px" }} />
                      <div className="progress-track" style={{ height:6 }}><div className="progress-fill" style={{ width:`${prog.pct}%`, background: prog.pct===100?"#15803d":"#2563eb" }} /></div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn-ghost sm" onClick={()=>setExpanded(isOpen?"":wf.id)} type="button">{isOpen?"Collapse":"Expand"}</button>
                      <button className="btn-ghost sm danger" onClick={()=>ai.removeWorkflow(wf.id)} type="button"><Trash2 size={12} /></button>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ display:"grid", gap:8, paddingTop:8, borderTop:"1px solid var(--border)" }}>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <input value={draftStep[wf.id]?.title || ""} onChange={(e)=>setDrafStep(d=>({...d,[wf.id]:{...(d[wf.id]||{}),title:e.target.value}}))} placeholder="Step title" style={{ flex:"1 1 160px" }} />
                        <input value={draftStep[wf.id]?.description || ""} onChange={(e)=>setDrafStep(d=>({...d,[wf.id]:{...(d[wf.id]||{}),description:e.target.value}}))} placeholder="description" style={{ flex:"2 1 200px" }} />
                        <button className="btn-primary sm" onClick={()=>{ const s=draftStep[wf.id]; if(!s?.title?.trim())return; ai.addStep(wf.id,{title:s.title.trim(),description:s.description?.trim()||""}); setDrafStep(d=>({...d,[wf.id]:{title:"",description:""}})); }} type="button"><Plus size={12} /> Add Step</button>
                      </div>

                      <div style={{ display:"grid", gap:6 }}>
                        {wf.steps.length===0 ? <p style={{ fontSize:12, color:"var(--text-faint)", textAlign:"center", padding:10, border:"1px dashed var(--border)", borderRadius:8 }}>Belum ada steps.</p> :
                          wf.steps.map(st=> (
                            <div key={st.id} className="planning-item" style={{ opacity: st.done?0.7:1 }}>
                              <label style={{ display:"flex", gap:10, flex:1, alignItems:"center", cursor:"pointer" }}>
                                <input type="checkbox" checked={!!st.done} onChange={()=>ai.toggleStep(wf.id, st.id)} />
                                <div style={{ flex:1, display:"grid", gap:2 }}>
                                  <input value={st.title} onChange={(e)=>ai.updateStep(wf.id,st.id,{title:e.target.value})} style={{ fontWeight:600, fontSize:13, border:"1px solid transparent", background:"transparent", padding:"2px 4px", textDecoration: st.done?"line-through":"none" }} />
                                  <input value={st.description||""} onChange={(e)=>ai.updateStep(wf.id,st.id,{description:e.target.value})} placeholder="description" style={{ fontSize:12, color:"var(--text-muted)", border:"1px solid transparent", background:"transparent", padding:"2px 4px" }} />
                                </div>
                              </label>
                              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                {st.done && <span style={{ color:"#15803d" }}><Check size={14} /></span>}
                                <button className="btn-ghost sm danger" onClick={()=>ai.removeStep(wf.id,st.id)} type="button"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
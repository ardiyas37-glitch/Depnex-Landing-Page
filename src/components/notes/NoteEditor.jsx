import { useEffect, useState, useRef } from "react";
import { X, Save } from "lucide-react";
import { NOTE_TYPES, CODE_LANGUAGES, DEADLINE_PRIORITY, DEADLINE_STATUS } from "../../hooks/useNotes";

export default function NoteEditor({ open, onTutup, onSimpan, initial, projects, allTags }) {
  const [form, setForm] = useState(getDefault());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const formRef = useRef(null);
  const initialRef = useRef(null);

  function getDefault(){
    return {
      title:"", type:"general", tags:[], projectId:"", pinned:false,
      content:"", topic:"", category:"", codeExample:"", whatILearned:"", importantConcepts:"", whatIDontUnderstand:"", nextToLearn:"", resources:"",
      deadline:"", priority:"medium", status:"pending", tasks:[],
      clientName:"", contactReference:"", requirements:"", requests:"", feedback:"", decisions:"", followUp:"", nextAction:"",
      language:"JavaScript", code:"", description:"", source:"",
      idea:"", nextStep:"",
    };
  }

  useEffect(()=>{
    if(open){
      setFormError("");
      setSaving(false);
      if(initial && initial.id){
        initialRef.current = initial.id;
        setForm({
          title: initial.title||"", type: initial.type||"general", tags: Array.isArray(initial.tags) ? [...initial.tags] : [], projectId: initial.projectId||"", pinned: !!initial.pinned,
          content: initial.content||"", topic: initial.topic||"", category: initial.category||"", codeExample: initial.codeExample||"", whatILearned: initial.whatILearned||"", importantConcepts: initial.importantConcepts||"", whatIDontUnderstand: initial.whatIDontUnderstand||"", nextToLearn: initial.nextToLearn||"", resources: initial.resources||"",
          deadline: initial.deadline ? initial.deadline.slice(0,16) : "", priority: initial.priority||"medium", status: initial.status||"pending", tasks: Array.isArray(initial.tasks) ? initial.tasks.map(t=>({...t})) : [],
          clientName: initial.clientName||"", contactReference: initial.contactReference||"", requirements: initial.requirements||"", requests: initial.requests||"", feedback: initial.feedback||"", decisions: initial.decisions||"", followUp: initial.followUp||"", nextAction: initial.nextAction||"",
          language: initial.language||"JavaScript", code: initial.code||"", description: initial.description||"", source: initial.source||"",
          idea: initial.idea||"", nextStep: initial.nextStep||"",
        });
      } else {
        initialRef.current = null;
        setForm(getDefault());
      }
    }
  },[open, initial?.id, initial?.type]);

  if(!open) return null;

  function handleSubmit(e){
    e.preventDefault();
    setFormError("");
    if(!form.title.trim()){
      setFormError("Judul wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, title: form.title.trim(), tags: form.tags };
      if(payload.deadline) payload.deadline = new Date(payload.deadline).toISOString();
      onSimpan(payload);
      onTutup();
    } catch(err){
      setFormError("Terjadi kesalahan saat menyimpan. Silakan coba lagi.");
      setSaving(false);
    }
  }

  function handleTagInput(val){
    const parts = val.split(',').map(s=> s.trim()).filter(Boolean);
    if(parts.length>1){
      setForm(f=> ({...f, tags: [...new Set([...f.tags, ...parts.map(p=> p.toLowerCase().replace(/^#/,''))])]}));
      return "";
    }
    return val;
  }

  const type = form.type;

  return (
    <div className="modal-overlay" onClick={onTutup} role="dialog" aria-modal="true">
      <div className="modal" onClick={e=>e.stopPropagation()} style={{ width:"min(720px, 100%)" }}>
        <div className="modal-head">
          <h3>{initial?.id ? "Edit Note" : "New Note"}</h3>
          <button className="btn-ghost sm" onClick={onTutup} aria-label="Tutup" disabled={saving}><X size={16} /></button>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="modal-body" style={{ display:"grid", gap:14 }}>
          {formError && <div className="auth-error">{formError}</div>}
          <div className="grid grid-2">
            <label className="field"><span className="field-label">Title *</span><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Ex: React useEffect" required disabled={saving} /></label>
            <label className="field"><span className="field-label">Type</span>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="field-input" disabled={saving}>
                {NOTE_TYPES.map(t=> <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
          </div>

          <div className="grid grid-2">
            <label className="field"><span className="field-label">Project</span>
              <select value={form.projectId} onChange={e=>setForm(f=>({...f,projectId:e.target.value}))} className="field-input" disabled={saving}>
                <option value="">— No project —</option>
                {projects?.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="field"><span className="field-label">Tags (comma separated)</span>
              <input
                value={form.tags.join(", ")}
                onChange={e=> setForm(f=>({...f, tags: e.target.value.split(",").map(s=> s.trim().toLowerCase().replace(/^#/,'')).filter(Boolean)}))}
                onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); const v=handleTagInput(e.currentTarget.value); if(v==="") e.currentTarget.value=""; }}}
                placeholder="react, javascript, learning"
                list="tags-list"
                disabled={saving}
              />
              <datalist id="tags-list">{allTags?.map(t=> <option key={t} value={t} />)}</datalist>
            </label>
          </div>

          <label style={{ display:"flex", gap:8, alignItems:"center", fontSize:12, color:"var(--text-muted)" }}><input type="checkbox" checked={form.pinned} onChange={e=>setForm(f=>({...f,pinned:e.target.checked}))} disabled={saving} /> Pinned</label>

          {type==="learning" && (
            <div style={{ display:"grid", gap:12, padding:12, border:"1px solid var(--border)", borderRadius:10, background:"var(--bg)" }}>
              <div className="grid grid-2">
                <label className="field"><span className="field-label">Topic</span><input value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} placeholder="React" disabled={saving} /></label>
                <label className="field"><span className="field-label">Category</span><input value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} placeholder="Frontend" disabled={saving} /></label>
              </div>
              <label className="field"><span className="field-label">What I Learned</span><textarea rows={3} value={form.whatILearned} onChange={e=>setForm(f=>({...f,whatILearned:e.target.value}))} className="field-input" disabled={saving} /></label>
              <label className="field"><span className="field-label">Important Concepts</span><textarea rows={2} value={form.importantConcepts} onChange={e=>setForm(f=>({...f,importantConcepts:e.target.value}))} className="field-input" placeholder="- dependency array&#10;- cleanup" disabled={saving} /></label>
              <label className="field"><span className="field-label">What I Don't Understand</span><textarea rows={2} value={form.whatIDontUnderstand} onChange={e=>setForm(f=>({...f,whatIDontUnderstand:e.target.value}))} className="field-input" disabled={saving} /></label>
              <label className="field"><span className="field-label">Next Thing To Learn</span><input value={form.nextToLearn} onChange={e=>setForm(f=>({...f,nextToLearn:e.target.value}))} disabled={saving} /></label>
              <label className="field"><span className="field-label">Code Example</span><textarea rows={4} value={form.codeExample} onChange={e=>setForm(f=>({...f,codeExample:e.target.value}))} className="field-input" style={{ fontFamily:"ui-monospace, monospace", fontSize:12 }} disabled={saving} /></label>
              <label className="field"><span className="field-label">Resources</span><input value={form.resources} onChange={e=>setForm(f=>({...f,resources:e.target.value}))} placeholder="links, books" disabled={saving} /></label>
            </div>
          )}

          {type==="deadline" && (
            <div style={{ display:"grid", gap:12, padding:12, border:"1px solid var(--border)", borderRadius:10, background:"var(--bg)" }}>
              <div className="grid grid-2">
                <label className="field"><span className="field-label">Tenggat Waktu</span><input type="datetime-local" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} disabled={saving} /></label>
                <label className="field"><span className="field-label">Prioritas</span>
                  <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className="field-input" disabled={saving}>
                    {DEADLINE_PRIORITY.map(p=> <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid grid-2">
                <label className="field"><span className="field-label">Status</span>
                  <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="field-input" disabled={saving}>
                    {DEADLINE_STATUS.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="field"><span className="field-label">Description</span><input value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} disabled={saving} /></label>
              </div>
            </div>
          )}

          {type==="client" && (
            <div style={{ display:"grid", gap:12, padding:12, border:"1px solid var(--border)", borderRadius:10, background:"var(--bg)" }}>
              <div className="grid grid-2">
                <label className="field"><span className="field-label">Client Name</span><input value={form.clientName} onChange={e=>setForm(f=>({...f,clientName:e.target.value}))} disabled={saving} /></label>
                <label className="field"><span className="field-label">Contact Reference</span><input value={form.contactReference} onChange={e=>setForm(f=>({...f,contactReference:e.target.value}))} placeholder="email / WA" disabled={saving} /></label>
              </div>
              <label className="field"><span className="field-label">Persyaratan</span><textarea rows={2} value={form.requirements} onChange={e=>setForm(f=>({...f,requirements:e.target.value}))} className="field-input" disabled={saving} /></label>
              <label className="field"><span className="field-label">Requests</span><textarea rows={2} value={form.requests} onChange={e=>setForm(f=>({...f,requests:e.target.value}))} className="field-input" disabled={saving} /></label>
              <label className="field"><span className="field-label">Feedback</span><textarea rows={2} value={form.feedback} onChange={e=>setForm(f=>({...f,feedback:e.target.value}))} className="field-input" disabled={saving} /></label>
              <div className="grid grid-2">
                <label className="field"><span className="field-label">Decisions</span><input value={form.decisions} onChange={e=>setForm(f=>({...f,decisions:e.target.value}))} disabled={saving} /></label>
                <label className="field"><span className="field-label">Next Action</span><input value={form.nextAction} onChange={e=>setForm(f=>({...f,nextAction:e.target.value}))} disabled={saving} /></label>
              </div>
              <div className="grid grid-2">
                <label className="field"><span className="field-label">Follow Up</span><input value={form.followUp} onChange={e=>setForm(f=>({...f,followUp:e.target.value}))} disabled={saving} /></label>
                <label className="field"><span className="field-label">Tenggat Waktu</span><input type="date" value={form.deadline ? form.deadline.slice(0,10) : ""} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} disabled={saving} /></label>
              </div>
            </div>
          )}

          {type==="code" && (
            <div style={{ display:"grid", gap:12, padding:12, border:"1px solid var(--border)", borderRadius:10, background:"var(--bg)" }}>
              <div className="grid grid-2">
                <label className="field"><span className="field-label">Language</span>
                  <select value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))} className="field-input" disabled={saving}>
                    {CODE_LANGUAGES.map(l=> <option key={l} value={l}>{l}</option>)}
                  </select>
                </label>
                <label className="field"><span className="field-label">Source</span><input value={form.source} onChange={e=>setForm(f=>({...f,source:e.target.value}))} placeholder="url / file" disabled={saving} /></label>
              </div>
              <label className="field"><span className="field-label">Description</span><input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} disabled={saving} /></label>
              <label className="field"><span className="field-label">Code *</span><textarea rows={8} value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} className="field-input" style={{ fontFamily:"ui-monospace, monospace", fontSize:12 }} required disabled={saving} /></label>
              <label className="field"><span className="field-label">Catatan</span><textarea rows={2} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} className="field-input" disabled={saving} /></label>
            </div>
          )}

          {type==="idea" && (
            <div style={{ display:"grid", gap:12, padding:12, border:"1px solid var(--border)", borderRadius:10, background:"var(--bg)" }}>
              <label className="field"><span className="field-label">Idea</span><textarea rows={3} value={form.idea} onChange={e=>setForm(f=>({...f,idea:e.target.value}))} className="field-input" disabled={saving} /></label>
              <div className="grid grid-2">
                <label className="field"><span className="field-label">Category</span><input value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} disabled={saving} /></label>
                <label className="field"><span className="field-label">Next Step</span><input value={form.nextStep} onChange={e=>setForm(f=>({...f,nextStep:e.target.value}))} disabled={saving} /></label>
              </div>
              <label className="field"><span className="field-label">Catatan</span><textarea rows={2} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} className="field-input" disabled={saving} /></label>
            </div>
          )}

          {type==="general" && (
            <label className="field"><span className="field-label">Content</span><textarea rows={6} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} className="field-input" placeholder="Write freely..." disabled={saving} /></label>
          )}

          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
            <button type="button" className="btn-ghost" onClick={onTutup} disabled={saving}>Batal</button>
            <button type="submit" className="btn-primary" disabled={saving}><Save size={14} /> {saving ? "Menyimpan..." : (initial?.id ? "Simpan" : "Create")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

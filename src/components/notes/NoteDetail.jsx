import { X, Pin, Archive, Trash2, Copy, Edit3, Clock, Tag, Calendar } from "lucide-react";
import { noteTypeMeta, isOverdue } from "../../hooks/useNotes";

export default function NoteDetail({ open, note, projectName, onTutup, onEdit, onPin, onArchive, onHapus, onSalinCode, onToggleTask, onAddTask }) {
  if(!open || !note) return null;
  const meta = noteTypeMeta(note.type);
  const overdue = isOverdue(note);
  const tasks = Array.isArray(note.tasks) ? note.tasks : [];

  async function handleSalin(text){
    try{ await navigator.clipboard.writeText(text); }catch{}
    onSalinCode?.(text);
  }

  return (
    <div className="modal-overlay" onClick={onTutup} role="dialog" aria-modal="true">
      <div className="modal" onClick={e=>e.stopPropagation()} style={{ width:"min(760px, 100%)" }}>
        <div className="modal-head">
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <span className="badge" style={{ background: meta.color+"18", color: meta.color, borderColor: meta.color+"35" }}>{meta.label}</span>
            {note.pinned && <span className="badge" style={{ background:"var(--accent-soft)", color:"var(--accent)", borderColor:"rgba(108,99,255,0.25)" }}><Pin size={10} style={{ marginRight:4 }} />Pinned</span>}
            {note.archived && <span className="badge"><Archive size={10} style={{ marginRight:4 }} />Archived</span>}
            {overdue && <span className="badge" style={{ background:"rgba(239,68,68,0.15)", color:"#FCA5A5", borderColor:"rgba(239,68,68,0.3)" }}>Terlambat</span>}
          </div>
          <button className="btn-ghost sm" onClick={onTutup} aria-label="Tutup"><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ display:"grid", gap:16 }}>
          <div>
            <h3 style={{ margin:"0 0 4px", fontSize:18, color:"var(--text)" }}>{note.title}</h3>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:11, color:"var(--text-muted)", alignItems:"center" }}>
              <span style={{ display:"inline-flex", gap:4, alignItems:"center" }}><Clock size={11} /> Updated {new Date(note.updatedAt).toLocaleString("id-ID")}</span>
              <span>·</span>
              <span style={{ display:"inline-flex", gap:4, alignItems:"center" }}><Calendar size={11} /> Created {new Date(note.createdAt).toLocaleDateString("id-ID")}</span>
              {projectName && <><span>·</span><span className="badge" style={{ fontSize:10 }}>{projectName}</span></>}
            </div>
            {Array.isArray(note.tags) && note.tags.length>0 && <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:8 }}>{note.tags.map(t=> <span key={t} className="badge" style={{ fontSize:10, textTransform:"none" }}><Tag size={10} style={{ marginRight:3 }} />{t}</span>)}</div>}
          </div>

          {note.type==="learning" && (
            <div style={{ display:"grid", gap:12 }}>
              {note.topic && <DetailField label="Topic" value={note.topic} />}
              {note.category && <DetailField label="Category" value={note.category} />}
              {note.whatILearned && <DetailField label="What I Learned" value={note.whatILearned} pre />}
              {note.importantConcepts && <DetailField label="Important Concepts" value={note.importantConcepts} pre />}
              {note.whatIDontUnderstand && <DetailField label="What I Don't Understand" value={note.whatIDontUnderstand} pre />}
              {note.nextToLearn && <DetailField label="Next Thing To Learn" value={note.nextToLearn} />}
              {note.codeExample && <div><div className="field-label">Code Example</div><pre style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:8, padding:12, fontSize:12, overflowX:"auto" }}><code>{note.codeExample}</code></pre><button className="btn-ghost sm" onClick={()=>handleSalin(note.codeExample)} type="button"><Copy size={12} /> Salin</button></div>}
              {note.resources && <DetailField label="Resources" value={note.resources} />}
              {note.content && <DetailField label="Catatan" value={note.content} pre />}
            </div>
          )}

          {note.type==="deadline" && (
            <div style={{ display:"grid", gap:12 }}>
              {note.deadline && <DetailField label="Tenggat Waktu" value={new Date(note.deadline).toLocaleString("id-ID")} highlight={overdue} />}
              <div className="grid grid-2">
                <DetailField label="Prioritas" value={note.priority} badge={`prio-${note.priority}`} />
                <DetailField label="Status" value={note.status} />
              </div>
              {note.content && <DetailField label="Description" value={note.content} pre />}
              <div>
                <div className="field-label">Tasks ({tasks.filter(t=>t.done).length}/{tasks.length})</div>
                <div style={{ display:"grid", gap:6, marginTop:6 }}>
                  {tasks.map(t=> (
                    <label key={t.id} style={{ display:"flex", gap:8, alignItems:"center", padding:"8px 10px", border:"1px solid var(--border)", borderRadius:8, background: t.done?"var(--bg-hover)":"var(--bg-card)" }}>
                      <input type="checkbox" checked={!!t.done} onChange={()=>onToggleTask?.(note.id, t.id)} />
                      <span style={{ flex:1, fontSize:13, textDecoration: t.done?"line-through":"none", opacity: t.done?0.7:1 }}>{t.text}</span>
                    </label>
                  ))}
                  {tasks.length===0 && <div style={{ fontSize:12, color:"var(--text-faint)", padding:8, border:"1px dashed var(--border)", borderRadius:8, textAlign:"center" }}>No tasks</div>}
                </div>
              </div>
            </div>
          )}

          {note.type==="client" && (
            <div style={{ display:"grid", gap:12 }}>
              {note.clientName && <DetailField label="Client Name" value={note.clientName} />}
              {note.contactReference && <DetailField label="Contact" value={note.contactReference} />}
              {note.requirements && <DetailField label="Persyaratan" value={note.requirements} pre />}
              {note.requests && <DetailField label="Client Requests" value={note.requests} pre />}
              {note.feedback && <DetailField label="Feedback" value={note.feedback} pre />}
              {note.decisions && <DetailField label="Decisions" value={note.decisions} pre />}
              {note.nextAction && <DetailField label="Next Action" value={note.nextAction} highlight />}
              {note.followUp && <DetailField label="Follow Up" value={note.followUp} />}
              {note.deadline && <DetailField label="Tenggat Waktu" value={new Date(note.deadline).toLocaleDateString("id-ID")} />}
              {note.content && <DetailField label="Catatan" value={note.content} pre />}
            </div>
          )}

          {note.type==="code" && (
            <div style={{ display:"grid", gap:12 }}>
              <DetailField label="Language" value={note.language} badge />
              {note.description && <DetailField label="Description" value={note.description} />}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span className="field-label">Code</span>
                  <button className="btn-primary sm" onClick={()=>handleSalin(note.code)} type="button"><Copy size={12} /> Salin Code</button>
                </div>
                <pre style={{ background:"#0B0D10", border:"1px solid var(--border)", borderRadius:10, padding:14, fontSize:12, lineHeight:1.6, overflowX:"auto", color:"#F5F7FA" }}><code>{note.code}</code></pre>
              </div>
              {note.source && <DetailField label="Source" value={note.source} />}
              {note.content && <DetailField label="Catatan" value={note.content} pre />}
            </div>
          )}

          {note.type==="idea" && (
            <div style={{ display:"grid", gap:12 }}>
              <DetailField label="Idea" value={note.idea || note.content} pre />
              {note.category && <DetailField label="Category" value={note.category} />}
              {note.nextStep && <DetailField label="Next Step" value={note.nextStep} highlight />}
              {projectName && <DetailField label="Related Project" value={projectName} />}
            </div>
          )}

          {note.type==="general" && (
            <div style={{ whiteSpace:"pre-wrap", fontSize:13, lineHeight:1.7, color:"var(--text-secondary)", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:10, padding:14 }}>{note.content || "— no content —"}</div>
          )}

          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", flexWrap:"wrap", paddingTop:8, borderTop:"1px solid var(--border)" }}>
            <button className="btn-ghost sm" onClick={()=>onPin?.(note.id)} type="button"><Pin size={12} /> {note.pinned?"Unpin":"Pin"}</button>
            <button className="btn-ghost sm" onClick={()=>onArchive?.(note.id)} type="button"><Archive size={12} /> {note.archived?"Restore":"Archive"}</button>
            <button className="btn-ghost sm" onClick={()=>onEdit?.(note)} type="button"><Edit3 size={12} /> Edit</button>
            <button className="btn-ghost sm danger" onClick={()=>onHapus?.(note.id)} type="button"><Trash2 size={12} /> Hapus</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, pre, badge, highlight }){
  return (
    <div>
      <div className="field-label" style={{ color: highlight ? "var(--accent)" : undefined }}>{label}</div>
      {badge ? <span className={`badge ${badge}`} style={{ marginTop:4 }}>{value}</span> :
        <div style={{ marginTop:4, fontSize:13, color:"var(--text-secondary)", background: pre?"var(--bg)":"transparent", border: pre?"1px solid var(--border)":"0", borderRadius: pre?8:0, padding: pre?"10px 12px":0, whiteSpace: pre?"pre-wrap":"normal", lineHeight:1.6 }}>{value || "—"}</div>
      }
    </div>
  );
}

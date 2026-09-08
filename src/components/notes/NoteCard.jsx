import { Pin, Archive, Copy, Clock, AlertTriangle, Code2, GraduationCap, Lightbulb, Briefcase, StickyNote } from "lucide-react";
import { noteTypeMeta, isOverdue, isUpcoming } from "../../hooks/useNotes";

const typeIconMap = {
  learning: GraduationCap,
  deadline: Clock,
  client: Briefcase,
  code: Code2,
  idea: Lightbulb,
  general: StickyNote,
};

export default function NoteCard({ note, projectName, onOpen, onPin, onArchive, onSalinCode }) {
  if(!note) return null;
  const meta = noteTypeMeta(note.type);
  const TypeIcon = typeIconMap[note.type] || StickyNote;
  const overdue = isOverdue(note);
  const upcoming = isUpcoming(note);

  return (
    <article
      className="note-card"
      onClick={() => onOpen?.(note)}
      role="button"
      tabIndex={0}
      onKeyDown={(e)=> e.key==='Enter' && onOpen?.(note)}
      aria-label={`Open note ${note.title}`}
    >
      <div className="note-card-head">
        <span className="badge" style={{ background: meta.color+"18", color: meta.color, borderColor: meta.color+"35", fontSize:10 }}>
          <TypeIcon size={10} style={{ marginRight:4 }} />{meta.label}
        </span>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {note.pinned && <span className="badge" style={{ background:"var(--accent-soft)", color:"var(--accent)", borderColor:"rgba(108,99,255,0.25)", fontSize:10 }}><Pin size={10} style={{ marginRight:3 }} />Pinned</span>}
          {overdue && <span className="badge" style={{ background:"rgba(239,68,68,0.15)", color:"#FCA5A5", borderColor:"rgba(239,68,68,0.3)", fontSize:10 }}><AlertTriangle size={10} style={{ marginRight:3 }} />Terlambat</span>}
          {upcoming && !overdue && <span className="badge" style={{ background:"rgba(245,158,11,0.15)", color:"#FCD34D", borderColor:"rgba(245,158,11,0.3)", fontSize:10 }}>Due soon</span>}
        </div>
      </div>

      <h4 className="note-card-title">{note.title}</h4>

      {/* Type-specific preview */}
      {note.type==="code" ? (
        <div className="note-code-preview">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <span style={{ fontSize:11, color:"var(--text-faint)", fontFamily:"ui-monospace, monospace" }}>{note.language}</span>
            <button className="btn-ghost sm" onClick={(e)=>{ e.stopPropagation(); onSalinCode?.(note.code); }} type="button" aria-label={`Salin code ${note.title}`}><Copy size={12} /> Salin</button>
          </div>
          <pre>{note.code?.slice(0,240)}{note.code && note.code.length>240 ? "…" : ""}</pre>
          {note.description && <p className="note-preview-text">{note.description.slice(0,120)}</p>}
        </div>
      ) : note.type==="deadline" ? (
        <div className="note-deadline-preview">
          {note.deadline && <div style={{ fontSize:12, color: overdue ? "#FCA5A5" : upcoming ? "#FCD34D" : "var(--text-secondary)" }}>
            <Clock size={11} style={{ display:"inline", marginRight:4, verticalAlign:"-1px" }} />
            {new Date(note.deadline).toLocaleString("id-ID",{ day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
          </div>}
          <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
            <span className={`badge prio-${note.priority}`} style={{ fontSize:10 }}>{note.priority}</span>
            <span className="badge" style={{ fontSize:10 }}>{note.status}</span>
            {projectName && <span className="badge" style={{ fontSize:10 }}>{projectName}</span>}
          </div>
          {Array.isArray(note.tasks) && note.tasks.length>0 && <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:6 }}>{note.tasks.filter(t=>t.done).length}/{note.tasks.length} tasks</div>}
        </div>
      ) : note.type==="client" ? (
        <div className="note-preview-text">
          {note.clientName && <div style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{note.clientName}{projectName? ` · ${projectName}`:""}</div>}
          <div style={{ display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", fontSize:12, color:"var(--text-muted)", marginTop:4 }}>
            {note.requirements?.slice(0,140) || note.content?.slice(0,140) || note.nextAction?.slice(0,140) || "— no preview —"}
          </div>
        </div>
      ) : note.type==="learning" ? (
        <div className="note-preview-text">
          {note.topic && <div style={{ fontSize:11, color:"var(--accent)", fontWeight:600 }}>{note.topic}{note.category?` · ${note.category}`:""}</div>}
          <div style={{ display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", fontSize:12, color:"var(--text-muted)", marginTop:4 }}>
            {note.whatILearned?.slice(0,160) || note.importantConcepts?.slice(0,160) || note.content?.slice(0,160) || "— no preview —"}
          </div>
        </div>
      ) : note.type==="idea" ? (
        <div className="note-preview-text" style={{ display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", fontSize:12, color:"var(--text-muted)" }}>
          {note.idea?.slice(0,180) || note.content?.slice(0,180) || "— no preview —"}
        </div>
      ) : (
        <div className="note-preview-text" style={{ display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", fontSize:12, color:"var(--text-muted)" }}>
          {note.content?.slice(0,180) || "— no content —"}
        </div>
      )}

      {(note.tags?.length>0) && (
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:8 }}>
          {note.tags.slice(0,4).map(tag=> <span key={tag} className="badge" style={{ fontSize:10, textTransform:"none", letterSpacing:0 }}>#{tag}</span>)}
          {note.tags.length>4 && <span style={{ fontSize:10, color:"var(--text-faint)" }}>+{note.tags.length-4}</span>}
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10, fontSize:11, color:"var(--text-faint)" }}>
        <span>Updated {new Date(note.updatedAt).toLocaleDateString("id-ID",{ day:"2-digit", month:"short" })}</span>
        <div style={{ display:"flex", gap:4 }}>
          <button className="btn-ghost" style={{ padding:"4px 6px", fontSize:11, borderColor:"transparent", background:"transparent" }} onClick={(e)=>{ e.stopPropagation(); onPin?.(note.id); }} aria-label={note.pinned?"Unpin":"Pin"}><Pin size={12} fill={note.pinned?"currentColor":"none"} /></button>
          <button className="btn-ghost" style={{ padding:"4px 6px", fontSize:11, borderColor:"transparent", background:"transparent" }} onClick={(e)=>{ e.stopPropagation(); onArchive?.(note.id); }} aria-label="Archive"><Archive size={12} /></button>
        </div>
      </div>
    </article>
  );
}
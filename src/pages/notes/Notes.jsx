import { useMemo, useState } from "react";
import { Search, Plus, StickyNote, GraduationCap, Clock, Briefcase, Code2, Lightbulb, Pin, Archive, Layers, Filter, ArrowUpDown, X, Zap, AlertTriangle } from "lucide-react";
import { useNotes, NOTE_TYPES, isOverdue } from "../../hooks/useNotes";
import { useProjects } from "../../hooks/useProjects";
import NoteCard from "../../components/notes/NoteCard";
import NoteEditor from "../../components/notes/NoteEditor";
import NoteDetail from "../../components/notes/NoteDetail";

const CATEGORIES = [
  { id: "all", label: "Semua Catatan", icon: Layers },
  { id: "learning", label: "Belajar", icon: GraduationCap, type: "learning" },
  { id: "deadlines", label: "Tenggat", icon: Clock, type: "deadline" },
  { id: "clients", label: "Klien", icon: Briefcase, type: "client" },
  { id: "code", label: "Cuplikan Kode", icon: Code2, type: "code" },
  { id: "ideas", label: "Ide", icon: Lightbulb, type: "idea" },
  { id: "general", label: "Umum", icon: StickyNote, type: "general" },
  { id: "pinned", label: "Disematkan", icon: Pin },
  { id: "archived", label: "Diarsipkan", icon: Archive },
];

const SORT_OPTIONS = [
  { value: "updated-desc", label: "Baru Diperbarui" },
  { value: "created-desc", label: "Baru Dibuat" },
  { value: "created-asc", label: "Terlama" },
  { value: "deadline-asc", label: "Tenggat Waktu" },
  { value: "priority", label: "Prioritas" },
  { value: "alpha", label: "Alfabet" },
];

const PRIORITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };

export default function Notes() {
  const { notes, loaded, saveError, addNote, updateNote, removeNote, togglePin, toggleArchive, restoreArchived, allTags, stats } = useNotes();
  const { projects } = useProjects();

  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({ tag: "all", project: "all", status: "all", priority: "all", language: "all" });
  const [quickText, setQuickText] = useState("");
  const [quickType, setQuickType] = useState("general");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editorType, setEditorType] = useState("general");
  const [detail, setDetail] = useState(null);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [copied, setCopied] = useState("");

  const projectMap = useMemo(()=> {
    const m={};
    projects.forEach(p=> m[p.id]=p.name);
    return m;
  },[projects]);

  const filtered = useMemo(()=>{
    let list = [...notes];

    if(activeCat==="all") list = list.filter(n=>!n.archived);
    else if(activeCat==="pinned") list = list.filter(n=>n.pinned && !n.archived);
    else if(activeCat==="archived") list = list.filter(n=>n.archived);
    else {
      const cat = CATEGORIES.find(c=>c.id===activeCat);
      if(cat?.type) list = list.filter(n=> n.type===cat.type && !n.archived);
    }

    if(filter.tag!=="all") list = list.filter(n=> n.tags?.includes(filter.tag));
    if(filter.project!=="all") list = list.filter(n=> n.projectId===filter.project);
    if(filter.status!=="all") list = list.filter(n=> n.status===filter.status);
    if(filter.priority!=="all") list = list.filter(n=> n.priority===filter.priority);
    if(filter.language!=="all") list = list.filter(n=> n.language===filter.language);

    if(query.trim()){
      const q = query.toLowerCase();
      list = list.filter(n=>{
        const hay = [
          n.title, n.content, n.type, n.tags?.join(" "), projectMap[n.projectId]||"", n.clientName||"", n.language||"", n.topic||"", n.category||"", n.code||"", n.idea||"", n.whatILearned||"", n.description||""
        ].join(" ").toLowerCase();
        return hay.includes(q);
      });
    }

    list.sort((a,b)=>{
      if(sortBy==="updated-desc") return new Date(b.updatedAt) - new Date(a.updatedAt);
      if(sortBy==="created-desc") return new Date(b.createdAt) - new Date(a.createdAt);
      if(sortBy==="created-asc") return new Date(a.createdAt) - new Date(b.createdAt);
      if(sortBy==="alpha") return a.title.localeCompare(b.title);
      if(sortBy==="priority") return (PRIORITY_ORDER[b.priority]||0) - (PRIORITY_ORDER[a.priority]||0);
      if(sortBy==="deadline-asc"){
        if(!a.deadline) return 1;
        if(!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0;
    });

    if(activeCat==="all"){
      list.sort((a,b)=> (b.pinned?1:0) - (a.pinned?1:0));
    }

    return list;
  },[notes, activeCat, query, sortBy, filter, projectMap]);

  function handleNew(type){
    setEditing(null);
    setEditorType(type);
    setEditorOpen(true);
    setShowNewMenu(false);
  }
  function handleEdit(note){
    setEditing(note);
    setEditorOpen(true);
    setDetail(null);
  }
  function handleSimpan(payload){
    if(editing){
      updateNote(editing.id, payload);
    } else {
      const final = { ...payload };
      if(payload.type==="general" && editorType!=="general") final.type = editorType;
      addNote(final);
    }
  }
  function handleQuickSimpan(){
    if(!quickText.trim()) return;
    addNote({ title: quickText.slice(0,60) || "Quick note", type: quickType, content: quickText, tags: [] });
    setQuickText("");
  }
  async function handleSalinCode(code){
    try{ await navigator.clipboard.writeText(code); setCopied(code.slice(0,20)); setTimeout(()=>setCopied(""),1500);}catch{}
  }

  function handleDetailPin(id){
    togglePin(id);
    setDetail(d=>{
      if(!d || d.id!==id) return d;
      const updated = notes.find(n=>n.id===id);
      return updated ? {...updated, pinned: !updated.pinned} : d;
    });
  }

  function handleDetailArchive(id){
    const note = notes.find(n=>n.id===id);
    if(note?.archived) restoreArchived(id); else toggleArchive(id);
    setDetail(null);
  }

  function handleDetailHapus(id){
    if(!confirm("Hapus catatan ini secara permanen?")) return;
    removeNote(id);
    setDetail(null);
  }

  if(!loaded){
    return <div className="page"><div className="auth-loading" style={{ minHeight:200 }}><div className="spinner" /></div></div>;
  }

  const emptyForCat = {
    all: { title:"Belum ada catatan", desc:"Mulai bangun basis pengetahuan pribadimu.", cta:"Buat Catatan", type:"general" },
    learning: { title:"Belum ada catatan belajar", desc:"Simpan sesuatu yang kamu pelajari hari ini.", cta:"Catatan Belajar", type:"learning" },
    deadlines: { title:"Belum ada tenggat", desc:"Keep track of important things you need to finish.", cta:"Tenggat Waktu", type:"deadline" },
    clients: { title:"Belum ada catatan klien", desc:"Simpan kebutuhan dan masukan klien di sini.", cta:"Catatan Klien", type:"client" },
    code: { title:"Belum ada cuplikan kode", desc:"Simpan kode berguna di sini untuk dipelajari atau digunakan kembali.", cta:"Cuplikan Kode", type:"code" },
    ideas: { title:"Belum ada ide", desc:"Tangkap ide besar berikutnya.", cta:"Ide", type:"idea" },
    general: { title:"Belum ada catatan umum", desc:"Buat catatan pertamamu.", cta:"Catatan", type:"general" },
    pinned: { title:"Belum ada catatan disematkan", desc:"Sematkan catatan penting agar cepat ditemukan.", cta:null },
    archived: { title:"Belum ada catatan diarsipkan", desc:"Catatan yang diarsipkan akan muncul di sini.", cta:null },
  };
  const empty = emptyForCat[activeCat] || emptyForCat.all;

  return (
    <div className="page" style={{ maxWidth:1100 }}>
      <div className="page-header" style={{ display:"flex", justifyContent:"space-between", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
        <div>
          <h1 style={{ display:"flex", gap:10, alignItems:"center" }}><StickyNote size={20} /> Catatan</h1>
          <p>Ruang pengetahuan dan pengembangan pribadimu. Simpan ide, pembelajaran, informasi klien, tenggat, dan kode.</p>
        </div>
        <div style={{ position:"relative" }}>
          <button className="btn-primary" onClick={()=> setShowNewMenu(v=>!v)} type="button" aria-haspopup="menu" aria-expanded={showNewMenu}>
            <Plus size={14} /> Catatan Baru
          </button>
          {showNewMenu && (
            <div style={{ position:"absolute", right:0, top:"100%", marginTop:6, background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:10, padding:6, display:"grid", gap:4, minWidth:180, zIndex:20, boxShadow:"var(--shadow-lg)" }} role="menu">
              {NOTE_TYPES.map(t=> (
                <button key={t.value} className="btn-ghost" style={{ justifyContent:"flex-start", borderColor:"transparent", background:"transparent", fontSize:12 }} onClick={()=> handleNew(t.value)} role="menuitem">
                  <span style={{ width:8, height:8, borderRadius:"50%", background:t.color, flexShrink:0 }} /> {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {saveError && (
        <div className="auth-error" style={{ marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <AlertTriangle size={14} /> {saveError}
        </div>
      )}

      <div className="card" style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", padding:12, marginBottom:14 }}>
        <Zap size={14} style={{ color:"var(--accent)", flexShrink:0 }} />
        <span style={{ fontSize:12, fontWeight:600, color:"var(--text-secondary)" }}>Tangkap Cepat</span>
        <input value={quickText} onChange={e=>setQuickText(e.target.value)} onKeyDown={e=> e.key==="Enter" && handleQuickSimpan()} placeholder="Tulis sesuatu..." style={{ flex:"1 1 200px" }} aria-label="Quick capture" />
        <select value={quickType} onChange={e=>setQuickType(e.target.value)} className="select-sm">
          {NOTE_TYPES.map(t=> <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button className="btn-primary sm" onClick={handleQuickSimpan} type="button">Simpan</button>
      </div>

      <div className="card" style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", padding:12, marginBottom:14 }}>
        <div style={{ position:"relative", flex:"1 1 200px" }}>
          <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-faint)" }} />
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari catatan..." style={{ paddingLeft:32, width:"100%" }} aria-label="Search notes" />
          {query && <button onClick={()=>setQuery("")} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"transparent", border:0, color:"var(--text-faint)", cursor:"pointer" }} aria-label="Bersihkan search"><X size={14} /></button>}
        </div>
        <button className={`btn-ghost sm ${showFilters?"active-filter":""}`} onClick={()=>setShowFilters(v=>!v)} type="button"><Filter size={12} /> Filter</button>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <ArrowUpDown size={12} style={{ color:"var(--text-faint)" }} />
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="select-sm" aria-label="Sort">
            {SORT_OPTIONS.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {copied && <span style={{ fontSize:11, color:"var(--success)" }}>Disalin!</span>}
      </div>

      {showFilters && (
        <div className="card" style={{ display:"flex", gap:10, flexWrap:"wrap", padding:12, marginBottom:14 }}>
          <select value={filter.tag} onChange={e=>setFilter(f=>({...f,tag:e.target.value}))} className="select-sm">
            <option value="all">All tags</option>{allTags.map(t=> <option key={t} value={t}>#{t}</option>)}
          </select>
          <select value={filter.project} onChange={e=>setFilter(f=>({...f,project:e.target.value}))} className="select-sm">
            <option value="all">All projects</option>{projects.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={filter.status} onChange={e=>setFilter(f=>({...f,status:e.target.value}))} className="select-sm">
            <option value="all">All status</option><option value="pending">pending</option><option value="in-progress">in-progress</option><option value="completed">completed</option><option value="overdue">overdue</option>
          </select>
          <select value={filter.priority} onChange={e=>setFilter(f=>({...f,priority:e.target.value}))} className="select-sm">
            <option value="all">All priority</option><option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="critical">critical</option>
          </select>
          <select value={filter.language} onChange={e=>setFilter(f=>({...f,language:e.target.value}))} className="select-sm">
            <option value="all">All languages</option>{["JavaScript","TypeScript","React / JSX","HTML","CSS","PHP","Laravel","Python","SQL","Bash","JSON"].map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
          <button className="btn-ghost sm" onClick={()=>setFilter({ tag:"all", project:"all", status:"all", priority:"all", language:"all" })} type="button">Bersihkan</button>
          <span style={{ fontSize:11, color:"var(--text-faint)", marginLeft:"auto" }}>{filtered.length} catatan</span>
        </div>
      )}

      <div className="planning-tabs" role="tablist" style={{ marginBottom:16 }}>
        {CATEGORIES.map(cat=>{
          const Icon=cat.icon;
          const isActive = activeCat===cat.id;
          const count = cat.id==="all" ? stats.total : cat.id==="pinned" ? stats.pinned : cat.id==="archived" ? stats.archived : stats.byType[cat.type] || 0;
          return (
            <button key={cat.id} role="tab" aria-selected={isActive} onClick={()=>setActiveCat(cat.id)} className={`planning-tab ${isActive?"planning-tab--active":""}`} type="button">
              <Icon size={14} /> {cat.label} <span className="planning-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length===0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{(() => { const CatIcon = CATEGORIES.find(c=>c.id===activeCat)?.icon || StickyNote; return <CatIcon size={18} />; })()}</div>
          <h3>{empty.title}</h3>
          <p>{empty.desc}</p>
          {empty.cta && <button className="btn-primary sm" onClick={()=> handleNew(empty.type)} type="button"><Plus size={14} /> {empty.cta}</button>}
        </div>
      ) : (
        <div className="notes-grid">
          {filtered.map(note=> (
            <NoteCard
              key={note.id}
              note={note}
              projectName={projectMap[note.projectId]}
              onOpen={(n)=> setDetail(n)}
              onPin={togglePin}
              onArchive={toggleArchive}
              onSalinCode={handleSalinCode}
            />
          ))}
        </div>
      )}

      <p style={{ marginTop:14, fontSize:11, color:"var(--text-faint)", textAlign:"center" }}>
        {stats.total} notes · {stats.pinned} pinned · {stats.upcoming} upcoming · {stats.overdue} overdue · auto-save <code style={{ background:"var(--bg)", padding:"2px 6px", borderRadius:6, border:"1px solid var(--border)", fontSize:10 }}>webplan:notes:v09</code>
      </p>

      <NoteEditor
        open={editorOpen}
        onTutup={()=>{ setEditorOpen(false); setEditing(null); }}
        onSimpan={handleSimpan}
        initial={editing ? editing : (editorType!=="general" ? { type: editorType } : null)}
        projects={projects}
        allTags={allTags}
      />

      <NoteDetail
        open={!!detail}
        note={detail}
        projectName={detail ? projectMap[detail.projectId] : ""}
        onTutup={()=> setDetail(null)}
        onEdit={(n)=> { setDetail(null); handleEdit(n); }}
        onPin={handleDetailPin}
        onArchive={handleDetailArchive}
        onHapus={handleDetailHapus}
        onSalinCode={handleSalinCode}
      />

      {showNewMenu && <div style={{ position:"fixed", inset:0, zIndex:10 }} onClick={()=>setShowNewMenu(false)} aria-hidden />}
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { FolderKanban, Plus, Activity, CheckSquare, TrendingUp, ArrowUpRight, Clock, Layers, Pin, Code2, StickyNote } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import { useNotes } from "../../hooks/useNotes";

export default function Dashboard() {
  const { projects, loaded, stats } = useProjects();
  const { notes } = useNotes();
  const navigate = useNavigate();
  const pinnedNotes = notes.filter(n=> n.pinned && !n.archived).slice(0,3);
  const upcomingDeadlines = notes.filter(n=> n.type==="deadline" && !n.archived && n.status!=="completed" && n.deadline).sort((a,b)=> new Date(a.deadline)-new Date(b.deadline)).slice(0,3);

  if (!loaded) {
    return (
      <div className="page">
        <div className="grid grid-3">
          <div className="skeleton" style={{ height: 92 }} />
          <div className="skeleton" style={{ height: 92 }} />
          <div className="skeleton" style={{ height: 92 }} />
        </div>
        <div className="skeleton" style={{ height: 220, marginTop: 16 }} />
      </div>
    );
  }

  const recentProyek = [...projects].sort((a,b)=> new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0,4);
  const hasProyek = projects.length > 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dasbor</h1>
        <p>Ruang kerja pengembangan pribadimu — rencanakan, desain, bangun, dan lacak.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card" style={{ display:"flex", gap:12, alignItems:"center", padding:"14px 16px" }}>
          <span className="stat-icon"><FolderKanban size={16} /></span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-faint)", fontWeight:600 }}>Proyek</div>
            <div style={{ fontSize:18, fontWeight:700, color:"var(--text)" }}>{stats.total}</div>
            <div style={{ fontSize:11, color:"var(--text-muted)" }}>{stats.inProgress} aktif · {stats.completed} selesai</div>
          </div>
        </div>
        <div className="card" style={{ display:"flex", gap:12, alignItems:"center", padding:"14px 16px" }}>
          <span className="stat-icon"><TrendingUp size={16} /></span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-faint)", fontWeight:600 }}>Kemajuan Keseluruhan</div>
            <div style={{ fontSize:18, fontWeight:700, color:"var(--text)" }}>{stats.avgProgress}%</div>
            <div className="progress-track" style={{ marginTop:6, height:4 }}><div className="progress-fill" style={{ width:`${stats.avgProgress}%`, background:"var(--accent)" }} /></div>
          </div>
        </div>
        <div className="card" style={{ display:"flex", gap:12, alignItems:"center", padding:"14px 16px" }}>
          <span className="stat-icon"><CheckSquare size={16} /></span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-faint)", fontWeight:600 }}>Fokus</div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginTop:2 }}>{hasProyek ? recentProyek[0]?.name : "Tidak ada proyek aktif"}</div>
            <div style={{ fontSize:11, color:"var(--text-muted)" }}>{hasProyek ? `${recentProyek[0]?.status} · ${recentProyek[0]?.progress}%` : "Buat proyek untuk memulai"}</div>
          </div>
        </div>
      </div>

      {/* Proyek Saya */}
      <div className="card" style={{ display:"grid", gap:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"center", flexWrap:"wrap" }}>
          <h3 style={{ margin:0, display:"flex", gap:8, alignItems:"center" }}><FolderKanban size={14} /> Proyek Saya</h3>
          <Link to="/admin/projects" className="btn-ghost sm" style={{ textDecoration:"none" }}>Lihat semua</Link>
        </div>

        {!hasProyek ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FolderKanban size={18} /></div>
            <h3>Belum ada proyek</h3>
            <p>Buat proyek pertama kamu untuk mulai bekerja. Workspace dimulai bersih tanpa data contoh.</p>
            <button className="btn-primary sm" onClick={()=>navigate("/admin/projects")}><Plus size={14} /> Buat Proyek</button>
          </div>
        ) : (
          <div className="projects-grid">
            {recentProyek.map((p)=> (
              <Link key={p.id} to={`/admin/projects/${p.id}`} style={{ textDecoration:"none" }}>
                <div className="project-card" style={{ height:"100%" }}>
                  <div className="project-card-top">
                    <span className="badge" style={{ fontSize:10 }}>{p.type}</span>
                    <span className="badge" style={{ fontSize:10, background: p.status==="completed"? "rgba(16,185,129,0.12)": p.status==="in-progress"?"rgba(245,158,11,0.12)":"var(--bg-hover)", color: p.status==="completed"?"#6EE7B7": p.status==="in-progress"?"#FCD34D":"var(--text-muted)", borderColor: p.status==="completed"?"rgba(16,185,129,0.25)": p.status==="in-progress"?"rgba(245,158,11,0.25)":"var(--border)" }}>{p.status}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8, alignItems:"flex-start" }}>
                    <h3 style={{ margin:0, fontSize:13 }}>{p.name}</h3>
                    <ArrowUpRight size={12} style={{ color:"var(--text-faint)", flexShrink:0, marginTop:2 }} />
                  </div>
                  <p className="project-card-desc" style={{ minHeight:32, WebkitLineClamp:2 }}>{p.description || "— belum ada deskripsi —"}</p>
                  <div className="project-card-meta">
                    <span className="project-meta-item"><Layers size={10} />{p.stack}</span>
                    <span className="project-meta-item"><Clock size={10} />{new Date(p.updatedAt).toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}</span>
                  </div>
                  <div className="project-progress-wrap">
                    <div className="project-progress-head"><span>Kemajuan</span><strong>{p.progress}%</strong></div>
                    <div className="progress-track"><div className="progress-fill" style={{ width:`${p.progress}%`, background: p.progress>=80?"#10B981": p.progress>=50?"#F59E0B":"var(--accent)" }} /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-2" style={{ marginTop:16 }}>
        <div className="card" style={{ display:"grid", gap:10 }}>
          <h3 style={{ margin:0, display:"flex", gap:8, alignItems:"center" }}><Activity size={14} /> Aktivitas Terbaru</h3>
          {!hasProyek ? (
            <p style={{ fontSize:12, color:"var(--text-faint)", textAlign:"center", padding:"20px 0", border:"1px dashed var(--border)", borderRadius:10 }}>Belum ada aktivitas. Buat dan perbarui proyek untuk melihat riwayat di sini.</p>
          ) : (
            <div style={{ display:"grid", gap:8 }}>
              {recentProyek.slice(0,4).map((p)=> (
                <div key={p.id} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 10px", border:"1px solid var(--border)", borderRadius:10, background:"var(--bg)", justifyContent:"space-between" }}>
                  <div style={{ display:"grid", gap:2 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{p.name}</span>
                    <span style={{ fontSize:11, color:"var(--text-muted)" }}>Diperbarui {new Date(p.updatedAt).toLocaleDateString("id-ID")} · {p.status}</span>
                  </div>
                  <span className="badge" style={{ fontSize:10 }}>{p.progress}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ display:"grid", gap:10 }}>
          <h3 style={{ margin:0, display:"flex", gap:8, alignItems:"center" }}><CheckSquare size={14} /> Tugas Saat Ini</h3>
          <p style={{ fontSize:12, color:"var(--text-muted)" }}>Tugas akan muncul di sini setelah kamu menambahkannya ke ruang kerja proyek.</p>
          <div className="empty-state" style={{ padding:"20px" }}>
            <p style={{ fontSize:12 }}>Belum ada tugas — rencanakan proyekmu untuk membuat tugas.</p>
            <Link to="/admin/planning" className="btn-ghost sm" style={{ textDecoration:"none" }}>Ke Perencanaan</Link>
          </div>
        </div>
      </div>

      {(pinnedNotes.length>0 || upcomingDeadlines.length>0) && (
        <div className="grid grid-2" style={{ marginTop:16 }}>
          <div className="card" style={{ display:"grid", gap:10 }}>
            <h3 style={{ margin:0, display:"flex", gap:8, alignItems:"center" }}><Pin size={14} /> Catatan Disematkan</h3>
            {pinnedNotes.length===0 ? <p style={{ fontSize:12, color:"var(--text-faint)", textAlign:"center", padding:12, border:"1px dashed var(--border)", borderRadius:10 }}>Belum ada catatan disematkan</p> :
              <div style={{ display:"grid", gap:8 }}>
                {pinnedNotes.map(n=> (
                  <Link key={n.id} to="/admin/notes" style={{ textDecoration:"none", display:"flex", gap:8, alignItems:"center", padding:"8px 10px", border:"1px solid var(--border)", borderRadius:10, background:"var(--bg)" }}>
                    <StickyNote size={12} style={{ color:"var(--accent)", flexShrink:0 }} />
                    <span style={{ fontSize:12, fontWeight:500, color:"var(--text)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{n.title}</span>
                    <span className="badge" style={{ fontSize:9 }}>{n.type}</span>
                  </Link>
                ))}
              </div>
            }
            <Link to="/admin/notes" className="btn-ghost sm" style={{ textDecoration:"none", justifyContent:"center" }}>Buka Catatan</Link>
          </div>
          <div className="card" style={{ display:"grid", gap:10 }}>
            <h3 style={{ margin:0, display:"flex", gap:8, alignItems:"center" }}><Clock size={14} /> Tenggat Mendatang</h3>
            {upcomingDeadlines.length===0 ? <p style={{ fontSize:12, color:"var(--text-faint)", textAlign:"center", padding:12, border:"1px dashed var(--border)", borderRadius:10 }}>Belum ada tenggat mendatang</p> :
              <div style={{ display:"grid", gap:8 }}>
                {upcomingDeadlines.map(n=> (
                  <Link key={n.id} to="/admin/notes" style={{ textDecoration:"none", display:"flex", gap:8, alignItems:"center", padding:"8px 10px", border:"1px solid var(--border)", borderRadius:10, background:"var(--bg)", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, fontWeight:500, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{n.title}</span>
                    <span style={{ fontSize:11, color: new Date(n.deadline) < new Date() ? "#FCA5A5" : "var(--text-muted)", flexShrink:0 }}>{new Date(n.deadline).toLocaleDateString("id-ID",{ day:"2-digit", month:"short" })}</span>
                  </Link>
                ))}
              </div>
            }
            <Link to="/admin/notes" className="btn-ghost sm" style={{ textDecoration:"none", justifyContent:"center" }}><Code2 size={12} /> Ke Pusat Catatan</Link>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop:16, background:"var(--bg-card)", borderStyle:"dashed" }}>
        <p style={{ fontSize:11, color:"var(--text-faint)", textAlign:"center", margin:0 }}>
          Ruang kerja pribadi · data disimpan lokal (localStorage) · awalan <code style={{ fontSize:10, background:"var(--bg)", padding:"2px 6px", borderRadius:6, border:"1px solid var(--border)" }}>webplan:*</code> · siap untuk Supabase
        </p>
      </div>
    </div>
  );
}
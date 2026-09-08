import { useMemo } from "react";

export default function FinalPreviewTab({ data }) {
  const { project, goals, audienceDetail, scope, sitemap, sections, requirements, features, checklist, notes, designBrief, constraints } = data;

  const completion = useMemo(()=>{
    const parts = [
      !!project.name,
      !!project.description,
      goals.length>0,
      !!audienceDetail.targetAudience,
      (scope.inScope.length+scope.outOfScope.length)>0,
      sitemap.length>0,
      sections.length>0,
      requirements.length>0,
      features.length>0,
      checklist.length>0,
      !!(designBrief.inspiration||designBrief.colors),
      !!(constraints.technical||constraints.business),
    ];
    const done = parts.filter(Boolean).length;
    return { done, total: parts.length, pct: Math.round((done/parts.length)*100) };
  }, [data]);

  const stack = Array.isArray(project.stack) ? project.stack.join(", ") : (project.stack||"-");

  return (
    <div className="planning-panel" style={{ display:"grid", gap:16 }}>
      <div className="card">
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <h3 style={{ margin:0 }}>Pratinjau Akhir</h3>
          <span className="badge" style={{ fontSize:10 }}>{completion.done}/{completion.total} sections · {completion.pct}%</span>
          <div style={{ flex:1 }} />
          <div className="progress-track" style={{ width:120, height:6 }}><div className="progress-fill" style={{ width:`${completion.pct}%`, background:"var(--accent)" }} /></div>
        </div>
        <p style={{ margin:"6px 0 0", color:"var(--text-muted)", fontSize:12 }}>Sintesis hanya-baca — this is what will be sent to AI. Fill gaps in previous tabs.</p>
      </div>

      <div className="grid grid-2">
        <div className="card" style={{ display:"grid", gap:10 }}>
          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)" }}>Project</strong>
          <div style={{ fontSize:13, lineHeight:1.6, color:"var(--text-muted)" }}>
            <div><span style={{ color:"var(--text)", fontWeight:600 }}>{project.name||"—"}</span> · {project.type} · {project.platform} · {stack||"-"}</div>
            <div style={{ marginTop:6 }}>{project.description||"— no description —"}</div>
            {project.goal && <div style={{ marginTop:6 }}><em>Goal:</em> {project.goal}</div>}
          </div>

          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)", marginTop:8 }}>Tujuan</strong>
          {goals.length===0 ? <span style={{ fontSize:12, color:"var(--text-faint)" }}>— none —</span> : <ul style={{ margin:0, paddingLeft:16, fontSize:12, color:"var(--text-muted)", lineHeight:1.7 }}>{goals.map(g=> <li key={g.id}>{g.text} <span className="badge" style={{ fontSize:9, marginLeft:4 }}>{g.priority}/{g.status}</span></li>)}</ul>}

          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)", marginTop:8 }}>Target Pengguna</strong>
          <div style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.6 }}>
            <div>Target: {audienceDetail.targetAudience||project.targetAudience||"—"}</div>
            <div>Type: {audienceDetail.userType||"—"}</div>
            <div>Problems: {audienceDetail.problems||"—"}</div>
            <div>Needs: {audienceDetail.needs||"—"}</div>
            <div>Behavior: {audienceDetail.expectedBehavior||"—"}</div>
          </div>

          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)", marginTop:8 }}>Ruang Lingkup</strong>
          <div style={{ display:"grid", gap:8, fontSize:12 }}>
            <div><span style={{ fontWeight:600, color:"var(--text)" }}>In:</span> {scope.inScope.length? scope.inScope.map(s=>s.text).join(" · ") : "—"}</div>
            <div><span style={{ fontWeight:600, color:"var(--text)" }}>Out:</span> {scope.outOfScope.length? scope.outOfScope.map(s=>s.text).join(" · ") : "—"}</div>
          </div>
        </div>

        <div className="card" style={{ display:"grid", gap:10 }}>
          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)" }}>Peta Situs</strong>
          {sitemap.length===0 ? <span style={{ fontSize:12, color:"var(--text-faint)" }}>— none —</span> : <div style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.7 }}>{sitemap.map(p=> <div key={p.id}><code style={{ fontSize:11, background:"var(--bg)", border:"1px solid var(--border)", padding:"1px 4px", borderRadius:4 }}>{p.path}</code> {p.title}{p.description?` — ${p.description}`:""}</div>)}</div>}

          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)", marginTop:8 }}>Bagian</strong>
          {sections.length===0 ? <span style={{ fontSize:12, color:"var(--text-faint)" }}>— none —</span> : <ul style={{ margin:0, paddingLeft:16, fontSize:12, color:"var(--text-muted)", lineHeight:1.7 }}>{sections.filter(s=>s.include).map(s=> <li key={s.id}>{s.name}: {s.purpose}</li>)}</ul>}

          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)", marginTop:8 }}>Persyaratan</strong>
          {requirements.length===0 ? <span style={{ fontSize:12, color:"var(--text-faint)" }}>— none —</span> : <ul style={{ margin:0, paddingLeft:16, fontSize:12, color:"var(--text-muted)", lineHeight:1.7 }}>{requirements.map(r=> <li key={r.id}>[{r.type}/{r.priority}] {r.title}</li>)}</ul>}

          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)", marginTop:8 }}>Fitur</strong>
          {features.length===0 ? <span style={{ fontSize:12, color:"var(--text-faint)" }}>— none —</span> : <ul style={{ margin:0, paddingLeft:16, fontSize:12, color:"var(--text-muted)", lineHeight:1.7 }}>{features.map(f=> <li key={f.id}>[{f.priority}] {f.title}{f.description?` — ${f.description}`:""}</li>)}</ul>}

          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)", marginTop:8 }}>Brief Desain</strong>
          <div style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.6 }}>
            <div>Mood: {designBrief.mood||"—"}</div>
            <div>Warna: {designBrief.colors||"—"}</div>
            <div>Tipografi: {designBrief.typography||"—"}</div>
            <div>Referensi Inspirasi: {designBrief.inspiration||"—"}</div>
          </div>

          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)", marginTop:8 }}>Batasan</strong>
          <div style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.6 }}>
            <div>Technical: {constraints.technical||"—"}</div>
            <div>Business: {constraints.business||"—"}</div>
            <div>Timeline: {constraints.timeline||"—"}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ display:"grid", gap:8 }}>
        <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)" }}>Daftar Tugas · {checklist.filter(c=>c.done).length}/{checklist.length}</strong>
        {checklist.length===0 ? <span style={{ fontSize:12, color:"var(--text-faint)" }}>— none —</span> : <div style={{ display:"grid", gap:4, fontSize:12, color:"var(--text-muted)" }}>{checklist.map(c=> <div key={c.id} style={{ display:"flex", gap:8, alignItems:"center" }}><input type="checkbox" checked={!!c.done} readOnly /> <span style={{ textDecoration: c.done?"line-through":"none" }}>{c.text}</span></div>)}</div>}
      </div>

      {notes.length>0 && (
        <div className="card" style={{ display:"grid", gap:8 }}>
          <strong style={{ fontSize:12, letterSpacing:"0.04em", textTransform:"uppercase", color:"var(--text)" }}>Catatan</strong>
          {notes.map(n=> <div key={n.id} style={{ padding:8, border:"1px solid var(--border)", borderRadius:6, background:"var(--bg)" }}><div style={{ fontWeight:600, fontSize:12 }}>{n.title}</div><div style={{ fontSize:12, color:"var(--text-muted)", whiteSpace:"pre-wrap" }}>{n.content}</div></div>)}
        </div>
      )}
    </div>
  );
}
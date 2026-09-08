import { useMemo, useState } from "react";
import { Copy, Download, Plus, Trash2, Sparkles, Save } from "lucide-react";
import { buildAggregatedPrompt, PROMPT_TEMPLATES } from "../../hooks/useAI";

export default function PromptGeneratorTab({ ai, project, pages, tables, colors, features, instructions }) {
  const [template, setTemplate] = useState("opencode");
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);

  const aggregated = useMemo(() => buildAggregatedPrompt({ project, pages, tables, colors, features, instructions, template }), [project, pages, tables, colors, features, instructions, template]);

  async function handleSalin(text) {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),1500);} catch {}
  }
  function handleDownload(text, name) {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url);
  }
  function handleSimpan() {
    if (!aggregated.trim()) return;
    ai.addPrompt({ title: title.trim() || `Prompt — ${template} — ${new Date().toLocaleDateString("id-ID")}`, body: aggregated, template });
    setTitle("");
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0, display: "flex", gap: 8, alignItems: "center" }}><Sparkles size={16} /> Pembuat Prompt</h3>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>Gabungkan konteks Project + Pages + DB + Design + Fitur → prompt siap paste ke OpenCode.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn-primary sm" onClick={()=>handleSalin(aggregated)} type="button"><Copy size={12} /> {copied?"Disalin!":"Salin"}</button>
            <button className="btn-ghost sm" onClick={()=>handleDownload(aggregated, `prompt-${template}.md`)} type="button"><Download size={12} /> .md</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={template} onChange={(e)=>setTemplate(e.target.value)} className="field-input" style={{ flex: "1 1 220px", maxWidth: 320, padding: "8px 12px" }}>
            {PROMPT_TEMPLATES.map(t=> <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <span style={{ fontSize: 12, color: "var(--text-muted)", alignSelf: "center" }}>{PROMPT_TEMPLATES.find(t=>t.id===template)?.desc}</span>
        </div>

        <div style={{ padding: 10, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span>Project: <strong style={{ color:"var(--text)" }}>{project?.name || "—"}</strong> ({project?.type||"-"})</span>
          <span>Pages: {pages?.length||0}</span><span>Tabel: {tables?.length||0}</span><span>Warna: {colors?.length||0}</span><span>Fitur: {features?.length||0}</span><span>Instructions: {(instructions||[]).filter(i=>i.enabled).length} enabled</span>
        </div>

        <textarea readOnly value={aggregated} rows={16} style={{ width:"100%", fontFamily:"ui-monospace, monospace", fontSize:12, lineHeight:1.6, padding:12, borderRadius:10, border:"1px solid var(--border)", background:"#0a0a0a", color:"#e7e5e4" }} />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Judul untuk save — ex: Prompt Checkout WA" style={{ flex: "1 1 200px" }} />
          <button className="btn-secondary sm" onClick={handleSimpan} type="button"><Save size={12} /> Simpan to Library</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: 0 }}>Simpand Prompt ({ai.prompts.length})</h3>
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {ai.prompts.length===0 ? <p style={{ color:"var(--text-faint)", fontSize:13, textAlign:"center", padding:12, border:"1px dashed var(--border)", borderRadius:10 }}>Belum ada saved prompts.</p> :
            ai.prompts.map(p=> (
              <div key={p.id} className="planning-item" style={{ alignItems:"flex-start" }}>
                <div style={{ flex:1, minWidth:0, display:"grid", gap:4 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                    <strong style={{ fontSize:13 }}>{p.title}</strong><span className="badge" style={{ fontSize:10 }}>{p.template}</span>
                  </div>
                  <pre style={{ margin:0, fontSize:11, color:"var(--text-muted)", whiteSpace:"pre-wrap", wordBreak:"break-word", maxHeight:80, overflow:"hidden" }}>{p.body.slice(0,220)}{p.body.length>220?"...":""}</pre>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button className="btn-ghost sm" onClick={()=>handleSalin(p.body)} type="button"><Copy size={12} /></button>
                  <button className="btn-ghost sm" onClick={()=>handleDownload(p.body, `${p.title.replace(/\s+/g,"-")}.md`)} type="button"><Download size={12} /></button>
                  <button className="btn-ghost sm danger" onClick={()=>ai.removePrompt(p.id)} type="button"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
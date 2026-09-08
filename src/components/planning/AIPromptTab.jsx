import { useState, useMemo } from "react";
import { generatePrompt } from "../../hooks/usePlanning";

export default function AIPromptTab({ data }) {
  const [style, setStyle] = useState("opencode");
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => generatePrompt(data, { style }), [data, style]);

  async function handleSalin() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: select
      const ta = document.getElementById("ai-prompt-textarea");
      if (ta) { ta.select(); document.execCommand("copy"); setCopied(true); setTimeout(()=>setCopied(false),1800); }
    }
  }

  function handleDownload() {
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webplan-prompt-${(data.project.name || "untitled").replace(/\s+/g, "-").toLowerCase()}-${style}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const stats = {
    sections: data.sections.filter(s=>s.include).length,
    requirements: data.requirements.length,
    checklistDone: data.checklist.filter(c=>c.done).length,
    totalChecklist: data.checklist.length,
  };

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card" style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0 }}>Pembuat Prompt AI</h3>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
              Buat prompt siap-paste ke OpenCode / ChatGPT / v0 untuk mengawali development.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={style} onChange={(e)=>setStyle(e.target.value)} className="field-input" style={{ padding: "8px 10px", fontSize: 13 }}>
              <option value="opencode">OpenCode — actionable</option>
              <option value="detailed">Detailed — brief lengkap</option>
              <option value="minimal">Minimal — ringkas</option>
            </select>
            <button className="btn-primary" onClick={handleSalin} type="button">{copied ? "✓ Tersalin" : "Salin Prompt"}</button>
            <button className="btn-secondary" onClick={handleDownload} type="button">Download .md</button>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="stat"><span className="stat-val">{stats.sections}</span><span className="stat-label">Bagian included</span></div>
          <div className="stat"><span className="stat-val">{stats.requirements}</span><span className="stat-label">Persyaratan</span></div>
          <div className="stat"><span className="stat-val">{stats.checklistDone}/{stats.totalChecklist}</span><span className="stat-label">Daftar Tugas done</span></div>
        </div>

        {!data.project.name && (
          <div style={{ padding: "10px 12px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, fontSize: 13, color: "#92400e" }}>
            ⚠️ Nama project masih kosong — isi di tab <strong>Project Planning</strong> agar prompt lebih akurat.
          </div>
        )}

        <div style={{ position: "relative" }}>
          <textarea
            id="ai-prompt-textarea"
            readOnly
            value={prompt}
            rows={18}
            style={{ width: "100%", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, lineHeight: 1.6, padding: 14, borderRadius: 12, border: "1px solid var(--border)", background: "#0a0a0a", color: "#e7e5e4", resize: "vertical" }}
          />
        </div>

        <details style={{ fontSize: 13, color: "var(--text-muted)" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--text)" }}>Cara pakai</summary>
          <ol style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Lengkapi Project Planning, Bagian, dan Persyaratan terlebih dahulu.</li>
            <li>Pilih style prompt: <em>OpenCode</em> untuk langsung build via opencode, <em>Detailed</em> untuk brief ke tim.</li>
            <li>Salin → paste ke OpenCode / AI chat → iterasi sections satu per satu.</li>
            <li>Download .md jika ingin disimpan sebagai dokumentasi planning.</li>
          </ol>
        </details>
      </div>
    </div>
  );
}
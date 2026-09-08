import { useMemo, useState } from "react";
import { Copy, Download, Code2 } from "lucide-react";
import { generateSQL } from "../../hooks/useDatabase";

export default function ERDTab({ tables, relationships }) {
  const [copied, setCopied] = useState(false);
  const sql = useMemo(() => generateSQL(tables, relationships), [tables, relationships]);

  async function handleSalin() {
    try { await navigator.clipboard.writeText(sql); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }
  function handleDownload() {
    const blob = new Blob([sql], { type: "text/sql" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "schema.sql"; a.click();
    URL.revokeObjectURL(url);
  }

  function handleSalinMermaid() {
    const mermaid = generateMermaid(tables, relationships);
    navigator.clipboard.writeText(mermaid).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0, display: "flex", gap: 8, alignItems: "center" }}><Code2 size={16} /> ERD — Entity Relationship Diagram</h3>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>Visual ringkas + SQL siap paste ke Supabase. Garis = relationships.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn-ghost sm" onClick={handleSalinMermaid} type="button"><Copy size={12} /> Salin Mermaid</button>
            <button className="btn-ghost sm" onClick={handleSalin} type="button">{copied ? "Disalin!" : <><Copy size={12} /> Salin SQL</>}</button>
            <button className="btn-primary sm" onClick={handleDownload} type="button"><Download size={12} /> schema.sql</button>
          </div>
        </div>

        {/* ERD visual */}
        <div className="erd-grid">
          {tables.map((t) => (
            <div key={t.id} className="erd-table">
              <div className="erd-table-head">
                <strong style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>{t.name}</strong>
                <span className="badge" style={{ fontSize: 10 }}>{t.columns.length} cols</span>
              </div>
              <div className="erd-table-body">
                {t.columns.map((c) => (
                  <div key={c.id} className="erd-col" style={{ background: c.isPK ? "#171717" : c.isFK ? "#fffbeb" : "#fff", color: c.isPK ? "#fff" : "var(--text)", borderColor: c.isPK ? "#171717" : c.isFK ? "#fde68a" : "var(--border)" }}>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}>{c.isPK ? "PK " : c.isFK ? "FK " : ""}{c.name}</span>
                    <span style={{ fontSize: 11, color: c.isPK ? "#a3a3a3" : "var(--text-muted)" }}>{c.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {relationships.length > 0 && (
          <div style={{ marginTop: 14, display: "grid", gap: 6 }}>
            <strong style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>Relasi</strong>
            {relationships.map((r) => {
              const fromT = tables.find((t) => t.id === r.fromTable);
              const toT = tables.find((t) => t.id === r.toTable);
              const fromC = fromT?.columns.find((c) => c.id === r.fromColumn);
              const toC = toT?.columns.find((c) => c.id === r.toColumn);
              return (
                <div key={r.id} style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "ui-monospace, monospace", fontSize: 12, flexWrap: "wrap", padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--off-white)" }}>
                  <span>{fromT?.name}.{fromC?.name}</span><span style={{ color: "var(--text-faint)" }}>—{r.type}→</span><span>{toT?.name}.{toC?.name}</span>
                  <span className="badge" style={{ fontSize: 10 }}>{r.onHapus}</span>
                </div>
              );
            })}
          </div>
        )}

        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Preview SQL</summary>
          <pre style={{ marginTop: 8, padding: 12, background: "#0a0a0a", color: "#e7e5e4", borderRadius: 10, fontSize: 12, lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{sql}</pre>
        </details>
      </div>
    </div>
  );
}

function generateMermaid(tables, relationships) {
  let out = "erDiagram\n";
  for (const t of tables) {
    out += `  ${t.name} {\n`;
    for (const c of t.columns) {
      const key = c.isPK ? "PK" : c.isFK ? "FK" : "";
      out += `    ${c.type} ${c.name} ${key}\n`;
    }
    out += "  }\n";
  }
  for (const r of relationships) {
    const fromT = tables.find((t) => t.id === r.fromTable)?.name || "unknown";
    const toT = tables.find((t) => t.id === r.toTable)?.name || "unknown";
    const sym = r.type === "one-to-many" ? "||--o{" : r.type === "many-to-one" ? "}o--||" : r.type === "one-to-one" ? "||--||" : "}o--o{";
    out += `  ${fromT} ${sym} ${toT} : "${r.fromTable}"\n`;
  }
  return out;
}
import { useState } from "react";
import { Bot, Sparkles, Code2, Workflow, RotateCcw } from "lucide-react";
import { useAI } from "../../hooks/useAI";
import { useProjects } from "../../hooks/useProjects";
import { usePages } from "../../hooks/usePages";
import { useDatabase } from "../../hooks/useDatabase";
import { useDesign } from "../../hooks/useDesign";
import { useFeatures } from "../../hooks/useFeatures";
import PromptGeneratorTab from "../../components/prompts/PromptGeneratorTab";
import CodingInstructionsTab from "../../components/prompts/CodingInstructionsTab";
import AgentWorkflowTab from "../../components/prompts/AgentWorkflowTab";

const TABS = [
  { id: "prompt", label: "Pembuat Prompt", icon: Sparkles },
  { id: "instructions", label: "Instruksi Coding", icon: Code2 },
  { id: "workflow", label: "Alur Kerja Agent", icon: Workflow },
];

export default function Prompt() {
  const ai = useAI();
  const { projects } = useProjects();
  const { pages } = usePages();
  const { tables } = useDatabase();
  const { colors } = useDesign();
  const { features } = useFeatures();
  const [active, setActive] = useState("prompt");
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");

  if (!ai.loaded) return <div className="page"><div className="auth-loading" style={{ minHeight: 200 }}><div className="spinner" /></div></div>;

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ display: "flex", gap: 10, alignItems: "center" }}><Bot size={20} /> AI / OpenCode</h1>
          <p style={{ maxWidth: 600 }}>Prompt + instruksi + workflow untuk agent. Generator menarik konteks dari Proyek/Pages/DB/Design/Fitur.</p>
        </div>
        <button className="btn-ghost sm" onClick={() => { if (confirm("Bersihkan AI data?")) ai.reset(); }} type="button"><RotateCcw size={14} /> Atur Ulang</button>
      </div>

      <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16, padding: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Active Project:</span>
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="field-input" style={{ flex: "1 1 200px", maxWidth: 360, padding: "8px 12px" }}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.type}</option>)}
        </select>
        {project && <><span className="badge">{project.status}</span><span className="badge">{project.progress}%</span></>}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>{ai.stats.totalPrompt} prompts · {ai.stats.enabledInstructions}/{ai.stats.totalInstructions} instructions · {ai.stats.totalWorkflows} workflows</span>
      </div>

      <div className="planning-tabs" role="tablist" style={{ marginBottom: 16 }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} role="tab" aria-selected={isActive} onClick={() => setActive(t.id)} className={`planning-tab ${isActive ? "planning-tab--active" : ""}`} type="button">
              <Icon size={16} /> {t.label}
              {t.id === "prompt" && <span className="planning-tab-count">{ai.prompts.length}</span>}
              {t.id === "instructions" && <span className="planning-tab-count">{ai.stats.enabledInstructions}/{ai.stats.totalInstructions}</span>}
              {t.id === "workflow" && <span className="planning-tab-count">{ai.workflows.length}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 8 }}>
        {active === "prompt" && <PromptGeneratorTab ai={ai} project={project} pages={pages} tables={tables} colors={colors} features={features} instructions={ai.instructions} />}
        {active === "instructions" && <CodingInstructionsTab ai={ai} />}
        {active === "workflow" && <AgentWorkflowTab ai={ai} />}
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>
        Auto-save · key: <code>{ai.STORAGE_KEY}</code> · template via <code>buildAggregatedPrompt()</code>
      </p>
    </div>
  );
}
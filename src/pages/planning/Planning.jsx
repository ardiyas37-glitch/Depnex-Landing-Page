import { useState } from "react";
import {
  LayoutDashboard,
  Target,
  Users,
  ListChecks,
  Map,
  LayoutPanelLeft,
  ClipboardCheck,
  Sparkles,
  CheckSquare,
  StickyNote,
  Palette,
  Settings,
  Bot,
  Eye,
  RotateCcw,
} from "lucide-react";
import { usePlanning } from "../../hooks/usePlanning";
import ProjectPlanningTab from "../../components/planning/ProjectPlanningTab";
import GoalsTab from "../../components/planning/GoalsTab";
import AudienceTab from "../../components/planning/AudienceTab";
import ScopeTab from "../../components/planning/ScopeTab";
import SitemapTab from "../../components/planning/SitemapTab";
import SectionsTab from "../../components/planning/SectionsTab";
import RequirementsTab from "../../components/planning/RequirementsTab";
import PlanningFeaturesTab from "../../components/planning/PlanningFeaturesTab";
import ChecklistTab from "../../components/planning/ChecklistTab";
import NotesTab from "../../components/planning/NotesTab";
import DesignBriefTab from "../../components/planning/DesignBriefTab";
import ConstraintsTab from "../../components/planning/ConstraintsTab";
import AIPromptTab from "../../components/planning/AIPromptTab";
import FinalPreviewTab from "../../components/planning/FinalPreviewTab";

const TABS = [
  { id: "project", label: "Project", icon: LayoutDashboard },
  { id: "goals", label: "Tujuan", icon: Target },
  { id: "audience", label: "Pengguna", icon: Users },
  { id: "scope", label: "Ruang Lingkup", icon: ListChecks },
  { id: "sitemap", label: "Peta Situs", icon: Map },
  { id: "sections", label: "Bagian", icon: LayoutPanelLeft },
  { id: "requirements", label: "Persyaratan", icon: ClipboardCheck },
  { id: "features", label: "Fitur", icon: Sparkles },
  { id: "checklist", label: "Checklist", icon: CheckSquare },
  { id: "notes", label: "Catatan", icon: StickyNote },
  { id: "designBrief", label: "Brief Desain", icon: Palette },
  { id: "constraints", label: "Batasan", icon: Settings },
  { id: "aiPrompt", label: "AI Prompt", icon: Bot },
  { id: "preview", label: "Pratinjau", icon: Eye },
];

export default function Planning() {
  const hook = usePlanning();
  const [active, setActive] = useState("project");

  if (!hook.loaded) return <div className="page"><div className="auth-loading" style={{ minHeight: 200 }}><div className="spinner" /></div></div>;

  const { data, progress, completion } = hook;

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ display: "flex", gap: 10, alignItems: "center" }}><LayoutDashboard size={20} /> Perencanaan</h1>
          <p style={{ maxWidth: 600 }}>Struktur proyek lengkap — project brief, sitemap, sections, requirements, fitur, hingga prompt AI siap pakai.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost sm" onClick={() => { if (confirm("Reset semua data perencanaan? Tindakan ini tidak dapat dibatalkan.")) hook.reset(); }} type="button"><RotateCcw size={14} /> Atur Ulang</button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="stat"><span className="stat-val">{progress.done}/{progress.total}</span><span className="stat-label">Progress {progress.pct}%</span></div>
        <div className="stat"><span className="stat-val">{completion.done}/{completion.total}</span><span className="stat-label">Checklist {completion.pct}%</span></div>
        <div className="stat"><span className="stat-val">{data.sections.filter(s=>s.include).length}</span><span className="stat-label">Bagian Included</span></div>
      </div>

      <div className="planning-tabs" role="tablist" style={{ marginBottom: 16 }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} role="tab" aria-selected={isActive} onClick={() => setActive(t.id)} className={`planning-tab ${isActive ? "planning-tab--active" : ""}`} type="button">
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 8 }}>
        {active === "project" && <ProjectPlanningTab project={data.project} updateProject={hook.updateProject} />}
        {active === "goals" && <GoalsTab goals={data.goals} addGoal={hook.addGoal} updateGoal={hook.updateGoal} removeGoal={hook.removeGoal} />}
        {active === "audience" && <AudienceTab audience={data.audienceDetail} updateAudience={hook.updateAudience} />}
        {active === "scope" && <ScopeTab scope={data.scope} addScopeItem={hook.addScopeItem} updateScopeItem={hook.updateScopeItem} removeScopeItem={hook.removeScopeItem} />}
        {active === "sitemap" && <SitemapTab sitemap={data.sitemap} addSitemapPage={hook.addSitemapPage} updateSitemapPage={hook.updateSitemapPage} removeSitemapPage={hook.removeSitemapPage} moveSitemap={hook.moveSitemap} />}
        {active === "sections" && <SectionsTab sections={data.sections} addSection={hook.addSection} updateSection={hook.updateSection} removeSection={hook.removeSection} moveSection={hook.moveSection} />}
        {active === "requirements" && <RequirementsTab requirements={data.requirements} addRequirement={hook.addRequirement} updateRequirement={hook.updateRequirement} removeRequirement={hook.removeRequirement} />}
        {active === "features" && <PlanningFeaturesTab features={data.features} addFeature={hook.addFeature} updateFeature={hook.updateFeature} removeFeature={hook.removeFeature} toggleFeature={hook.toggleFeature} />}
        {active === "checklist" && <ChecklistTab checklist={data.checklist} addChecklist={hook.addChecklist} toggleChecklist={hook.toggleChecklist} removeChecklist={hook.removeChecklist} updateChecklist={hook.updateChecklist} completion={completion} />}
        {active === "notes" && <NotesTab notes={data.notes} addNote={hook.addNote} updateNote={hook.updateNote} removeNote={hook.removeNote} />}
        {active === "designBrief" && <DesignBriefTab brief={data.designBrief} updateBrief={hook.updateDesignBrief} />}
        {active === "constraints" && <ConstraintsTab constraints={data.constraints} updateConstraints={hook.updateConstraints} />}
        {active === "aiPrompt" && <AIPromptTab data={data} />}
        {active === "preview" && <FinalPreviewTab data={data} />}
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>
        Simpan otomatis · kunci: <code>{hook.STORAGE_KEY}</code> · progress: {progress.pct}% · checklist: {completion.pct}%
      </p>
    </div>
  );
}
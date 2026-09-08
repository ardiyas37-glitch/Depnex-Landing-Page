import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/safeStorage";

const STORAGE_KEY = "depnex:ai:v08";

export const PROMPT_TEMPLATES = [
  { id: "opencode", label: "OpenCode — aksi", desc: "Ringkas, langkah demi langkah untuk agent OpenCode" },
  { id: "detailed", label: "Rinci — brief lengkap", desc: "Spesifikasi lengkap untuk handoff tim/klien" },
  { id: "minimal", label: "Minimal — ringkas", desc: "Mulai cepat 1 paragraf" },
  { id: "supabase", label: "Supabase — skema + RLS", desc: "Fokus DB + auth" },
];

export const INSTRUCTION_CATEGORY = ["General", "Code Style", "Security", "Performance", "UI/UX"];
export const WORKFLOW_STATUS = [
  { value: "todo", label: "Perlu Dikerjakan", color: "#737373" },
  { value: "doing", label: "Dikerjakan", color: "#d97706" },
  { value: "done", label: "Selesai", color: "#15803d" },
];

function uid(prefix = "ai") { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`; }
function nowISO() { return new Date().toISOString(); }




export function useAI() {
  const [prompts, setPrompts] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadFailedRef = useRef(false);
  const defaultData = { prompts: [], instructions: [], workflows: [] };

  useEffect(() => {
    const raw = safeGet(STORAGE_KEY, defaultData);
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      setPrompts(Array.isArray(raw.prompts) ? raw.prompts : []);
      setInstructions(Array.isArray(raw.instructions) ? raw.instructions : []);
      setWorkflows(Array.isArray(raw.workflows) ? raw.workflows : []);
    } else {
      loadFailedRef.current = true;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (loadFailedRef.current) { loadFailedRef.current = false; return; }
    safeSet(STORAGE_KEY, { prompts, instructions, workflows });
  }, [prompts, instructions, workflows, loaded]);

  // Prompts
  const addPrompt = useCallback((p)=> setPrompts(prev=> [{ id: uid("pr"), title:(p.title||"Untitled").trim(), body:p.body||"", template:p.template||"opencode", createdAt: nowISO(), updatedAt: nowISO() }, ...prev]), []);
  const updatePrompt = useCallback((id,patch)=> setPrompts(prev=> prev.map(p=> p.id===id?{...p,...patch,updatedAt:nowISO()}:p)), []);
  const removePrompt = useCallback((id)=> setPrompts(prev=> prev.filter(p=>p.id!==id)), []);
  const duplicatePrompt = useCallback((id)=> { const src=prompts.find(p=>p.id===id); if(!src) return; setPrompts(prev=>[{...src,id:uid("pr"),title:src.title+" Copy",createdAt:nowISO(),updatedAt:nowISO()},...prev]); },[prompts]);

  // Instructions
  const addInstruction = useCallback((r)=> setInstructions(prev=> [{ id: uid("ins"), title:(r.title||"New").trim(), category:r.category||"General", body:r.body||"", enabled: r.enabled ?? true, createdAt: nowISO() }, ...prev]), []);
  const updateInstruction = useCallback((id,patch)=> setInstructions(prev=> prev.map(r=> r.id===id?{...r,...patch}:r)), []);
  const toggleInstruction = useCallback((id)=> setInstructions(prev=> prev.map(r=> r.id===id?{...r,enabled:!r.enabled}:r)), []);
  const removeInstruction = useCallback((id)=> setInstructions(prev=> prev.filter(r=>r.id!==id)), []);

  // Workflows
  const addWorkflow = useCallback((w)=> setWorkflows(prev=> [{ id: uid("wf"), title:(w.title||"New Workflow").trim(), description:w.description||"", status:w.status||"todo", steps:w.steps||[], createdAt: nowISO(), updatedAt: nowISO() }, ...prev]), []);
  const updateWorkflow = useCallback((id,patch)=> setWorkflows(prev=> prev.map(w=> w.id===id?{...w,...patch,updatedAt:nowISO()}:w)), []);
  const removeWorkflow = useCallback((id)=> setWorkflows(prev=> prev.filter(w=>w.id!==id)), []);
  const addStep = useCallback((wfId, step)=> setWorkflows(prev=> prev.map(w=> w.id===wfId?{...w, steps:[...w.steps,{ id: uid("st"), title:(step.title||"Step").trim(), description:step.description||"", done: !!step.done }], updatedAt: nowISO()}:w)), []);
  const toggleStep = useCallback((wfId, stepId)=> setWorkflows(prev=> prev.map(w=> w.id===wfId?{...w, steps:w.steps.map(s=> s.id===stepId?{...s,done:!s.done}:s), updatedAt: nowISO()}:w)), []);
  const updateStep = useCallback((wfId, stepId, patch)=> setWorkflows(prev=> prev.map(w=> w.id===wfId?{...w, steps:w.steps.map(s=> s.id===stepId?{...s,...patch}:s), updatedAt: nowISO()}:w)), []);
  const removeStep = useCallback((wfId, stepId)=> setWorkflows(prev=> prev.map(w=> w.id===wfId?{...w, steps:w.steps.filter(s=>s.id!==stepId), updatedAt: nowISO()}:w)), []);

  const stats = useMemo(()=> ({
    totalPrompts: prompts.length,
    totalInstructions: instructions.length,
    enabledInstructions: instructions.filter(i=>i.enabled).length,
    totalWorkflows: workflows.length,
    doneWorkflows: workflows.filter(w=>w.status==="done").length,
  }),[prompts,instructions,workflows]);

  const reset = useCallback(()=> { setPrompts([]); setInstructions([]); setWorkflows([]); safeRemove(STORAGE_KEY); },[]);

  return { prompts, instructions, workflows, loaded, addPrompt, updatePrompt, removePrompt, duplicatePrompt, addInstruction, updateInstruction, toggleInstruction, removeInstruction, addWorkflow, updateWorkflow, removeWorkflow, addStep, toggleStep, updateStep, removeStep, stats, reset, STORAGE_KEY, PROMPT_TEMPLATES };
}

export function buildAggregatedPrompt({ project, pages, tables, colors, features, instructions, template = "opencode" }) {
  const enabledIns = (instructions||[]).filter(i=>i.enabled).map(i=> `- ${i.title}: ${i.body}`).join("\n") || "- (none)";
  const pagesList = (pages||[]).slice(0,8).map(p=> `  - ${p.path} (${p.title}) — ${p.type} [${p.status}]`).join("\n") || "  - (no pages)";
  const tablesList = (tables||[]).slice(0,6).map(t=> `  - ${t.name} (${t.columns.length} cols) — ${t.status}`).join("\n") || "  - (no tables)";
  const colorsList = (colors||[]).slice(0,5).map(c=> `  - ${c.token}: ${c.value} (${c.name})`).join("\n") || "  - (default tokens)";
  const featList = (features||[]).slice(0,6).map(f=> `  - [${f.status}/${f.priority}] ${f.title} — ${f.category}`).join("\n") || "  - (no features)";

  if (template === "supabase") {
    return `Kamu adalah OpenCode — Supabase + React.

PROYEK: ${project?.name || "proyek DepnexProject"} — ${project?.type || ""} — ${project?.status || ""} [${project?.progress || 0}%]

FOKUS: Basis Data + Auth
TABEL:
${tablesList}

INSTRUKSI:
${enabledIns}

TUGAS:
1. Buat SQL Supabase (CREATE TABLE + FK + RLS) kompatibel Postgres.
2. Siapkan AuthContext dengan Supabase Auth (email/password), sesi persisten.
3. Hubungkan tabel ke hooks (useProjects, usePages, dll) dengan live query.
4. Jaga variabel CSS tetap utuh.
`;
  }
  if (template === "minimal") {
    return `Buat ${project?.name || "website"} — ${project?.description || "modern responsif"}\nHalaman:\n${pagesList}\nTeknologi: React + Vite, tanpa UI lib berat.\n`;
  }
  if (template === "detailed") {
    return `# DepnexProject — Brief Build (${project?.name || "Tanpa Nama"})

## Proyek
- Nama: ${project?.name || "-"}
- Jenis: ${project?.type || "-"}
- Deskripsi: ${project?.description || "-"}
- Status: ${project?.status || "-"} · Kemajuan: ${project?.progress || 0}%

## Halaman
${pagesList}

## Basis Data
${tablesList}

## Token Desain
${colorsList}

## Fitur
${featList}

## Instruksi (aktif)
${enabledIns}

---
Buat dengan React + Vite, UI modern yang bersih, responsif, modular src/components/<fitur>.`;
  }
  // opencode default
  return `Kamu adalah OpenCode. Buat aplikasi React (Vite) yang siap production.

PROYEK: ${project?.name || "DepnexProject"} — ${project?.type || "Landing"} 
DESKRIPSI: ${project?.description || "Ruang kerja perencanaan website"}
TEKNOLOGI: React + Vite, react-router-dom, CSS modern (token di bawah), responsif, a11y

HALAMAN (peta situs):
${pagesList}

TABEL DB:
${tablesList}

TOKEN DESAIN:
${colorsList}

FITUR:
${featList}

INSTRUKSI:
${enabledIns}

TUGAS:
1. Buat routing sesuai peta situs.
2. Implementasikan komponen per fitur dengan data placeholder.
3. Jaga kode tetap modular, gunakan variabel CSS.
4. Pastikan responsif mobile & siap untuk integrasi Supabase.`;
}

export function workflowProgress(workflow) {
  const total = workflow.steps.length || 1;
  const done = workflow.steps.filter(s=>s.done).length;
  return { total, done, pct: Math.round((done/total)*100) };
}

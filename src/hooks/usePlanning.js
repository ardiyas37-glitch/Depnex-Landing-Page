import { useEffect, useState, useCallback, useRef } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/safeStorage";

const STORAGE_KEY = "webplan:planning:v03";

export const PROJECT_TYPES = ["Landing Page","Company Profile","E-Commerce","Booking","Dashboard","Portfolio","Blog","Web Application","SaaS","Other"];
export const PLATFORMS = ["Web","Mobile Web","PWA","Other"];
export const STACK_OPTIONS = ["React","Vite","React Router","CSS","JavaScript","TypeScript","Backend","Database"];
export const GOAL_PRIORITIES = ["low","medium","high","critical"];
export const GOAL_STATUSES = ["pending","in-progress","done","cancelled"];
export const AUDIENCE_FIELDS = ["targetAudience","userType","problems","needs","expectedBehavior"];

const defaultPlanning = {
  project: {
    name: "",
    type: "Landing Page",
    description: "",
    goal: "",
    targetAudience: "",
    platform: "Web",
    stack: [],
    audience: "",
    deadline: "",
    status: "draft",
    budget: "",
    inspiration: "",
  },
  goals: [],
  audienceDetail: {
    targetAudience: "",
    userType: "",
    problems: "",
    needs: "",
    expectedBehavior: "",
  },
  scope: {
    inScope: [],
    outOfScope: [],
  },
  sitemap: [],
  sections: [],
  requirements: [],
  features: [],
  checklist: [],
  notes: [],
  designBrief: {
    inspiration: "",
    references: "",
    mood: "",
    colors: "",
    typography: "",
    notes: "",
  },
  constraints: {
    technical: "",
    business: "",
    timeline: "",
    budget: "",
  },
};

function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function usePlanning() {
  const [data, setData] = useState(defaultPlanning);
  const [loaded, setLoaded] = useState(false);

  const loadFailedRef = useRef(false);

  useEffect(() => {
    const loaded = safeGet(STORAGE_KEY, null);
    let src = loaded;

    if (!src || (typeof src === "object" && Object.keys(src).length === 0)) {
      let legacy = null;
      try {
        const legacyRaw = localStorage.getItem("webplan:planning:v02");
        legacy = legacyRaw ? JSON.parse(legacyRaw) : null;
      } catch {}
      if (legacy) src = legacy;
    }

    if (src && typeof src === "object" && !Array.isArray(src)) {
      setData((prev) => {
        let migratedGoals = src.goals || prev.goals;
        if (src.project?.goals && Array.isArray(src.project.goals) && src.project.goals.length && typeof src.project.goals[0] === 'string') {
          migratedGoals = src.project.goals.filter(Boolean).map(t => ({ id: uid("goal"), text: t, priority: "medium", status: "pending" }));
        }
        let migratedStack = src.project?.stack;
        if (typeof migratedStack === 'string') migratedStack = migratedStack ? [migratedStack] : [];

        return {
          ...prev,
          ...src,
          project: {
            ...prev.project,
            ...(src.project || {}),
            stack: Array.isArray(migratedStack) ? migratedStack : prev.project.stack,
            goal: src.project?.goal || prev.project.goal,
            targetAudience: src.project?.targetAudience || src.audienceDetail?.targetAudience || prev.project.targetAudience,
            platform: src.project?.platform || prev.project.platform,
          },
          goals: Array.isArray(migratedGoals) ? migratedGoals : prev.goals,
          audienceDetail: { ...prev.audienceDetail, ...(src.audienceDetail || {}) },
          scope: {
            inScope: Array.isArray(src.scope?.inScope) ? src.scope.inScope : prev.scope.inScope,
            outOfScope: Array.isArray(src.scope?.outOfScope) ? src.scope.outOfScope : prev.scope.outOfScope,
          },
          sitemap: Array.isArray(src.sitemap) ? src.sitemap : prev.sitemap,
          sections: Array.isArray(src.sections) ? src.sections : prev.sections,
          requirements: Array.isArray(src.requirements) ? src.requirements : prev.requirements,
          features: Array.isArray(src.features) ? src.features : prev.features,
          checklist: Array.isArray(src.checklist) ? src.checklist : prev.checklist,
          notes: Array.isArray(src.notes) ? src.notes : prev.notes,
          designBrief: { ...prev.designBrief, ...(src.designBrief || {}) },
          constraints: { ...prev.constraints, ...(src.constraints || {}) },
        };
      });
    } else {
      loadFailedRef.current = true;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (loadFailedRef.current) { loadFailedRef.current = false; return; }
    safeSet(STORAGE_KEY, data);
  }, [data, loaded]);

  const updateProject = useCallback((patch) => {
    setData((d) => ({ ...d, project: { ...d.project, ...patch } }));
  }, []);

  const updateGoalsLegacy = useCallback((goals) => {
    // legacy support: goals as string array -> convert
    const structured = goals.filter(Boolean).map(text => typeof text === 'string' ? ({ id: uid("goal"), text, priority:"medium", status:"pending" }) : text);
    setData((d) => ({ ...d, goals: structured }));
  }, []);

  // Goals structured
  const addGoal = useCallback((payload) => {
    setData((d) => ({ ...d, goals: [...d.goals, { id: uid("goal"), text: payload.text?.trim() || "New goal", priority: payload.priority || "medium", status: payload.status || "pending" }] }));
  }, []);
  const updateGoal = useCallback((id, patch) => {
    setData((d) => ({ ...d, goals: d.goals.map(g => g.id===id ? { ...g, ...patch } : g)}));
  }, []);
  const removeGoal = useCallback((id) => {
    setData((d) => ({ ...d, goals: d.goals.filter(g => g.id!==id)}));
  }, []);

  // Audience
  const updateAudience = useCallback((patch) => {
    setData((d) => ({ ...d, audienceDetail: { ...d.audienceDetail, ...patch }}));
  }, []);

  // Scope
  const addScopeItem = useCallback((kind, text) => {
    const key = kind==="in" ? "inScope" : "outOfScope";
    setData((d) => ({ ...d, scope: { ...d.scope, [key]: [...d.scope[key], { id: uid("scope"), text: text.trim() }] } }));
  }, []);
  const updateScopeItem = useCallback((kind, id, text) => {
    const key = kind==="in" ? "inScope" : "outOfScope";
    setData((d) => ({ ...d, scope: { ...d.scope, [key]: d.scope[key].map(s => s.id===id ? { ...s, text } : s) }}));
  }, []);
  const removeScopeItem = useCallback((kind, id) => {
    const key = kind==="in" ? "inScope" : "outOfScope";
    setData((d) => ({ ...d, scope: { ...d.scope, [key]: d.scope[key].filter(s => s.id!==id) }}));
  }, []);

  // Sitemap
  const addSitemapPage = useCallback((payload) => {
    setData((d) => ({ ...d, sitemap: [...d.sitemap, { id: uid("page"), title: payload.title?.trim()||"New Page", path: payload.path?.trim()||"/new", description: payload.description||"", parentId: payload.parentId||null }] }));
  }, []);
  const updateSitemapPage = useCallback((id, patch) => {
    setData((d) => ({ ...d, sitemap: d.sitemap.map(p => p.id===id ? { ...p, ...patch } : p)}));
  }, []);
  const removeSitemapPage = useCallback((id) => {
    setData((d) => ({ ...d, sitemap: d.sitemap.filter(p => p.id!==id)}));
  }, []);
  const moveSitemap = useCallback((id, dir) => {
    setData((d) => {
      const idx = d.sitemap.findIndex(p=>p.id===id);
      if(idx===-1) return d;
      const next=[...d.sitemap];
      const target = dir==="up"? idx-1: idx+1;
      if(target<0 || target>=next.length) return d;
      [next[idx], next[target]]=[next[target], next[idx]];
      return { ...d, sitemap: next };
    });
  }, []);

  // Sections
  const addSection = useCallback((section) => {
    setData((d) => ({ ...d, sections: [...d.sections, { id: uid("sec"), include: true, ...section }] }));
  }, []);
  const updateSection = useCallback((id, patch) => {
    setData((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  }, []);
  const removeSection = useCallback((id) => {
    setData((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }));
  }, []);
  const moveSection = useCallback((id, dir) => {
    setData((d) => {
      const idx = d.sections.findIndex((s) => s.id === id);
      if (idx === -1) return d;
      const next = [...d.sections];
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return d;
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...d, sections: next };
    });
  }, []);

  // Requirements
  const addRequirement = useCallback((req) => {
    setData((d) => ({ ...d, requirements: [...d.requirements, { id: uid("req"), done: false, ...req }] }));
  }, []);
  const updateRequirement = useCallback((id, patch) => {
    setData((d) => ({ ...d, requirements: d.requirements.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }, []);
  const removeRequirement = useCallback((id) => {
    setData((d) => ({ ...d, requirements: d.requirements.filter((r) => r.id !== id) }));
  }, []);

  // Features (planning features)
  const addFeature = useCallback((payload) => {
    setData((d) => ({ ...d, features: [...d.features, { id: uid("feat"), title: payload.title?.trim()||"New feature", description: payload.description||"", priority: payload.priority||"medium", done:false }] }));
  }, []);
  const updateFeature = useCallback((id, patch) => {
    setData((d) => ({ ...d, features: d.features.map(f=> f.id===id ? { ...f, ...patch } : f)}));
  }, []);
  const removeFeature = useCallback((id) => {
    setData((d) => ({ ...d, features: d.features.filter(f=> f.id!==id)}));
  }, []);
  const toggleFeature = useCallback((id) => {
    setData((d) => ({ ...d, features: d.features.map(f=> f.id===id ? { ...f, done: !f.done } : f)}));
  }, []);

  // Checklist
  const addChecklist = useCallback((text, category = "general") => {
    setData((d) => ({ ...d, checklist: [...d.checklist, { id: uid("chk"), text, category, done: false }] }));
  }, []);
  const toggleChecklist = useCallback((id) => {
    setData((d) => ({ ...d, checklist: d.checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)) }));
  }, []);
  const updateChecklist = useCallback((id, patch) => {
    setData((d) => ({ ...d, checklist: d.checklist.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  }, []);
  const removeChecklist = useCallback((id) => {
    setData((d) => ({ ...d, checklist: d.checklist.filter((c) => c.id !== id) }));
  }, []);

  // Notes
  const addNote = useCallback((note) => {
    setData((d) => ({ ...d, notes: [{ id: uid("note"), createdAt: new Date().toISOString(), ...note }, ...d.notes] }));
  }, []);
  const updateNote = useCallback((id, patch) => {
    setData((d) => ({ ...d, notes: d.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) }));
  }, []);
  const removeNote = useCallback((id) => {
    setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }));
  }, []);

  // Design Brief
  const updateDesignBrief = useCallback((patch) => {
    setData((d) => ({ ...d, designBrief: { ...d.designBrief, ...patch }}));
  }, []);

  // Constraints
  const updateConstraints = useCallback((patch) => {
    setData((d) => ({ ...d, constraints: { ...d.constraints, ...patch }}));
  }, []);

  const completion = (() => {
    const list = Array.isArray(data?.checklist) ? data.checklist : [];
    const total = list.length || 0;
    const done = list.filter((c) => c?.done).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  })();

  const progress = (() => {
    try {
      const checks = [
        !!data?.project?.name,
        !!data?.project?.description,
        Array.isArray(data?.goals) && data.goals.length>0,
        !!data?.audienceDetail?.targetAudience,
        ((Array.isArray(data?.scope?.inScope) ? data.scope.inScope.length : 0) + (Array.isArray(data?.scope?.outOfScope) ? data.scope.outOfScope.length : 0))>0,
        Array.isArray(data?.sitemap) && data.sitemap.length>0,
        Array.isArray(data?.sections) && data.sections.length>0,
        Array.isArray(data?.requirements) && data.requirements.length>0,
        Array.isArray(data?.features) && data.features.length>0,
        Array.isArray(data?.checklist) && data.checklist.length>0,
        !!(data?.designBrief?.inspiration || data?.designBrief?.colors),
        !!(data?.constraints?.technical || data?.constraints?.business),
      ];
      const done = checks.filter(Boolean).length;
      return { total: checks.length, done, pct: Math.round((done/checks.length)*100) };
    } catch {
      return { total: 12, done: 0, pct: 0 };
    }
  })();

  const reset = useCallback(() => {
    setData(defaultPlanning);
    safeRemove(STORAGE_KEY);
    safeRemove("webplan:planning:v02");
  }, []);

  return {
    data,
    setData,
    loaded,
    updateProject,
    updateGoals: updateGoalsLegacy,
    addGoal, updateGoal, removeGoal,
    updateAudience,
    addScopeItem, updateScopeItem, removeScopeItem,
    addSitemapPage, updateSitemapPage, removeSitemapPage, moveSitemap,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    addRequirement,
    updateRequirement,
    removeRequirement,
    addFeature, updateFeature, removeFeature, toggleFeature,
    addChecklist,
    toggleChecklist,
    updateChecklist,
    removeChecklist,
    addNote,
    updateNote,
    removeNote,
    updateDesignBrief,
    updateConstraints,
    completion,
    progress,
    reset,
    STORAGE_KEY,
  };
}

export function generatePrompt(data, opts = {}) {
  try {
  const project = data?.project || {};
  const goals = Array.isArray(data?.goals) ? data.goals : [];
  const audienceDetail = data?.audienceDetail || {};
  const scope = data?.scope || { inScope: [], outOfScope: [] };
  const sitemap = Array.isArray(data?.sitemap) ? data.sitemap : [];
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  const requirements = Array.isArray(data?.requirements) ? data.requirements : [];
  const features = Array.isArray(data?.features) ? data.features : [];
  const checklist = Array.isArray(data?.checklist) ? data.checklist : [];
  const notes = Array.isArray(data?.notes) ? data.notes : [];
  const designBrief = data?.designBrief || {};
  const constraints = data?.constraints || {};
  const style = opts.style || "opencode";

  const goalsText = (goals||[]).map(g=> `- [${g.priority}/${g.status}] ${g.text}`).join("\n");
  const legacyGoalsText = Array.isArray(project.goals) ? project.goals.filter(Boolean).join("; ") : "";
  const includedSections = sections.filter((s) => s.include).map((s) => `- ${s.name}: ${s.purpose}`).join("\n");
  const sitemapText = sitemap.map(p=> `- ${p.title} (${p.path})${p.description?`: ${p.description}`:""}`).join("\n");
  const scopeIn = (Array.isArray(scope.inScope) ? scope.inScope : []).map(s=> `- ${s.text}`).join("\n");
  const scopeOut = (Array.isArray(scope.outOfScope) ? scope.outOfScope : []).map(s=> `- ${s.text}`).join("\n");
  const reqText = requirements.map((r) => `- [${r.type}/${r.priority}] ${r.title}${r.done ? " (done)" : ""}`).join("\n");
  const featText = features.map(f=> `- [${f.priority}] ${f.title}${f.description?`: ${f.description}`:""}${f.done?" (done)":""}`).join("\n");
  const checklistText = checklist.map((c) => `- [${c.done ? "x" : " "}] ${c.text}`).join("\n");
  const notesText = notes.map((n) => `### ${n.title}\n${n.content}`).join("\n\n");
  const stackText = Array.isArray(project.stack) ? project.stack.join(", ") : (project.stack||"-");
  const audienceText = `Target: ${audienceDetail.targetAudience||project.targetAudience||"-"}\nJenis Pengguna: ${audienceDetail.userType||"-"}\nMasalah: ${audienceDetail.problems||"-"}\nKebutuhan: ${audienceDetail.needs||"-"}\nPerilaku: ${audienceDetail.expectedBehavior||"-"}`;

  if (style === "minimal") {
    return `Buat website ${project.type} bernama "${project.name || "Proyek Tanpa Nama"}"\n\nDeskripsi: ${project.description || "-"}\nPlatform: ${project.platform||"-"} Teknologi: ${stackText}\nTarget Pengguna: ${audienceDetail.targetAudience||project.audience||"-"}\n\nPeta Situs:\n${sitemapText||"-"}\nBagian:\n${includedSections || "-"}\n\nPersyaratan:\n${reqText || "-"}\n`;
  }

  if (style === "detailed") {
    return `# Brief Perencanaan Website — ${project.name || "Proyek Tanpa Nama"}

## Informasi Proyek
- **Nama:** ${project.name||"-"}
- **Jenis:** ${project.type}
- **Platform:** ${project.platform||"-"}
- **Teknologi:** ${stackText}
- **Deskripsi:** ${project.description || "-"}
- **Tujuan:** ${project.goal||legacyGoalsText||"-"}
- **Status:** ${project.status}
- **Anggaran:** ${project.budget||constraints.budget||"-"}
- **Tenggat Waktu:** ${project.deadline||constraints.timeline||"-"}

## Tujuan
${goalsText||legacyGoalsText||"-"}

## Target Pengguna
${audienceText}

## Ruang Lingkup
### Dalam Lingkup
${scopeIn||"-"}
### Di Luar Lingkup
${scopeOut||"-"}

## Peta Situs
${sitemapText||"-"}

## Bagian
${includedSections || "- (belum ada bagian)"}

## Persyaratan
${reqText || "-"}

## Fitur
${featText||"-"}

## Daftar Tugas (${checklist.filter((c) => c.done).length}/${checklist.length} selesai)
${checklistText || "-"}

## Brief Desain
- Inspirasi: ${designBrief.inspiration||"-"}
- Referensi: ${designBrief.references||"-"}
- Mood: ${designBrief.mood||"-"}
- Warna: ${designBrief.colors||"-"}
- Tipografi: ${designBrief.typography||"-"}
- Catatan: ${designBrief.notes||"-"}

## Batasan
- Teknis: ${constraints.technical||"-"}
- Bisnis: ${constraints.business||"-"}
- Timeline: ${constraints.timeline||"-"}
- Anggaran: ${constraints.budget||"-"}

${notes.length ? `## Catatan\n${notesText}` : ""}

---
Buat dengan React + Vite, UI modern yang bersih, responsif, dan modular.
`;
  }

  return `Kamu adalah OpenCode. Buat website React (Vite) yang siap production.

PROYEK: ${project.name || "Tanpa Nama"} — ${project.type} — Platform: ${project.platform||"Web"}
DESKRIPSI: ${project.description || "Belum ada deskripsi."}
TUJUAN: ${project.goal||legacyGoalsText||"-"}
TEKNOLOGI: ${stackText}
PLATFORM: ${project.platform||"Web"}

TUJUAN:
${goalsText||legacyGoalsText||"-"}

TARGET PENGGUNA:
${audienceText}

DALAM LINGKUP:
${scopeIn||"-"}
DI LUAR LINGKUP:
${scopeOut||"-"}

PETA SITUS:
${sitemapText||"-"}

BAGIAN (bangun berurutan):
${includedSections || "- Header, Hero, Fitur, CTA, Footer (default)"}

PERSYARATAN:
${reqText || "- Responsif + performa baik"}

FITUR:
${featText||"-"}

DAFTAR TUGAS:
${checklistText || "-"}

BRIEF DESAIN:
Inspirasi: ${designBrief.inspiration||"-"}
Mood: ${designBrief.mood||"-"}
Warna: ${designBrief.colors||"-"}
Tipografi: ${designBrief.typography||"-"}

BATASAN:
Teknis: ${constraints.technical||"-"}
Bisnis: ${constraints.business||"-"}
Timeline: ${constraints.timeline||constraints.timeline||"-"}
Anggaran: ${constraints.budget||"-"}
${notes.length ? `\nCATATAN:\n${notesText}` : ""}

TUGAS:
1. Buat routing sesuai peta situs.
2. Implementasikan setiap bagian sebagai komponen.
3. Pastikan responsif mobile & siap untuk konten nyata.
4. Jaga kode tetap modular di src/components/<bagian>.
`;
  } catch(e){ return "Planning data error: "+(e?.message||e); }
}

export { defaultPlanning, uid };

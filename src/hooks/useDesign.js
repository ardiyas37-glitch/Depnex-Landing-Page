import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/safeStorage";

const STORAGE_KEY = "webplan:design:v07";

export const COLOR_ROLES = ["Primary", "Neutral", "Accent", "Semantic", "Background"];
export const TYPO_ROLES = ["Heading", "Body", "Label", "Caption"];
export const COMP_STATUS = [
  { value: "planned", label: "Direncanakan", color: "#2563eb" },
  { value: "building", label: "Dibangun", color: "#d97706" },
  { value: "live", label: "Tayang", color: "#15803d" },
  { value: "deprecated", label: "Usang", color: "#6E7681" },
];
export const RULE_CATEGORY = ["Spacing", "Layout", "Accessibility", "Typography", "Color", "Interaction"];
export const RULE_PRIORITY = ["high", "medium", "low"];

function uid(prefix = "des") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
function nowISO() { return new Date().toISOString(); }





export function useDesign() {
  const [colors, setColors] = useState([]);
  const [typography, setTypography] = useState([]);
  const [components, setComponents] = useState([]);
  const [rules, setRules] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadFailedRef = useRef(false);
  const defaultData = { colors: [], typography: [], components: [], rules: [] };

  useEffect(() => {
    const raw = safeGet(STORAGE_KEY, defaultData);
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      setColors(Array.isArray(raw.colors) ? raw.colors : []);
      setTypography(Array.isArray(raw.typography) ? raw.typography : []);
      setComponents(Array.isArray(raw.components) ? raw.components : []);
      setRules(Array.isArray(raw.rules) ? raw.rules : []);
    } else {
      loadFailedRef.current = true;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (loadFailedRef.current) { loadFailedRef.current = false; return; }
    safeSet(STORAGE_KEY, { colors, typography, components, rules });
  }, [colors, typography, components, rules, loaded]);

  // Colors
  const addColor = useCallback((c) => setColors((prev) => [{ id: uid("col"), name: (c.name||"New Color").trim(), value: c.value||"#6E7681", role: c.role||"Neutral", token: c.token||"--custom", usage: c.usage||"" }, ...prev]), []);
  const updateColor = useCallback((id, patch) => setColors((prev) => prev.map((c)=> c.id===id?{...c,...patch}:c)), []);
  const removeColor = useCallback((id) => setColors((prev)=> prev.filter((c)=>c.id!==id)), []);
  const duplicateColor = useCallback((id)=> { const src=colors.find(c=>c.id===id); if(!src) return; setColors(prev=>[{...src,id:uid("col"),name:src.name+" Copy"},...prev]); },[colors]);

  // Typography
  const addTypography = useCallback((t)=> setTypography((prev)=> [{ id: uid("typo"), name: (t.name||"New Style").trim(), family: t.family||"Inter", size: t.size||"14px", weight: t.weight||"400", lineHeight: t.lineHeight||"1.5", letterSpacing: t.letterSpacing||"0", example: t.example||"Example text", role: t.role||"Body", usage: t.usage||"" }, ...prev]), []);
  const updateTypography = useCallback((id,patch)=> setTypography(prev=> prev.map(t=> t.id===id?{...t,...patch}:t)), []);
  const removeTypography = useCallback((id)=> setTypography(prev=> prev.filter(t=>t.id!==id)), []);

  // Components
  const addComponent = useCallback((c)=> setComponents(prev=> [{ id: uid("comp"), name:(c.name||"New Component").trim(), description:c.description||"", category:c.category||"General", status:c.status||"planned", variants:c.variants||["default"], createdAt: nowISO(), updatedAt: nowISO() }, ...prev]), []);
  const updateComponent = useCallback((id,patch)=> setComponents(prev=> prev.map(c=> c.id===id?{...c,...patch,updatedAt:nowISO()}:c)), []);
  const removeComponent = useCallback((id)=> setComponents(prev=> prev.filter(c=>c.id!==id)), []);
  const duplicateComponent = useCallback((id)=> { const src=components.find(c=>c.id===id); if(!src)return; setComponents(prev=>[{...src,id:uid("comp"),name:src.name+" Copy",createdAt:nowISO(),updatedAt:nowISO()},...prev]); },[components]);

  // Rules
  const addRule = useCallback((r)=> setRules(prev=> [{ id: uid("rule"), title:(r.title||"New Rule").trim(), category:r.category||"Spacing", description:r.description||"", priority:r.priority||"medium", done: !!r.done, createdAt: nowISO() }, ...prev]), []);
  const updateRule = useCallback((id,patch)=> setRules(prev=> prev.map(r=> r.id===id?{...r,...patch}:r)), []);
  const toggleRule = useCallback((id)=> setRules(prev=> prev.map(r=> r.id===id?{...r,done:!r.done}:r)), []);
  const removeRule = useCallback((id)=> setRules(prev=> prev.filter(r=>r.id!==id)), []);

  const stats = useMemo(()=> ({
    totalColors: colors.length,
    totalTypo: typography.length,
    totalComp: components.length,
    liveComp: components.filter(c=>c.status==="live").length,
    totalRules: rules.length,
    doneRules: rules.filter(r=>r.done).length,
    rulePct: rules.length ? Math.round((rules.filter(r=>r.done).length/rules.length)*100) : 0,
  }),[colors,typography,components,rules]);

  const reset = useCallback(()=> { setColors([]); setTypography([]); setComponents([]); setRules([]); safeRemove(STORAGE_KEY); },[]);

  return { colors, typography, components, rules, loaded, addColor, updateColor, removeColor, duplicateColor, addTypography, updateTypography, removeTypography, addComponent, updateComponent, removeComponent, duplicateComponent, addRule, updateRule, toggleRule, removeRule, stats, reset, STORAGE_KEY };
}

export function compStatusMeta(value) {
  return COMP_STATUS.find(s=>s.value===value)||{value,label:value,color:"#6E7681"};
}

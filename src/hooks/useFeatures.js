import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/safeStorage";

const STORAGE_KEY = "webplan:features:v05";

export const FEATURE_STATUS = [
  { value: "idea", label: "Ide", color: "#6E7681" },
  { value: "planned", label: "Direncanakan", color: "#58A6FF" },
  { value: "building", label: "Dibangun", color: "#D29922" },
  { value: "review", label: "Ditinjau", color: "#8957E5" },
  { value: "shipped", label: "Dirilis", color: "#3FB950" },
  { value: "dropped", label: "Dibatalkan", color: "#F85149" },
];

export const FEATURE_CATEGORY = ["Core", "Auth", "UI", "Data", "Integration", "Payment", "SEO", "Analytics"];
export const FEATURE_PRIORITY = ["high", "medium", "low"];
export const FEATURE_EFFORT = ["S", "M", "L", "XL"];

function uid(prefix = "feat") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
function nowISO() {
  return new Date().toISOString();
}


export function useFeatures() {
  const [features, setFeatures] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadFailedRef = useRef(false);

  useEffect(() => {
    const data = safeGet(STORAGE_KEY, []);
    if (Array.isArray(data)) {
      setFeatures(data);
    } else {
      loadFailedRef.current = true;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (loadFailedRef.current) { loadFailedRef.current = false; return; }
    safeSet(STORAGE_KEY, features);
  }, [features, loaded]);

  const addFeature = useCallback((payload) => {
    const f = {
      id: uid(),
      title: (payload.title || "Untitled Feature").trim(),
      description: payload.description || "",
      category: payload.category || "Core",
      status: payload.status || "idea",
      priority: payload.priority || "medium",
      effort: payload.effort || "M",
      page: payload.page || "global",
      projectId: payload.projectId || null,
      criteria: payload.criteria || [],
      notes: payload.notes || "",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    setFeatures((prev) => [f, ...prev]);
    return f;
  }, []);

  const updateFeature = useCallback((id, patch) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch, updatedAt: nowISO() } : f)));
  }, []);

  const removeFeature = useCallback((id) => setFeatures((prev) => prev.filter((f) => f.id !== id)), []);

  const duplicateFeature = useCallback((id) => {
    const src = features.find((f) => f.id === id);
    if (!src) return null;
    const dup = { ...src, id: uid(), title: src.title + " Copy", status: "idea", createdAt: nowISO(), updatedAt: nowISO() };
    setFeatures((prev) => [dup, ...prev]);
    return dup;
  }, [features]);

  // criteria helpers
  const addCriteria = useCallback((featureId, text) => {
    setFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, criteria: [...(f.criteria || []), { id: uid("crit"), text, done: false }], updatedAt: nowISO() } : f)));
  }, []);
  const toggleCriteria = useCallback((featureId, critId) => {
    setFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, criteria: f.criteria.map((c) => (c.id === critId ? { ...c, done: !c.done } : c)), updatedAt: nowISO() } : f)));
  }, []);
  const removeCriteria = useCallback((featureId, critId) => {
    setFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, criteria: f.criteria.filter((c) => c.id !== critId), updatedAt: nowISO() } : f)));
  }, []);
  const updateCriteria = useCallback((featureId, critId, patch) => {
    setFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, criteria: f.criteria.map((c) => (c.id === critId ? { ...c, ...patch } : c)), updatedAt: nowISO() } : f)));
  }, []);

  const stats = useMemo(() => {
    const total = features.length;
    const byStatus = FEATURE_STATUS.reduce((acc, s) => ({ ...acc, [s.value]: features.filter((f) => f.status === s.value).length }), {});
    const shipped = byStatus.shipped || 0;
    const building = byStatus.building || 0;
    const completion = total ? Math.round((shipped / total) * 100) : 0;
    const byCategory = FEATURE_CATEGORY.reduce((acc, cat) => ({ ...acc, [cat]: features.filter((f) => f.category === cat).length }), {});
    return { total, byStatus, shipped, building, completion, byCategory };
  }, [features]);

  const reset = useCallback(() => {
    setFeatures([]);
    safeRemove(STORAGE_KEY);
  }, []);

  return { features, loaded, addFeature, updateFeature, removeFeature, duplicateFeature, addCriteria, toggleCriteria, removeCriteria, updateCriteria, stats, reset, STORAGE_KEY };
}

export function featureStatusMeta(value) {
  return FEATURE_STATUS.find((s) => s.value === value) || { value, label: value, color: "#6E7681" };
}

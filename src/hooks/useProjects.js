import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/safeStorage";

const STORAGE_KEY = "webplan:projects:v03";

export const STATUS_OPTIONS = [
  { value: "draft", label: "Draf", color: "#6E7681" },
  { value: "planning", label: "Direncanakan", color: "#58A6FF" },
  { value: "in-progress", label: "Sedang Dikerjakan", color: "#D29922" },
  { value: "review", label: "Ditinjau", color: "#8957E5" },
  { value: "completed", label: "Selesai", color: "#3FB950" },
  { value: "on-hold", label: "Ditahan", color: "#F85149" },
];

export const TYPE_OPTIONS = ["Landing Page", "Company Profile", "E-commerce", "Portfolio", "Blog", "SaaS", "Dashboard / Admin", "Custom"];

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Rendah" },
  { value: "high", label: "Tinggi" },
  { value: "medium", label: "Sedang" },
];

function uid(prefix = "proj") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function nowISO() {
  return new Date().toISOString();
}


function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 48);
}

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadFailedRef = useRef(false);

  useEffect(() => {
    const data = safeGet(STORAGE_KEY, []);
    if (Array.isArray(data) && data.length > 0) {
      setProjects(data);
    } else if (Array.isArray(data)) {
      setProjects(data);
    } else {
      loadFailedRef.current = true;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (loadFailedRef.current) {
      loadFailedRef.current = false;
      return;
    }
    safeSet(STORAGE_KEY, projects);
  }, [projects, loaded]);

  const createProject = useCallback((payload) => {
    const id = uid();
    const name = (payload.name || "Untitled Project").trim();
    const proj = {
      id,
      slug: slugify(name) + "-" + id.slice(-4),
      name,
      type: payload.type || "Landing Page",
      description: payload.description || "",
      status: payload.status || "draft",
      progress: Math.min(100, Math.max(0, Number(payload.progress) || 0)),
      priority: payload.priority || "medium",
      deadline: payload.deadline || "",
      stack: payload.stack || "React + Vite",
      team: payload.team || "Solo",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    setProjects((prev) => [proj, ...prev]);
    return proj;
  }, []);

  const updateProject = useCallback((id, patch) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: nowISO(), slug: patch.name ? slugify(patch.name) + "-" + p.id.slice(-4) : p.slug } : p)));
  }, []);

  const removeProject = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const duplicateProject = useCallback((id) => {
    const src = projects.find((p) => p.id === id);
    if (!src) return null;
    const dup = { ...src, id: uid(), name: src.name + " (Copy)", slug: slugify(src.name + " copy") + "-" + Math.random().toString(36).slice(2, 6), createdAt: nowISO(), updatedAt: nowISO() };
    setProjects((prev) => [dup, ...prev]);
    return dup;
  }, [projects]);

  const getById = useCallback((id) => projects.find((p) => p.id === id || p.slug === id), [projects]);

  const stats = useMemo(() => {
    const total = projects.length;
    const byStatus = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s.value]: projects.filter((p) => p.status === s.value).length }), {});
    const avgProgress = total ? Math.round(projects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / total) : 0;
    const completed = byStatus["completed"] || 0;
    const inProgress = byStatus["in-progress"] || 0;
    const overdue = projects.filter((p) => p.deadline && new Date(p.deadline) < new Date() && p.status !== "completed").length;
    return { total, byStatus, avgProgress, completed, inProgress, overdue };
  }, [projects]);

  const reset = useCallback(() => {
    setProjects([]);
    safeRemove(STORAGE_KEY);
  }, []);

  return { projects, loaded, createProject, updateProject, removeProject, duplicateProject, getById, stats, reset, STORAGE_KEY, STATUS_OPTIONS };
}

export function statusMeta(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) || { value, label: value, color: "#6E7681" };
}

export function progressColor(p) {
  if (p >= 80) return "#3FB950";
  if (p >= 50) return "#D29922";
  if (p >= 25) return "#58A6FF";
  return "#6E7681";
}

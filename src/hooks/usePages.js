import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/safeStorage";

const STORAGE_KEY = "webplan:pages:v04";

export const PAGE_STATUS = [
  { value: "draft", label: "Draf", color: "#6E7681" },
  { value: "planned", label: "Direncanakan", color: "#58A6FF" },
  { value: "building", label: "Dibangun", color: "#D29922" },
  { value: "review", label: "Ditinjau", color: "#8957E5" },
  { value: "live", label: "Tayang", color: "#3FB950" },
];

export const PAGE_TYPE = ["Public", "Auth", "Dashboard", "Dynamic", "System"];
export const REQ_TYPE = ["functional", "seo", "ui", "data", "auth"];
export const REQ_PRIORITY = ["high", "medium", "low"];

function uid(prefix = "pg") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
function nowISO() {
  return new Date().toISOString();
}



export function usePages() {
  const [pages, setPages] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadFailedRef = useRef(false);
  const defaultData = { pages: [], requirements: [] };

  useEffect(() => {
    const raw = safeGet(STORAGE_KEY, defaultData);
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      setPages(Array.isArray(raw.pages) ? raw.pages : []);
      setRequirements(Array.isArray(raw.requirements) ? raw.requirements : []);
    } else {
      loadFailedRef.current = true;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (loadFailedRef.current) { loadFailedRef.current = false; return; }
    safeSet(STORAGE_KEY, { pages, requirements });
  }, [pages, requirements, loaded]);

  const addPage = useCallback((payload) => {
    const id = uid("pg");
    const page = {
      id,
      title: (payload.title || "Untitled Page").trim(),
      path: (payload.path || "/new-page").trim(),
      description: payload.description || "",
      type: payload.type || "Public",
      status: payload.status || "draft",
      parentId: payload.parentId || null,
      order: pages.length,
      blocks: payload.blocks || [],
      seoTitle: payload.seoTitle || "",
      seoDesc: payload.seoDesc || "",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    setPages((prev) => [...prev, page]);
    return page;
  }, [pages.length]);

  const updatePage = useCallback((id, patch) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: nowISO() } : p)));
  }, []);

  const removePage = useCallback((id) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setRequirements((prev) => prev.filter((r) => r.pageId !== id));
  }, []);

  const duplicatePage = useCallback((id) => {
    const src = pages.find((p) => p.id === id);
    if (!src) return null;
    const dup = { ...src, id: uid("pg"), title: src.title + " Copy", path: src.path + "-copy", createdAt: nowISO(), updatedAt: nowISO() };
    setPages((prev) => [...prev, dup]);
    return dup;
  }, [pages]);

  const movePage = useCallback((id, dir) => {
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((p, i) => ({ ...p, order: i }));
    });
  }, []);

  // Blocks per page
  const addBlock = useCallback((pageId, block) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, blocks: [...(p.blocks || []), { id: uid("blk"), ...block }], updatedAt: nowISO() } : p)));
  }, []);
  const updateBlock = useCallback((pageId, blockId, patch) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)), updatedAt: nowISO() } : p)));
  }, []);
  const removeBlock = useCallback((pageId, blockId) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId), updatedAt: nowISO() } : p)));
  }, []);

  // Requirements
  const addRequirement = useCallback((req) => {
    setRequirements((prev) => [{ id: uid("pr"), done: false, createdAt: nowISO(), ...req }, ...prev]);
  }, []);
  const updateRequirement = useCallback((id, patch) => {
    setRequirements((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);
  const removeRequirement = useCallback((id) => setRequirements((prev) => prev.filter((r) => r.id !== id)), []);

  const stats = useMemo(() => {
    const total = pages.length;
    const byStatus = PAGE_STATUS.reduce((acc, s) => ({ ...acc, [s.value]: pages.filter((p) => p.status === s.value).length }), {});
    const totalReqs = requirements.length;
    const doneReqs = requirements.filter((r) => r.done).length;
    const coverage = total ? Math.round((pages.filter((p) => (p.blocks?.length || 0) > 0).length / total) * 100) : 0;
    return { total, byStatus, totalReqs, doneReqs, coverage };
  }, [pages, requirements]);

  const reset = useCallback(() => {
    setPages([]);
    setRequirements([]);
    safeRemove(STORAGE_KEY);
  }, []);

  return {
    pages, requirements, loaded,
    addPage, updatePage, removePage, duplicatePage, movePage,
    addBlock, updateBlock, removeBlock,
    addRequirement, updateRequirement, removeRequirement,
    stats, reset, STORAGE_KEY, PAGE_STATUS, PAGE_TYPE,
  };
}

export function pageStatusMeta(value) {
  return PAGE_STATUS.find((s) => s.value === value) || { value, label: value, color: "#6E7681" };
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/safeStorage";

const STORAGE_KEY = "webplan:notes:v09";

export const NOTE_TYPES = [
  { value: "learning", label: "Belajar", color: "#58A6FF" },
  { value: "deadline", label: "Tenggat", color: "#F59E0B" },
  { value: "client", label: "Klien", color: "#10B981" },
  { value: "code", label: "Kode", color: "#3B82F6" },
  { value: "idea", label: "Ide", color: "#EAB308" },
  { value: "general", label: "Umum", color: "#6E7681" },
];

export const CODE_LANGUAGES = ["JavaScript","TypeScript","React / JSX","HTML","CSS","PHP","Laravel","Python","SQL","Bash","JSON"];
export const DEADLINE_PRIORITY = ["low","medium","high","critical"];
export const DEADLINE_STATUS = ["pending","in-progress","completed","overdue"];
export const CLIENT_FIELDS = ["clientName","project","contactReference","requirements","requests","feedback","decisions","followUp","nextAction","deadline","notes","tags"];

function uid(prefix="note") { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`; }
function nowISO(){ return new Date().toISOString(); }

function normalizeTag(t){
  return t.trim().toLowerCase().replace(/^#/,'').replace(/\s+/g,'-').slice(0,30);
}
function normalizeTags(arr){
  if(!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for(const raw of arr){
    const n = normalizeTag(raw);
    if(!n || seen.has(n)) continue;
    seen.add(n); out.push(n);
  }
  return out;
}

function sanitizeNote(n){
  if(!n || typeof n !== "object") return null;
  if(!n.id) return null;
  return {
    ...n,
    id: String(n.id),
    title: String(n.title || "Untitled"),
    type: NOTE_TYPES.some(t=>t.value===n.type) ? n.type : "general",
    tags: normalizeTags(n.tags),
    pinned: !!n.pinned,
    archived: !!n.archived,
    createdAt: n.createdAt || nowISO(),
    updatedAt: n.updatedAt || nowISO(),
    content: String(n.content || ""),
    tasks: Array.isArray(n.tasks) ? n.tasks : [],
  };
}

export function noteTypeMeta(type){
  return NOTE_TYPES.find(n=>n.value===type) || { value:type, label: type, color:"#6E7681" };
}

export function isOverdue(note){
  if(!note || note.type!=="deadline" || !note.deadline) return false;
  if(note.status==="completed") return false;
  return new Date(note.deadline) < new Date();
}
export function isUpcoming(note, days=3){
  if(!note || note.type!=="deadline" || !note.deadline || note.status==="completed") return false;
  const diff = (new Date(note.deadline) - new Date()) / (1000*60*60*24);
  return diff >=0 && diff <= days;
}

export function useNotes(){
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(()=>{
    try {
      const data = safeGet(STORAGE_KEY, []);
      if(Array.isArray(data)){
        const sanitized = data.map(sanitizeNote).filter(Boolean);
        setNotes(sanitized);
      } else if(data && typeof data === "object" && Array.isArray(data.notes)){
        const sanitized = data.notes.map(sanitizeNote).filter(Boolean);
        setNotes(sanitized);
      } else {
        setNotes([]);
      }
    } catch {
      setNotes([]);
    }
    setLoaded(true);
  },[]);

  useEffect(()=>{
    if(!loaded) return;
    const result = safeSet(STORAGE_KEY, notes);
    if(result === false && notes.length > 0){
      setSaveError("Gagal menyimpan ke storage. Data mungkin tidak tersimpan secara permanen.");
    } else {
      setSaveError(null);
    }
  },[notes, loaded]);

  const addNote = useCallback((payload)=>{
    const base = {
      id: uid(),
      title: (payload.title||"Untitled").trim().slice(0,120) || "Untitled",
      type: payload.type || "general",
      tags: normalizeTags(payload.tags || []),
      projectId: payload.projectId || null,
      pinned: !!payload.pinned,
      archived: !!payload.archived,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      content: payload.content || "",
      topic: payload.topic || "",
      category: payload.category || "",
      codeExample: payload.codeExample || "",
      whatILearned: payload.whatILearned || "",
      importantConcepts: payload.importantConcepts || "",
      whatIDontUnderstand: payload.whatIDontUnderstand || "",
      nextToLearn: payload.nextToLearn || "",
      resources: payload.resources || "",
      deadline: payload.deadline || "",
      priority: payload.priority || "medium",
      status: payload.status || "pending",
      tasks: Array.isArray(payload.tasks) ? payload.tasks : [],
      clientName: payload.clientName || "",
      contactReference: payload.contactReference || "",
      requirements: payload.requirements || "",
      requests: payload.requests || "",
      feedback: payload.feedback || "",
      decisions: payload.decisions || "",
      followUp: payload.followUp || "",
      nextAction: payload.nextAction || "",
      language: payload.language || "JavaScript",
      code: payload.code || "",
      description: payload.description || "",
      source: payload.source || "",
      idea: payload.idea || "",
      nextStep: payload.nextStep || "",
    };
    if(base.type==="deadline" && isOverdue(base)) base.status = "overdue";
    setNotes(prev=> [base, ...prev]);
    return base;
  },[]);

  const updateNote = useCallback((id, patch)=>{
    setNotes(prev=> prev.map(n=>{
      if(n.id!==id) return n;
      const next = { ...n, ...patch, updatedAt: nowISO() };
      if(patch.tags) next.tags = normalizeTags(patch.tags);
      if(next.type==="deadline" && next.deadline){
        if(isOverdue(next) && next.status!=="completed") next.status="overdue";
        if(!isOverdue(next) && next.status==="overdue") next.status="pending";
      }
      return next;
    }));
  },[]);

  const removeNote = useCallback((id)=> setNotes(prev=> prev.filter(n=>n.id!==id)),[]);

  const duplicateNote = useCallback((id)=>{
    setNotes(prev=>{
      const src = prev.find(n=>n.id===id);
      if(!src) return prev;
      const dup = {...src, id:uid(), title: src.title+" Copy", pinned:false, createdAt: nowISO(), updatedAt: nowISO()};
      return [dup, ...prev];
    });
  },[]);

  const togglePin = useCallback((id)=> setNotes(prev=> prev.map(n=> n.id===id?{...n, pinned: !n.pinned, updatedAt: nowISO()}:n)),[]);
  const toggleArchive = useCallback((id)=> setNotes(prev=> prev.map(n=> n.id===id?{...n, archived: !n.archived, pinned: false, updatedAt: nowISO()}:n)),[]);
  const restoreArchived = useCallback((id)=> setNotes(prev=> prev.map(n=> n.id===id?{...n, archived:false, updatedAt: nowISO()}:n)),[]);

  const addTask = useCallback((noteId, text)=>{
    setNotes(prev=> prev.map(n=> n.id===noteId?{...n, tasks:[...(n.tasks||[]), {id:uid("task"), text: text.trim(), done:false}], updatedAt: nowISO()}:n));
  },[]);
  const toggleTask = useCallback((noteId, taskId)=>{
    setNotes(prev=> prev.map(n=> n.id===noteId?{...n, tasks: (n.tasks||[]).map(t=> t.id===taskId?{...t,done:!t.done}:t), updatedAt: nowISO()}:n));
  },[]);
  const removeTask = useCallback((noteId, taskId)=>{
    setNotes(prev=> prev.map(n=> n.id===noteId?{...n, tasks: (n.tasks||[]).filter(t=>t.id!==taskId), updatedAt: nowISO()}:n));
  },[]);
  const updateTask = useCallback((noteId, taskId, text)=>{
    setNotes(prev=> prev.map(n=> n.id===noteId?{...n, tasks: (n.tasks||[]).map(t=> t.id===taskId?{...t,text}:t), updatedAt: nowISO()}:n));
  },[]);

  const allTags = useMemo(()=>{
    const set=new Set();
    notes.forEach(n=> n.tags?.forEach(t=> set.add(t)));
    return Array.from(set).sort();
  },[notes]);

  const stats = useMemo(()=>{
    const total = notes.filter(n=>!n.archived).length;
    const archived = notes.filter(n=>n.archived).length;
    const pinned = notes.filter(n=>n.pinned && !n.archived).length;
    const byType = NOTE_TYPES.reduce((acc,t)=> ({...acc, [t.value]: notes.filter(n=>n.type===t.value && !n.archived).length}),{});
    const upcoming = notes.filter(n=> isUpcoming(n) && !n.archived).length;
    const overdue = notes.filter(n=> isOverdue(n) && !n.archived).length;
    return { total, archived, pinned, byType, upcoming, overdue };
  },[notes]);

  const reset = useCallback(()=>{ setNotes([]); safeRemove(STORAGE_KEY); },[]);

  return {
    notes, loaded, saveError,
    addNote, updateNote, removeNote, duplicateNote,
    togglePin, toggleArchive, restoreArchived,
    addTask, toggleTask, removeTask, updateTask,
    allTags, stats, STORAGE_KEY, normalizeTags
  };
}

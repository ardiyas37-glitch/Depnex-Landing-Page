import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/safeStorage";

const STORAGE_KEY = "depnex:database:v06";

export const COLUMN_TYPES = ["uuid", "text", "varchar(255)", "integer", "boolean", "timestamp", "jsonb", "enum"];
export const TABLE_STATUS = [
  { value: "planned", label: "Direncanakan", color: "#2563eb" },
  { value: "building", label: "Dibangun", color: "#d97706" },
  { value: "live", label: "Tayang", color: "#15803d" },
];
export const REL_TYPES = [
  { value: "one-to-many", label: "1 — N" },
  { value: "many-to-one", label: "N — 1" },
  { value: "one-to-one", label: "1 — 1" },
  { value: "many-to-many", label: "N — N" },
];

function uid(prefix = "db") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
function nowISO() {
  return new Date().toISOString();
}



export function useDatabase() {
  const [tables, setTables] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadFailedRef = useRef(false);
  const defaultData = { tables: [], relationships: [] };

  useEffect(() => {
    const raw = safeGet(STORAGE_KEY, defaultData);
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      setTables(Array.isArray(raw.tables) ? raw.tables : []);
      setRelationships(Array.isArray(raw.relationships) ? raw.relationships : []);
    } else {
      loadFailedRef.current = true;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (loadFailedRef.current) { loadFailedRef.current = false; return; }
    safeSet(STORAGE_KEY, { tables, relationships });
  }, [tables, relationships, loaded]);

  const addTable = useCallback((payload) => {
    const tbl = {
      id: uid("tbl"),
      name: (payload.name || "new_table").trim().toLowerCase().replace(/\s+/g, "_"),
      description: payload.description || "",
      status: payload.status || "planned",
      columns: payload.columns || [{ id: uid("col"), name: "id", type: "uuid", nullable: false, isPK: true, isFK: false, defaultValue: "gen_random_uuid()", description: "PK" }],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    setTables((prev) => [...prev, tbl]);
    return tbl;
  }, []);

  const updateTable = useCallback((id, patch) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowISO() } : t)));
  }, []);

  const removeTable = useCallback((id) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
    setRelationships((prev) => prev.filter((r) => r.fromTable !== id && r.toTable !== id));
  }, []);

  const duplicateTable = useCallback((id) => {
    const src = tables.find((t) => t.id === id);
    if (!src) return null;
    const dup = { ...src, id: uid("tbl"), name: src.name + "_copy", columns: src.columns.map((c) => ({ ...c, id: uid("col") })), createdAt: nowISO(), updatedAt: nowISO() };
    setTables((prev) => [...prev, dup]);
    return dup;
  }, [tables]);

  // Columns
  const addColumn = useCallback((tableId, col) => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, columns: [...t.columns, { id: uid("col"), name: (col.name || "new_column").trim(), type: col.type || "text", nullable: col.nullable ?? true, isPK: !!col.isPK, isFK: !!col.isFK, defaultValue: col.defaultValue || "", description: col.description || "" }], updatedAt: nowISO() } : t)));
  }, []);

  const updateColumn = useCallback((tableId, colId, patch) => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, columns: t.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)), updatedAt: nowISO() } : t)));
  }, []);

  const removeColumn = useCallback((tableId, colId) => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, columns: t.columns.filter((c) => c.id !== colId), updatedAt: nowISO() } : t)));
    setRelationships((prev) => prev.filter((r) => r.fromColumn !== colId && r.toColumn !== colId));
  }, []);

  // Relationships
  const addRelationship = useCallback((rel) => {
    const r = { id: uid("rel"), fromTable: rel.fromTable, fromColumn: rel.fromColumn, toTable: rel.toTable, toColumn: rel.toColumn, type: rel.type || "many-to-one", onDelete: rel.onDelete || "CASCADE", description: rel.description || "" };
    setRelationships((prev) => [...prev, r]);
    return r;
  }, []);

  const updateRelationship = useCallback((id, patch) => {
    setRelationships((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const removeRelationship = useCallback((id) => setRelationships((prev) => prev.filter((r) => r.id !== id)), []);

  const stats = useMemo(() => {
    const totalTables = tables.length;
    const totalColumns = tables.reduce((sum, t) => sum + t.columns.length, 0);
    const totalRels = relationships.length;
    const live = tables.filter((t) => t.status === "live").length;
    return { totalTables, totalColumns, totalRels, live };
  }, [tables, relationships]);

  const reset = useCallback(() => {
    setTables([]);
    setRelationships([]);
    safeRemove(STORAGE_KEY);
  }, []);

  const getTable = useCallback((id) => tables.find((t) => t.id === id), [tables]);
  const getColumn = useCallback((tableId, colId) => tables.find((t) => t.id === tableId)?.columns.find((c) => c.id === colId), [tables]);

  return {
    tables, relationships, loaded,
    addTable, updateTable, removeTable, duplicateTable,
    addColumn, updateColumn, removeColumn,
    addRelationship, updateRelationship, removeRelationship,
    stats, reset, STORAGE_KEY, getTable, getColumn,
  };
}

export function tableStatusMeta(value) {
  return TABLE_STATUS.find((s) => s.value === value) || { value, label: value, color: "#737373" };
}

export function generateSQL(tables, relationships) {
  let sql = "-- DepnexProject Generated SQL (Supabase/Postgres)\n-- Tables: " + tables.length + " · Relationships: " + relationships.length + "\n\n";
  for (const t of tables) {
    sql += `CREATE TABLE IF NOT EXISTS ${t.name} (\n`;
    const cols = t.columns.map((c) => {
      let line = `  ${c.name} ${c.type}`;
      if (c.isPK) line += " PRIMARY KEY";
      if (!c.nullable) line += " NOT NULL";
      if (c.defaultValue) line += ` DEFAULT ${c.defaultValue}`;
      return line;
    });
    sql += cols.join(",\n");
    sql += "\n);\n";
    if (t.description) sql += `COMMENT ON TABLE ${t.name} IS '${t.description.replace(/'/g, "''")}';\n`;
    sql += "\n";
  }
  for (const r of relationships) {
    const fromT = tables.find((t) => t.id === r.fromTable);
    const toT = tables.find((t) => t.id === r.toTable);
    const fromC = fromT?.columns.find((c) => c.id === r.fromColumn);
    const toC = toT?.columns.find((c) => c.id === r.toColumn);
    if (!fromT || !toT || !fromC || !toC) continue;
    sql += `ALTER TABLE ${fromT.name} ADD CONSTRAINT fk_${fromT.name}_${fromC.name} FOREIGN KEY (${fromC.name}) REFERENCES ${toT.name}(${toC.name}) ON DELETE ${r.onDelete};\n`;
  }
  return sql;
}

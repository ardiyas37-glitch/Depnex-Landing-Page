import { useState } from "react";
import { Database as DbIcon, Table2, Columns3, GitBranch, Network, RotateCcw } from "lucide-react";
import { useDatabase } from "../../hooks/useDatabase";
import TablesTab from "../../components/database/TablesTab";
import ColumnsTab from "../../components/database/ColumnsTab";
import RelationshipsTab from "../../components/database/RelationshipsTab";
import ERDTab from "../../components/database/ERDTab";

const TABS = [
  { id: "tables", label: "Tabel", icon: Table2 },
  { id: "columns", label: "Kolom", icon: Columns3 },
  { id: "relationships", label: "Relasi", icon: GitBranch },
  { id: "erd", label: "ERD", icon: Network },
];

export default function Database() {
  const hook = useDatabase();
  const [active, setActive] = useState("tables");

  if (!hook.loaded) {
    return <div className="page"><div className="auth-loading" style={{ minHeight: 200 }}><div className="spinner" /></div></div>;
  }

  const { tables, relationships, stats } = hook;

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ display: "flex", gap: 10, alignItems: "center" }}><DbIcon size={20} /> Basis Data</h1>
          <p style={{ maxWidth: 600 }}>Rancang skema sebelum migrasi — tabel, kolom, relasi → buat SQL & ERD untuk Supabase.</p>
        </div>
        <button className="btn-ghost sm" onClick={() => { if (confirm("Apakah kamu yakin ingin menghapus semua tabel? Tindakan ini tidak dapat dibatalkan.")) hook.reset(); }} type="button"><RotateCcw size={14} /> Atur Ulang</button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="stat"><span className="stat-val">{stats.totalTabel}</span><span className="stat-label">Tabel · {stats.live} tayang</span></div>
        <div className="stat"><span className="stat-val">{stats.totalKolom}</span><span className="stat-label">Total Kolom</span></div>
        <div className="stat"><span className="stat-val">{stats.totalRels}</span><span className="stat-label">Relasi</span></div>
      </div>

      <div className="planning-tabs" role="tablist" style={{ marginBottom: 16 }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} role="tab" aria-selected={isActive} onClick={() => setActive(t.id)} className={`planning-tab ${isActive ? "planning-tab--active" : ""}`} type="button">
              <Icon size={16} /> {t.label}
              {t.id === "tables" && <span className="planning-tab-count">{tables.length}</span>}
              {t.id === "columns" && <span className="planning-tab-count">{stats.totalKolom}</span>}
              {t.id === "relationships" && <span className="planning-tab-count">{relationships.length}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 8 }}>
        {active === "tables" && <TablesTab tables={tables} addTable={hook.addTable} updateTable={hook.updateTable} removeTable={hook.removeTable} duplicateTable={hook.duplicateTable} />}
        {active === "columns" && <ColumnsTab tables={tables} addColumn={hook.addColumn} updateColumn={hook.updateColumn} removeColumn={hook.removeColumn} />}
        {active === "relationships" && <RelationshipsTab tables={tables} relationships={relationships} addRelationship={hook.addRelationship} updateRelationship={hook.updateRelationship} removeRelationship={hook.removeRelationship} />}
        {active === "erd" && <ERDTab tables={tables} relationships={relationships} />}
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>
        Simpan otomatis · kunci: <code>{hook.STORAGE_KEY}</code> · SQL kompatibel Supabase/Postgres
      </p>
    </div>
  );
}
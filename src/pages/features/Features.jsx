import { useState } from "react";
import { Sparkles, List, FileText, Kanban, RotateCcw } from "lucide-react";
import { useFeatures } from "../../hooks/useFeatures";
import FeatureListTab from "../../components/features/FeatureListTab";
import FeatureDetailTab from "../../components/features/FeatureDetailTab";
import FeatureStatusTab from "../../components/features/FeatureStatusTab";

const TABS = [
  { id: "list", label: "Daftar Fitur", icon: List },
  { id: "detail", label: "Detail Fitur", icon: FileText },
  { id: "status", label: "Status Fitur", icon: Kanban },
];

export default function Features() {
  const hook = useFeatures();
  const [active, setActive] = useState("list");
  const [selectedId, setSelectedId] = useState(null);

  if (!hook.loaded) {
    return <div className="page"><div className="auth-loading" style={{ minHeight: 200 }}><div className="spinner" /></div></div>;
  }

  function handleSelect(id) {
    setSelectedId(id);
    setActive("detail");
  }

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Sparkles size={20} /> Fitur
          </h1>
          <p style={{ maxWidth: 600 }}>Kembalilog fitur terstruktur — daftar untuk grooming, detail untuk acceptance, status untuk pelacakan.</p>
        </div>
        <button className="btn-ghost sm" onClick={() => { if (confirm("Apakah kamu yakin ingin menghapus semua fitur? Tindakan ini tidak dapat dibatalkan.")) hook.reset(); }} type="button"><RotateCcw size={14} /> Atur Ulang</button>
      </div>

      <div className="planning-tabs" role="tablist" style={{ marginBottom: 16 }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} role="tab" aria-selected={isActive} onClick={() => setActive(t.id)} className={`planning-tab ${isActive ? "planning-tab--active" : ""}`} type="button">
              <Icon size={16} /> {t.label}
              {t.id === "list" && <span className="planning-tab-count">{hook.features.length}</span>}
              {t.id === "status" && <span className="planning-tab-count">{hook.stats.shipped}/{hook.stats.total}</span>}
            </button>
          );
        })}
      </div>

      {active === "list" && (
        <FeatureListTab
          features={hook.features}
          addFeature={hook.addFeature}
          updateFeature={hook.updateFeature}
          removeFeature={hook.removeFeature}
          duplicateFeature={hook.duplicateFeature}
          onSelect={handleSelect}
        />
      )}
      {active === "detail" && (
        <FeatureDetailTab
          features={hook.features}
          updateFeature={hook.updateFeature}
          addCriteria={hook.addCriteria}
          toggleCriteria={hook.toggleCriteria}
          removeCriteria={hook.removeCriteria}
          updateCriteria={hook.updateCriteria}
          forcedId={selectedId}
        />
      )}
      {active === "status" && (
        <FeatureStatusTab features={hook.features} updateFeature={hook.updateFeature} stats={hook.stats} />
      )}

      <p style={{ marginTop: 18, fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>
        Simpan otomatis · kunci: <code>{hook.STORAGE_KEY}</code>
      </p>
    </div>
  );
}
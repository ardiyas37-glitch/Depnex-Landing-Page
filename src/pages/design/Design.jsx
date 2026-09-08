import { useState } from "react";
import { Palette, Type, Box, ShieldCheck, RotateCcw, Paintbrush } from "lucide-react";
import { useDesign } from "../../hooks/useDesign";
import ColorsTab from "../../components/design/ColorsTab";
import TypographyTab from "../../components/design/TypographyTab";
import ComponentsTab from "../../components/design/ComponentsTab";
import UIRulesTab from "../../components/design/UIRulesTab";

const TABS = [
  { id: "colors", label: "Warna", icon: Palette },
  { id: "typography", label: "Tipografi", icon: Type },
  { id: "components", label: "Komponen", icon: Box },
  { id: "rules", label: "Aturan UI", icon: ShieldCheck },
];

export default function Design() {
  const hook = useDesign();
  const [active, setActive] = useState("colors");

  if (!hook.loaded) return <div className="page"><div className="auth-loading" style={{ minHeight: 200 }}><div className="spinner" /></div></div>;

  const { stats } = hook;

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ display: "flex", gap: 10, alignItems: "center" }}><Paintbrush size={20} /> Desain</h1>
          <p style={{ maxWidth: 600 }}>Sistem desain — token, tipografi, inventaris komponen, dan aturan UI sebelum build.</p>
        </div>
        <button className="btn-ghost sm" onClick={() => { if (confirm("Apakah kamu yakin ingin menghapus data desain? Tindakan ini tidak dapat dibatalkan.")) hook.reset(); }} type="button"><RotateCcw size={14} /> Atur Ulang</button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="stat"><span className="stat-val">{stats.totalColors}</span><span className="stat-label">Warna</span></div>
        <div className="stat"><span className="stat-val">{stats.liveComp}/{stats.totalComp}</span><span className="stat-label">Komponen Tayang</span></div>
        <div className="stat"><span className="stat-val">{stats.doneRules}/{stats.totalRules}</span><span className="stat-label">Aturan {stats.rulePct}%</span></div>
      </div>

      <div className="planning-tabs" role="tablist" style={{ marginBottom: 16 }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} role="tab" aria-selected={isActive} onClick={() => setActive(t.id)} className={`planning-tab ${isActive ? "planning-tab--active" : ""}`} type="button">
              <Icon size={16} /> {t.label}
              {t.id === "colors" && <span className="planning-tab-count">{stats.totalColors}</span>}
              {t.id === "typography" && <span className="planning-tab-count">{stats.totalTypo}</span>}
              {t.id === "components" && <span className="planning-tab-count">{stats.liveComp}/{stats.totalComp}</span>}
              {t.id === "rules" && <span className="planning-tab-count">{stats.doneRules}/{stats.totalRules}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 8 }}>
        {active === "colors" && <ColorsTab colors={hook.colors} addColor={hook.addColor} updateColor={hook.updateColor} removeColor={hook.removeColor} duplicateColor={hook.duplicateColor} />}
        {active === "typography" && <TypographyTab typography={hook.typography} addTipografi={hook.addTypography} updateTipografi={hook.updateTypography} removeTipografi={hook.removeTypography} />}
        {active === "components" && <ComponentsTab components={hook.components} addComponent={hook.addComponent} updateComponent={hook.updateComponent} removeComponent={hook.removeComponent} duplicateComponent={hook.duplicateComponent} />}
        {active === "rules" && <UIRulesTab rules={hook.rules} addRule={hook.addRule} updateRule={hook.updateRule} toggleRule={hook.toggleRule} removeRule={hook.removeRule} />}
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>
        Simpan otomatis · kunci: <code>{hook.STORAGE_KEY}</code> · token sesuai <code>global.css</code>
      </p>
    </div>
  );
}
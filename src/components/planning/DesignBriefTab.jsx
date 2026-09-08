export default function DesignBriefTab({ brief, updateBrief }) {
  return (
    <div className="planning-panel" style={{ display:"grid", gap:16 }}>
      <div className="card" style={{ display:"grid", gap:14 }}>
        <div>
          <h3 style={{ margin:0 }}>Brief Desain</h3>
          <p style={{ margin:"4px 0 0", color:"var(--text-muted)", fontSize:13 }}>Tangkap arahan visual so AI respects constraints and you stay consistent.</p>
        </div>

        <label className="field">
          <span className="field-label">Referensi Inspirasi / References</span>
          <input value={brief.inspiration} onChange={e=> updateBrief({ inspiration: e.target.value })} placeholder="Dribbble links, competitor URLs" />
        </label>

        <label className="field">
          <span className="field-label">References (detailed)</span>
          <textarea rows={2} value={brief.references} onChange={e=> updateBrief({ references: e.target.value })} placeholder="Ex: Linear.app nav + Stripe pricing" className="field-input" />
        </label>

        <div className="grid grid-2">
          <label className="field">
            <span className="field-label">Mood / Style</span>
            <input value={brief.mood} onChange={e=> updateBrief({ mood: e.target.value })} placeholder="Ex: Minimal, calm, dense, GitHub-inspired" />
          </label>
          <label className="field">
            <span className="field-label">Warna</span>
            <input value={brief.colors} onChange={e=> updateBrief({ colors: e.target.value })} placeholder="Ex: #0D1117 bg, #58A6FF accent" />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="field">
            <span className="field-label">Tipografi</span>
            <input value={brief.typography} onChange={e=> updateBrief({ typography: e.target.value })} placeholder="Ex: Inter 14px, JetBrains Mono for code" />
          </label>
          <label className="field">
            <span className="field-label">Catatan</span>
            <input value={brief.notes} onChange={e=> updateBrief({ notes: e.target.value })} placeholder="Any visual rules — no gradients, 6px radius..." />
          </label>
        </div>
      </div>
    </div>
  );
}
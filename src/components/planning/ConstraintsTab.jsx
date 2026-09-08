export default function ConstraintsTab({ constraints, updateConstraints }) {
  return (
    <div className="planning-panel" style={{ display:"grid", gap:16 }}>
      <div className="card" style={{ display:"grid", gap:14 }}>
        <div>
          <h3 style={{ margin:0 }}>Batasan</h3>
          <p style={{ margin:"4px 0 0", color:"var(--text-muted)", fontSize:13 }}>Batasan keras yang harus dipatuhi AI. If not defined, AI will assume broad defaults.</p>
        </div>

        <label className="field">
          <span className="field-label">Technical Batasan</span>
          <textarea rows={3} value={constraints.technical} onChange={e=> updateConstraints({ technical: e.target.value })} placeholder="Stack must be React+Vite, no backend, localStorage only, etc." className="field-input" />
        </label>

        <label className="field">
          <span className="field-label">Business / Product Batasan</span>
          <textarea rows={3} value={constraints.business} onChange={e=> updateConstraints({ business: e.target.value })} placeholder="Must be single-user, no billing, personal workspace only." className="field-input" />
        </label>

        <div className="grid grid-2">
          <label className="field">
            <span className="field-label">Timeline</span>
            <input value={constraints.timeline} onChange={e=> updateConstraints({ timeline: e.target.value })} placeholder="Ex: 2 weeks, must ship Friday" />
          </label>
          <label className="field">
            <span className="field-label">Anggaran</span>
            <input value={constraints.budget} onChange={e=> updateConstraints({ budget: e.target.value })} placeholder="Ex: $0, no paid APIs" />
          </label>
        </div>
      </div>
    </div>
  );
}
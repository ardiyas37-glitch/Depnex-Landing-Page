export default function AudienceTab({ audience, updateAudience }) {
  return (
    <div className="planning-panel" style={{ display:"grid", gap:16 }}>
      <div className="card" style={{ display:"grid", gap:14 }}>
        <div>
          <h3 style={{ margin:0 }}>Target Pengguna</h3>
          <p style={{ margin:"4px 0 0", color:"var(--text-muted)", fontSize:13 }}>Untuk siapa kamu membangun? Be specific — this drives copy, structure, and features.</p>
        </div>

        <label className="field">
          <span className="field-label">Target Pengguna</span>
          <input value={audience.targetAudience} onChange={e=> updateAudience({ targetAudience: e.target.value })} placeholder="Ex: UMKM owners, 30-45, need online presence" />
        </label>

        <label className="field">
          <span className="field-label">Jenis Pengguna</span>
          <input value={audience.userType} onChange={e=> updateAudience({ userType: e.target.value })} placeholder="Ex: Owner, Admin, Visitor" />
        </label>

        <label className="field">
          <span className="field-label">Masalah</span>
          <textarea rows={3} value={audience.problems} onChange={e=> updateAudience({ problems: e.target.value })} placeholder="What problems do they have? Pain points, frustrations." className="field-input" />
        </label>

        <label className="field">
          <span className="field-label">Kebutuhan</span>
          <textarea rows={3} value={audience.needs} onChange={e=> updateAudience({ needs: e.target.value })} placeholder="What do they need from this website? Jobs-to-be-done." className="field-input" />
        </label>

        <label className="field">
          <span className="field-label">Perilaku yang Diharapkan</span>
          <textarea rows={2} value={audience.expectedBehavior} onChange={e=> updateAudience({ expectedBehavior: e.target.value })} placeholder="What should they do? Ex: Contact via WhatsApp, book a slot." className="field-input" />
        </label>
      </div>

      <div className="card" style={{ background:"var(--bg)", borderStyle:"dashed" }}>
        <strong style={{ fontSize:12, color:"var(--text)" }}>Tip</strong>
        <p style={{ fontSize:12, color:"var(--text-muted)", margin:"4px 0 0", lineHeight:1.6 }}>Example: UMKM owners — Masalah: no online catalog — Kebutuhan: simple company profile — Behavior: tap WhatsApp CTA in hero.</p>
      </div>
    </div>
  );
}
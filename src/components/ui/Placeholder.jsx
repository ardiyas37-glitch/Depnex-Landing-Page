export default function Placeholder({ title, desc = "Modul ini akan dikembangkan pada phase berikutnya. Routing sudah siap." }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <div className="placeholder">
        <div>
          <span className="badge">Phase 01 — Foundation</span>
          <p style={{ marginTop: 12 }}>{title} — placeholder siap. Implementasi detail di Phase 02+.</p>
        </div>
      </div>
    </div>
  );
}
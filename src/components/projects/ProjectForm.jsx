import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { TYPE_OPTIONS, STATUS_OPTIONS } from "../../hooks/useProjects";

export default function ProjectForm({ open, onTutup, onSubmit, initial }) {
  const [form, setForm] = useState({
    name: "",
    type: "Landing Page",
    description: "",
    status: "draft",
    progress: 0,
    priority: "medium",
    deadline: "",
    stack: "React + Vite",
    team: "Solo",
  });

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name || "",
          type: initial.type || "Landing Page",
          description: initial.description || "",
          status: initial.status || "draft",
          progress: initial.progress ?? 0,
          priority: initial.priority || "medium",
          deadline: initial.deadline || "",
          stack: initial.stack || "React + Vite",
          team: initial.team || "Solo",
        });
      } else {
        setForm({ name: "", type: "Landing Page", description: "", status: "draft", progress: 0, priority: "medium", deadline: "", stack: "React + Vite", team: "Solo" });
      }
    }
  }, [open, initial]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    onTutup();
  }

  return (
    <div className="modal-overlay" onClick={onTutup}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>{initial ? "Edit Project" : "Proyek Baru"}</h3>
          <button className="btn-ghost sm" onClick={onTutup} type="button"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: "grid", gap: 14 }}>
          <label className="field">
            <span className="field-label">Nama Project *</span>
            <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Ex: Toko Kue Ibu Sari" required />
          </label>

          <div className="grid grid-2">
            <label className="field">
              <span className="field-label">Tipe</span>
              <select value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} className="field-input">
                {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Status</span>
              <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="field-input">
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <label className="field">
            <span className="field-label">Deskripsi</span>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Jelaskan project 1-2 kalimat..." className="field-input" />
          </label>

          <div className="grid grid-2">
            <label className="field">
              <span className="field-label">Progress — {form.progress}%</span>
              <input type="range" min={0} max={100} value={form.progress} onChange={(e) => setForm((s) => ({ ...s, progress: Number(e.target.value) }))} />
            </label>
            <label className="field">
              <span className="field-label">Prioritas</span>
              <select value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value }))} className="field-input">
                <option value="low">Rendah</option><option value="medium">Sedang</option><option value="high">Tinggi</option>
              </select>
            </label>
          </div>

          <div className="grid grid-2">
            <label className="field">
              <span className="field-label">Tenggat Waktu</span>
              <input type="date" value={form.deadline} onChange={(e) => setForm((s) => ({ ...s, deadline: e.target.value }))} />
            </label>
            <label className="field">
              <span className="field-label">Team</span>
              <input value={form.team} onChange={(e) => setForm((s) => ({ ...s, team: e.target.value }))} placeholder="Solo / 2 orang / Studio" />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Stack</span>
            <input value={form.stack} onChange={(e) => setForm((s) => ({ ...s, stack: e.target.value }))} placeholder="React + Vite + Supabase" />
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <button type="button" className="btn-ghost" onClick={onTutup}>Batal</button>
            <button type="submit" className="btn-primary">{initial ? "Simpan" : "Buat Proyek"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
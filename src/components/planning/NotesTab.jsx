import { useState } from "react";

export default function NotesTab({ notes, addNote, updateNote, removeNote }) {
  const [draft, setDraf] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({ title: "", content: "" });

  function handleAdd() {
    if (!draft.title.trim() && !draft.content.trim()) return;
    addNote({ title: draft.title.trim() || "Untitled", content: draft.content.trim() });
    setDraf({ title: "", content: "" });
  }

  function startEdit(n) {
    setEditingId(n.id);
    setEdit({ title: n.title, content: n.content });
  }
  function saveEdit() {
    if (editingId) {
      updateNote(editingId, { title: edit.title.trim() || "Untitled", content: edit.content });
      setEditingId(null);
    }
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0 }}>Catatan</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>Catatan bebas untuk riset, ide, atau link referensi. Mendukung markdown ringan.</p>

        <div style={{ display: "grid", gap: 10, marginBottom: 16, padding: 14, border: "1px solid var(--border)", borderRadius: 12, background: "var(--off-white)" }}>
          <input value={draft.title} onChange={(e) => setDraf((d) => ({ ...d, title: e.target.value }))} placeholder="Judul — ex: Kompetitor & referensi desain" />
          <textarea rows={3} value={draft.content} onChange={(e) => setDraf((d) => ({ ...d, content: e.target.value }))} placeholder="Isi catatan... — paste link, bullet list, atau ide mentah" className="field-input" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={handleAdd} type="button">+ Simpan Note</button>
          </div>
        </div>

        {notes.length === 0 ? (
          <p style={{ color: "var(--text-faint)", fontSize: 13, textAlign: "center", padding: 20, border: "1px dashed var(--border)", borderRadius: 12 }}>Belum ada notes. Tambahkan insight riset di sini.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {notes.map((n) => (
              <div key={n.id} className="card" style={{ padding: 14, boxShadow: "none" }}>
                {editingId === n.id ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    <input value={edit.title} onChange={(e) => setEdit((s) => ({ ...s, title: e.target.value }))} />
                    <textarea rows={3} value={edit.content} onChange={(e) => setEdit((s) => ({ ...s, content: e.target.value }))} className="field-input" />
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button className="btn-ghost sm" onClick={() => setEditingId(null)} type="button">Batal</button>
                      <button className="btn-primary sm" onClick={saveEdit} type="button">Simpan</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                      <strong style={{ fontSize: 14 }}>{n.title}</strong>
                      <span style={{ fontSize: 11, color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                        {new Date(n.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p style={{ margin: "8px 0 0", whiteSpace: "pre-wrap", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>{n.content || "— kosong —"}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="btn-ghost sm" onClick={() => startEdit(n)} type="button">Edit</button>
                      <button className="btn-ghost sm danger" onClick={() => removeNote(n.id)} type="button">Hapus</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
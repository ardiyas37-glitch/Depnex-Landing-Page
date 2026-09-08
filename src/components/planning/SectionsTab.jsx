import { useState } from "react";

export default function SectionsTab({ sections, addSection, updateSection, removeSection, moveSection }) {
  const [draft, setDraf] = useState({ name: "", purpose: "" });

  function handleAdd() {
    if (!draft.name.trim()) return;
    addSection({ name: draft.name.trim(), purpose: draft.purpose.trim() || "-" });
    setDraf({ name: "", purpose: "" });
  }

  return (
    <div className="planning-panel" style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h3 style={{ margin: 0 }}>Bagian — Struktur Website</h3>
        <p style={{ margin: "4px 0 14px", color: "var(--text-muted)", fontSize: 13 }}>
          Susun urutan bagian seperti sitemap. Toggle include untuk mengikutkan ke Prompt AI. Drag order via ▲▼.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <input value={draft.name} onChange={(e) => setDraf((d) => ({ ...d, name: e.target.value }))} placeholder="Nama section — ex: Pricing Table" style={{ flex: "1 1 180px" }} />
          <input value={draft.purpose} onChange={(e) => setDraf((d) => ({ ...d, purpose: e.target.value }))} placeholder="Purpose / isi — ex: 3 tier harga + FAQ" style={{ flex: "2 1 260px" }} />
          <button className="btn-primary" onClick={handleAdd} type="button">+ Tambah</button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {sections.length === 0 && <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Belum ada sections. Tambahkan minimal 3 sections utama.</p>}
          {sections.map((s, idx) => (
            <div key={s.id} className="planning-item">
              <label style={{ display: "flex", gap: 10, flex: 1, alignItems: "flex-start" }}>
                <input type="checkbox" checked={s.include} onChange={(e) => updateSection(s.id, { include: e.target.checked })} style={{ marginTop: 4 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    value={s.name}
                    onChange={(e) => updateSection(s.id, { name: e.target.value })}
                    style={{ fontWeight: 600, border: "1px solid transparent", background: "transparent", padding: "2px 4px", width: "100%" }}
                  />
                  <input
                    value={s.purpose}
                    onChange={(e) => updateSection(s.id, { purpose: e.target.value })}
                    placeholder="purpose"
                    style={{ fontSize: 13, color: "var(--text-muted)", border: "1px solid transparent", background: "transparent", padding: "2px 4px", width: "100%" }}
                  />
                </div>
              </label>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span className="badge" style={{ fontSize: 10 }}>#{idx + 1}</span>
                <button className="btn-ghost sm" onClick={() => moveSection(s.id, "up")} disabled={idx === 0} type="button">▲</button>
                <button className="btn-ghost sm" onClick={() => moveSection(s.id, "down")} disabled={idx === sections.length - 1} type="button">▼</button>
                <button className="btn-ghost sm danger" onClick={() => removeSection(s.id)} type="button">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: "var(--off-white)" }}>
        <strong style={{ fontSize: 13 }}>Tips:</strong>
        <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
          <li>Urutkan: Header → Hero → Social Proof → Fitur → Pricing → Testimonials → FAQ → CTA → Footer</li>
          <li>Nonaktifkan section yang belum prioritas (exclude dari prompt)</li>
          <li>Tiap section akan jadi &lt;section&gt; component terpisah saat generate</li>
        </ul>
      </div>
    </div>
  );
}
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("DepnexProject ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0D1117", padding: 24, color: "#E6EDF3" }}>
          <div style={{ maxWidth: 720, width: "100%", background: "#161B22", border: "1px solid #F85149", borderRadius: 8, padding: 20 }}>
            <h1 style={{ margin: 0, fontSize: 16, color: "#F85149" }}>TERJADI KESALAHAN APLIKASI</h1>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#8B949E" }}>Aplikasi gagal merender. Pesan error ditampilkan di bawah untuk debugging di HP.</p>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#E6EDF3" }}>Pesan:</div>
              <pre style={{ margin: "4px 0 0", whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 11, background: "#0D1117", border: "1px solid #30363D", borderRadius: 6, padding: 10, color: "#F85149" }}>
                {String(this.state.error?.message || this.state.error)}
              </pre>
            </div>
            {this.state.error?.stack && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#E6EDF3" }}>Komponen:</div>
                <pre style={{ margin: "4px 0 0", whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 10, background: "#0D1117", border: "1px solid #30363D", borderRadius: 6, padding: 10, color: "#8B949E", maxHeight: 200, overflow: "auto" }}>
                  {String(this.state.error.stack).slice(0, 2000)}
                </pre>
              </div>
            )}
            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn-primary sm" onClick={() => { localStorage.clear(); location.reload(); }} type="button">Hapus Storage & Muat Ulang</button>
              <button className="btn-ghost sm" onClick={() => this.setState({ error: null })} type="button">Tutup</button>
              <button className="btn-ghost sm" onClick={() => location.reload()} type="button">Muat Ulang</button>
            </div>
            <p style={{ marginTop: 12, fontSize: 11, color: "#6E7681" }}>Juga cek console.error() untuk log lengkap. Setelah root cause diperbaiki, boundary ini akan dihapus.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

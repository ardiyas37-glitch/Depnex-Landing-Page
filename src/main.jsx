import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/global.css";

// Mobile visible error overlay — blank putih jadi kelihatan errornya
window.addEventListener("error", (e) => {
  const msg = e?.message || e?.error?.message || "Unknown error";
  let el = document.getElementById("webplan-error-overlay");
  if (!el) {
    el = document.createElement("div");
    el.id = "webplan-error-overlay";
    el.style.cssText = "position:fixed;inset:12px;z-index:99999;background:#161B22;border:1px solid #F85149;border-radius:6px;padding:12px;color:#E6EDF3;font-family:monospace;font-size:11px;overflow:auto;max-height:90vh";
    document.body.appendChild(el);
  }
  el.innerHTML = `<b style="color:#F85149">DepnexProject Error</b><br/>${msg}<br/><pre style="white-space:pre-wrap;color:#8B949E">${(e?.error?.stack||"").slice(0,800)}</pre><button onclick="localStorage.clear();location.reload()" style="margin-top:8px;padding:6px 10px;background:#238636;color:#fff;border:1px solid #30363D;border-radius:6px">Hapus Storage & Reload</button>`;
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = e?.reason?.message || String(e.reason);
  let el = document.getElementById("webplan-error-overlay");
  if (!el) {
    el = document.createElement("div");
    el.id = "webplan-error-overlay";
    el.style.cssText = "position:fixed;inset:12px;z-index:99999;background:#161B22;border:1px solid #F85149;border-radius:6px;padding:12px;color:#E6EDF3;font-family:monospace;font-size:11px;overflow:auto;max-height:90vh";
    document.body.appendChild(el);
  }
  el.innerHTML = `<b style="color:#F85149">DepnexProject Promise Error</b><br/>${msg}`;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

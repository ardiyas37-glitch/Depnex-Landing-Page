import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-card">
          <div className="spinner" />
          <p style={{ fontSize:12, color:"var(--text-muted)" }}>Memuat ruang kerja…</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }
    const dest = location.state?.from || "/admin";
    navigate(dest, { replace: true });
  }

  const isDisabled = loading || !email.trim() || !password;

  return (
    <main className="auth-page">
      <div className="auth-container">
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-brand">
            <div className="auth-brand-icon" aria-hidden>WP</div>
            <span className="auth-kicker">DepnexProject</span>
          </div>

          <h1 id="login-title">Ruang kerja pribadi</h1>
          <p className="auth-desc">
            Masuk ke pusat kendali pengembangan lokalmu.<br />
            Pengembang tunggal · tanpa setup tim.
          </p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <label className="field">
              <span className="field-label">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                autoComplete="email"
                required
                disabled={loading}
                aria-label="Email"
              />
            </label>

            <label className="field">
              <span className="field-label">Kata Sandi</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={loading}
                aria-label="Kata Sandi"
              />
            </label>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" disabled={isDisabled} className="btn-primary" aria-label="Masuk">
              {loading ? "Memproses…" : "Masuk"}
            </button>
          </form>
        </section>

        <p className="auth-footer">DepnexProject — Pikir · Rencanakan · Bangun · Lacak</p>
      </div>
    </main>
  );
}
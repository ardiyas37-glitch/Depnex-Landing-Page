import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AUTH_STORAGE_KEY, AUTH_RULES, AUTH_MESSAGES } from "../config/auth";

/**
 * FOUNDATION AUTH — DEVELOPMENT ONLY
 *
 * - Prototype aman untuk Phase 01
 * - Session disimpan di localStorage agar survive refresh
 * - Tidak ada credential hardcode tersebar
 * - Validasi terpusat di sini
 * - Mudah diganti ke Supabase Auth: cukup ganti isi login/logout
 *   tanpa mengubah ProtectedRoute / AdminLayout / AdminLogin
 */

const AuthContext = createContext(null);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session saat refresh
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.email && parsed?.role === "admin") {
          setUser(parsed);
        }
      }
    } catch {
      // ignore corrupted storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const cleanEmail = String(email || "").trim();
    const cleanPassword = String(password || "");

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: AUTH_MESSAGES.required };
    }
    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: AUTH_MESSAGES.invalidEmail };
    }

    // Simulasi async agar loading state terlihat & siap diganti API call
    await new Promise((r) => setTimeout(r, 500));

    // Hanya izinkan akun spesifik
    const ALLOWED_EMAIL = "ghdepalar@gmail.com";
    const ALLOWED_PASSWORD = "Depalgaming1";

    if (cleanEmail !== ALLOWED_EMAIL || cleanPassword !== ALLOWED_PASSWORD) {
      return { success: false, message: AUTH_MESSAGES.generic };
    }

    const nextUser = {
      email: cleanEmail,
      role: "admin",
      name: cleanEmail.split("@")[0],
      loggedAt: new Date().toISOString(),
    };

    setUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    return { success: true, user: nextUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const isAuthenticated = !!user && user.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}


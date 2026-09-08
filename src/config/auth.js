/**
 * DepnexProject — Auth Config (PHASE 01 FOUNDATION)
 *
 * Authentication saat ini adalah PROTOTYPE untuk development.
 * Tujuannya agar routing, layout, dan session flow bisa diuji tanpa backend.
 *
 * - JANGAN menaruh password asli di banyak file
 * - JANGAN menaruh secret API di source code
 * - Satu tempat konfigurasi ada di sini
 *
 * Migrasi berikutnya:
 *   Ganti implementasi di src/context/AuthContext.jsx untuk memanggil
 *   Supabase Auth / backend lain. Interface { user, login, logout, isAuthenticated, isLoading }
 *   dipertahankan agar tidak perlu ubah komponen lain.
 *
 * Contoh env untuk Supabase (belum aktif di Phase 01):
 *   VITE_SUPABASE_URL=
 *   VITE_SUPABASE_ANON_KEY=
 */

// Kunci storage — satu tempat, konsisten di seluruh app
export const AUTH_STORAGE_KEY = "depnex_auth";

// Validasi minimal untuk prototype dev.
// Di production nanti diganti validasi Supabase.
export const AUTH_RULES = {
  minPasswordLength: 6,
};

// Pesan error terpusat (Bahasa Indonesia)
export const AUTH_MESSAGES = {
  required: "Email dan password wajib diisi.",
  invalidEmail: "Format email tidak valid.",
  shortPassword: `Password minimal ${AUTH_RULES.minPasswordLength} karakter.`,
  generic: "Gagal masuk. Periksa email dan password.",
};

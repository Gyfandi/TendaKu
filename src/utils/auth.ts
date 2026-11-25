import type { AuthUser, SupabaseUser, UserMetadata } from "@/types/auth";

export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const isValidEmail = (email: string): boolean => EMAIL_PATTERN.test(email.trim());

/**
 * Mengubah objek user Supabase menjadi AuthUser aplikasi.
 * Role admin hanya dipercaya dari `app_metadata` (tidak bisa diubah oleh user
 * sendiri), sedangkan `user_metadata` hanya dipakai untuk data tampilan.
 */
export function mapSupabaseUser(user: SupabaseUser): AuthUser {
  const metadata = (user.user_metadata ?? {}) as UserMetadata;
  const email = user.email ?? "";

  return {
    id: user.id,
    email,
    fullName: metadata.full_name?.trim() || email.split("@")[0] || "Pengguna",
    role: user.app_metadata?.role === "admin" ? "admin" : "user",
  };
}

interface ErrorLike {
  message?: string;
  code?: string;
  name?: string;
  status?: number;
}

/** Menerjemahkan error Supabase Auth ke pesan bahasa Indonesia yang mudah dipahami. */
export function translateAuthError(error: unknown): string {
  const { message = "", code = "", name = "", status } = (error ?? {}) as ErrorLike;
  const text = message.toLowerCase();

  if (
    name === "AuthRetryableFetchError" ||
    text.includes("network request failed") ||
    text.includes("failed to fetch") ||
    text.includes("network error")
  ) {
    return "Koneksi bermasalah. Periksa internet Anda lalu coba lagi.";
  }
  if (code === "invalid_credentials" || text.includes("invalid login credentials")) {
    return "Email atau password salah.";
  }
  if (code === "email_not_confirmed" || text.includes("email not confirmed")) {
    return "Email belum diverifikasi. Silakan cek inbox email Anda.";
  }
  if (code === "user_already_exists" || text.includes("already registered")) {
    return "Email sudah terdaftar. Silakan login.";
  }
  if (code === "weak_password" || text.includes("password should be at least")) {
    return `Password terlalu lemah. Gunakan minimal ${MIN_PASSWORD_LENGTH} karakter.`;
  }
  if (code === "validation_failed" || text.includes("unable to validate email")) {
    return "Format email tidak valid.";
  }
  if (
    code === "over_request_rate_limit" ||
    code === "over_email_send_rate_limit" ||
    status === 429 ||
    text.includes("rate limit")
  ) {
    return "Terlalu banyak percobaan. Silakan tunggu beberapa saat lalu coba lagi.";
  }
  if (code === "signup_disabled") {
    return "Pendaftaran akun baru sedang dinonaktifkan.";
  }
  if (typeof status === "number" && status >= 500) {
    return "Server sedang bermasalah. Silakan coba lagi nanti.";
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}
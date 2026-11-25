import type { User } from "@supabase/supabase-js";
import type { AuthUser } from "@/types/auth";

export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const isValidEmail = (email: string): boolean => {
  return EMAIL_PATTERN.test(email);
};

export function mapSupabaseUser(user: User): AuthUser {
  const email = user.email ?? "";
  const metadata = user.user_metadata ?? {};

  const username =
    typeof metadata.username === "string"
      ? metadata.username
      : email.split("@")[0] || "user";

  const fullName =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : username;

  return {
    id: user.id,
    email,
    username,
    fullName,
    role: "user",
  };
}

export function translateAuthError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : String(error ?? "Terjadi kesalahan.");

  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("invalid login credentials") ||
    lowerMessage.includes("invalid credentials")
  ) {
    return "Email atau password tidak sesuai.";
  }

  if (lowerMessage.includes("email not confirmed")) {
    return "Email belum dikonfirmasi. Silakan periksa email kamu.";
  }

  if (lowerMessage.includes("user already registered")) {
    return "Email sudah terdaftar. Silakan login.";
  }

  if (lowerMessage.includes("password should be at least")) {
    return `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`;
  }

  if (lowerMessage.includes("unable to validate email")) {
    return "Format email tidak valid.";
  }

  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("fetch")
  ) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet.";
  }

  return message;
}
import type { Session, User } from "@supabase/supabase-js";

export type UserRole = "user" | "admin";

/** Bentuk objek Session & User asli dari Supabase Auth. */
export type AuthSession = Session;
export type SupabaseUser = User;

/** Metadata yang disimpan di `user.user_metadata` saat sign up. */
export interface UserMetadata {
  full_name?: string;
}

/**
 * User aplikasi yang diturunkan dari objek user Supabase.
 * - id        : `user.id` (UUID)
 * - email     : `user.email`
 * - fullName  : `user.user_metadata.full_name`
 * - role      : `user.app_metadata.role` ("admin" hanya bisa diset dari sisi server)
 */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

export interface SignUpResult extends AuthResult {
  /** true jika Supabase meminta verifikasi email sebelum akun bisa dipakai login. */
  needsEmailConfirmation?: boolean;
}
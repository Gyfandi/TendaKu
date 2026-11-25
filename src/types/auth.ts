import type { Session, User } from "@supabase/supabase-js";

export type UserRole = "user" | "admin";

export type AuthSession = Session;

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

export interface SignUpResult extends AuthResult {
  success: boolean;
  needsEmailConfirmation?: boolean;
}

export interface RegisteredUser {
  username: string;
  fullName: string;
  password: string;
  role: "user";
}

export type SupabaseAuthUser = User;
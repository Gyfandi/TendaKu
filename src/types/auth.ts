export type UserRole = "user" | "admin";

export interface AuthUser {
  username: string;
  fullName: string;
  role: UserRole;
}

export interface RegisteredUser {
  username: string;
  fullName: string;
  password: string;
  role: "user";
}

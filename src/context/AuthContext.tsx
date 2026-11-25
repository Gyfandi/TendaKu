import { supabase } from "@/lib/supabase";
import type {
  AuthResult,
  AuthSession,
  AuthUser,
  SignUpResult,
} from "@/types/auth";
import {
  isValidEmail,
  mapSupabaseUser,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  translateAuthError,
} from "@/utils/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState, Platform } from "react-native";

interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  isAdmin: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<SignUpResult>;
  signOut: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfileRole = useCallback(async (currentSession: AuthSession) => {
    const userId = currentSession.user.id;

    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("role, username, full_name")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.warn("Gagal mengambil role profil:", profileError.message);
        return;
      }

      if (!data) return;

      setUser((currentUser) => {
        if (!currentUser || currentUser.id !== userId) {
          return currentUser;
        }

        return {
          ...currentUser,
          role: data.role === "admin" ? "admin" : "user",
          username: data.username || currentUser.username,
          fullName: data.full_name || currentUser.fullName,
        };
      });
    } catch (err) {
      console.warn("Gagal memuat profil pengguna:", err);
    }
  }, []);

  const applySession = useCallback((nextSession: AuthSession | null) => {
    setSession(nextSession);
    setUser(nextSession ? mapSupabaseUser(nextSession.user) : null);
  }, []);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!active) return;

        applySession(data.session);

        if (data.session) {
          void loadProfileRole(data.session);
        }
      } catch (err) {
        console.warn("Gagal memulihkan sesi login:", err);
      } finally {
        if (active) setIsInitializing(false);
      }
    };

    void restoreSession();

    const { data } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        applySession(nextSession);

        if (nextSession) {
          setTimeout(() => {
            void loadProfileRole(nextSession);
          }, 0);
        }
      },
    );

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [applySession, loadProfileRole]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void supabase.auth.startAutoRefresh();
      } else {
        void supabase.auth.stopAutoRefresh();
      }
    });

    void supabase.auth.startAutoRefresh();

    return () => {
      subscription.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fail = useCallback((message: string): AuthResult => {
    setError(message);
    return { success: false, message };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: normalizeEmail(email),
            password,
          });

        if (signInError) {
          return fail(translateAuthError(signInError));
        }

        return { success: true };
      } catch (err) {
        return fail(translateAuthError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [fail],
  );

  const signUp = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
    ): Promise<SignUpResult> => {
      const cleanName = fullName.trim();
      const cleanEmail = normalizeEmail(email);

      if (!cleanName || !cleanEmail || !password) {
        return fail("Semua kolom wajib diisi.");
      }

      if (!isValidEmail(cleanEmail)) {
        return fail("Format email tidak valid.");
      }

      if (password.length < MIN_PASSWORD_LENGTH) {
        return fail(
          `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`,
        );
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: signUpError } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: cleanName,
              },
            },
          });

        if (signUpError) {
          return fail(translateAuthError(signUpError));
        }

        if (data.user && data.user.identities?.length === 0) {
          return fail("Email sudah terdaftar. Silakan login.");
        }

        return {
          success: true,
          needsEmailConfirmation: !data.session,
        };
      } catch (err) {
        return fail(translateAuthError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [fail],
  );

  const signOut = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        return fail("Gagal keluar. Silakan coba lagi.");
      }

      applySession(null);
      return { success: true };
    } catch {
      return fail("Gagal keluar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [applySession, fail]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAdmin: user?.role === "admin",
      isInitializing,
      isLoading,
      error,
      clearError,
      signIn,
      signUp,
      signOut,
    }),
    [
      user,
      session,
      isInitializing,
      isLoading,
      error,
      clearError,
      signIn,
      signUp,
      signOut,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}
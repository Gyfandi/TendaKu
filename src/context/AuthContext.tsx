import { supabase } from "@/lib/supabase";
import { AuthResult, AuthSession, AuthUser, SignUpResult } from "@/types/auth";
import {
  MIN_PASSWORD_LENGTH,
  isValidEmail,
  mapSupabaseUser,
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
  /** true selama sesi tersimpan masih dipulihkan saat aplikasi dibuka. */
  isInitializing: boolean;
  /** true selama request signIn / signUp / signOut ke Supabase berlangsung. */
  isLoading: boolean;
  /** Pesan error terakhir dari Supabase (sudah diterjemahkan), atau null. */
  error: string | null;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (fullName: string, email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applySession = useCallback((nextSession: AuthSession | null) => {
    setSession(nextSession);
    setUser(nextSession ? mapSupabaseUser(nextSession.user) : null);
  }, []);

  // Pulihkan sesi dari SecureStore, lalu ikuti perubahan sesi (login, logout, refresh token).
  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) applySession(data.session);
      })
      .catch((err) => console.warn("Gagal memulihkan sesi login:", err))
      .finally(() => {
        if (active) setIsInitializing(false);
      });

    // Callback ini hanya mengubah state (tanpa memanggil API Supabase lain).
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [applySession]);

  // Di mobile, hentikan auto refresh token saat aplikasi di background.
  useEffect(() => {
    if (Platform.OS === "web") return;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void supabase.auth.startAutoRefresh();
      else void supabase.auth.stopAutoRefresh();
    });
    void supabase.auth.startAutoRefresh();

    return () => {
      subscription.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const fail = useCallback((message: string): AuthResult => {
    setError(message);
    return { success: false, message };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizeEmail(email),
          password,
        });
        if (signInError) return fail(translateAuthError(signInError));

        // State user/session diperbarui oleh onAuthStateChange.
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
    async (fullName: string, email: string, password: string): Promise<SignUpResult> => {
      const cleanName = fullName.trim();
      const cleanEmail = normalizeEmail(email);

      // Validasi ulang sebagai pengaman jika fungsi dipanggil dari tempat lain.
      if (!cleanName || !cleanEmail || !password) return fail("Semua kolom wajib diisi.");
      if (!isValidEmail(cleanEmail)) return fail("Format email tidak valid.");
      if (password.length < MIN_PASSWORD_LENGTH) {
        return fail(`Password minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      }

      setIsLoading(true);
      setError(null);

      try {
        // Role tidak dikirim dari client: akun baru selalu menjadi "user".
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: cleanName } },
        });
        if (signUpError) return fail(translateAuthError(signUpError));

        // Jika email sudah terdaftar & verifikasi email aktif, Supabase tidak
        // mengembalikan error, melainkan user tanpa identities.
        if (data.user && data.user.identities?.length === 0) {
          return fail("Email sudah terdaftar. Silakan login.");
        }

        // Tanpa session = Supabase menunggu verifikasi email.
        return { success: true, needsEmailConfirmation: !data.session };
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
      let { error: signOutError } = await supabase.auth.signOut();

      // Jika gagal (misalnya offline), hapus sesi di perangkat saja agar
      // token di SecureStore tetap bersih dan user bisa keluar.
      if (signOutError) {
        ({ error: signOutError } = await supabase.auth.signOut({ scope: "local" }));
      }
      if (signOutError) return fail("Gagal keluar. Silakan coba lagi.");

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
    [user, session, isInitializing, isLoading, error, clearError, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
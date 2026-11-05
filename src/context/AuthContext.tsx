import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthUser, RegisteredUser } from "@/types/auth";

const SESSION_KEY = "tendaku_session";
const USERS_KEY = "tendaku_registered_users";
const LEGACY_ADMIN_KEY = "tendaku_admin_session";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "tendaku123";

interface AuthContextValue {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (fullName: string, username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem(SESSION_KEY);
        if (savedSession) {
          const parsed = JSON.parse(savedSession) as AuthUser;
          if (parsed?.username && (parsed.role === "admin" || parsed.role === "user")) {
            setUser(parsed);
          }
        } else {
          // Migrasi sesi admin dari versi autentikasi sebelumnya.
          const legacyAdmin = await AsyncStorage.getItem(LEGACY_ADMIN_KEY);
          if (legacyAdmin === "admin") {
            const adminUser: AuthUser = {
              username: ADMIN_USERNAME,
              fullName: "Administrator",
              role: "admin",
            };
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
            setUser(adminUser);
          }
        }
      } catch (error) {
        console.warn("Gagal memulihkan sesi login:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const normalizedUsername = username.trim().toLowerCase();

    try {
      let authenticatedUser: AuthUser | null = null;

      if (normalizedUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        authenticatedUser = {
          username: ADMIN_USERNAME,
          fullName: "Administrator",
          role: "admin",
        };
      } else {
        const rawUsers = await AsyncStorage.getItem(USERS_KEY);
        const users: RegisteredUser[] = rawUsers ? JSON.parse(rawUsers) : [];
        const found = users.find(
          (item) =>
            item.username.toLowerCase() === normalizedUsername &&
            item.password === password,
        );

        if (found) {
          authenticatedUser = {
            username: found.username,
            fullName: found.fullName,
            role: "user",
          };
        }
      }

      if (!authenticatedUser) return false;

      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return true;
    } catch (error) {
      console.warn("Gagal melakukan login:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (
    fullName: string,
    username: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanName = fullName.trim();
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanName || !cleanUsername || !password) {
      return { success: false, message: "Semua kolom wajib diisi." };
    }
    if (cleanUsername === ADMIN_USERNAME) {
      return { success: false, message: "Username tersebut tidak dapat digunakan." };
    }
    if (cleanUsername.length < 3) {
      return { success: false, message: "Username minimal 3 karakter." };
    }
    if (password.length < 6) {
      return { success: false, message: "Password minimal 6 karakter." };
    }

    try {
      const rawUsers = await AsyncStorage.getItem(USERS_KEY);
      const users: RegisteredUser[] = rawUsers ? JSON.parse(rawUsers) : [];
      const exists = users.some(
        (item) => item.username.toLowerCase() === cleanUsername,
      );

      if (exists) {
        return { success: false, message: "Username sudah digunakan." };
      }

      const newUser: RegisteredUser = {
        username: cleanUsername,
        fullName: cleanName,
        password,
        role: "user",
      };

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

      const sessionUser: AuthUser = {
        username: newUser.username,
        fullName: newUser.fullName,
        role: "user",
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);

      return { success: true };
    } catch (error) {
      console.warn("Gagal membuat akun:", error);
      return { success: false, message: "Pendaftaran gagal. Silakan coba lagi." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      await AsyncStorage.removeItem(LEGACY_ADMIN_KEY);
    } catch (error) {
      console.warn("Gagal menghapus sesi login:", error);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === "admin",
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
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

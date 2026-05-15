import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authApi, type AuthResponse, type MeResponse } from "../api/apiClient";

type User = {
  username: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  register: (
    username: string,
    password: string,
    role: string,
  ) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isManager: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((data: MeResponse) =>
        setUser({ username: data.username, role: data.role }),
      )
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<AuthResponse> => {
      const data = await authApi.login({ username, password });
      setUser({ username: data.username, role: data.role });
      return data;
    },
    [],
  );

  const register = useCallback(
    async (
      username: string,
      password: string,
      role?: string,
    ): Promise<AuthResponse> => {
      const data = await authApi.register({ username, password, role });
      setUser({ username: data.username, role: data.role });
      return data;
    },
    [],
  );

  const logout = useCallback(async ():Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  // ── RBAC helpers ─────────────────────────────────────────────────────────
  const isAdmin = user?.role === "ROLE_ADMIN";
  const isManager = user?.role === "ROLE_MANAGER";
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isManager,
        canEdit,
        canDelete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth mush be used within AuthProvider");
  return ctx;
};

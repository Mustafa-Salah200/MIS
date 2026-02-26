import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  type: string;
  first_name: string;
  last_name: string;
  roll_no: string;
  student_id: string;
  address: string;
  birth_day: string;
  program: string;
  department: string;
  enrollment: string;
  year: number;
  phone?: string | number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = "mis-auth-user";

const buildUserFromEmail = (email: string): User => {
  const displayName = email.split("@")[0] || "Student";

  return {
    id: crypto.randomUUID(),
    name: displayName,
    email,
    studentId: "",
    type: "student",
    first_name: "",
    last_name: "",
    roll_no: "",
    student_id: "",
    address: "",
    birth_day: "",
    program: "",
    department: "",
    enrollment: "",
    year: 1,
    phone: "",
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to restore auth from localStorage:", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email.trim() || !password.trim()) {
        return false;
      }

      const localUser = buildUserFromEmail(email.trim().toLowerCase());
      setUser(localUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(localUser));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return null;
      }

      const nextUser = { ...currentUser, ...updates };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

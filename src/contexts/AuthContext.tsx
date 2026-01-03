import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, UserProfile } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("email", authUser.email)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user profile:", error);
      }

      if (data) {
        // User found in users table
        setUser({
          id: authUser.id,
          name: data.full_name || authUser.email?.split('@')[0] || "User",
          email: authUser.email || "",
          studentId: data.student_id || "",
          type: "student",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          roll_no: data.student_id || "",
          student_id: data.student_id || "",
          address: data.address || "",
          birth_day: data.birth_day || "",
          program: data.program || "",
          department: data.department || "",
          enrollment: data.enrollment || "",
          year: data.year || 1,
          phone: data.phone || 1,
        });
      } else {
        // User authenticated but no record in users table, create basic user object
        console.warn("User authenticated but not found in users table. Creating basic user profile.");
        setUser({
          id: authUser.id,
          name: authUser.email?.split('@')[0] || "User",
          email: authUser.email || "",
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
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Still create a basic user object to allow login
      setUser({
        id: authUser.id,
        name: authUser.email?.split('@')[0] || "User",
        email: authUser.email || "",
        studentId: "",
        type: "student",
        first_name: "",
        last_name: "",
        student_id: "",
        address: "",
        birth_day: "",
        program: "",
        department: "",
        enrollment: "",
        year: 1,
        roll_no: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
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

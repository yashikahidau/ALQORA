"use client";

import {
  loginUser,
  registerUser,
  getMyProfile,
} from "@/lib/authApi";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  badge:
    | "Member"
    | "Silver"
    | "Gold"
    | "Platinum"
    | "Elite"
    | "Administrator";
  createdAt?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  googleLogin: (
    userData: User,
    token: string
  ) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("token");
    localStorage.removeItem("alqora-user");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      const response = await getMyProfile();

      if (response?.success && response.user) {
        setUser(response.user);

        localStorage.setItem(
          "alqora-user",
          JSON.stringify(response.user)
        );
        return;
      }

      // only clear session if backend explicitly says token is invalid
      if (response?.unauthorized) {
        clearAuth();
        return;
      }

      // temporary backend / network issue -> keep cached user if available
      const cachedUser = localStorage.getItem("alqora-user");

      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          setUser(null);
        }
      }
    } catch (error) {
      console.error(
        "Failed to restore auth session:",
        error
      );

      // keep cached session on transient failure
      if (typeof window !== "undefined") {
        const cachedUser =
          localStorage.getItem("alqora-user");

        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
            return;
          } catch {
            setUser(null);
          }
        }
      }
    }
  }, [clearAuth]);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await loginUser(
        email,
        password
      );

      if (!response?.success) {
        return {
          success: false,
          error:
            response?.error || "Login failed",
        };
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "alqora-user",
        JSON.stringify(response.user)
      );

      setUser(response.user);

      return { success: true };
    } catch {
      return {
        success: false,
        error: "Login failed",
      };
    }
  };

  const googleLogin = (
    userData: User,
    token: string
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem(
      "alqora-user",
      JSON.stringify(userData)
    );
    setUser(userData);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await registerUser(
        name,
        email,
        password
      );

      if (!response?.success) {
        return {
          success: false,
          error:
            response?.error ||
            "Registration failed",
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: "Registration failed",
      };
    }
  };

  const logout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const cachedUser =
            localStorage.getItem("alqora-user");

          // hydrate instantly from cache first
          if (cachedUser) {
            try {
              setUser(JSON.parse(cachedUser));
            } catch {
              localStorage.removeItem("alqora-user");
            }
          }
        }

        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};
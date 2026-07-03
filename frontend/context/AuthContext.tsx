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
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const refreshUser = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

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
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("alqora-user");
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Failed to restore auth session:",
        error
      );
      localStorage.removeItem("token");
      localStorage.removeItem("alqora-user");
      setUser(null);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response =
        await loginUser(email, password);

      if (!response.success) {
        return {
          success: false,
          error: response.error,
        };
      }

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "alqora-user",
        JSON.stringify(response.user)
      );

      setUser(response.user);

      return {
        success: true,
      };
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
      const response =
        await registerUser(
          name,
          email,
          password
        );

      if (!response.success) {
        return {
          success: false,
          error: response.error,
        };
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("alqora-user");
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setIsLoading(false);
    };

    initAuth();
  }, []);

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
"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Demo user for mock authentication
const DEMO_USER: User = {
  id: "demo-user-001",
  email: "demo@tourguide.app",
  name: "Demo User",
  avatar: undefined,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("demo-auth-user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on client only
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("demo-auth-user");
      if (saved) setUser(JSON.parse(saved));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const loggedInUser = { ...DEMO_USER, email };
    setUser(loggedInUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("demo-auth-user", JSON.stringify(loggedInUser));
    }
    setIsLoading(false);
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser = { ...DEMO_USER, email, name };
      setUser(newUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("demo-auth-user", JSON.stringify(newUser));
      }
      setIsLoading(false);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo-auth-user");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

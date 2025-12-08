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
  resetPassword: (email: string) => Promise<void>; // ← added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock user for demo
const DEMO_USER: User = {
  id: "demo-user-001",
  email: "demo@tourguide.app",
  name: "Demo User",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({ ...DEMO_USER, email });
        setIsLoading(false);
        resolve();
      }, 800);
    });
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setUser({ id: "new-user", email, name });
          setIsLoading(false);
          resolve();
        }, 800);
      });
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // ✅ Forgot password mock function
  const resetPassword = async (email: string) => {
    setIsLoading(true);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === DEMO_USER.email) {
          console.log("Mock reset link sent to:", email);
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error("Email not found"));
        }
      }, 1200);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword, // ← added here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

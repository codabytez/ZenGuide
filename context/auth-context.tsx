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

  resetRequest: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Mock user for demo only
const DEMO_USER: User = {
  id: "demo-user-001",
  email: "demo@tourguide.app",
  name: "Demo User",
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------------------
  // LOGIN
  // -------------------------------------------
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

  // -------------------------------------------
  // SIGNUP
  // -------------------------------------------
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

  // -------------------------------------------
  // LOGOUT
  // -------------------------------------------
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // -------------------------------------------
  // PASSWORD RESET — STEP 1: SEND OTP
  // -------------------------------------------
  const resetRequest = async (email: string) => {
    setIsLoading(true);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!email) {
          setIsLoading(false);
          reject(new Error("Invalid email"));
          return;
        }

        // mock: store email & otp locally
        localStorage.setItem("reset_email", email);
        localStorage.setItem("otp", "123456");

        setIsLoading(false);
        resolve();
      }, 800);
    });
  };

  // -------------------------------------------
  // PASSWORD RESET — STEP 2: VERIFY OTP
  // -------------------------------------------
  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);

    return new Promise<void>((resolve, reject) => {
      const storedEmail = localStorage.getItem("reset_email");
      const storedOtp = localStorage.getItem("otp");

      setTimeout(() => {
        if (email === storedEmail && otp === storedOtp) {
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error("Invalid OTP"));
        }
      }, 800);
    });
  };

  // -------------------------------------------
  // PASSWORD RESET — STEP 3: SAVE NEW PASSWORD
  // -------------------------------------------
  const resetPassword = async (email: string, newPassword: string) => {
    setIsLoading(true);

    return new Promise<void>((resolve, reject) => {
      const storedEmail = localStorage.getItem("reset_email");

      setTimeout(() => {
        if (email === storedEmail) {
          // cleanup mock storage
          localStorage.removeItem("otp");
          localStorage.removeItem("reset_email");

          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error("Password reset failed"));
        }
      }, 800);
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
        resetRequest,
        verifyOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

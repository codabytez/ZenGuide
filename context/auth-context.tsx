"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoading: boolean;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

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
        isLoading,
        resetRequest,
        verifyOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

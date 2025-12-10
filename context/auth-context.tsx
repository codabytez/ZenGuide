"use client";

import React, { createContext, useContext, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type AuthContextType = {
  requestPasswordReset: (email: string) => Promise<void>;
  verifyResetOtp: (email: string, code: string) => Promise<void>;
  resetPassword: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
};

// FIX: default value must NOT be null, use undefined type union.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const requestResetMutation = useMutation(api.reset.requestReset);
  const verifyOtpMutation = useMutation(api.reset.verifyOtp);
  const resetPasswordMutation = useMutation(api.reset.resetPassword);

  const [isLoading, setIsLoading] = useState(false);

  async function requestPasswordReset(email: string) {
    setIsLoading(true);
    try {
      await requestResetMutation({ email });
      toast.success("Reset OTP sent to your email.");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyResetOtp(email: string, code: string) {
    setIsLoading(true);
    try {
      await verifyOtpMutation({ email, code });
      toast.success("OTP verified!");
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(email: string, password: string) {
    setIsLoading(true);
    try {
      await resetPasswordMutation({ email, newPassword: password });
      toast.success("Password updated successfully.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        requestPasswordReset,
        verifyResetOtp,
        resetPassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  // FIX: Throw correct error if provider missing
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}

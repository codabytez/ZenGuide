"use client";

import React, { createContext, useContext, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import bcrypt from "bcryptjs";
import { toast } from "sonner"; // adjust to your toast lib if different

type AuthContextType = {
  requestPasswordReset: (email: string) => Promise<void>;
  verifyResetOtp: (email: string, code: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const requestReset = useMutation(api.reset.requestReset);
  const verifyOtp = useMutation(api.reset.verifyOtp);
  const resetPasswordMutation = useMutation(api.reset.resetPassword);

  const [isLoading, setIsLoading] = useState(false);

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      await requestReset({ email });
      toast.success("If that email exists, an OTP was sent (check dev logs).");
    } catch (err: any) {
      toast.error(err.message || "Unable to request reset.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetOtp = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      await verifyOtp({ email, code });
      toast.success("OTP verified.");
    } catch (err: any) {
      toast.error(err.message || "Invalid or expired OTP.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // hash password on client (bcryptjs)
      const hash = await bcrypt.hash(newPassword, 10);
      await resetPasswordMutation({ email, newPasswordHash: hash });
      toast.success("Password reset successfully.");
    } catch (err: any) {
      toast.error(err.message || "Unable to reset password.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

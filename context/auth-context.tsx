"use client";

import React, { createContext, useContext, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const requestReset = useMutation(api.reset.requestReset);
  const verifyOtp = useMutation(api.reset.verifyOtp);
  const resetPasswordMutation = useMutation(api.reset.resetPassword);

  const [isLoading, setIsLoading] = useState(false);

  async function requestPasswordReset(email) {
    setIsLoading(true);
    try {
      await requestReset({ email });
      toast.success("OTP sent to your email.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyResetOtp(email, code) {
    setIsLoading(true);
    try {
      await verifyOtp({ email, code });
      toast.success("OTP verified.");
    } catch (e) {
      toast.error(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(email, password) {
    setIsLoading(true);
    try {
      await resetPasswordMutation({ email, newPassword: password });
      toast.success("Password reset successful.");
    } catch (e) {
      toast.error(e.message);
      throw e;
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
};

export const useAuth = () => useContext(AuthContext);

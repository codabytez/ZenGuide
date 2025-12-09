"use client";

import { createContext, useContext, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// ----------------------------
// Types
// ----------------------------
interface AuthContextType {
  signup: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
  verifyResetOtp: (email: string, otp: string) => Promise<any>;
  resetPassword: (email: string, password: string) => Promise<any>;
  isLoading: boolean;
}

// Context MUST NOT be null anymore
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------------
// Provider
// ----------------------------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Convex API calls
  const requestReset = useMutation(api.reset.requestReset);
  const verifyOtp = useQuery(api.reset.verifyOtp);
  const doReset = useMutation(api.reset.resetPassword);

  const getUserByEmail = useQuery(api.users.getUserByEmail);
  const getPasswordHash = useQuery(api.users.getPasswordHash);
  const setPasswordHash = useMutation(api.users.setPasswordHash);

  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------
  // SIGNUP
  // ----------------------------
  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);

    const bcrypt = (await import("bcryptjs")).default;
    const hash = await bcrypt.hash(password, 10);

    // Does user exist?
    const existing = await getUserByEmail({ email });
    if (existing) throw new Error("User already exists");

    // Create user
    await setPasswordHash({
      userId: existing?._id,
      passwordHash: hash,
    });

    setIsLoading(false);
  };

  // ----------------------------
  // LOGIN
  // ----------------------------
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    const bcrypt = (await import("bcryptjs")).default;

    const user = await getUserByEmail({ email });
    if (!user) throw new Error("Invalid credentials");

    const stored = await getPasswordHash({ userId: user._id });
    if (!stored?.passwordHash) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, stored.passwordHash);
    if (!match) throw new Error("Invalid credentials");

    setIsLoading(false);
    return user;
  };

  // ----------------------------
  // REQUEST OTP
  // ----------------------------
  const requestPasswordReset = async (email: string) => {
    return await requestReset({ email });
  };

  // ----------------------------
  // VERIFY OTP
  // ----------------------------
  const verifyResetOtp = async (email: string, otp: string) => {
    return await verifyOtp({ email, otp });
  };

  // ----------------------------
  // RESET PASSWORD
  // ----------------------------
  const resetPassword = async (email: string, password: string) => {
    setIsLoading(true);
    const bcrypt = (await import("bcryptjs")).default;

    const hash = await bcrypt.hash(password, 10);

    const user = await getUserByEmail({ email });
    if (!user) throw new Error("User not found");

    await setPasswordHash({
      userId: user._id,
      passwordHash: hash,
    });

    await doReset({ email, newPassword: password });

    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
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

// ----------------------------
// Hook
// ----------------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

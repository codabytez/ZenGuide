"use client";

import { createContext, useContext, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // QUERIES
  const getUserByEmail = useQuery(api.users.getUserByEmail);
  const getPasswordHash = useQuery(api.users.getPasswordHash);

  // MUTATIONS
  const setPasswordHash = useMutation(api.users.setPasswordHash);
  const requestReset = useMutation(api.reset.requestReset);
  const verifyOtpMutation = useMutation(api.reset.verifyOtp);
  const resetPasswordMutation = useMutation(api.reset.resetPassword);

  const [isLoading, setIsLoading] = useState(false);

  // SIGNUP
  async function signup(email, password) {
    setIsLoading(true);

    const bcrypt = (await import("bcryptjs")).default;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await getUserByEmail({ email });
    if (!user) {
      setIsLoading(false);
      throw new Error("User was not created automatically via Convex Auth.");
    }

    await setPasswordHash({
      userId: user._id,
      passwordHash,
    });

    setIsLoading(false);
  }

  // LOGIN
  async function login(email, password) {
    setIsLoading(true);

    const user = await getUserByEmail({ email });
    if (!user) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }

    const stored = await getPasswordHash({ userId: user._id });
    if (!stored) {
      setIsLoading(false);
      throw new Error("Password not set");
    }

    const bcrypt = (await import("bcryptjs")).default;
    const match = await bcrypt.compare(password, stored.passwordHash);

    if (!match) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }

    setIsLoading(false);
    return user;
  }

  // REQUEST RESET
  async function requestPasswordReset(email) {
    return await requestReset({ email });
  }

  // VERIFY OTP
  async function verifyResetOtp(email, code) {
    return await verifyOtpMutation({ email, code });
  }

  // RESET PASSWORD
  async function resetPassword(email, newPassword) {
    setIsLoading(true);

    const user = await getUserByEmail({ email });
    if (!user) {
      setIsLoading(false);
      throw new Error("Account not found");
    }

    const bcrypt = (await import("bcryptjs")).default;
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await setPasswordHash({
      userId: user._id,
      passwordHash,
    });

    await resetPasswordMutation({ email, newPassword });

    setIsLoading(false);
  }

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
}

export const useAuth = () => useContext(AuthContext);

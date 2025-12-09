"use client";

import { createContext, useContext, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import bcrypt from "bcryptjs";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // QUERIES
  const getUserByEmail = useQuery(api.users.getUserByEmail);
  const getPasswordHash = useQuery(api.users.getPasswordHash);

  // MUTATIONS
  const setPasswordHash = useMutation(api.users.setPasswordHash);
  const requestReset = useMutation(api.reset.requestReset);
  const verifyOtp = useMutation(api.reset.verifyOtp);
  const resetPasswordMutation = useMutation(api.reset.resetPassword);

  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------
  // SIGN UP
  // -----------------------------
  async function signup(email, password) {
    setIsLoading(true);

    // Create Convex Auth user automatically
    const user = await getUserByEmail({ email });
    if (user) {
      setIsLoading(false);
      throw new Error("Account already exists.");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create Convex auth user manually if needed (depends on your flow)
    // For now, we'll rely on your existing signup flow

    // Store hashed password
    await setPasswordHash({
      userId: user?._id, // If you have your own signup mutation, update this
      passwordHash,
    });

    setIsLoading(false);
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  async function login(email, password) {
    setIsLoading(true);

    // Step 1 — Check if user exists
    const user = await getUserByEmail({ email });
    if (!user) {
      setIsLoading(false);
      throw new Error("Invalid email or password.");
    }

    // Step 2 — Get stored password hash
    const passwordRow = await getPasswordHash({ userId: user._id });
    if (!passwordRow) {
      setIsLoading(false);
      throw new Error("No password set for this account.");
    }

    // Step 3 — Validate password
    const match = await bcrypt.compare(password, passwordRow.passwordHash);
    if (!match) {
      setIsLoading(false);
      throw new Error("Invalid email or password.");
    }

    setIsLoading(false);
    return user;
  }

  // -----------------------------
  // REQUEST OTP
  // -----------------------------
  async function requestPasswordReset(email) {
    return await requestReset({ email });
  }

  // -----------------------------
  // VERIFY OTP
  // -----------------------------
  async function verifyResetOtp(email, code) {
    return await verifyOtp({ email, code });
  }

  // -----------------------------
  // RESET PASSWORD
  // -----------------------------
  async function resetPassword(email, newPassword) {
    setIsLoading(true);

    // Step 1 — Fetch user
    const user = await getUserByEmail({ email });
    if (!user) {
      setIsLoading(false);
      throw new Error("Account not found.");
    }

    // Step 2 — Hash password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Step 3 — Save to userPasswords table
    await setPasswordHash({
      userId: user._id,
      passwordHash,
    });

    // Step 4 — Remove OTP via resetPassword mutation
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

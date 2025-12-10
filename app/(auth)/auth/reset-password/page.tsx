"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuth();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      // use your toast lib
      alert("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await resetPassword(email, password);
      router.push("/auth/reset-password/success");
    } catch {
      // handled in context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>

        <Input
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Confirm password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}

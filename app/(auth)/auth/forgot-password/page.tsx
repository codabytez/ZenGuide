"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset, isLoading } = useAuth();
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await requestPasswordReset(email);
    router.push(`/auth/forgot-password/verify-otp?email=${email}`);
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Forgot Password</h1>

      <Input
        type="email"
        required
        value={email}
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button disabled={isLoading} className="w-full">
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  );
}

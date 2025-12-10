"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { requestPasswordReset, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      router.push(`/auth/forgot-password/verify-otp?email=${encodeURIComponent(email)}`);
    } catch {
      // toast already shown in context, optionally show more
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <Input
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}

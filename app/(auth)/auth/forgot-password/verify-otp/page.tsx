"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyOtp() {
  const { verifyResetOtp, isLoading } = useAuth();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [code, setCode] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await verifyResetOtp(email, code);
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch {
      // toast shown in context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Verify OTP</h1>
        <Input
          type="text"
          placeholder="6-digit code"
          value={code}
          maxLength={6}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  );
}

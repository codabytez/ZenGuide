"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyOtp() {
  const { verifyResetOtp, isLoading } = useAuth();

  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [code, setCode] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await verifyResetOtp(email, code);
    window.location.href = `/auth/reset-password?email=${email}`;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-8">
      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold">Verify OTP</h1>

        <Input
          type="text"
          placeholder="Enter 6-digit code"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </div>
  );
}

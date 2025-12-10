"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const router = useRouter();

  const { verifyResetOtp, isLoading } = useAuth();
  const [code, setCode] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await verifyResetOtp(email, code);
    router.push(`/auth/reset-password?email=${email}`);
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Verify OTP</h1>

      <Input
        required
        placeholder="Enter OTP"
        value={code}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCode(e.target.value)
        }
      />

      <Button disabled={isLoading} className="w-full">
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
    </form>
  );
}

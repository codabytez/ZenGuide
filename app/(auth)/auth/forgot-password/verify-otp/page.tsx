"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  const { verifyResetOtp, isLoading } = useAuth();
  const [code, setCode] = useState("");

  async function submit(e) {
    e.preventDefault();
    await verifyResetOtp(email, code);
    router.push(`/auth/reset-password?email=${email}`);
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Verify OTP</h1>
      <Input
        placeholder="Enter OTP"
        value={code}
        onChange={e => setCode(e.target.value)}
        required
      />
      <Button disabled={isLoading} className="w-full">
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
    </form>
  );
}

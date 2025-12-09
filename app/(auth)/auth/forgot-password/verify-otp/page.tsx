"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VerifyOtp() {
  const router = useRouter();
  const search = useSearchParams();
  const email = search.get("email");
  const { verifyOtp, isLoading } = useAuth();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Email is missing");
        return;
      }
      await verifyOtp(email, otp);
      router.push("/auth/reset-password?email=" + email);
    } catch {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-display font-bold mb-2">Verify OTP</h1>
        <p className="text-muted-foreground mb-6">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            required
          />

          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}

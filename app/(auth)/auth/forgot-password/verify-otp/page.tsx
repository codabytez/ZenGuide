"use client";

import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function VerifyOtp() {
  const { verifyOtp, isLoading } = useAuth();
  const params = useSearchParams();
  const email = params.get("email");
  const [code, setCode] = useState("");

  async function submit(e) {
    e.preventDefault();
    await verifyOtp({ email, code });
    window.location.href = `/auth/reset-password?email=${email}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-4">Verify OTP</h1>
        <p className="text-muted-foreground">OTP sent to: {email}</p>

        <form className="space-y-4" onSubmit={submit}>
          <Input
            placeholder="123456"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

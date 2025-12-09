"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const { requestReset, isLoading } = useAuth();
  const [email, setEmail] = useState("");

  async function submit(e) {
    e.preventDefault();
    await requestReset({ email });
    window.location.href = `/auth/forgot-password/verify-otp?email=${email}`;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-8">
      <motion.div
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Forgot Password</h1>

        <form className="space-y-4" onSubmit={submit}>
          <Input
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

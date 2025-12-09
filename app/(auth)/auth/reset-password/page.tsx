"use client";

import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const { resetPassword, isLoading } = useAuth();
  const params = useSearchParams();
  const email = params.get("email");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    await resetPassword(email, password);
    window.location.href = "/auth/reset-password/success";
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-8">
      <motion.div
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Reset Password</h1>

        <form className="space-y-4" onSubmit={submit}>
          <Input
            type="password"
            placeholder="New password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

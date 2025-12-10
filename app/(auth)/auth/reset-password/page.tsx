"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const router = useRouter();

  const { resetPassword, isLoading } = useAuth();
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await resetPassword(email, password);
    router.push("/auth/login");
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Set New Password</h1>

      <Input
        type="password"
        required
        value={password}
        placeholder="New password"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />

      <Button disabled={isLoading} className="w-full">
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}

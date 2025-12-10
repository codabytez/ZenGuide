"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email");

  const { resetPassword, isLoading } = useAuth();
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    await resetPassword(email, password);
    router.push("/auth/login");
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Set New Password</h1>
      <Input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button disabled={isLoading} className="w-full">
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}

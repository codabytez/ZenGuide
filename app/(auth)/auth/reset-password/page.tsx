"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResetPassword() {
  const search = useSearchParams();
  const email = search.get("email");
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pw1 !== pw2) return toast.error("Passwords do not match");

    try {
      if (!email) {
        toast.error("Email is missing");
        return;
      }
      await resetPassword(email, pw1);
      router.push("/auth/reset-password/success");
    } catch {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-display font-bold mb-2">Reset Password</h1>
        <p className="text-muted-foreground mb-6">
          Create a new password for <strong>{email}</strong>
        </p>

        <form onSubmit={submit} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Confirm password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            required
          />

          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

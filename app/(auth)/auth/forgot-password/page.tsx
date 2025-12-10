"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const { resetRequest, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await resetRequest(email);
      router.push("/auth/forgot-password/verify-otp?email=" + email);
    } catch {
      toast.error("Unable to send reset code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <h1 className="text-3xl font-display font-bold mb-2">Forgot Password</h1>
        <p className="text-muted-foreground mb-6">
          Enter your email to receive an OTP code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1.5"
            />
          </div>

          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send OTP Code"}
          </Button>
        </form>
      </div>
    </div>
  );
}

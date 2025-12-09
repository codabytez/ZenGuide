"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResetSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-display font-bold">Password Reset</h1>
        <p className="text-muted-foreground">
          Your password has been successfully updated.
        </p>

        <Link href="/auth/login">
          <Button className="mt-4 w-full">Go to Login</Button>
        </Link>
      </div>
    </div>
  );
}

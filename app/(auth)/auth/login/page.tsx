"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const Login: React.FC = () => {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await login(email, password);
//       toast.success("Welcome back!");
//       router.push("/dashboard");
//     } catch (error) {
//       toast.error("Login failed");
//     }
//   };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const toastId=toast.loading("Signing in...");
    try {
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      });
      toast.success("Login successful", { id: toastId });
      // Use window.location for full page reload to sync auth state
      window.location.href = "/dashboard";
    } catch (err) {
      const friendlyMessage = getAuthErrorMessage(err);
    setError(friendlyMessage);
    toast.error(friendlyMessage, { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              TourGuide
            </span>
          </div>

          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>



          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1.5"
              />
            </div>

            {/* ✅ Corrected Forgot Password link */}
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline block"
            >
              Forgot Password?
            </Link>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Decoration */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-primary/10 via-accent/10 to-primary/5 items-center justify-center p-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-32 h-32 rounded-full bg-linear-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center">
            <Compass className="w-16 h-16 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Create Amazing Tours
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Build interactive onboarding experiences that engage and convert
            your users.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

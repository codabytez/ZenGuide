"use client";
import React, { useState } from "react";
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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Eye, EyeOff } from 'lucide-react'

const Signup: React.FC = () => {
    const { signIn } = useAuthActions();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Import the checkEmailExists query
     const emailExists = useQuery(api.users.checkEmailExists, email ? { email } : "skip");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const toastId = toast.loading("Creating account...");

        try {
            // Check if email already exists
            if (emailExists) {
                throw new Error("USER_ALREADY_EXISTS");
            }

            await signIn("password", {
                email,
                password,
                name,
                flow: "signUp",
            });

            toast.success("Account created successfully!", { id: toastId });
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
            {/* Left Panel - Decoration */}
            <div className="hidden lg:flex flex-1 bg-linear-to-br from-accent/10 via-primary/10 to-accent/5 items-center justify-center p-12">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-accent to-primary mx-auto mb-6 flex items-center justify-center">
                        <Compass className="w-16 h-16 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                        Join ZenGuide
                    </h2>
                    <p className="text-muted-foreground max-w-sm">
                        Start creating beautiful onboarding tours in minutes. No credit card
                        required.
                    </p>
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, x: 20 }}
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
                        <div className="w-10 h-10 flex items-center justify-center">
                            <div className="relative w-15 h-15 shrink-0">
                                <Image
                                src="/images/image.png"    
                                alt="ZenGuide Logo"
                                fill               
                                className="object-contain"
                                priority             
                                />
                            </div>
                        </div>
                        <span className="font-display font-bold text-xl text-foreground">
                            ZenGuide
                        </span>
                    </div>

                    <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                        Create an account
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Get started with ZenGuide for free
                    </p>



                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Zen Guide"
                                required
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="zen@example.com"
                                required
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative mt-1.5">
                            <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="pr-10"
                            />
                            <button
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                            </button>
                        </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create account"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
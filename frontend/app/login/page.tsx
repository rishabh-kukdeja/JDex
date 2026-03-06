"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Chrome } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignup, setIsSignup] = useState(false);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!email || !password) {
                throw new Error("Please fill in all fields");
            }

            if (isSignup) {
                // Sign up
                const { createUserWithEmailAndPassword } = await import("firebase/auth");
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                // Sign in
                await signInWithEmailAndPassword(auth, email, password);
            }

            // Redirect to dashboard on successful authentication
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        try {
            await signInWithPopup(auth, googleProvider);
            // Redirect to dashboard on successful authentication
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Google sign-in failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-lg border-primary/20">
                    <CardHeader className="space-y-2 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <LogIn className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl">Welcome Back</CardTitle>
                        <CardDescription>
                            {isSignup ? "Create your account to get started" : "Sign in to your account to continue"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {/* Email and Password Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 font-semibold py-6"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2 animate-pulse">
                                        <LogIn className="w-4 h-4 animate-spin" /> {isSignup ? "Creating account..." : "Signing in..."}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <LogIn className="w-4 h-4" /> {isSignup ? "Create Account" : "Sign In"}
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-muted"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full py-6 font-semibold border-primary/20 hover:bg-primary/5"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <Chrome className="w-4 h-4 mr-2" />
                            Sign in with Google
                        </Button>

                        {/* Toggle Section */}
                        <div className="text-center text-sm text-muted-foreground">
                            {isSignup ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSignup(false);
                                            setError(null);
                                        }}
                                        className="text-primary hover:underline font-semibold"
                                    >
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSignup(true);
                                            setError(null);
                                        }}
                                        className="text-primary hover:underline font-semibold"
                                    >
                                        Create one
                                    </button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Note */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}

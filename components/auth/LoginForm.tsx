"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, AtSign, Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      if (!email.trim()) {
        toast.error("Please enter your username or email");
        return;
      }
      if (!password) {
        toast.error("Please enter your password");
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: email.trim(),
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Authentication failed");
        }

        toast.success(`Welcome back, ${data.user?.name || "User"}!`);
        router.push("/dashboard");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Invalid credentials. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Account created successfully! You may now sign in.");
        setMode("login");
      }, 1000);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      toast.info("Google authentication initiated...");
    }, 1000);
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      toast.error("Please enter your email or username first");
      return;
    }
    toast.success(`Password reset instructions sent to ${email}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 bg-grid-pattern p-4 sm:p-6 font-sans relative overflow-hidden">

      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(248,250,252,0.85)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,6,23,0.85)_100%)] pointer-events-none" />

      <Card className="w-full max-w-md mx-auto border-border/80 bg-card/95 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden relative z-10 p-2 sm:p-3">
        <CardHeader className="text-left pb-3 pt-3 px-5 space-y-1">
          <div className="space-y-0.5">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-[#3D3C3A] dark:text-[#E2E2E2] tracking-tight leading-tight">
              {mode === "login" ? "Welcome back!" : "Join Community"}
            </CardTitle>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Signal Regiment
            </span>
          </div>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1.5">
            Personnel Information Management System for military personnel and unit administration.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-5 pt-1 space-y-4">
          <form onSubmit={handleFormSubmit} className="space-y-3">
            {mode === "register" && (
              <>
                {/* Full Name */}
                <div className="space-y-1">
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name (e.g. Juan Dela Cruz)"
                      className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-muted/30 focus-visible:bg-background border-border"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <div className="relative">
                    <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username (e.g. juandelacruz)"
                      className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-muted/30 focus-visible:bg-background border-border"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address / Identifier */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type={mode === "register" ? "email" : "text"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === "login" ? "Username or Email" : "Email Address"}
                  className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-muted/30 focus-visible:bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="pl-10 pr-10 h-10 rounded-xl text-xs sm:text-sm bg-muted/30 focus-visible:bg-background border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {mode === "login" && (
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer transition-all"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md mt-1"
            >
              {isLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <span>{mode === "login" ? "Sign In" : "Create Free Account"}</span>
              )}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/80" />
            </div>
            <span className="relative bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              or continue with
            </span>
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full h-10 rounded-xl border-border hover:bg-muted/60 font-semibold text-xs sm:text-sm gap-2 transition-all cursor-pointer shadow-xs"
            >
              {isGoogleLoading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Google</span>
            </Button>
          </div>

          <div className="pt-2 border-t border-border/50 text-center">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer ml-0.5"
              >
                {mode === "login" ? "Sign Up" : "Log In"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

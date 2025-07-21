"use client";

import type React from "react";
import { Baby, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { signInWithGoogle } from "@/src/lib/auth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {};

  const handleGoogleLogin = async () => {
    signInWithGoogle()
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        router.push("/babies");
      });
  };

  const handleAppleLogin = async () => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-pink-200">
        <CardHeader className="text-center bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-t-lg">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Baby className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to BabyBuddy
          </CardTitle>
          <p className="text-pink-100 text-sm">
            Track your baby's journey with love
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Toggle Login/Signup */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={isLogin ? "default" : "ghost"}
              onClick={() => setIsLogin(true)}
              className={`flex-1 ${
                isLogin ? "bg-pink-500 text-white" : "text-gray-600"
              }`}
            >
              Sign In
            </Button>
            <Button
              variant={!isLogin ? "default" : "ghost"}
              onClick={() => setIsLogin(false)}
              className={`flex-1 ${
                !isLogin ? "bg-pink-500 text-white" : "text-gray-600"
              }`}
            >
              Sign Up
            </Button>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required={!isLogin}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="pl-10 border-pink-200 focus:border-pink-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="pl-10 pr-10 border-pink-200 focus:border-pink-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              {isLoading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={handleAppleLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Continue with Apple
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui";
import { createClient } from "@/src/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "@/src/components/auth/otp-input";
import ResendButton from "@/src/components/auth/otp-resend-button";
import OtpTips from "@/src/components/auth/otp-tips";
import OtpSuccess from "@/src/components/auth/otp-success";

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter all 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

const OTPVerificationScreen = () => {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const urlEmail = searchParams.get("email");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setEmail] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = watch("otp");

  // Prefill email from localStorage if present
  useEffect(() => {
    if (userEmail) {
      return;
    }

    if (urlEmail) {
      setEmail(urlEmail);
      window.localStorage.setItem("bb_email", urlEmail);
      // remove email from url
      router.replace("/otp-confirmation");
    } else {
      router.push("/login");
    }
  }, [urlEmail, userEmail, router]);

  const onSubmit = async (data: OtpFormData) => {
    setIsVerifying(true);

    const { error } = await supabase.auth.verifyOtp({
      email: userEmail ?? "",
      token: data.otp,
      type: "email",
    });

    if (error) {
      setValue("otp", "");
    } else {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }

    setIsVerifying(false);
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setResendCooldown(60);

    await supabase.auth.resend({ type: "signup", email: userEmail ?? "" });

    setIsResending(false);
  };

  const handleOtpChange = (value: string) => {
    setValue("otp", value);
  };

  if (showSuccess) {
    return <OtpSuccess />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-blue-400 to-purple-400 text-white p-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Enter Verification Code
          </CardTitle>
          <p className="text-blue-100 text-sm mt-2">
            We've sent a 6-digit code to your email
          </p>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <OtpInput
              value={otpValue}
              onChange={handleOtpChange}
              onKeyDown={() => {}}
              onPaste={() => {}}
              disabled={isVerifying}
              error={errors.otp?.message}
            />

            <Button
              type="submit"
              disabled={isVerifying || otpValue.length !== 6 || !userEmail}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>

          <ResendButton
            onResend={handleResendOTP}
            isResending={isResending}
            resendCooldown={resendCooldown}
          />

          <OtpTips />

          <div className="pt-4 border-t border-gray-100">
            <Button
              onClick={() => router.push("/login")}
              variant="ghost"
              className="w-full text-gray-600 hover:bg-gray-50 rounded-xl h-12 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Loading component for Suspense fallback
const LoadingOTP = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-blue-400 to-purple-400 text-white p-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Wrapped component with Suspense
const OTPVerificationPage = () => {
  return (
    <Suspense fallback={<LoadingOTP />}>
      <OTPVerificationScreen />
    </Suspense>
  );
};

export default OTPVerificationPage;

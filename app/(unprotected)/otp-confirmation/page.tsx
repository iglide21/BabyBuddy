"use client";

import React, { useState, useEffect } from "react";
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/src/components/ui";
import { createClient } from "@/src/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

// Validation schema for OTP
const otpSchema = z.object({
  otp: z.string().length(6, "Please enter all 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

// Success component
const SuccessScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white rounded-3xl overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-r from-green-400 to-green-500 text-white p-8">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <CheckCircle className="w-10 h-10 text-white animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Verification Successful!
        </CardTitle>
        <p className="text-green-100 text-sm mt-2">Welcome to BabyBuddy</p>
      </CardHeader>

      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h3>
            <p className="text-gray-600 text-sm">
              You've been successfully signed in.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-1 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// OTP Input component
const OtpInput = ({
  value,
  onChange,
  onKeyDown,
  onPaste,
  disabled,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  disabled: boolean;
  error?: string;
}) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow digits
    if (inputValue && !/^\d$/.test(inputValue)) return;

    const currentOtp = value.split("");
    currentOtp[index] = inputValue;
    const newOtp = currentOtp.join("");
    onChange(newOtp);

    // Auto-focus next input
    if (inputValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    onKeyDown(e);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      onChange(pastedData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Input
            key={index}
            ref={(el) => {
              if (el) {
                inputRefs.current[index] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-0"
            disabled={disabled}
          />
        ))}
      </div>

      {error && (
        <div className="text-center">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

// Resend button component
const ResendButton = ({
  onResend,
  isResending,
  resendCooldown,
}: {
  onResend: () => void;
  isResending: boolean;
  resendCooldown: number;
}) => (
  <div className="text-center space-y-3">
    <p className="text-xs text-gray-500">Didn't receive the code?</p>

    <Button
      onClick={onResend}
      disabled={isResending || resendCooldown > 0}
      variant="ghost"
      className="text-blue-600 hover:bg-blue-50 font-medium"
    >
      {isResending ? (
        <>
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Sending...
        </>
      ) : resendCooldown > 0 ? (
        <>Resend in {resendCooldown}s</>
      ) : (
        <>
          <RefreshCw className="w-4 h-4 mr-2" />
          Resend Code
        </>
      )}
    </Button>
  </div>
);

// Tips component
const TipsSection = () => (
  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
    <h4 className="font-semibold text-yellow-800 mb-2 text-sm flex items-center gap-2">
      💡 Tips
    </h4>
    <ul className="text-xs text-yellow-700 space-y-1">
      <li>• Check your spam or junk folder</li>
      <li>• The code expires in 10 minutes</li>
      <li>• You can paste the code from your clipboard</li>
    </ul>
  </div>
);

// Utility function to mask email
const maskEmail = (email: string) => {
  const [username, domain] = email.split("@");
  if (username.length <= 2) return email;

  const maskedUsername =
    username[0] +
    "*".repeat(username.length - 2) +
    username[username.length - 1];
  return `${maskedUsername}@${domain}`;
};

const OTPVerificationScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const supabase = createClient();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
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

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async (data: OtpFormData) => {
    setIsVerifying(true);

    // const supabase = await createClient();
    // const { error } = await supabase.auth.verifyOtp({
    //   email: email ?? "",
    //   token: data.otp,
    //   type: "email",
    // });

    const error = null;

    if (error) {
      setValue("otp", "");
      // The error will be handled by the form validation
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
    setResendCooldown(60); // 60 second cooldown

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email ?? "",
    });
  };

  const handleOtpChange = (value: string) => {
    setValue("otp", value);
  };

  if (showSuccess) {
    return <SuccessScreen />;
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
            {/* Email Display */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">Code sent to:</p>
              <p className="font-semibold text-blue-600 mt-1">
                {maskEmail(email ?? "")}
              </p>
            </div>

            {/* OTP Input */}
            <OtpInput
              value={otpValue}
              onChange={handleOtpChange}
              onKeyDown={() => {}}
              onPaste={() => {}}
              disabled={isVerifying}
              error={errors.otp?.message}
            />

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isVerifying || otpValue.length !== 6}
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

          {/* Resend Code */}
          <ResendButton
            onResend={handleResendOTP}
            isResending={isResending}
            resendCooldown={resendCooldown}
          />

          {/* Tips */}
          <TipsSection />

          {/* Back Button */}
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

export default OTPVerificationScreen;

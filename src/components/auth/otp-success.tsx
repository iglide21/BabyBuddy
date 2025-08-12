"use client";

import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";

export const OtpSuccess = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white rounded-3xl overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-r from-green-400 to-green-500 text-white p-8">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <CheckCircle className="w-10 h-10 text-white animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Verification Successful!
        </CardTitle>
        <p className="text-green-100 text-sm mt-2">Welcome to BabyMax</p>
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

export default OtpSuccess;

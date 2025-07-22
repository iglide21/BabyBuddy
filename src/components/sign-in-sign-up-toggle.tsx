"use client";

import { Button } from "./ui/button";
import { useState } from "react";

const SignUpSignInToggle = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
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
  );
};

export default SignUpSignInToggle;

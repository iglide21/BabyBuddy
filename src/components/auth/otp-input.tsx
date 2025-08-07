"use client";

import * as React from "react";
import { Input } from "@/src/components/ui";

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  disabled: boolean;
  error?: string;
};

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onKeyDown,
  onPaste,
  disabled,
  error,
}) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, inputValue: string) => {
    if (inputValue && !/^\d$/.test(inputValue)) return;

    const currentOtp = value.split("");
    currentOtp[index] = inputValue;
    const newOtp = currentOtp.join("");
    onChange(newOtp);

    if (inputValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
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

export default OtpInput;

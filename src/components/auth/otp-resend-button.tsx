"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui";

export type ResendButtonProps = {
  onResend: () => void;
  isResending: boolean;
  resendCooldown: number;
};

const ResendButton: React.FC<ResendButtonProps> = ({
  onResend,
  isResending,
  resendCooldown,
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

export default ResendButton;


import React, { useState, useEffect, useRef } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface OTPVerificationProps {
  email: string;
  onVerify: (verified: boolean) => void;
  onResend: () => void;
  isLoading?: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  isLoading = false,
}) => {
  const [value, setValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const [isVerifying, setIsVerifying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    if (value.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    setIsVerifying(true);
    
    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simple validation - in real app would verify against backend
      if (value === "123456") {
        toast.success("OTP verified successfully");
        onVerify(true);
      } else {
        toast.error("Invalid OTP code");
        onVerify(false);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Failed to verify OTP");
      onVerify(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    // Reset the timer
    setTimeLeft(120);
    
    // Clear existing interval
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Start new interval
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Call the resend callback
    onResend();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-orange-500/20 p-2 rounded-full">
          <AlertTriangle className="text-orange-500 h-5 w-5" />
        </div>
        <div>
          <h4 className="font-poppins font-bold">Security Verification Required</h4>
          <p className="text-sm text-gray-300">
            For your security, we've sent a verification code to <span className="font-mono">{email}</span>
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={setValue}
          disabled={isVerifying || isLoading}
          className="justify-center"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="bg-black/30" />
            <InputOTPSlot index={1} className="bg-black/30" />
            <InputOTPSlot index={2} className="bg-black/30" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="bg-black/30" />
            <InputOTPSlot index={4} className="bg-black/30" />
            <InputOTPSlot index={5} className="bg-black/30" />
          </InputOTPGroup>
        </InputOTP>
        
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
          {timeLeft > 0 ? (
            <p>Code expires in: {formatTime(timeLeft)}</p>
          ) : (
            <p>OTP code has expired</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1 border-white/20"
          disabled={timeLeft > 0 || isVerifying || isLoading}
          onClick={handleResend}
        >
          {timeLeft > 0 ? `Resend OTP (${formatTime(timeLeft)})` : "Resend OTP"}
        </Button>
        <Button
          className="flex-1 bg-orange-500 hover:bg-orange-600"
          disabled={value.length !== 6 || isVerifying || isLoading}
          onClick={handleVerify}
        >
          {isVerifying || isLoading ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verify OTP
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;

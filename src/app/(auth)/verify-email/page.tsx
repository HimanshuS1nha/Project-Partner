"use client";

import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  return (
    <>
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold">Verify</p>
        <p className="text-gray-700 text-sm">Verify your email</p>
      </div>

      <form className="flex flex-col gap-y-6 w-full">
        <div className="flex flex-col gap-y-2.5">
          <Label className="ml-1">OTP</Label>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex flex-col gap-y-2.5">
          <Button type="submit">Verify</Button>

          <Button variant={"link"}>Resend OTP</Button>
        </div>
      </form>
    </>
  );
};

export default VerifyEmail;

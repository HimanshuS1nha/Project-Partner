"use client";

import { Suspense, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { ZodError } from "zod";

import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { verifyEmailValidator } from "@/validators/verify-email-validator";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [otp, setOtp] = useState("");

  const { mutate: handleVerifyOtp, isPending } = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: async () => {
      const parsedData = await verifyEmailValidator.parseAsync({
        otp,
        email,
      });

      const { data } = await axios.post("/api/verify-email", { ...parsedData });

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setOtp("");
      router.replace("/login");
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });
  return (
    <>
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold">Verify</p>
        <p className="text-gray-700 text-sm">Verify your email</p>
      </div>

      <form
        className="flex flex-col gap-y-6 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyOtp();
        }}
      >
        <div className="flex flex-col gap-y-2.5">
          <Label className="ml-1">OTP</Label>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
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
          <Button type="submit" disabled={isPending}>
            {isPending ? "Please wait..." : "Verify"}
          </Button>

          <Button variant={"link"} disabled={isPending}>
            Resend OTP
          </Button>
        </div>
      </form>
    </>
  );
};

const Verify = () => {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
};

export default Verify;

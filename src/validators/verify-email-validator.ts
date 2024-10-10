import { z } from "zod";

export const verifyEmailValidator = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  otp: z
    .string({ required_error: "OTP is required" })
    .trim()
    .min(6, { message: "OTP must be atleast 8 characters long" }),
});

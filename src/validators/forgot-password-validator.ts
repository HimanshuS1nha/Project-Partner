import { z } from "zod";

export const forgotPasswordValidator = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
});

export type forgotPasswordValidatorType = z.infer<
  typeof forgotPasswordValidator
>;

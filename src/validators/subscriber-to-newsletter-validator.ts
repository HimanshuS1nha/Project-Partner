import { z } from "zod";

export const subscribeToNewsletterValidator = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
});

export type subscribeToNewsletterValidatorType = z.infer<
  typeof subscribeToNewsletterValidator
>;

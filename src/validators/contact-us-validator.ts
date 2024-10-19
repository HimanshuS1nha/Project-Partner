import { z } from "zod";

export const contactUsValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Please fill in the name field" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  subject: z
    .string({ required_error: "Subject is required" })
    .trim()
    .min(1, { message: "Please fill in the subject field" }),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, { message: "Please fill in the message field" }),
});

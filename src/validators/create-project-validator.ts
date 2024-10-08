import { z } from "zod";

export const createProjectValidator = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["Live", "Building"]),
});

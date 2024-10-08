import { z } from "zod";

export const createTaskValidatorServer = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["Pending", "Review", "Completed"]),
  startDate: z
    .string({ required_error: "Start Date is required" })
    .date("Please enter a valid start date"),
  endDate: z
    .string({ required_error: "End Date is required" })
    .date("Please enter a valid end date"),
  projectId: z
    .string({ required_error: "Project ID is required" })
    .trim()
    .min(1, { message: "Project ID is required" }),
});

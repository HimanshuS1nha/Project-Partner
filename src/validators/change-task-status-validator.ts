import { z } from "zod";

export const changeTaskStatusValidator = z.object({
  status: z.enum(["Pending", "Review", "Completed"]),
});

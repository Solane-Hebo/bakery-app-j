import { z } from "zod";

export const historyQuerySchema = z.object({
  range: z.enum(["day", "week", "month"]).default("day"),
})

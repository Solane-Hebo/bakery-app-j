import { z } from "zod"

export const createStaffSchema = z.object({
  name: z.string().min(1, "Name i requered").max(80),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  role: z.enum(["admin", "staff", "viewer"]).default("staff"),
})

export const updateStaffSchema = z
  .object({
    role: z.enum(["admin", "staff", "viewer"]).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

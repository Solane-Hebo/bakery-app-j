import { z } from "zod"

export const createContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long.")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase(),

  message: z
    .string()
    .min(5, "Message must be at least 5 characters.")
    .max(2000, "Message is too long.")
    .trim(),
})

export type CreateContactInput = z.infer<typeof createContactSchema>

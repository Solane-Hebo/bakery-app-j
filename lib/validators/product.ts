import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  description: z.string().max(500).optional().default(""),
  price: z.coerce.number().min(0),
  unit: z.string().max(20).optional().default("pcs"),
  currentStock: z.number().int().min(0).optional().default(0),
  lowStockThreshold: z.number().int().min(0).optional().default(5),
  imageUrl: z.string().optional().default("").refine(
    (val) => val === "" || /^https?:\/\/.+/.test(val),
    { message: "Invalid image URL" }
    ),
    isActive: z.boolean().optional().default(true),
 })

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.values(data).some(v => v !== undefined), {
    message: "No fields to update",
  })

export const stockAdjustSchema = z.object({
  type: z.enum(["IN", "OUT", "ADJUST"]),
  quantity: z.number().int(),
  note: z.string().max(200).optional().default(""),
})

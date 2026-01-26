import { z } from "zod";

export const createSaleSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  note: z.string().max(200).optional().default(""),
});

export const listSalesQuerySchema = z.object({
  from: z.string().optional(), // ISO date string
  to: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
})

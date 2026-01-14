import { z } from 'zod';

// export const registerSchema = z.object({
//     name: z.string().min(1, "Name is required").max(40, "Name is too long"),
//     email: z.email("Invalid email address"),
//     password: z.string().min(6, "Password must be at least 6 characters long"),
// })

export const loginSchema = z.object({
    email: z.email({
    message:"Invalid email address",
    }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})
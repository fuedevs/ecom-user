import { z } from 'zod'

export const LoginRequestSchema = z.object({
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(1),
})

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: z.any().optional(),
})

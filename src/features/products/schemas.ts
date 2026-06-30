import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().optional(),
  title: z.string().optional(),
  price: z.union([z.string(), z.number()]).optional(),
  thumbnail: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
})

export const ProductListSchema = z.object({
  data: z.array(ProductSchema).optional(),
  meta: z
    .object({
      current_page: z.number().optional(),
      last_page: z.number().optional(),
      per_page: z.number().optional(),
      total: z.number().optional(),
    })
    .optional(),
  links: z.any().optional(),
}).passthrough()

export type Product = z.infer<typeof ProductSchema>
export type ProductList = z.infer<typeof ProductListSchema>

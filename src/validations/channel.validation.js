import { z } from 'zod'

export const channelUpdateSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'name must be a string'
    })
    .min(3, 'name must be at least 3 characters')
    .max(50, 'name must be at most 50 characters')
    .trim()
    .optional()
})

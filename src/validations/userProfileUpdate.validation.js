import { z } from 'zod'

export const userProfileUpdateSchema = z.object({
  username: z
    .string({
      invalid_type_error: 'username must be a string'
    })
    .min(3, 'username must be at least 3 characters')
    .max(20, 'username must be at most 20 characters')
    .refine(
      (username) => /^[a-zA-Z0-9]+$/.test(username),
      'Username must contain only latters and numbers'
    )
    .optional(),

  avater: z
    .string({
      invalid_type_error: 'avater image must be a string'
    })
    .url('invalid url format')
    .optional()
})

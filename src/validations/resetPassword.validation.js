import { z } from 'zod'

const resetPasswordShema = z.object({
  hash: z
    .string({
      required_error: 'hash is required',
      invalid_type_error: 'hash must be a string'
    })
    .min(3, 'hash must be at least 3 characters'),

  password: z
    .string({
      required_error: 'password is required',
      invalid_type_error: 'password must be a string'
    })
    .min(6, 'password must be at least 6 characters')
    .max(20, 'password must be at most 20 characters')
})

export default resetPasswordShema

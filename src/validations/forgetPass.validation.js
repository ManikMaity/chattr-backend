import { z } from 'zod'

const forgetPassSchema = z.object({
  email: z
    .string({
      required_error: 'email is required',
      invalid_type_error: 'email must be a string'
    })
    .min(3, 'email must be at least 3 characters')
    .email('invalid email format')
})

export default forgetPassSchema

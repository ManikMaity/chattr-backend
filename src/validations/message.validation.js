import { z } from 'zod'

export const searchMessageSchema = z.object({
  workspaceId: z.string({
    required_error: 'workspaceId is required',
    invalid_type_error: 'workspaceId must be a string'
  }),
  searchQuery: z
    .string({
      required_error: 'searchQuery is required',
      invalid_type_error: 'searchQuery must be a string'
    })
    .min(1, 'searchQuery cant be empty')
})

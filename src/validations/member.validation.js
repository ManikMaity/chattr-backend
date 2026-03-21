import { z } from 'zod'

export const getMemberDeatils = z.object({
  workspaceId: z.string({
    required_error: 'workspaceId is required',
    invalid_type_error: 'workspaceId must be a string'
  }),
  memberId: z.string({
    required_error: 'memberId is required',
    invalid_type_error: 'memberId must be a string'
  })
})

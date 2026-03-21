import { z } from 'zod'

export const createLikeSchama = z.object({
  workspaceId: z.string({
    required_error: 'workspaceId is required',
    invalid_type_error: 'workspaceId must be a string'
  }),
  channelId: z.string({
    required_error: 'channelId is required',
    invalid_type_error: 'channelId must be a string'
  }),
  likeContent: z.string({
    required_error: 'likeContent is required',
    invalid_type_error: 'likeContent must be a string'
  })
})

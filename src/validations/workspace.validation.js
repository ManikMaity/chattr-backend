import { z } from 'zod'

export const workspaceSchema = z.object({
  name: z
    .string({
      required_error: 'name is required',
      invalid_type_error: 'name must be a string'
    })
    .min(3, 'name must be at least 3 characters')
    .max(50, 'name must be at most 50 characters'),
  description: z
    .string({
      required_error: 'description is required',
      invalid_type_error: 'description must be a string'
    })
    .min(3, 'description must be at least 3 characters')
    .max(500, 'description must be at most 500 characters'),
  image: z.string({
    required_error: 'image is required',
    invalid_type_error: 'image must be a string'
  })
})

export const updateWorkspaceSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'name must be a string'
    })
    .min(3, 'name must be at least 3 characters')
    .max(50, 'name must be at most 50 characters')
    .optional(),
  description: z
    .string({
      invalid_type_error: 'description must be a string'
    })
    .min(3, 'description must be at least 3 characters')
    .max(500, 'description must be at most 500 characters')
    .optional(),
  image: z
    .string({
      invalid_type_error: 'image must be a string'
    })
    .optional()
})

export const addMemberSchema = z.object({
  memberId: z
    .string({
      invalid_type_error: 'memberId must be a string'
    })
    .optional(),
  role: z.enum(['admin', 'member'], {
    required_error: 'role is required',
    invalid_type_error: 'role must be a string'
  }),
  workspaceId: z.string({
    required_error: 'workspaceId is required',
    invalid_type_error: 'workspaceId must be a string'
  }),
  email: z
    .string({
      invalid_type_error: 'email must be a string'
    })
    .email('invalid email format')
    .optional()
})

export const makeAdminSchema = z.object({
  workspaceId: z.string({
    required_error: 'Workspace id is requirerd',
    invalid_type_error: 'Workspace id must be a string'
  }),
  memberId: z.string({
    required_error: 'Member id is requirerd',
    invalid_type_error: 'Member id must be a string'
  })
})

export const removeMemberSchema = z.object({
  memberId: z.string({
    required_error: 'memberId is required',
    invalid_type_error: 'memberId must be a string'
  }),
  workspaceId: z.string({
    required_error: 'workspaceId is required',
    invalid_type_error: 'workspaceId must be a string'
  })
})

export const joinByCodeSchema = z.object({
  joinCode: z
    .string({
      required_error: 'JoinCode is required',
      invalid_type_error: 'joinCode must be a string'
    })
    .min(1, 'joinCode cant be empty'),
  workspaceId: z
    .string({
      required_error: 'workspaceId is required',
      invalid_type_error: 'workspaceId must be a string'
    })
    .min(1, 'workspaceId cant be empty')
})

export const addChannelSchema = z.object({
  channelName: z
    .string({
      required_error: 'channelName is required',
      invalid_type_error: 'channelName must be a string'
    })
    .min(3, 'channelName must be at least 3 characters')
    .max(50, 'channelName must be at most 50 characters')
    .trim(),
  workspaceId: z.string({
    required_error: 'workspaceId is required',
    invalid_type_error: 'workspaceId must be a string'
  })
})

import { StatusCodes } from 'http-status-codes'

import { addEmailToQueue } from '../producers/mailQueue.producer.js'
import channelRepo from '../repositories/channel.repo.js'
import userRepo from '../repositories/user.repo.js'
import workspaceRepo from '../repositories/workspace.repo.js'
import { createJoinWorkspaceMail } from '../utils/common/mailObject.js'
import createJoinCode from '../utils/createJoinCode.js'

export function isMemberOfWorkspace(workspace, userId) {
  const isMember = workspace.members.find(
    (member) => member.member.toString() === userId.toString()
  )
  return isMember
}

export function isMemberOfWorkspacePopulated(workspace, userId) {
  const isMember = workspace.members.find(
    (member) => member?.member?._id.toString() === userId.toString()
  )
  return isMember
}

export function isAdminOfWorkspace(workspace, userId) {
  const isAdmin = workspace.members.find(
    (member) =>
      member.member.toString() == userId.toString() && member.role == 'admin'
  )
  return isAdmin
}

export function moreThanOneAdmin(workspace) {
  const adminCount = workspace.members?.filter(
    (member) => member?.role == 'admin'
  ).length
  return adminCount > 1
}

function isChannelAlreadyExits(workspace, channelName) {
  const exit = workspace.channels.find(
    (channel) => channel.name.toLowerCase() == channelName.toLowerCase()
  )
  return exit
}

export async function createWorkspaceService(workspace) {
  try {
    const joinCode = createJoinCode(6)
    const response = await workspaceRepo.create({
      name: workspace.name,
      description: workspace.description,
      image: workspace.image,
      joinCode
    })
    await workspaceRepo.addMemberToWorkspace(
      response._id,
      workspace.owner,
      'admin'
    )
    const w1 = await workspaceRepo.addChannelToWorkspace(
      response._id,
      'general'
    )
    return w1
  } catch (err) {
    if (err.code === 11000) {
      throw {
        message: 'A workspace with this name already exists',
        explanation: ['A workspace with this name already exists'],
        statusCode: StatusCodes.BAD_REQUEST
      }
    } else {
      throw err
    }
  }
}

export async function getAllWorspaceSerive(userId) {
  const respose = await workspaceRepo.fetchAllWorkspacesByMemberId(userId)
  return respose
}

export async function deleteWorkspaceService(workspaceId, userId) {
  const workspace = await workspaceRepo.getById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }
  const exitsAsAdmin = workspace.members.find((member) => {
    if (
      member.member.toString() === userId.toString() &&
      member.role === 'admin'
    ) {
      return true
    }
    return false
  })
  if (!exitsAsAdmin) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to delete this workspace',
      explanation: ['You are not athorized to delete this workspace']
    }
  }
  await channelRepo.deleteManyByIds(workspace.channels)
  const response = await workspaceRepo.delete(workspaceId)
  return response
}

export async function updateWorkspaceService(workspaceId, data, userId) {
  const workspace = await workspaceRepo.getById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }

  const isAdmin = workspace.members.find(
    (member) =>
      member.member.toString() == userId.toString() && member.role == 'admin'
  )
  if (!isAdmin) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to update this workspace',
      explanation: ['You are not athorized to update this workspace']
    }
  }
  const response = await workspaceRepo.update(workspaceId, data)
  return response
}

export async function getWorkspaceService(workspaceId, userId) {
  const workspace = await workspaceRepo.getWorkspaceDetailsById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }
  const isMember = isMemberOfWorkspacePopulated(workspace, userId)
  if (!isMember) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to access this workspace',
      explanation: ['You are not athorized to access this workspace']
    }
  }

  return workspace
}

export async function getWorkSpaceByJoinCodeService(joinCode) {
  const workspace = await workspaceRepo.getWorkspaceByJoinCode(joinCode)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace with this join code not found',
      explanation: ['Workspace with this join code not found']
    }
  }
  return workspace
}

export async function addMemberToWorkspaceService(
  workspaceId,
  userId,
  memberId,
  role,
  email = ''
) {
  if (!memberId && !email) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Member id or email is required',
      explanation: ['Member id or email is required']
    }
  }

  let user

  if (!memberId) {
    const member = await userRepo.getUserByEmail(email)
    if (!member) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'User not found with this email',
        explanation: ['User not found with this email']
      }
    }
    user = member
    memberId = member._id
  } else {
    user = await userRepo.getById(memberId)
    if (!user) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'User not found with this id',
        explanation: ['User not found with this id']
      }
    }
  }

  const workspace = await workspaceRepo.getById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }

  const isAdmin = isAdminOfWorkspace(workspace, userId)

  if (!isAdmin) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to add members to this workspace',
      explanation: ['You are not athorized to add members to this workspace']
    }
  }
  const respose = await workspaceRepo.addMemberToWorkspace(
    workspaceId,
    memberId,
    role
  )
  addEmailToQueue(createJoinWorkspaceMail(workspace.name, user.email))
  return respose
}

export async function makeWorkspaceMemberAdminService(
  workspaceId,
  memberId,
  userId
) {
  const workspace = await workspaceRepo.getById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }

  const isAdmin = isAdminOfWorkspace(workspace, userId)
  if (!isAdmin) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to make members admin',
      explanation: ['You are not athorized to make members admin']
    }
  }

  const isMember = isMemberOfWorkspace(workspace, memberId)
  if (!isMember) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Member not found in this workspace',
      explanation: ['Member not found in this workspace']
    }
  }
  const response = await workspaceRepo.makeWorkspaceMemberAdmin(
    workspaceId,
    memberId
  )
  return response
}

export async function removeMemberFromWorkspaceService(
  workspaceId,
  memberId,
  userId
) {
  const workspace = await workspaceRepo.getById(workspaceId)

  if (userId.toString() === memberId.toString()) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'You cannot remove yourself from the workspace',
      explanation: [
        'You cannot remove yourself from the workspace instead use leave'
      ]
    }
  }

  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }
  const isAdmin = isAdminOfWorkspace(workspace, userId)
  if (!isAdmin) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to remove members from this workspace',
      explanation: [
        'You are not athorized to remove members from this workspace'
      ]
    }
  }
  const isMemberExit = isMemberOfWorkspace(workspace, memberId)
  if (!isMemberExit) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Member not found in this workspace',
      explanation: ['Member not found in this workspace']
    }
  }
  const response = await workspaceRepo.removeMemberFromWorkspace(
    workspaceId,
    memberId
  )
  return response
}

export async function leaveWorkspaceService(workspaceId, userId) {
  const workspace = await workspaceRepo.getById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }

  const isAdmin = isAdminOfWorkspace(workspace, userId)
  const admins = moreThanOneAdmin(workspace)

  if (isAdmin && !admins) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Workspace should have at least one admin',
      explanation: ['Make a member admin first']
    }
  }

  const response = await workspaceRepo.removeMemberFromWorkspace(
    workspaceId,
    userId
  )
  return response
}

export async function addChannelToWorkspaceService(
  workspaceId,
  userId,
  channelName
) {
  const workspace = await workspaceRepo.getWorkspaceDetailsById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }

  const isAdmin = workspace.members.find(
    (member) =>
      member.member._id.toString() == userId.toString() &&
      member.role == 'admin'
  )

  if (!isAdmin) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to add channel to this workspace',
      explanation: ['You are not athorized to add channel to this workspace']
    }
  }

  const exit = isChannelAlreadyExits(workspace, channelName)
  if (exit) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Channel already exists in workspace',
      explanation: ['Channel already exists in workspace']
    }
  }
  const response = await workspaceRepo.addChannelToWorkspace(
    workspaceId,
    channelName
  )
  return response
}

export async function changeWorkspaceJoinCodeService(workspaceId, userId) {
  const workspace = await workspaceRepo.getById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }

  const isAdmin = isAdminOfWorkspace(workspace, userId)

  if (!isAdmin) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not authorized to change workspace join code',
      explanation: ['You are not authorized to change workspace join code']
    }
  }

  const joinCode = createJoinCode()
  const response = await workspaceRepo.changeWorkspaceJoinCode(
    workspaceId,
    joinCode
  )

  return response
}

export async function joinWorkspaceByCodeService(user, joinCode) {
  const workspace = await workspaceRepo.getWorkspaceByJoinCode(joinCode)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }

  const response = workspaceRepo.addMemberToWorkspace(
    workspace._id,
    user._id,
    'member'
  )

  addEmailToQueue(createJoinWorkspaceMail(workspace.name, user.email))
  return response
}

import { StatusCodes } from 'http-status-codes'

import userRepo from '../repositories/user.repo.js'
import workspaceRepo from '../repositories/workspace.repo.js'
import { isMemberOfWorkspace } from './workspace.service.js'

export async function isUserPartOfWorkspaceService(workspaceId, userId) {
  const workspace = await workspaceRepo.getById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }
  const isMember = isMemberOfWorkspace(workspace, userId)

  if (!isMember) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User is not part of this workspace',
      explanation: ['User is not part of this workspace']
    }
  }
  const userDeatils = await userRepo.getById(userId)
  return userDeatils
}

export async function getMemberDeatilsService(workspaceId, userId, memberId) {
  const workspace = await workspaceRepo.getById(workspaceId)
  if (!workspace) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Workspace not found',
      explanation: ['Workspace not found']
    }
  }
  const isUserMember = isMemberOfWorkspace(workspace, userId)
  if (!isUserMember) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to access this workspace',
      explanation: ['You are not athorized to access this workspace']
    }
  }

  const isMemberExit = isMemberOfWorkspace(workspace, memberId)
  if (!isMemberExit) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Member is not part of this workspace',
      explanation: ['Member is not part this workspace']
    }
  }

  const memberDeatils = await userRepo.getById(memberId)
  // eslint-disable-next-line no-unused-vars
  const { password, ...data } = memberDeatils._doc
  return data
}

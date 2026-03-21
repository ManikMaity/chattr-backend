import { StatusCodes } from 'http-status-codes'

import likeRepo from '../repositories/like.repo.js'
import messageRepo from '../repositories/message.repo.js'
import workspaceRepo from '../repositories/workspace.repo.js'
import { isMemberOfWorkspace } from './workspace.service.js'

export async function createLikeService(
  messageId,
  likeContent,
  channelId,
  workspaceId,
  userId
) {
  const message = await messageRepo.getMessageWithLikesDetail(messageId)

  if (!message) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Message not found',
      explanation: ['Message not found']
    }
  }
  const alreadyLiked = message.likes.find(
    (like) => like.userId.toString() === userId.toString()
  )
  if (alreadyLiked) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'You have already liked this message',
      explanation: ['You have already liked this message']
    }
  }

  const workspace = await workspaceRepo.getById(workspaceId)
  const exit = isMemberOfWorkspace(workspace, userId)

  if (!exit) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not part of this workspace',
      explanation: ['You are not part of this workspace']
    }
  }

  const like = await likeRepo.create({
    messageId,
    likeContent,
    channelId,
    workspaceId,
    userId
  })
  if (!like) {
    throw {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      explanation: ['Something went wrong']
    }
  }
  message.likes.push(like._id)
  await message.save()
  const updatedMessage = await messageRepo.getMessageWithLikesDetail(messageId)
  return updatedMessage
}

export async function getMessageLikesService(messageId) {
  const message = await messageRepo.getById(messageId)
  if (!message) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Message not found',
      explanation: ['Message not found']
    }
  }

  if (!message.likes) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'No Reactions found for this message',
      explanation: ['No Reactions found for this message']
    }
  }

  const likes = await likeRepo.getAllLikesByMessageId(messageId)
  return likes
}

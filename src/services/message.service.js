import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

import groq from '../config/groq.config.js'
import { JWT_SECRET } from '../config/variables.js'
import messageRepo from '../repositories/message.repo.js'
import workspaceRepo from '../repositories/workspace.repo.js'
import clientError from '../utils/errors/clientError.js'
import { isMemberOfWorkspace } from './workspace.service.js'

export async function getMessagePaginatedService(
  userId,
  messageParams,
  page,
  limit
) {
  let workspace

  if (messageParams.workspaceId) {
    workspace = await workspaceRepo.getById(messageParams.workspaceId)
  } else {
    workspace = await workspaceRepo.getWorkspaceFromChannelId(
      messageParams.channelId
    )
  }

  if (!workspace) {
    throw new clientError({
      message: 'Workspace not found',
      explanation: ['Invailid data given'],
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  const isMember = isMemberOfWorkspace(workspace, userId)
  if (!isMember) {
    throw new clientError({
      message: 'You are not athorized to access this channel',
      explanation: ['You are not athorized to access this channel'],
      statusCode: StatusCodes.UNAUTHORIZED
    })
  }
  const messages = await messageRepo.getMessagePaginated(
    messageParams,
    page,
    limit
  )
  return messages
}

export async function getDMPaginatedMessagesService(
  userId,
  workspaceId,
  combinedId,
  page,
  limit
) {
  const combinedIds = combinedId.split('-')
  const workspace = await workspaceRepo.getById(workspaceId)

  if (!workspace) {
    throw new clientError({
      message: 'Workspace not found',
      explanation: ['Invailid data given'],
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  const isUserIncluded = combinedIds.includes(userId.toString())

  const isMember1 = isMemberOfWorkspace(workspace, combinedIds[0])
  const isMember2 = isMemberOfWorkspace(workspace, combinedIds[1])

  if (!isMember1 || !isMember2 || !isUserIncluded) {
    throw {
      message: 'You are not permited to access these DMS',
      explanation: ['You are not permited to access these DMS'],
      statusCode: StatusCodes.UNAUTHORIZED
    }
  }

  const messages = await messageRepo.getMessagePaginated(
    { roomId: combinedId, workspaceId: workspaceId },
    page,
    limit
  )
  return messages
}

export async function createMessageService(messageData) {
  const newMessage = await messageRepo.create(messageData)
  const messageDetail = await messageRepo.getMessageDetail(newMessage._id)
  return messageDetail
}

export async function updateMessageService(messageData) {
  if (!messageData?.token) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Slack token is required',
      explanation: ['Slack token is required']
    }
  }
  const message = await messageRepo.getById(messageData.messageId)
  if (!message) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Message not found',
      explanation: ['Message not found']
    }
  }

  const { id } = jwt.verify(messageData?.token, JWT_SECRET)

  if (id.toString() !== message.senderId.toString()) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You are not athorized to edit this message',
      explanation: ['You are not athorized to edit this message']
    }
  }

  const updatedMessage = await messageRepo.update(
    messageData?.messageId,
    messageData.updateContent
  )
  const messageDetail = await messageRepo.getMessageDetail(updatedMessage._id)
  return messageDetail
}

export async function searchMessagesService(workspaceId, userId, searchQuery) {
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
      message: 'You are not athorized to access this workspace',
      explanation: ['You are not athorized to access this workspace']
    }
  }

  const messages = await messageRepo.getMessagesBySearch(
    workspaceId,
    searchQuery
  )
  return messages
}

export async function createAIMessageService(prompt) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content:
          'You are a Slack writing assistant. Respond professionally and briefly.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 120
  })

  const text = completion.choices[0]?.message?.content

  return {
    response: text
  }
}

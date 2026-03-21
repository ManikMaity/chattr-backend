import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../config/variables.js'
import { createLikeService } from '../services/like.service.js'
import {
  createMessageService,
  updateMessageService
} from '../services/message.service.js'
import {
  EDIT_MESSAGE_EVENT,
  EDITED_MESSAGE_RECEIVED,
  NEW_DM_MESSAGE,
  NEW_DM_MESSAGE_LIKE,
  NEW_EDITED_DM_MESSAGE,
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_LIKE,
  NEW_MESSAGE_LIKE_RECEIVED,
  NEW_MESSAGE_RECEIVED
} from '../utils/common/socketEventConstant.js'

export function messageHandler(io, socket) {
  socket.on(EDIT_MESSAGE_EVENT, async function editMessageHandler(data, cb) {
    const { channelId } = data
    try {
      const updatedMessage = await updateMessageService(data)
      io.to(channelId).emit(EDITED_MESSAGE_RECEIVED, updatedMessage)
      if (cb) {
        cb({
          success: true,
          message: 'Message updated successfully',
          data: updatedMessage
        })
      }
    } catch (err) {
      if (cb) {
        cb({
          success: false,
          message: err.message,
          err: err.explanation
        })
      }
    }
  })

  socket.on(NEW_EDITED_DM_MESSAGE, async function editMessageHandler(data, cb) {
    const { roomId } = data
    try {
      const updatedMessage = await updateMessageService(data)
      io.to(roomId).emit(EDITED_MESSAGE_RECEIVED, updatedMessage)
      if (cb) {
        cb({
          success: true,
          message: 'Message updated successfully',
          data: updatedMessage
        })
      }
    } catch (err) {
      if (cb) {
        cb({
          success: false,
          message: err.message,
          err: err.explanation
        })
      }
    }
  })

  socket.on(NEW_DM_MESSAGE, async function createMessageHandler(data, cb) {
    const { roomId } = data
    const messageResponse = await createMessageService(data)
    io.to(roomId).emit(NEW_MESSAGE_RECEIVED, messageResponse)
    if (cb) {
      cb({
        success: true,
        message: 'Message created successfully',
        data: messageResponse
      })
    }
  })

  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    const { channelId } = data
    const messageResponse = await createMessageService(data)
    io.to(channelId).emit(NEW_MESSAGE_RECEIVED, messageResponse)
    if (cb) {
      cb({
        success: true,
        message: 'Message created successfully',
        data: messageResponse
      })
    }
  })

  socket.on(NEW_MESSAGE_LIKE, async function likeMessageHandler(data, cb) {
    const { workspaceId, channelId, likeContent, messageId, token } = data
    try {
      const { id } = jwt.verify(token, JWT_SECRET)
      const updatedMessage = await createLikeService(
        messageId,
        likeContent,
        channelId,
        workspaceId,
        id
      )
      io.to(channelId).emit(NEW_MESSAGE_LIKE_RECEIVED, updatedMessage)
      if (cb) {
        cb({
          success: true,
          message: 'Like created successfully',
          data: updatedMessage
        })
      }
    } catch (err) {
      if (cb) {
        cb({
          success: false,
          message: err.message,
          err: err.explanation
        })
      }
    }
  })

  socket.on(NEW_DM_MESSAGE_LIKE, async function likeMessageHandler(data, cb) {
    console.log(data)
    const { workspaceId, channelId, likeContent, messageId, token, roomId } =
      data
    try {
      const { id } = jwt.verify(token, JWT_SECRET)
      const updatedMessage = await createLikeService(
        messageId,
        likeContent,
        channelId,
        workspaceId,
        id
      )
      io.to(roomId).emit(NEW_MESSAGE_LIKE_RECEIVED, updatedMessage)
      if (cb) {
        cb({
          success: true,
          message: 'Like created successfully',
          data: updatedMessage
        })
      }
    } catch (err) {
      if (cb) {
        cb({
          success: false,
          message: err.message,
          err: err.explanation
        })
      }
    }
  })
}

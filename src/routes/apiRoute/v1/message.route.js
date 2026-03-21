import { Router } from 'express'

import {
  createMessageWithAIController,
  getDMMessagesPaginatedController,
  getMessagePaginatedController,
  searchMessagesController
} from '../../../controllers/message.controller.js'
import verifyAIService from '../../../middlewares/aiResMiddleware.js'
import verifyToken from '../../../middlewares/authMiddleware.js'
import { searchMessageSchema } from '../../../validations/message.validation.js'
import validate from '../../../validations/validator.js'
const messageRouter = Router()

messageRouter.get(
  '/messages/:workspaceId/:channelId',
  verifyToken,
  getMessagePaginatedController
)
messageRouter.get(
  '/dm/:workspaceId/:combinedId',
  verifyToken,
  getDMMessagesPaginatedController
)
messageRouter.post(
  '/search-message',
  validate(searchMessageSchema),
  verifyToken,
  searchMessagesController
)

messageRouter.get(
  '/ai-message',
  verifyToken,
  verifyAIService,
  createMessageWithAIController
)

export default messageRouter

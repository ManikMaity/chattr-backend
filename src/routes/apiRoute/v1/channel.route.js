import { Router } from 'express'

import {
  deleteChannelController,
  getChannelByIdController,
  updateChannelController
} from '../../../controllers/channel.controller.js'
import verifyToken from '../../../middlewares/authMiddleware.js'
import { channelUpdateSchema } from '../../../validations/channel.validation.js'
import validate from '../../../validations/validator.js'
const channelRouter = Router()

channelRouter.get('/:channelId', verifyToken, getChannelByIdController)
channelRouter.delete('/:channelId', verifyToken, deleteChannelController)
channelRouter.post(
  '/:channelId',
  validate(channelUpdateSchema),
  verifyToken,
  updateChannelController
)

export default channelRouter

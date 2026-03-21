import { Router } from 'express'

import {
  createLikeController,
  getMessageLikesController
} from '../../../controllers/like.controller.js'
import verifyToken from '../../../middlewares/authMiddleware.js'
import { createLikeSchama } from '../../../validations/like.validation.js'
import validate from '../../../validations/validator.js'

const likeRouter = Router()

likeRouter.get('/', (req, res) => {
  res.json({ msg: 'Like route is working' })
})

likeRouter.post(
  '/:messageId',
  validate(createLikeSchama),
  verifyToken,
  createLikeController
)
likeRouter.get('/:messageId', verifyToken, getMessageLikesController)

export default likeRouter
